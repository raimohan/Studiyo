import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sendMessageToAI } from "@/lib/ai";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI study assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      // Convert messages to API format
      const chatMessages = messages
        .concat(userMessage)
        .slice(-10) // Keep last 10 messages for context
        .map(msg => ({
          role: msg.isUser ? 'user' as const : 'assistant' as const,
          content: msg.content
        }));

      const aiResponse = await sendMessageToAI(chatMessages);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // Only show AI assistant when user is logged in
  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      <motion.div
        animate={{ scale: isOpen ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="gradient-pastel text-white w-14 h-14 rounded-full shadow-soft hover:shadow-soft-hover transition-all duration-300 animate-pulse-soft"
          data-testid="button-ai-assistant"
        >
          <Bot className="text-xl" />
        </Button>
      </motion.div>

      {/* Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-16 right-0 w-80"
          >
            <Card className="neumorphic overflow-hidden">
              {/* Chat Header */}
              <div className="gradient-pastel text-white p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot />
                  <span className="font-semibold">AI Study Assistant</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200"
                  data-testid="button-close-ai-chat"
                >
                  <X />
                </Button>
              </div>

              {/* Chat Messages */}
              <div className="h-80 p-4 overflow-y-auto space-y-3" data-testid="ai-chat-messages">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`${
                        message.isUser
                          ? "gradient-pastel text-white rounded-2xl rounded-tr-md px-4 py-3 ml-auto max-w-xs"
                          : "bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3"
                      }`}
                    >
                      <p className={message.isUser ? "text-white" : "text-gray-800"}>
                        {message.content}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Ask me anything..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-3 py-2 bg-gray-50 rounded-full border-none focus:ring-2 focus:ring-sage-green/20 text-sm"
                    data-testid="input-ai-message"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={isLoading}
                    className="gradient-pastel text-white p-2 rounded-full shadow-soft hover:shadow-soft-hover transition-all duration-300"
                    data-testid="button-send-ai-message"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send className="text-sm" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
