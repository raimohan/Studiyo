import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function Profile() {
  const { userData } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!userData) return;
      const snap = await getDoc(doc(db, "users", userData.uid));
      if (snap.exists()) {
        const data = snap.data() as any;
        setDisplayName(data.displayName || "");
      }
      setLoading(false);
    };
    load();
  }, [userData]);

  const save = async () => {
    if (!userData) return;
    await updateDoc(doc(db, "users", userData.uid), { displayName });
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-pastel-beige flex items-center justify-center">Loading...</div>
    );
  }

  return (
    <div className="pt-20">
      <div className="max-w-3xl mx-auto p-6">
        <Card className="neumorphic">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Display Name</label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
              <Button onClick={save} className="bg-sage-green text-white">Save</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


