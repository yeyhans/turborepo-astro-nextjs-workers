"use client";

import { useState } from "react";
import { Button } from "./button";

export function DataExample() {
  const [users, setUsers] = useState<any[]>([]);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8787/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async () => {
    try {
      const res = await fetch("http://localhost:8787/api/upload", { method: "POST" });
      const data = await res.json();
      setUploadResult(data.objectName);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 border rounded-xl bg-card text-card-foreground shadow-sm max-w-md mx-auto w-full">
      <h2 className="text-xl font-bold mb-6">API & Storage Test</h2>
      
      <div className="mb-6 space-y-4">
        <div>
          <h3 className="font-semibold text-lg">D1 Database</h3>
          <p className="text-sm text-muted-foreground mb-3">Fetch users from Cloudflare D1 via the API.</p>
          <Button onClick={fetchUsers} disabled={loading}>
            {loading ? "Loading..." : "Fetch Users"}
          </Button>
          
          {users.length > 0 ? (
            <ul className="list-disc pl-5 mt-4 space-y-1">
              {users.map(u => <li key={u.id} className="text-sm">{u.name} - {u.email}</li>)}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground mt-3">No users found or table is empty.</p>
          )}
        </div>
      </div>

      <div className="pt-4 border-t">
        <h3 className="font-semibold text-lg">R2 Storage</h3>
        <p className="text-sm text-muted-foreground mb-3">Create a dummy text file upload on Cloudflare R2.</p>
        <Button onClick={uploadFile} variant="secondary">Test File Upload</Button>
        {uploadResult && (
          <p className="text-sm text-green-600 dark:text-green-500 mt-3 font-medium">
            Success! File {uploadResult} created.
          </p>
        )}
      </div>
    </div>
  );
}
