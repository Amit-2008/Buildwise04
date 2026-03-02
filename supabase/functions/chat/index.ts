import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are BuildWise AI, a friendly and knowledgeable construction cost estimation assistant for India. You help users with:

1. **Cost Estimation**: Provide accurate construction cost estimates based on area, location, building type, and quality level
2. **Material Calculations**: Calculate material quantities (cement, steel, sand, bricks, paint, aggregate) based on construction area
3. **State-wise Pricing**: Explain price variations across Indian states and factors affecting them
4. **Construction Guidance**: Offer practical advice on construction processes, timelines, and best practices

**Key Data Points to Use:**
- Base construction cost: ₹1,400-2,100 per sq ft depending on quality (Economy/Standard/Premium)
- Material rates vary by state (Maharashtra/Kerala 15-25% higher than UP/MP)
- Cement: ~0.4 bags per sq ft, Steel: ~4.5 kg per sq ft, Bricks: ~8 per sq ft
- Labor costs vary significantly: Kerala/Maharashtra (₹800-1000/day) vs UP/MP (₹500-600/day)
- Commercial buildings cost ~25% more than residential
- Each additional floor adds ~5% to base cost

**Response Style:**
- Be concise but informative
- Use bullet points and bold text for clarity
- Include specific numbers and estimates when relevant
- Always mention that users can use the Cost Estimator tool for precise calculations
- Use ₹ for currency and Indian units (lakhs, crores)
- Keep responses under 200 words unless complex explanation needed

If asked about topics unrelated to construction, politely redirect to construction-related queries.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Calling AI Gateway with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Streaming response from AI Gateway");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat function error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
