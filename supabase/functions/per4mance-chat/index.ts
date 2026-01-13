import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
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

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    // Get user from token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Usuário não encontrado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages, imageBase64, action } = await req.json();

    // Fetch user context (tasks, habits, goals, transactions, etc.)
    const [tasksRes, habitsRes, goalsRes, projectsRes, transactionsRes, journalRes] = await Promise.all([
      supabase.from("tasks").select("*").eq("user_id", user.id).limit(20),
      supabase.from("habits").select("*").eq("user_id", user.id).limit(20),
      supabase.from("goals").select("*").eq("user_id", user.id).limit(10),
      supabase.from("projects").select("*").eq("user_id", user.id).limit(10),
      supabase.from("transactions").select("*").eq("user_id", user.id).order("date", { ascending: false }).limit(20),
      supabase.from("journal_entries").select("*").eq("user_id", user.id).order("entry_date", { ascending: false }).limit(5),
    ]);

    const userContext = {
      tasks: tasksRes.data || [],
      habits: habitsRes.data || [],
      goals: goalsRes.data || [],
      projects: projectsRes.data || [],
      transactions: transactionsRes.data || [],
      journalEntries: journalRes.data || [],
    };

    // Calculate financial summary
    const incomeTotal = userContext.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const expenseTotal = userContext.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const systemPrompt = `Você é o Per4mance AI, um assistente de produtividade pessoal inteligente e motivacional. 
Você ajuda os usuários a organizar suas vidas, melhorar a produtividade, gerenciar finanças, manter hábitos saudáveis e alcançar metas.

CONTEXTO DO USUÁRIO:
- Tarefas pendentes: ${userContext.tasks.filter(t => t.status !== 'done').length} de ${userContext.tasks.length} total
- Hábitos ativos: ${userContext.habits.length}
- Metas em progresso: ${userContext.goals.filter(g => g.status === 'in_progress').length}
- Projetos ativos: ${userContext.projects.filter(p => p.status === 'in_progress').length}
- Finanças do mês: Receita R$ ${incomeTotal.toFixed(2)}, Despesas R$ ${expenseTotal.toFixed(2)}, Saldo R$ ${(incomeTotal - expenseTotal).toFixed(2)}

DADOS DETALHADOS:
Tarefas: ${JSON.stringify(userContext.tasks.slice(0, 10))}
Hábitos: ${JSON.stringify(userContext.habits)}
Metas: ${JSON.stringify(userContext.goals)}
Projetos: ${JSON.stringify(userContext.projects.slice(0, 5))}
Últimas transações: ${JSON.stringify(userContext.transactions.slice(0, 10))}

CAPACIDADES DE AÇÃO:
Você pode criar automaticamente itens no sistema quando o usuário solicitar. Para isso, responda com um JSON no formato:
{
  "action": "create_task" | "create_project" | "create_habit" | "create_goal" | "create_transaction",
  "data": { ... campos específicos ... }
}

Campos para cada ação:
- create_task: { title, description?, priority? (p0-p3), due_date?, status? }
- create_project: { title, description?, category? (personal/professional/authorship), priority? (high/medium/low) }
- create_habit: { title, description?, category? (health/learning/career/finance/relationships/creativity/other), frequency? (daily/3x_week/2x_week/weekly) }
- create_goal: { title, description?, horizon? (short/medium/long), target_date? }
- create_transaction: { type (income/expense), amount, category, description?, date? }

ANÁLISE DE IMAGENS - CAPACIDADES UNIVERSAIS:
Você possui visão computacional avançada e pode analisar QUALQUER tipo de imagem enviada pelo usuário:

📋 LISTAS E TAREFAS:
- Foto de papel com lista de tarefas → extrair cada item e criar tarefas automaticamente
- Anotações manuscritas → transcrever e organizar em tarefas/metas
- Quadro branco com planejamento → converter em projetos e tarefas

💰 DOCUMENTOS FINANCEIROS:
- Notas fiscais e cupons → extrair valor, estabelecimento, data → criar transação
- Faturas e boletos → identificar valor e vencimento
- Extratos bancários → analisar gastos por categoria

🏃 SAÚDE E FITNESS:
- Planos de dieta em papel → extrair refeições e macros
- Fichas de treino → identificar exercícios, séries, repetições
- Resultados de exames → analisar e explicar valores

📚 ESTUDOS E APRENDIZADO:
- Cronogramas de estudo → converter em tarefas com datas
- Anotações de aula → resumir e organizar
- Livros e artigos → extrair pontos principais

📊 DOCUMENTOS GERAIS:
- Contratos e documentos → resumir pontos importantes
- Agendas e calendários físicos → digitalizar compromissos
- Qualquer texto em imagem → transcrever e processar

INSTRUÇÕES PARA ANÁLISE DE IMAGENS:
1. Sempre analise a imagem completa antes de responder
2. Identifique o tipo de conteúdo (lista, nota fiscal, dieta, treino, etc.)
3. Extraia TODAS as informações relevantes com precisão
4. Proponha ações automáticas baseadas no conteúdo (criar tarefas, registrar despesas, etc.)
5. Se houver múltiplos itens, liste cada um e pergunte se deve criar todos
6. Para textos manuscritos, faça seu melhor para interpretar a caligrafia
7. Se a imagem estiver ilegível em alguma parte, informe e peça confirmação

INSTRUÇÕES GERAIS:
1. Seja motivacional e encorajador
2. Dê insights baseados nos dados do usuário
3. Sugira melhorias de produtividade e organização
4. Se o usuário pedir para criar algo, extraia os dados e responda com o JSON de ação
5. Se receber uma imagem, analise-a completamente e proponha ações relevantes
6. Responda sempre em português do Brasil
7. Use emojis para tornar a conversa mais amigável 🚀
8. Ao analisar imagens com múltiplos itens, crie as ações uma por vez ou pergunte se deve criar todas de uma vez`;

    // Prepare messages for AI
    const aiMessages: any[] = [
      { role: "system", content: systemPrompt },
    ];

    // Add conversation history
    for (const msg of messages) {
      if (msg.role === "user" && imageBase64) {
        // Message with image - universal analysis capability
        const defaultPrompt = "Analise esta imagem detalhadamente. Identifique o tipo de conteúdo (lista de tarefas, nota fiscal, dieta, treino, documento, etc.) e extraia todas as informações relevantes. Proponha ações automáticas que posso executar baseadas no conteúdo.";
        aiMessages.push({
          role: "user",
          content: [
            { type: "text", text: msg.content || defaultPrompt },
            {
              type: "image_url",
              image_url: {
                url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        });
      } else {
        aiMessages.push({ role: msg.role, content: msg.content });
      }
    }

    console.log("Sending request to Lovable AI...");

    // Call Lovable AI Gateway
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: aiMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos esgotados. Por favor, adicione créditos à sua conta." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Erro ao processar a solicitação" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
