import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AssistantRequest {
  userId: string;
  question: string;
  context?: Record<string, any>;
  model?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const {
      userId,
      question,
      context,
      model = "gpt-4.2"
    }: AssistantRequest = await req.json();

    // Générer une réponse de l'assistant créateur
    const response = await generateAssistantResponse(question, context, model);

    return new Response(
      JSON.stringify({
        success: true,
        response,
        model,
        timestamp: new Date().toISOString()
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Erreur assistant créateur:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Erreur de l'assistant créateur"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

async function generateAssistantResponse(
  question: string,
  context: any,
  model: string
): Promise<string> {
  // Dans un environnement de production, utilisez l'API OpenAI
  // const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

  // Pour la démonstration, générer une réponse simulée
  const responses: Record<string, string> = {
    "title": "Pour optimiser vos titres, utilisez des mots-clés pertinents, créez de l'intrigue et gardez-les concis (60-70 caractères). Incluez des chiffres quand possible et posez des questions pour susciter la curiosité.",
    "thumbnail": "Une miniature efficace doit avoir : des couleurs contrastées, un texte lisible (max 3-4 mots), un visage expressif si possible, et rester cohérente avec votre branding.",
    "engagement": "Pour augmenter l'engagement : posez des questions à votre audience, ajoutez des calls-to-action, répondez aux commentaires rapidement, et créez des séries de vidéos pour fidéliser.",
    "analytics": "Concentrez-vous sur le taux de rétention, la durée moyenne de visionnage et le taux de clics (CTR). Ces métriques sont plus importantes que les vues brutes.",
    "default": `Basé sur votre question "${question}", je vous recommande de : 1) Analyser vos statistiques actuelles, 2) Étudier votre audience cible, 3) Tester différentes approches, 4) Mesurer les résultats et itérer.`
  };

  // Trouver une réponse correspondante
  for (const [key, value] of Object.entries(responses)) {
    if (question.toLowerCase().includes(key)) {
      return value;
    }
  }

  return responses.default;
}
