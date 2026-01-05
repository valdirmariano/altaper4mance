import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Usuário não encontrado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, data } = await req.json();

    console.log(`Executing action: ${action} for user: ${user.id}`);

    let result;

    switch (action) {
      case "create_task":
        result = await supabase.from("tasks").insert({
          user_id: user.id,
          title: data.title,
          description: data.description || null,
          priority: data.priority || "p2",
          due_date: data.due_date || null,
          status: data.status || "todo",
        }).select().single();
        break;

      case "create_project":
        result = await supabase.from("projects").insert({
          user_id: user.id,
          title: data.title,
          description: data.description || null,
          category: data.category || "personal",
          priority: data.priority || "medium",
          status: "planned",
        }).select().single();
        break;

      case "create_habit":
        result = await supabase.from("habits").insert({
          user_id: user.id,
          title: data.title,
          description: data.description || null,
          category: data.category || "health",
          frequency: data.frequency || "daily",
          color: data.color || "#00D9FF",
        }).select().single();
        break;

      case "create_goal":
        result = await supabase.from("goals").insert({
          user_id: user.id,
          title: data.title,
          description: data.description || null,
          horizon: data.horizon || "medium",
          target_date: data.target_date || null,
          status: "in_progress",
        }).select().single();
        break;

      case "create_transaction":
        result = await supabase.from("transactions").insert({
          user_id: user.id,
          type: data.type,
          amount: data.amount,
          category: data.category,
          description: data.description || null,
          date: data.date || new Date().toISOString().split("T")[0],
        }).select().single();
        break;

      default:
        return new Response(JSON.stringify({ error: "Ação não reconhecida" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    if (result.error) {
      console.error("Action error:", result.error);
      return new Response(JSON.stringify({ error: result.error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Action ${action} completed successfully:`, result.data);

    return new Response(
      JSON.stringify({ success: true, data: result.data }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Action error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
