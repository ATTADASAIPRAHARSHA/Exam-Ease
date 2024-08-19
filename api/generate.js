// api/generate.js

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.VITE_GOOGLE_GENAI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const userPrompt = req.body.prompt;

    if (!userPrompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
      const result = await model.generateContent(userPrompt);
      const text = await result.response.text();
      res.status(200).json({ response: text });
    } catch (error) {
      console.error('Error generating content:', error);
      res.status(500).json({ error: 'Failed to generate content' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
