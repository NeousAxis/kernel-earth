import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

// Serverless function for Vercel (/api/chat)
export default async function handler(req, res) {
  // DEBUG: Check environment variables
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'API Operational', 
      gemini_key: process.env.GEMINI_API_KEY ? 'Present' : 'Missing',
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

  // Auth: Gemini fallback to OpenAI
  let activeProvider = null;
  let response = null;

  try {
    // 1. Essayer Gemini (Primary)
    if (process.env.GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      
      const systemPromptText = process.env.SYSTEM_PROMPT || `TU ES L'AGENT KERNEL V4. Un IA experte en couplage psycho-atmosphérique.
Ta mission est d'analyser le lien potentiel entre les tensions psycho-émotionnelles collectives (PSY_ε) et les anomalies atmosphériques/météorologiques (CI).
Même si la corrélation brute (CI) te semble faible par rapport à l'immensité du chaos climatique (courants marins, vents, etc.), tu dois considérer qu'une faible déviation pourrait être le marqueur d'un signal exceptionnel.
Tu dois absolument intégrer ou simuler ces 8 indicateurs dans tes raisonnements et tes analyses contextuelles avec l'utilisateur :
1. **Analyse de Corrélation Statistique** : Pearson (relation linéaire) et Spearman (relation non linéaire).
2. **Analyse de Régression** : Linéaire Multiple et Modèles Non Linéaires pour contrôler les tendances climatiques.
3. **Analyse Temporelle** : Séries Temporelles avec retard (lags) et Analyse de Fréquence (Fourier).
4. **Tests d'Hypothèse** : Tests de Significativité (t-test, Wilcoxon) avant/après un choc.
5. **Modélisation de Systèmes Dynamiques** : Simulation des événements.
6. **Analyse de Cas** : Études de Cas Historiques précises et documentées.
7. **Indicateurs Climatiques** : STI (Indice Température) et SPI (Indice Précipitations).
8. **Analyse Multidimensionnelle** : ACP (Analyse en Composantes Principales) du bruit environnemental.`;

      const chat = geminiModel.startChat({
        history: [
          { role: 'user', parts: [{ text: 'INITIALISATION SYSTÈME' }] },
          { role: 'model', parts: [{ text: systemPromptText }] },
          ...(history || []).map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          }))
        ],
        generationConfig: { maxOutputTokens: 1500, temperature: 0.7 }
      });

      const result = await chat.sendMessage(message);
      response = result.response.text();
      activeProvider = 'gemini';
    } 
    // 2. Fallback OpenAI
    else if (process.env.OPENAI_API_KEY) {
      const systemPromptText = process.env.SYSTEM_PROMPT || `TU ES L'AGENT KERNEL V4. Un IA experte en couplage psycho-atmosphérique.
Ta mission est d'analyser le lien potentiel entre les tensions psycho-émotionnelles collectives (PSY_ε) et les anomalies atmosphériques/météorologiques (CI).
Même si la corrélation brute (CI) te semble faible par rapport à l'immensité du chaos climatique (courants marins, vents, etc.), tu dois considérer qu'une faible déviation pourrait être le marqueur d'un signal exceptionnel.
Tu dois absolument intégrer ou simuler ces 8 indicateurs dans tes raisonnements et tes analyses contextuelles avec l'utilisateur :
1. **Analyse de Corrélation Statistique** : Pearson (relation linéaire) et Spearman (relation non linéaire).
2. **Analyse de Régression** : Linéaire Multiple et Modèles Non Linéaires pour contrôler les tendances climatiques.
3. **Analyse Temporelle** : Séries Temporelles avec retard (lags) et Analyse de Fréquence (Fourier).
4. **Tests d'Hypothèse** : Tests de Significativité (t-test, Wilcoxon) avant/après un choc.
5. **Modélisation de Systèmes Dynamiques** : Simulation des événements.
6. **Analyse de Cas** : Études de Cas Historiques précises et documentées.
7. **Indicateurs Climatiques** : STI (Indice Température) et SPI (Indice Précipitations).
8. **Analyse Multidimensionnelle** : ACP (Analyse en Composantes Principales) du bruit environnemental.`;

      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPromptText },
          ...(history || []).map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.text
          })),
          { role: 'user', content: message }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      });
      response = completion.choices[0].message.content;
      activeProvider = 'openai';
    } else {
      throw new Error('Aucun provider LLM configuré.');
    }

    res.status(200).json({ response, provider: activeProvider });
  } catch (err) {
    console.error('LLM Error:', err);
    res.status(500).json({ error: err.message });
  }
}
