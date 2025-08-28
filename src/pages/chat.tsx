import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Paperclip, Smile, Send, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { addDoc, collection, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  createdAt: any;
}

interface ChatConversation {
  id: string;
  participants: string[];
  participantNames: string[];
  lastMessage?: string;
  updatedAt?: any;
}

interface ChatUser {
  uid: string;
  displayName: string;
  email: string;
}

export default function Chat() {
  const { userData } = useAuth();
  const currentUserId = userData?.uid;
  const currentUserName = userData?.displayName || "You";

  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);

  // Load users (excluding self)
  useEffect(() => {
    if (!currentUserId) return;
    const load = async () => {
      const snap = await getDocs(collection(db, "users"));
      const list = snap.docs
        .map((d) => ({ uid: d.id, ...(d.data() as any) }))
        .filter((u) => u.uid !== currentUserId) as ChatUser[];
      setUsers(list);
    };
    load();
  }, [currentUserId]);

  // Subscribe to conversations where current user is a participant
  useEffect(() => {
    if (!currentUserId) return;
    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", currentUserId),
      orderBy("updatedAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setConversations(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as ChatConversation[]
      );
    });
    return () => unsub();
  }, [currentUserId]);

  // Subscribe to selected conversation messages
  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      return;
    }
    const q = query(
      collection(db, "conversations", selectedChat, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Message[]
      );
    });
    return () => unsub();
  }, [selectedChat]);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return users.filter((u) => u.displayName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
  }, [users, searchQuery]);

  const getConversationDisplay = (conv: ChatConversation) => {
    const idx = conv.participants.findIndex((id) => id !== currentUserId);
    const name = conv.participantNames?.[idx] || "Conversation";
    return name;
  };

  const findExistingConversationWith = (otherUserId: string) => {
    return conversations.find(
      (c) => c.participants.length === 2 && c.participants.includes(otherUserId) && c.participants.includes(currentUserId!)
    );
  };

  const startNewChat = async (user: ChatUser) => {
    if (!currentUserId) return;
    const existing = findExistingConversationWith(user.uid);
    if (existing) {
      setSelectedChat(existing.id);
      setSearchQuery("");
      return;
    }
    const docRef = await addDoc(collection(db, "conversations"), {
      participants: [currentUserId, user.uid],
      participantNames: [currentUserName, user.displayName],
      lastMessage: "New conversation started",
      updatedAt: serverTimestamp(),
    });
    setSelectedChat(docRef.id);
    setSearchQuery("");
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedChat || !currentUserId) return;
    const content = messageInput.trim();
    setMessageInput("");
    const msgCol = collection(db, "conversations", selectedChat, "messages");
    await addDoc(msgCol, {
      content,
      senderId: currentUserId,
      senderName: currentUserName,
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, "conversations", selectedChat), {
      lastMessage: content,
      updatedAt: serverTimestamp(),
    });
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

              {/* Search Users */
              }
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

              {/* User Search Results */
              }
              {searchQuery && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Search Results:</h3>
                  <div className="space-y-2">
                    {filteredUsers.map(user => (
                      <div
                        key={user.uid}
                        className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                        onClick={() => startNewChat(user)}
                      >
                        <div className="w-8 h-8 rounded-full mr-3 bg-gray-200 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="text-sm font-medium">{user.displayName}</span>
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
                    <div className="w-10 h-10 rounded-full mr-3 bg-gray-200 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-800 truncate">
                        {getConversationDisplay(conversation)}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
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
                      <div className="w-8 h-8 rounded-full mr-3 bg-gray-200 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <h3 className="font-medium">
                        {getConversationDisplay(conversations.find(c => c.id === selectedChat)!)}
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
                          className={`flex ${message.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`flex items-end max-w-xs ${message.senderId === currentUserId ? "flex-row-reverse" : ""}`}>
                            <div className="w-6 h-6 rounded-full mx-2 bg-gray-200 flex items-center justify-center">
                              <User className="w-3 h-3 text-gray-500" />
                            </div>
                            <div
                              className={`px-3 py-2 rounded-lg ${
                                message.senderId === currentUserId
                                  ? "bg-sage-green text-white"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">{message.senderName}</p>
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
