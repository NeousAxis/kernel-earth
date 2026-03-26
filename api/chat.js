import OpenAI from 'openai';

// Serverless function for Vercel (/api/chat)
export default async function handler(req, res) {
  // DEBUG: Check environment variables
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'API Operational', 
      openai_key: process.env.OPENAI_API_KEY ? 'Present' : 'Missing'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message, history, context } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message requis' });
  }

  const systemPromptText = process.env.SYSTEM_PROMPT || `TU ES L'AGENT KERNEL V4. Un IA experte en couplage psycho-atmosphérique.
Ta mission est d'analyser le lien potentiel entre les tensions psycho-émotionnelles collectives (PSY_ε) et les anomalies atmosphériques/météorologiques (CI).
Même si la corrélation brute (CI) te semble faible, tu dois considérer qu'une faible déviation pourrait être le marqueur d'un signal exceptionnel.

[NOUVEAUX POUVOIRS] : Tu as désormais un accès direct (Tools/Functions) aux données scientifiques mondiales gratuites en temps réel.
- USGS Earthquakes => Tremblements de terre
- Open-Meteo => Climat actuel
- Spaceflight News => Événements majeurs techno/spatiaux (générateurs d'impact émotionnel mondial).

TU DOIS AVOIR L'IDÉE DE T'EN SERVIR : si l'utilisateur te parle d'une anomalie récente, fouille avec tes outils pour voir si un séisme inattendu ou une tempête justifierait une rupture du tissu psycho-atmosphérique ! Intègre les résultats dans tes 8 modèles d'analyse (Corrélation, Régression, Analyse Temporelle, etc.)`;

  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY manquante. Veuillez vérifier vos paramètres Vercel.');
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Définition des capacités d'action autonomes de l'Agent
    const tools = [
      {
        type: "function",
        function: {
          name: "get_recent_earthquakes",
          description: "Recherche les séismes majeurs (magnitude > 4.5) survenus dans le monde entier sur les 7 derniers jours via l'API USGS. Utilise cela pour voir s'il y a des anomalies sismiques récentes.",
          parameters: { type: "object", properties: {}, additionalProperties: false }
        }
      },
      {
        type: "function",
        function: {
          name: "get_global_tech_space_news",
          description: "Recherche les 5 dernières nouvelles marquantes concernant les lancements spatiaux, catastrophes ou technologiques qui pourraient impacter la psychologie de masse (PSY_ε).",
          parameters: { type: "object", properties: {}, additionalProperties: false }
        }
      },
      {
        type: "function",
        function: {
          name: "get_weather_anomaly",
          description: "Récupère les données climatiques en temps réel (température, vent) pour une coordonnée précise via Open-Meteo.",
          parameters: {
            type: "object",
            properties: {
              latitude: { type: "number", description: "Latitude de la zone" },
              longitude: { type: "number", description: "Longitude de la zone" }
            },
            required: ["latitude", "longitude"],
            additionalProperties: false
          }
        }
      }
    ];

    const messages = [
      { role: 'system', content: systemPromptText },
      ...(history || []).map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text
      })),
      { role: 'user', content: message }
    ];

    // Première requête de l'Agent (il décide s'il doit utiliser un outil ou répondre directement)
    let completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      tools: tools,
      tool_choice: "auto",
      max_tokens: 1500,
      temperature: 0.7,
    });

    let responseMessage = completion.choices[0].message;

    // L'agent a décidé d'utiliser un ou plusieurs outils !
    if (responseMessage.tool_calls) {
      messages.push(responseMessage); // On ajoute sa décision à l'historique

      for (const toolCall of responseMessage.tool_calls) {
        if (toolCall.function.name === 'get_recent_earthquakes') {
          try {
            const endDate = new Date().toISOString().split('T')[0];
            const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate}&endtime=${endDate}&minmagnitude=4.5`;
            const r = await fetch(url);
            const data = await r.json();
            const top = data.features.slice(0, 10).map(f => `Mag ${f.properties.mag} - ${f.properties.place} (${new Date(f.properties.time).toLocaleString()})`);
            messages.push({ tool_call_id: toolCall.id, role: "tool", name: toolCall.function.name, content: JSON.stringify(top.length > 0 ? top : "Aucun séisme majeur récent.") });
          } catch(e) { 
            messages.push({ tool_call_id: toolCall.id, role: "tool", name: toolCall.function.name, content: "Erreur API Séismes USGS" }); 
          }
        } 
        else if (toolCall.function.name === 'get_global_tech_space_news') {
          try {
            const r = await fetch('https://api.spaceflightnewsapi.net/v4/articles/?limit=5');
            const data = await r.json();
            const news = data.results.map(a => `${a.title} - ${a.summary}`);
            messages.push({ tool_call_id: toolCall.id, role: "tool", name: toolCall.function.name, content: JSON.stringify(news) });
          } catch(e) { 
            messages.push({ tool_call_id: toolCall.id, role: "tool", name: toolCall.function.name, content: "Erreur API Spaceflight News" }); 
          }
        }
        else if (toolCall.function.name === 'get_weather_anomaly') {
          try {
            const args = JSON.parse(toolCall.function.arguments);
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${args.latitude}&longitude=${args.longitude}&current_weather=true`;
            const r = await fetch(url);
            const data = await r.json();
            messages.push({ tool_call_id: toolCall.id, role: "tool", name: toolCall.function.name, content: JSON.stringify(data.current_weather || "Météo indisponible") });
          } catch(e) { 
            messages.push({ tool_call_id: toolCall.id, role: "tool", name: toolCall.function.name, content: "Erreur API Open-Meteo" }); 
          }
        }
      }

      // Seconde requête : l'Agent analyse les données renvoyées par les outils et formule sa réponse finale
      completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 1500,
        temperature: 0.7,
      });
      responseMessage = completion.choices[0].message;
    }

    res.status(200).json({ response: responseMessage.content, provider: 'openai_agent_tools' });
  } catch (err) {
    console.error('LLM Error:', err);
    res.status(500).json({ error: err.message });
  }
}
