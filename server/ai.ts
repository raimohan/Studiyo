import { Router } from 'express';

const router = Router();

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

router.post('/chat', async (req, res) => {
  try {
    const { messages }: { messages: ChatMessage[] } = req.body;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI study assistant for students. Provide clear, educational responses that help with learning and academic questions. Keep responses concise but informative.'
          },
          ...messages
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || 'Sorry, I could not process your request.';

    res.json({ message: aiMessage });
  } catch (error) {
    console.error('AI API Error:', error);
    res.status(500).json({ error: 'Failed to communicate with AI assistant' });
  }
});

export default router;