
export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    if (request.method !== "POST") {
      return Response.json(
        { error: "Méthode non autorisée" },
        { status: 405, headers: cors }
      );
    }

    if (!env.OPENAI_API_KEY) {
      return Response.json(
        { error: "Clé API manquante" },
        { status: 500, headers: cors }
      );
    }

    try {
      const body = await request.json();

      const response = await fetch(
        "https://api.openai.com/v1/responses",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "gpt-4.1-mini",
            input: body.message || "Bonjour !"
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return Response.json(
          { error: data.error?.message || "Erreur OpenAI" },
          { status: response.status, headers: cors }
        );
      }

      return Response.json(
        { reply: data.output_text || "Pas de réponse reçue." },
        { headers: cors }
      );

    } catch (error) {
      return Response.json(
        { error: "Erreur du serveur SMART" },
        { status: 500, headers: cors }
      );
    }
  }
};
