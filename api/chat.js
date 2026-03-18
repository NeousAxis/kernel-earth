import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

// Serverless function for Vercel (/api/chat)
export default async function handler(req, res) {
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
      
      const chat = geminiModel.startChat({
        history: [
          { role: 'user', parts: [{ text: 'INITIALISATION SYSTÈME' }] },
          { role: 'model', parts: [{ text: process.env.SYSTEM_PROMPT || 'AGENT KERNEL V4' }] },
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
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: process.env.SYSTEM_PROMPT || 'AGENT KERNEL V4' },
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
