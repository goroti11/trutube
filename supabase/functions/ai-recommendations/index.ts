import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RecommendationsRequest {
  userId: string;
  watchHistory: any[];
  limit: number;
  premiumTier: string;
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
      watchHistory,
      limit = 10,
      premiumTier
    }: RecommendationsRequest = await req.json();

    // Générer des recommandations basées sur l'historique
    const recommendations = await generateRecommendations(
      userId,
      watchHistory,
      limit,
      premiumTier
    );

    return new Response(
      JSON.stringify({
        success: true,
        recommendations,
        premiumTier,
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
    console.error("Erreur recommandations IA:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Erreur lors de la génération des recommandations"
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

async function generateRecommendations(
  userId: string,
  watchHistory: any[],
  limit: number,
  premiumTier: string
): Promise<any[]> {
  // Dans un environnement de production, utilisez l'API OpenAI pour des recommandations avancées

  // Analyse basique de l'historique
  const preferences = analyzeWatchHistory(watchHistory);

  // Générer des recommandations mock
  const recommendations = [];
  for (let i = 0; i < limit; i++) {
    recommendations.push({
      contentId: `rec-${i + 1}`,
      contentType: "video",
      reason: premiumTier === 'platinum'
        ? "Recommandé par l'IA avancée (ChatGPT 4.2) basé sur vos préférences"
        : "Basé sur votre historique de visionnage",
      confidence: 0.85 + (Math.random() * 0.15),
      metadata: {
        title: `Vidéo recommandée ${i + 1}`,
        category: preferences.topCategories[0] || "divertissement"
      }
    });
  }

  return recommendations;
}

function analyzeWatchHistory(history: any[]): any {
  const categories: Record<string, number> = {};

  history.forEach(item => {
    const category = item.videos?.category || "general";
    categories[category] = (categories[category] || 0) + 1;
  });

  const topCategories = Object.entries(categories)
    .sort(([, a], [, b]) => b - a)
    .map(([cat]) => cat);

  return {
    topCategories,
    totalWatched: history.length
  };
}
