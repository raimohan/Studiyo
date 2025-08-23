import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Paperclip, Smile, Send, User } from "lucide-react";
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
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Sample users for search (replace with real user data)
  const sampleUsers = [
    { id: "1", name: "John Doe", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50" },
    { id: "2", name: "Sarah Wilson", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50" },
    { id: "3", name: "Mike Johnson", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50" },
    { id: "4", name: "Emma Davis", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50" },
  ];

  const filteredUsers = sampleUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startNewChat = (user: { id: string; name: string; avatar: string }) => {
    const newConversation: ChatConversation = {
      id: user.id,
      name: user.name,
      lastMessage: "New conversation started",
      timestamp: "now",
      avatar: user.avatar,
      isActive: true,
    };

    // Remove any existing conversation with this user
    setConversations(prev => prev.filter(conv => conv.id !== user.id));
    
    // Add new conversation at the top
    setConversations(prev => [newConversation, ...prev]);
    
    // Select this conversation
    setSelectedChat(user.id);
    
    // Clear messages for new chat
    setMessages([]);
    
    // Clear search
    setSearchQuery("");
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageInput,
      sender: "You",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
      isUser: true,
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv.id === selectedChat 
        ? { ...conv, lastMessage: messageInput, timestamp: "now" }
        : conv
    ));
    
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
                <h2 className="text-xl font-semibold text-gray-800">
                  Messages
                </h2>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button 
                    size="sm" 
                    className="bg-sage-green hover:bg-sage-green/90 text-white"
                    onClick={() => setSearchQuery("")}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Chat
                  </Button>
                </motion.div>
              </div>

              {/* Search Users */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* User Search Results */}
              {searchQuery && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Search Results:</h3>
                  <div className="space-y-2">
                    {filteredUsers.map(user => (
                      <div
                        key={user.id}
                        className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                        onClick={() => startNewChat(user)}
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <span className="text-sm font-medium">{user.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conversations List */}
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedChat === conversation.id
                        ? "bg-sage-green/10 border border-sage-green/20"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedChat(conversation.id)}
                  >
                    <img
                      src={conversation.avatar}
                      alt={conversation.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-800 truncate">
                        {conversation.name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {conversation.timestamp}
                    </span>
                  </div>
                ))}
              </div>

              {conversations.length === 0 && !searchQuery && (
                <div className="text-center text-gray-500 mt-8">
                  <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No conversations yet</p>
                  <p className="text-sm">Search for users to start chatting!</p>
                </div>
              )}
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="border-b border-gray-200 p-4">
                    <div className="flex items-center">
                      <img
                        src={conversations.find(c => c.id === selectedChat)?.avatar}
                        alt="Chat"
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <h3 className="font-medium">
                        {conversations.find(c => c.id === selectedChat)?.name}
                      </h3>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-8">
                        <p>No messages yet</p>
                        <p className="text-sm">Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`flex items-end max-w-xs ${message.isUser ? "flex-row-reverse" : ""}`}>
                            <img
                              src={message.avatar}
                              alt={message.sender}
                              className="w-6 h-6 rounded-full mx-2"
                            />
                            <div
                              className={`px-3 py-2 rounded-lg ${
                                message.isUser
                                  ? "bg-sage-green text-white"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {message.timestamp}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="border-t border-gray-200 p-4">
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Smile className="w-4 h-4" />
                      </Button>
                      <Input
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        className="flex-1"
                      />
                      <Button 
                        size="sm" 
                        onClick={sendMessage}
                        className="bg-sage-green hover:bg-sage-green/90 text-white"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                    <p>Choose a chat from the left or start a new one</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
