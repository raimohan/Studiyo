import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Image, Bold, Italic, Trash2, Edit3, Check, X } from "lucide-react";

interface Thread {
  id: string;
  title: string;
  content: string; // markdown-like
  images?: string[];
  authorId: string;
  authorName: string;
  createdAt: any;
}

export default function Forum() {
  const { userData } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");

  useEffect(() => {
    const q = query(collection(db, "threads"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setThreads(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Thread[]
      );
    });
    return () => unsub();
  }, []);

  const createThread = async () => {
    if (!title.trim() || !content.trim() || !userData) return;
    await addDoc(collection(db, "threads"), {
      title: title.trim(),
      content: content.trim(),
      images,
      authorId: userData.uid,
      authorName: userData.displayName,
      createdAt: serverTimestamp(),
    });
    setTitle("");
    setContent("");
    setImages([]);
  };

  const uploadImage = async (file: File) => {
    const url = await uploadToCloudinary(file, 'forum');
    setImages((prev) => [url, ...prev]);
  };

  const toggleBold = () => {
    const textarea = document.querySelector('textarea[placeholder*="Write your post"]') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      const beforeText = textarea.value.substring(0, start);
      const afterText = textarea.value.substring(end);
      
      if (selectedText) {
        const newContent = beforeText + `**${selectedText}**` + afterText;
        setContent(newContent);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + 2, end + 2);
        }, 10);
      } else {
        const newContent = content + "**bold text**";
        setContent(newContent);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(newContent.length - 11, newContent.length - 2);
        }, 10);
      }
    }
  };

  const toggleItalic = () => {
    const textarea = document.querySelector('textarea[placeholder*="Write your post"]') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      const beforeText = textarea.value.substring(0, start);
      const afterText = textarea.value.substring(end);
      
      if (selectedText) {
        const newContent = beforeText + `*${selectedText}*` + afterText;
        setContent(newContent);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + 1, end + 1);
        }, 10);
      } else {
        const newContent = content + "*italic text*";
        setContent(newContent);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(newContent.length - 12, newContent.length - 1);
        }, 10);
      }
    }
  };

  const startEdit = (t: Thread) => {
    setEditingId(t.id);
    setEditingTitle(t.title);
    setEditingContent(t.content || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
    setEditingContent("");
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await updateDoc(doc(db, 'threads', editingId), {
      title: editingTitle.trim(),
      content: editingContent.trim(),
    });
    cancelEdit();
  };

  const removeThread = async (id: string) => {
    await deleteDoc(doc(db, 'threads', id));
  };

  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="pt-20">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card className="neumorphic">
          <CardHeader>
            <CardTitle>Create Thread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Thread title" />
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={toggleBold}><Bold className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm" onClick={toggleItalic}><Italic className="w-4 h-4" /></Button>
                <input id="forum-image" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && uploadImage(e.target.files[0])} />
                <label htmlFor="forum-image">
                  <Button variant="outline" size="sm"><Image className="w-4 h-4" /></Button>
                </label>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post (supports basic markdown like **bold**, *italic*)"
                className="w-full min-h-[140px] rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-sage-green/20"
              />
              {images.length > 0 && (
                <div className="flex gap-3 flex-wrap">
                  {images.map((img) => (
                    <img key={img} src={img} className="h-20 w-20 object-cover rounded-lg" />
                  ))}
                </div>
              )}
              <div className="flex justify-end">
                <Button onClick={createThread} className="bg-sage-green text-white">Post</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {threads.map((t) => (
          <Card key={t.id} className="neumorphic">
            <CardHeader>
              <div className="flex items-center justify-between">
                {editingId === t.id ? (
                  <Input value={editingTitle} onChange={(e) => setEditingTitle(e.target.value)} />
                ) : (
                  <CardTitle>{t.title}</CardTitle>
                )}
                {(t.authorId === userData?.uid) && (
                  <div className="flex items-center gap-2">
                    {editingId === t.id ? (
                      <>
                        <Button size="sm" onClick={saveEdit}><Check className="w-4 h-4" /></Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}><X className="w-4 h-4" /></Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" onClick={() => startEdit(t)}><Edit3 className="w-4 h-4" /></Button>
                        <Button size="sm" variant="destructive" onClick={() => removeThread(t.id)}><Trash2 className="w-4 h-4" /></Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-3">by {t.authorName}</p>
              {editingId === t.id ? (
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className="w-full min-h-[120px] rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-sage-green/20"
                />
              ) : (
                <pre className="whitespace-pre-wrap text-gray-800">{t.content}</pre>
              )}
              {t.images && t.images.length > 0 && (
                <div className="flex gap-3 flex-wrap mt-3">
                  {t.images.map((img) => (
                    <img key={img} src={img} className="h-24 w-24 object-cover rounded-lg" />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


