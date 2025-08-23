import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, CloudUpload, Download, Share, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: string;
  title: string;
  description: string;
  subject: string;
  fileUrl?: string;
  authorId: string;
  authorName: string;
  createdAt: any;
  isPublic: boolean;
}

export default function Notes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { userData } = useAuth();
  const { toast } = useToast();

  const subjects = ["All Subjects", "Computer Science", "Mathematics", "Physics", "English", "Chemistry", "Biology"];

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      // Fetch user's own notes and public notes
      const notesQuery = query(
        collection(db, 'notes'),
        orderBy('createdAt', 'desc')
      );
      
      const notesSnapshot = await getDocs(notesQuery);
      const notesData = notesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Note[];
      
      // Filter to show only user's notes and public notes
      const filteredNotes = notesData.filter(note => 
        note.authorId === userData?.uid || note.isPublic
      );
      
      setNotes(filteredNotes);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch notes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userData) return;

    setUploading(true);
    try {
      // Upload to Cloudinary
      const fileUrl = await uploadToCloudinary(file, 'notes');
      
      // Create note in Firestore
      const noteData = {
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        description: `Uploaded file: ${file.name}`,
        subject: "General",
        fileUrl,
        authorId: userData.uid,
        authorName: userData.displayName,
        createdAt: new Date(),
        isPublic: false
      };
      
      await addDoc(collection(db, 'notes'), noteData);
      
      toast({
        title: "Success",
        description: "Note uploaded successfully!"
      });
      
      fetchNotes();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload note.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "all" || selectedSubject === "All Subjects" || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-pastel-beige flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4" data-testid="text-notes-title">
            Study Notes
          </h1>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-sage-green/20 w-80"
                  data-testid="input-search-notes"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-48 px-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-sage-green/20" data-testid="select-subject-filter">
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject === "All Subjects" ? "all" : subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="neumorphic mb-8 border-2 border-dashed border-gray-300 hover:border-sage-green transition-all duration-300">
            <CardContent className="p-8">
              <div className="text-center">
                <CloudUpload className="text-4xl text-gray-400 mb-4 mx-auto h-16 w-16" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2" data-testid="text-upload-title">
                  Upload Notes
                </h3>
                <p className="text-gray-600 mb-4">Drag and drop files here or click to browse</p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />
                <label htmlFor="file-upload">
                  <Button 
                    className="bg-sage-green text-white px-6 py-2 rounded-xl shadow-soft hover:shadow-soft-hover transition-all duration-300"
                    data-testid="button-choose-files"
                    disabled={uploading}
                    asChild
                  >
                    <span>
                      {uploading ? "Uploading..." : "Choose Files"}
                    </span>
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notes Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                variants={itemVariants}
                layout
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                data-testid={`card-note-${note.id}`}
              >
                <Card className="neumorphic hover:shadow-soft-hover transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span 
                        className="bg-sage-green/20 text-sage-green px-3 py-1 rounded-full text-xs font-medium"
                        data-testid={`text-note-subject-${note.id}`}
                      >
                        {note.subject}
                      </span>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2" data-testid={`text-note-title-${note.id}`}>
                      {note.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4" data-testid={`text-note-description-${note.id}`}>
                      {note.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-500" data-testid={`text-note-date-${note.id}`}>
                          {note.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                        </span>
                        <p className="text-xs text-gray-400">by {note.authorName}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {note.fileUrl && (
                          <motion.a 
                            href={note.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-gray-400 hover:text-sage-green transition-colors"
                            data-testid={`button-download-note-${note.id}`}
                          >
                            <Download className="h-4 w-4" />
                          </motion.a>
                        )}
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-400 hover:text-sage-green transition-colors"
                          data-testid={`button-share-note-${note.id}`}
                        >
                          <Share className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredNotes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg" data-testid="text-no-notes">
              No notes found. Upload your first note to get started!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}