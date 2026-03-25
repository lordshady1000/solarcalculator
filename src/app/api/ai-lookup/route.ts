import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/environment";
import type { ApiResponse, AiLookupResult } from "@/types";

const PROMPT = `You are an appliance energy expert for the African/Nigerian market.

CRITICAL: Your response must be ONLY a JSON array. No text before or after. No markdown. No explanation. Just the raw JSON array starting with [ and ending with ].

Return 1-3 appliances matching the query. Each object must have exactly these 5 fields:
{"name":"string","wattage":number,"category":"string","icon":"emoji","notes":"string"}

Valid categories: Lighting, Cooling, Kitchen, Entertainment, Office, Laundry, Utility, Security, Personal, Business

Rules:
- wattage must be a number (no quotes)
- icon must be a single emoji
- notes must be 1 short sentence, no newlines
- Be accurate with real-world wattages
- For Nigerian/African brands, use local market specifications`;

// ─── Helper: wait ms ───
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ─── Helper: retry with backoff for 429 rate limits ───
async function withRetry(fn: () => Promise<Response>, label: string, maxRetries = 2): Promise<Response> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const r = await fn();
    if (r.ok) return r;

    // If rate limited (429), wait and retry
    if (r.status === 429 && attempt < maxRetries) {
      const waitSec = Math.pow(2, attempt + 1); // 2s, 4s
      console.warn(`${label} rate limited (429). Retrying in ${waitSec}s... (attempt ${attempt + 1}/${maxRetries})`);
      await sleep(waitSec * 1000);
      continue;
    }

    // Any other error or final retry exhausted
    throw new Error(`${label} ${r.status}`);
  }
  throw new Error(`${label} retries exhausted`);
}

// ─── Provider: Google Gemini (FREE) ───
async function callGemini(q: string) {
  const r = await withRetry(
    () => fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${PROMPT}\n\nAppliance: "${q}"` }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1000, responseMimeType: "application/json" },
      }),
    }),
    "Gemini"
  );
  const d = await r.json();
  return d.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// ─── Provider: Groq (FREE) ───
async function callGroq(q: string) {
  const r = await withRetry(
    () => fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: PROMPT }, { role: "user", content: `Appliance: "${q}"` }],
        temperature: 0.3, max_tokens: 1000,
      }),
    }),
    "Groq"
  );
  const d = await r.json();
  return d.choices?.[0]?.message?.content || "";
}

// ─── Provider: Anthropic Claude (PAID) ───
async function callClaude(q: string) {
  const r = await withRetry(
    () => fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: PROMPT,
        messages: [{ role: "user", content: `Appliance: "${q}"` }],
      }),
    }),
    "Claude"
  );
  const d = await r.json();
  return d.content?.map((b: any) => b.text || "").join("") || "";
}

// ─── Smart Router: tries providers in order with retry ───
async function callAI(q: string) {
  const errors: string[] = [];

  if (env.GEMINI_API_KEY) {
    try { return await callGemini(q); }
    catch (e: any) { errors.push(`Gemini: ${e.message}`); console.warn("Gemini failed:", e.message); }
  }

  if (env.GROQ_API_KEY) {
    try { return await callGroq(q); }
    catch (e: any) { errors.push(`Groq: ${e.message}`); console.warn("Groq failed:", e.message); }
  }

  if (env.ANTHROPIC_API_KEY) {
    try { return await callClaude(q); }
    catch (e: any) { errors.push(`Claude: ${e.message}`); console.warn("Claude failed:", e.message); }
  }

  if (errors.length > 0) {
    throw new Error(`All AI providers failed. ${errors.join("; ")}. Try again in a moment — free APIs have rate limits.`);
  }

  throw new Error("No AI provider configured. Add GEMINI_API_KEY (free) or GROQ_API_KEY (free) to .env.local");
}

// ─── POST /api/ai-lookup ───
export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Query must be at least 2 characters" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    if (!env.GEMINI_API_KEY && !env.GROQ_API_KEY && !env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { success: false, error: "No AI key configured. Add GEMINI_API_KEY to .env.local (free at https://aistudio.google.com/apikey)" } satisfies ApiResponse,
        { status: 503 }
      );
    }

    const raw = await callAI(query.trim());
    console.log("AI raw response (first 500 chars):", raw.slice(0, 500));

    // ── Robust JSON extraction ──
    // Gemini often wraps JSON in markdown, adds preamble text, or includes
    // newlines/smart quotes inside strings. We handle all of it.
    let parsed: AiLookupResult[] = [];

    try {
      // Step 1: Try to extract JSON array from the raw text
      let jsonStr = raw;

      // Remove markdown code fences
      jsonStr = jsonStr.replace(/```json\s*/gi, "").replace(/```\s*/g, "");

      // Find the first '[' and last ']' — the actual JSON array
      const firstBracket = jsonStr.indexOf("[");
      const lastBracket = jsonStr.lastIndexOf("]");

      if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
        jsonStr = jsonStr.slice(firstBracket, lastBracket + 1);
      }

      // Fix common Gemini issues:
      // - Replace smart quotes with regular quotes
      jsonStr = jsonStr.replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"');
      jsonStr = jsonStr.replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'");

      // - Remove control characters (except newlines in strings — we handle those next)
      jsonStr = jsonStr.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");

      // - Fix unescaped newlines inside JSON strings by replacing them with spaces
      // This regex finds content between quotes and replaces newlines within
      jsonStr = jsonStr.replace(/"([^"]*?)"/g, (match: string) => {
        return match.replace(/\n/g, " ").replace(/\r/g, "");
      });

      // - Remove trailing commas before ] or }
      jsonStr = jsonStr.replace(/,\s*([\]}])/g, "$1");

      parsed = JSON.parse(jsonStr);
    } catch (parseErr) {
      // Step 2: Fallback — try to parse each object individually
      console.warn("JSON parse failed, trying fallback extraction:", parseErr);

      const objectRegex = /\{[^{}]*"name"\s*:\s*"[^"]+?"[^{}]*"wattage"\s*:\s*\d+[^{}]*\}/g;
      const matches = raw.match(objectRegex);

      if (matches && matches.length > 0) {
        for (const m of matches) {
          try {
            const obj = JSON.parse(m);
            if (obj.name && typeof obj.wattage === "number") {
              parsed.push(obj);
            }
          } catch {
            // Skip malformed individual objects
          }
        }
      }

      if (parsed.length === 0) {
        throw new Error("Could not parse AI response. Please try a different query.");
      }
    }

    const valid = parsed.filter(r => r.name && typeof r.wattage === "number").slice(0, 3);

    return NextResponse.json({ success: true, data: valid } satisfies ApiResponse<AiLookupResult[]>);
  } catch (e: any) {
    // Return 429 to the frontend so it knows to show a "try again" message
    const isRateLimit = e.message?.includes("429") || e.message?.includes("rate limit");
    return NextResponse.json(
      { success: false, error: isRateLimit ? "Rate limited — please wait a few seconds and try again." : (e.message || "AI lookup failed") } satisfies ApiResponse,
      { status: isRateLimit ? 429 : 500 }
    );
  }
}