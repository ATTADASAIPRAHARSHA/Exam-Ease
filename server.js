import 'dotenv/config'; // Automatically loads .env file
import express from 'express';
import bodyParser from 'body-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

// Initialize Google Generative AI with API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.VITE_GOOGLE_GENAI_API_KEY);

// Get the generative model
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));


app.get('/api/generate', async (req, res) => {
    const result = await model.generateContent("write an essay on ai");
    const text = await result.response.text(); // Await the text() method
    res.json({ response: text });
    console.log(text);
});

// POST endpoint to handle AI bot requests
app.post('/api/generate', async (req, res) => {
  const userPrompt = req.body.prompt;
  console.log(userPrompt);
  if (!userPrompt) {
      return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
      const result = await model.generateContent(userPrompt);
      const text = await result.response.text(); // Await the text() method
      res.json({ response: text });
      console.log(text);
  } catch (error) {
      console.error('Error generating content:', error);

      // Handle errors generically
      if (error.message.includes('RECITATION')) {
          res.status(400).json({ error: 'Content blocked due to restrictions' });
      } else {
          res.status(500).json({ error: 'Failed to generate content' });
      }
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
