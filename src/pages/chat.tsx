import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Paperclip, Smile, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  avatar: string;
  isUser: boolean;
}

interface ChatConversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  isActive?: boolean;
}

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState("1");
  const [messageInput, setMessageInput] = useState("");

  const conversations: ChatConversation[] = [
    {
      id: "1",
      name: "Study Group CS301",
      lastMessage: "Sarah: Can someone help with question 3?",
      timestamp: "2m",
      avatar: "https://pixabay.com/get/g0b9fcc301565b9fe4e72f3eecb8193871f4aa3938d89db000082baa27cafdde51b68ac9ad038ec93d6109ab6eb824ca4f54bd9cb6a2495eaefda51b7a229fb5c_1280.jpg",
      isActive: true,
    },
    {
      id: "2",
      name: "Mike Johnson",
      lastMessage: "Thanks for the notes!",
      timestamp: "1h",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
    },
    {
      id: "3",
      name: "Emma Wilson",
      lastMessage: "See you at the library!",
      timestamp: "3h",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
    },
  ];

  const messages: Message[] = [
    {
      id: "1",
      content: "Hey everyone! Did anyone complete the assignment for tomorrow?",
      sender: "Mike",
      timestamp: "2:30 PM",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
      isUser: false,
    },
    {
      id: "2",
      content: "Yes! I finished it this morning. Need help with anything specific?",
      sender: "You",
      timestamp: "2:32 PM",
      avatar: "https://pixabay.com/get/g462f067bbf61bd276d51f2fe4dc1eca548a0bff65ca31aea4a74852ac4a927c441c0645df07f486d20016e4c3827df009f41c81d88366a79fb54eba977c46ebe_1280.jpg",
      isUser: true,
    },
    {
      id: "3",
      content: "Can someone help with question 3? I'm stuck 😅",
      sender: "Emma",
      timestamp: "2:35 PM",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
      isUser: false,
    },
  ];

  const sendMessage = () => {
    if (!messageInput.trim()) return;
    // Here you would typically add the message to the messages array
    setMessageInput("");
  };

  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto p-6">
        <Card className="neumorphic overflow-hidden" style={{ height: "80vh" }}>
          <div className="flex h-full">
            {/* Chat List */}
            <div className="w-1/3 border-r border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800" data-testid="text-chat-title">
                  Messages
                </h2>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button 
                    className="gradient-pastel text-white p-2 rounded-full shadow-soft hover:shadow-soft-hover transition-all duration-300"
                    data-testid="button-new-chat"
                  >
                    <Plus />
                  </Button>
                </motion.div>
              </div>
              
              {/* Search */}
              <div className="relative mb-6">
                <Input
                  type="text"
                  placeholder="Search conversations..."
                  className="pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-sage-green/20"
                  data-testid="input-search-conversations"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>

              {/* Chat List Items */}
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <motion.div
                    key={conversation.id}
                    whileHover={{ x: 4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedChat(conversation.id)}
                    className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-colors duration-200 ${
                      selectedChat === conversation.id
                        ? "bg-sage-green/10"
                        : "hover:bg-sage-green/10"
                    }`}
                    data-testid={`chat-item-${conversation.id}`}
                  >
                    <img 
                      src={conversation.avatar} 
                      alt={conversation.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 truncate" data-testid={`text-chat-name-${conversation.id}`}>
                        {conversation.name}
                      </h4>
                      <p className="text-sm text-gray-600 truncate" data-testid={`text-chat-last-message-${conversation.id}`}>
                        {conversation.lastMessage}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500" data-testid={`text-chat-timestamp-${conversation.id}`}>
                      {conversation.timestamp}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <img 
                    src="https://pixabay.com/get/g47f2188ff854427f32e59f6ca4272f775083991a10766c256c02a9b879b4c76c6bff3f167943212c0da7fc3a78a5d1db0c1db99c1e9b74622ab1c9e53b9f99ba_1280.jpg" 
                    alt="Study group" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800" data-testid="text-current-chat-name">
                      Study Group CS301
                    </h3>
                    <p className="text-sm text-gray-600" data-testid="text-current-chat-status">
                      5 members • Active now
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4" data-testid="chat-messages-container">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-start space-x-3 ${
                        message.isUser ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                      data-testid={`message-${message.id}`}
                    >
                      <img 
                        src={message.avatar} 
                        alt={message.sender}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div
                        className={`rounded-2xl px-4 py-3 max-w-xs ${
                          message.isUser
                            ? "gradient-pastel text-white rounded-tr-md"
                            : "bg-gray-100 text-gray-800 rounded-tl-md"
                        }`}
                      >
                        <p className={message.isUser ? "text-white" : "text-gray-800"}>
                          {message.content}
                        </p>
                        <span 
                          className={`text-xs mt-1 block ${
                            message.isUser ? "opacity-80" : "text-gray-500"
                          }`}
                          data-testid={`message-timestamp-${message.id}`}
                        >
                          {message.sender} • {message.timestamp}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="sm" className="p-2 text-gray-400 hover:text-sage-green transition-colors">
                    <Paperclip />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      type="text"
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      className="w-full px-4 py-3 bg-gray-50 rounded-full border-none focus:ring-2 focus:ring-sage-green/20 pr-12"
                      data-testid="input-message"
                    />
                    <Button variant="ghost" size="sm" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-sage-green transition-colors">
                      <Smile />
                    </Button>
                  </div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      onClick={sendMessage}
                      className="gradient-pastel text-white p-3 rounded-full shadow-soft hover:shadow-soft-hover transition-all duration-300"
                      data-testid="button-send-message"
                    >
                      <Send />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
