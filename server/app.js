require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');  // New package

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Simple rule-based sentiment (free, no API)
function detectSentiment(text) {
  const positiveWords = ['good', 'happy', 'great', 'awesome', 'fine', 'okay', 'better', 'love', 'excited', 'hope', 'relaxed', 'calm'];
  const negativeWords = ['sad', 'depressed', 'anxious', 'stressed', 'bad', 'terrible', 'lonely', 'worry', 'fear', 'angry', 'hopeless', 'tired', 'overwhelmed'];

  const lowerText = text.toLowerCase();
  let posCount = positiveWords.filter(word => lowerText.includes(word)).length;
  let negCount = negativeWords.filter(word => lowerText.includes(word)).length;

  if (negCount > posCount) return 'negative';
  if (posCount > negCount) return 'positive';
  return 'neutral';  // fallback
}

function checkCrisis(text) {
  const crisisKeywords = [
    'suicide', 'kill myself', 'end it all', 'hopeless', 'die', 
    'want to die', 'not worth living', 'self harm', 'hurt myself'
  ];
  return crisisKeywords.some(word => text.toLowerCase().includes(word));
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ error: 'Please provide a valid message' });
    }

    const mood = detectSentiment(message);
    const isCrisis = checkCrisis(message);

    const systemPrompt = `You are a kind, supportive, non-judgmental mental health companion for students in Hyderabad, India.

User message: "${message}"
Detected mood: ${mood}
${isCrisis ? 'URGENT: This appears to be a crisis situation. Strongly recommend immediate professional help and helplines.' : ''}

Respond with:
- Empathy and warmth
- Encouragement
- If mood is negative or crisis, suggest one simple relaxation technique (e.g., deep breathing, grounding)
- Always end with: "I'm not a licensed therapist. For serious concerns, please talk to a counselor or call a helpline."
- Suggest helplines: Tele MANAS (14416), (1-800-891-4416), KIRAN (1800-599-0019)

Keep responses concise, hopeful, and caring.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      model: 'llama-3.1-8b-instant',  // Free, fast, good for chat (or try 'mixtral-8x7b-32768')
      temperature: 0.7,
      max_tokens: 350,
    });

    const reply = completion.choices[0]?.message?.content?.trim() || "I'm here to listen.";

    res.json({ reply });
  } catch (error) {
    console.error('Error in /api/chat:', error.message);
    res.status(500).json({ 
      error: "I'm having trouble responding right now. Please try again in a moment.",
      details: error.message  // For debugging
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Mental Health Chatbot Backend (Free with Groq)');
  console.log('-------------------------------');
  console.log(`Server running at: http://localhost:${PORT}`);
  console.log('Start frontend with: npm start in client folder');
  console.log('-------------------------------');
});