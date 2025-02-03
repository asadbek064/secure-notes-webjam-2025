import { useState, useEffect } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { NoteEditor } from "@/components/NoteEditor";
import { TodoList } from "@/components/TodoList";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CryptoService } from "@/utils/crypto";
import type { Database } from "@/lib/database.types";
import { EncryptionKeySetup } from "@/components/EncryptionKeySetup";
import { FileList } from "@/components/FilesList";
import { NoteList } from "@/components/NoteList";
import { KeySquare } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Home() {
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const router = useRouter();

  const [encryptionKey, setEncryptionKey] = useState<string>("");
  const [decryptionError, setDecryptionError] = useState(false);
  const [decryptionErrorMessage, setDecryptionErrorMessage] = useState("");

  const [isDecrypting, setIsDecrypting] = useState(false);
  const [notes, setNotes] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);

  const handleSaveNote = async (note: { title: string; content: string }) => {
    if (!user || !encryptionKey) return;

    const { encryptedData, iv } = await CryptoService.encrypt(
      JSON.stringify(note),
      encryptionKey
    );

    const { error } = await supabase.from("notes").insert({
      user_id: user.id,
      title: note.title,
      encrypted_content: encryptedData,
      iv,
    });

    if (error) throw error;
    await loadData();
  };

  const handleAddTodo = async (content: string) => {
    if (!user || !encryptionKey) return;

    const { encryptedData, iv } = await CryptoService.encrypt(
      content,
      encryptionKey
    );

    const { error } = await supabase.from("todos").insert({
      user_id: user.id,
      encrypted_content: encryptedData,
      iv,
      completed: false,
    });

    if (error) throw error;
    await loadData();
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    if (!user) return;

    const { error } = await supabase
      .from("todos")
      .update({ completed })
      .eq("id", id);

    if (error) throw error;
    await loadData();
  };

  const handleFileUpload = async (file: {
    name: string;
    key: string;
    iv: string;
  }) => {
    if (!user) return;

    const { error } = await supabase.from("files").insert({
      user_id: user.id,
      name: file.name,
      storage_key: file.key,
      iv: file.iv,
    });

    if (error) throw error;
    await loadData();
  };

  useEffect(() => {
    const savedKey = sessionStorage.getItem("encryption_key");
    if (savedKey) {
      setEncryptionKey(savedKey);
    }
  }, []);

  useEffect(() => {
    if (user && encryptionKey) {
      loadData();
    }
  }, [user, encryptionKey]);

  const handleSetEncryptionKey = (key: string) => {
    setEncryptionKey(key);
  };

  const handleLogout = async () => {
    sessionStorage.removeItem("encryption_key");
    setEncryptionKey("");
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleDeleteNote = async (id: string) => {
    if (!user) return;

    const { error } = await supabase.from("notes").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete note:", error);
      return;
    }

    await loadData();
  };

  const handleDeleteTodo = async (id: string) => {
    if (!user) return;

    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete note:", error);
      return;
    }

    await loadData();
  };

  const loadData = async () => {
    if (!encryptionKey) return;

    setIsDecrypting(true);

    try {
      const [notesResponse, todosResponse, filesResponse] = await Promise.all([
        supabase
          .from("notes")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("todos")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("files")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      if (notesResponse.data) {
        const decryptedNotes = await Promise.all(
          notesResponse.data.map(async (note) => {
            const decrypted = await CryptoService.decrypt(
              note.encrypted_content,
              note.iv,
              encryptionKey
            );
            return { ...note, content: JSON.parse(decrypted) };
          })
        );
        setNotes(decryptedNotes);
      }

      if (todosResponse.data) {
        const decryptedTodos = await Promise.all(
          todosResponse.data.map(async (todo) => {
            const decrypted = await CryptoService.decrypt(
              todo.encrypted_content,
              todo.iv,
              encryptionKey
            );
            return { ...todo, content: decrypted };
          })
        );
        setTodos(decryptedTodos);
      }

      setFiles(filesResponse.data || []);
    } catch (error) {
      console.log("Failed to decrypt data:", error);
      setDecryptionErrorMessage("Failed to decrypt data. The encryption key may be incorrect.");
      setDecryptionError(true);
      return;
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleDismissError = () => {
    setDecryptionError(false);
    setDecryptionErrorMessage("");
    sessionStorage.removeItem("encryption_key");
    setEncryptionKey("");
  };

  if (decryptionError) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{decryptionErrorMessage}</AlertDescription>
        </Alert>
        <Button onClick={handleDismissError} className="w-full">
          Return to Key Entry
        </Button>
      </div>
    );
  }

  if (!encryptionKey) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Secure Notes</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
        <EncryptionKeySetup onKeySet={handleSetEncryptionKey} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Secure Notes</h1>
        <div className="space-x-2 flex flex-row">
          <Button
            variant="outline"
            onClick={() => {
              sessionStorage.removeItem("encryption_key");
              setEncryptionKey("");
            }}
          >
            <div className="flex flex-row items-center justify-center space-x-2">
              <KeySquare className="h-4 w-4" />
              <div>Rekey</div>
            </div>
          </Button>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>

      {!encryptionKey ? (
        <div className="max-w-md mx-auto">
          <Input
            type="password"
            placeholder="Enter encryption key"
            value={encryptionKey}
            onChange={(e) => setEncryptionKey(e.target.value)}
          />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <NoteEditor onSave={handleSaveNote} />
            <NoteList notes={notes} onDelete={handleDeleteNote} />
          </div>

          <TodoList
            todos={todos}
            onAdd={handleAddTodo}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
          />

          <div className="space-y-8">
            <FileUpload
              onUpload={handleFileUpload}
              encryptionKey={encryptionKey}
            />

            {/* @ts-ignore */}
            <FileList
              files={files}
              encryptionKey={encryptionKey}
              onDelete={async (id: any) => {
                const file = files.find((f) => f.id === id);
                if (!file) return;

                const { error: storageError } = await supabase.storage
                  .from("encrypted-files")
                  .remove([file.storage_key]);

                if (storageError) {
                  console.error(
                    "Failed to delete file from storage:",
                    storageError
                  );
                  return;
                }

                const { error: dbError } = await supabase
                  .from("files")
                  .delete()
                  .eq("id", id);

                if (dbError) {
                  console.error("Failed to delete file record:", dbError);
                  return;
                }

                await loadData();
              }}
            />
          </div>
        </div>
      )}

      <div className="container mx-auto p-4 space-y-8 pb-16">
        <Footer />
      </div>
    </div>
  );
}
