import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Users, FileText, MessageCircle, Settings, Trash2, Edit3 } from "lucide-react";

interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'student' | 'admin';
  createdAt: any;
}

interface Note {
  id: string;
  title: string;
  subject: string;
  authorId: string;
  authorName: string;
  createdAt: any;
}

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    fetchNotes();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as User[];
      setUsers(usersData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users.",
        variant: "destructive"
      });
    }
  };

  const fetchNotes = async () => {
    try {
      const notesSnapshot = await getDocs(collection(db, 'notes'));
      const notesData = notesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Note[];
      setNotes(notesData);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch notes.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const updateUserRole = async (uid: string, newRole: 'student' | 'admin') => {
    try {
      await updateDoc(doc(db, 'users', uid), { role: newRole });
      toast({
        title: "Success",
        description: "User role updated successfully."
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive"
      });
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
      toast({
        title: "Success",
        description: "Note deleted successfully."
      });
      fetchNotes();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pastel-beige flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pastel-beige p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, content, and platform settings</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="neumorphic">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-800">{users.length}</p>
                </div>
                <Users className="text-sage-green h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="neumorphic">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Notes</p>
                  <p className="text-2xl font-bold text-gray-800">{notes.length}</p>
                </div>
                <FileText className="text-soft-orange h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="neumorphic">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Admin Users</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
                <Settings className="text-sage-green h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="neumorphic">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Students</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {users.filter(u => u.role === 'student').length}
                  </p>
                </div>
                <Users className="text-soft-orange h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Management Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="content">Content Management</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <Card className="neumorphic">
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div
                        key={user.uid}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{user.displayName}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">
                            Joined: {user.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                          {user.uid !== userData?.uid && (
                            <Button
                              size="sm"
                              onClick={() => updateUserRole(
                                user.uid, 
                                user.role === 'admin' ? 'student' : 'admin'
                              )}
                              className="text-xs"
                            >
                              {user.role === 'admin' ? 'Make Student' : 'Make Admin'}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content">
              <Card className="neumorphic">
                <CardHeader>
                  <CardTitle>Content Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{note.title}</h4>
                          <p className="text-sm text-gray-600">Subject: {note.subject}</p>
                          <p className="text-xs text-gray-500">
                            By: {note.authorName} • {note.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => deleteNote(note.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}