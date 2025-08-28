import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { addDoc, collection, getDocs, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";

interface Thread {
  id: string;
  title: string;
  authorName: string;
  createdAt: any;
}

export default function Forum() {
  const { userData } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [title, setTitle] = useState("");

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
    if (!title.trim() || !userData) return;
    await addDoc(collection(db, "threads"), {
      title: title.trim(),
      authorName: userData.displayName,
      createdAt: serverTimestamp(),
    });
    setTitle("");
  };

  return (
    <div className="pt-20">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card className="neumorphic">
          <CardHeader>
            <CardTitle>Create Thread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Thread title" />
              <Button onClick={createThread} className="bg-sage-green text-white">Post</Button>
            </div>
          </CardContent>
        </Card>

        {threads.map((t) => (
          <Card key={t.id} className="neumorphic">
            <CardHeader>
              <CardTitle>{t.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">by {t.authorName}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


