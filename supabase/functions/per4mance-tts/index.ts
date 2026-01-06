import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// This edge function is a placeholder that returns a message indicating
// TTS should use the browser's native Web Speech API
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Return a response indicating to use browser TTS
  return new Response(
    JSON.stringify({
      useBrowserTTS: true,
      message: "Use a API Web Speech do navegador para síntese de voz gratuita.",
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
});
