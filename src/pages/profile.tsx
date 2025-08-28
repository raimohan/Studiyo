import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function Profile() {
  const { userData, logout } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [about, setAbout] = useState("");
  const [photoURL, setPhotoURL] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!userData) return;
      const snap = await getDoc(doc(db, "users", userData.uid));
      if (snap.exists()) {
        const data = snap.data() as any;
        setDisplayName(data.displayName || "");
        setAbout(data.about || "");
        setPhotoURL(data.photoURL);
      }
      setLoading(false);
    };
    load();
  }, [userData]);

  const save = async () => {
    if (!userData) return;
    setSaving(true);
    await updateDoc(doc(db, "users", userData.uid), { displayName, about, photoURL });
    setSaving(false);
  };

  const onAvatarChange = async (file?: File) => {
    if (!file || !userData) return;
    
    try {
      setSaving(true);
      const url = await uploadToCloudinary(file, 'avatars');
      setPhotoURL(url);
      await updateDoc(doc(db, 'users', userData.uid), { photoURL: url });
      
      // Also update the auth context if needed
      window.location.reload(); // Simple way to refresh user data
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload profile picture. Please try again.');
    } finally {
      setSaving(false);
    }
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
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                  {photoURL ? (
                    <img src={photoURL} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-500 text-sm">No Photo</span>
                  )}
                </div>
                <div>
                  <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={(e) => onAvatarChange(e.target.files?.[0])} />
                  <label htmlFor="avatar-upload">
                    <Button variant="outline">Change Photo</Button>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Display Name</label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">About</label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full min-h-[120px] rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-sage-green/20"
                  placeholder="Tell something about yourself"
                />
              </div>

              <div className="flex items-center gap-3">
                <Button onClick={save} className="bg-sage-green text-white" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                <Button variant="outline" onClick={logout}>Logout</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


