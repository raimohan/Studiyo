export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const sendMessageToAI = async (messages: ChatMessage[]): Promise<string> => {
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('AI API Error:', error);
    throw new Error('Failed to communicate with AI assistant');
  }
};