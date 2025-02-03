/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/pages/api-reference/config/typescript for more information.
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/api/auth')

  if (session && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: any;
  created_at: string;
}

interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
}

export function NoteList({ notes, onDelete }: NoteListProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Notes</CardTitle>
      </CardHeader>
      <CardContent className='h-[20rem] overflow-y-auto'>
        {notes.length === 0 ? (
          <p className="text-gray-500">No notes yet.</p>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <Card key={note.id} className="p-4">
                <h3 className="font-medium mb-2">{note.title}</h3>
                <p className="text-gray-600 text-sm">{note.content.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-gray-400">
                    {new Date(note.created_at).toLocaleDateString()}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(note.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface NoteEditorProps {
  onSave: (note: { title: string; content: string }) => Promise<void>;
}

export function NoteEditor({ onSave }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSaving(true);
    try {
      await onSave({ title, content });
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add Note</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSaving}
          />
          <Textarea
            placeholder="Note content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-32"
            disabled={isSaving}
          />
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Note'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface Todo {
  id: string;
  content: string;
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
  onAdd: (content: string) => Promise<void>;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function TodoList({ todos, onAdd, onToggle, onDelete }: TodoListProps) {
  const [newTodo, setNewTodo] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setIsAdding(true);
    try {
      await onAdd(newTodo);
      setNewTodo('');
    } catch (error) {
      console.error('Failed to add todo:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Todos</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Add a new todo"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              disabled={isAdding}
            />
            <Button type="submit" disabled={isAdding}>
              {isAdding ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </form>

        <div className="mt-4 space-y-2 h-[18rem]">
          {todos.map((todo) => (
            <div key={todo.id} className="flex items-center space-x-2">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={(checked) => onToggle(todo.id, checked as boolean)}
                id={todo.id}
              />
              <label
                htmlFor={todo.id}
                className={`flex-grow ${todo.completed ? 'line-through text-gray-500' : ''}`}
              >
                {todo.content}
              </label>
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(todo.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EncryptionKeySetupProps {
  onKeySet: (key: string) => void;
}

export function EncryptionKeySetup({ onKeySet }: EncryptionKeySetupProps) {
  const [key, setKey] = useState('');
  const [confirmKey, setConfirmKey] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!key || !confirmKey) {
      setError('Both fields are required');
      return;
    }

    if (key.length < 8) {
      setError('Encryption key must be at least 8 characters');
      return;
    }

    if (key !== confirmKey) {
      setError('Keys do not match');
      return;
    }

    sessionStorage.setItem('encryption_key', key);
    onKeySet(key);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Set Encryption Key</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter encryption key"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                setError(null);
              }}
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Confirm encryption key"
              value={confirmKey}
              onChange={(e) => {
                setConfirmKey(e.target.value);
                setError(null);
              }}
              autoComplete="new-password"
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full">
            Set Encryption Key
          </Button>
          <p className="text-sm text-gray-500 text-center">
            Remember this key! You'll need it to decrypt your data.
            We don't store this key anywhere.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CryptoService } from '@/utils/crypto';
import { Download, Trash2 } from 'lucide-react';

interface FileRecord {
  id: string;
  name: string;
  storage_key: string;
  iv: string;
  created_at: string;
}

interface FileListProps {
  files: FileRecord[];
  encryptionKey: string;
  onDelete?: (id: string) => Promise<void>;
}

export function FileList({ files, encryptionKey, onDelete }: FileListProps) {
  const supabase = useSupabaseClient();
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (file: FileRecord) => {
    setError(null);
    setDownloading(file.id);

    try {
      const { data, error: downloadError } = await supabase.storage
        .from('encrypted-files')
        .download(file.storage_key);

      if (downloadError) throw downloadError;
      if (!data) throw new Error('No data received');

      const encryptedBuffer = await data.arrayBuffer();
      const encryptedBase64 = CryptoService['arrayBufferToBase64'](encryptedBuffer);

      const decryptedBuffer = await CryptoService.decryptFile(
        encryptedBase64,
        file.iv,
        encryptionKey
      );

      const blob = new Blob([decryptedBuffer]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Failed to download file:', error);
      setError('Failed to download file. Please check your encryption key and try again.');
    } finally {
      setDownloading(null);
    }
  };

  if (files.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Files</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No files uploaded yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Files</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="divide-y">
            {files.map((file) => (
              <div
                key={file.id}
                className="py-3 flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(file.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(file)}
                    disabled={!!downloading}
                  >
                    {downloading === file.id ? (
                      'Downloading...'
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </>
                    )}
                  </Button>
                  {onDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(file.id)}
                      disabled={!!downloading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { CryptoService } from '@/utils/crypto';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FileUploadProps {
  encryptionKey: string;
  onUpload: (file: { name: string; key: string; iv: string }) => Promise<void>;
}

export function FileUpload({ encryptionKey, onUpload }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = useSupabaseClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      const { encryptedData, iv } = await CryptoService.encryptFile(file, encryptionKey);

      const fileKey = `${crypto.randomUUID()}-${file.name}`;

      const encryptedBlob = new Blob(
        [CryptoService['base64ToArrayBuffer'](encryptedData)],
        { type: 'application/octet-stream' }
      );

      const { error: uploadError } = await supabase.storage
        .from('encrypted-files')
        .upload(fileKey, encryptedBlob);

      if (uploadError) throw uploadError;

      await onUpload({
        name: file.name,
        key: fileKey,
        iv
      });

      e.target.value = '';

    } catch (error) {
      console.error('Failed to upload file:', error);
      setError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Encrypted File</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="file"
            onChange={handleFileChange}
            disabled={isUploading}
            className="cursor-pointer"
          />
          {isUploading && (
            <div className="text-sm text-gray-500">
              Encrypting and uploading file...
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}export function Footer() {
    return (
      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center text-gray-500 text-sm bg-background/80 backdrop-blur-sm border-t">
        <p>
          Created by{' '}
          <a 
            href="https://asadk.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Asadbek Karimov
          </a>
          {' • '}
          <a 
            href="https://github.com/asadbek064" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            GitHub
          </a>
        </p>
      </footer>
    );
  }export class CryptoService {
    private static async deriveKey(password: string): Promise<CryptoKey> {
      const enc = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
      );
  
      return crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: enc.encode("secure-notes-salt"),
          iterations: 100000,
          hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );
    }
  
    static async encrypt(data: string, password: string): Promise<{ encryptedData: string, iv: string }> {
      const key = await this.deriveKey(password);
      const enc = new TextEncoder();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      const encryptedBuffer = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        enc.encode(data)
      );
  
      return {
        encryptedData: this.arrayBufferToBase64(encryptedBuffer),
        /* @ts-ignore */
        iv: this.arrayBufferToBase64(iv)
      };
    }
  
    static async decrypt(encryptedData: string, iv: string, password: string): Promise<string> {
      const key = await this.deriveKey(password);
      const dec = new TextDecoder();
      
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: this.base64ToArrayBuffer(iv) },
        key,
        this.base64ToArrayBuffer(encryptedData)
      );
  
      return dec.decode(decryptedBuffer);
    }
  
    static async encryptFile(file: File, password: string): Promise<{ encryptedData: string, iv: string }> {
      const key = await this.deriveKey(password);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // Read file as array buffer
      const fileBuffer = await new Promise<ArrayBuffer>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.readAsArrayBuffer(file);
      });
      
      const encryptedBuffer = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        fileBuffer
      );
  
      return {
        encryptedData: this.arrayBufferToBase64(encryptedBuffer),
        /* @ts-ignore */
        iv: this.arrayBufferToBase64(iv)
      };
    }
  
    static async decryptFile(encryptedData: string, iv: string, password: string): Promise<ArrayBuffer> {
      const key = await this.deriveKey(password);
      
      return crypto.subtle.decrypt(
        { name: "AES-GCM", iv: this.base64ToArrayBuffer(iv) },
        key,
        this.base64ToArrayBuffer(encryptedData)
      );
    }
  
    private static arrayBufferToBase64(buffer: ArrayBuffer): string {
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    }
  
    private static base64ToArrayBuffer(base64: string): ArrayBuffer {
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    }
  }type Note = {
    id: string;
    title: string;
    content: string;
    encrypted: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  
  type Todo = {
    id: string;
    title: string;
    completed: boolean;
    encrypted: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  
  type EncryptedFile = {
    id: string;
    name: string;
    encryptedData: ArrayBuffer;
    iv: Uint8Array;
    createdAt: Date;
  };import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      notes: {
        Row: {
          id: string
          user_id: string
          title: string
          encrypted_content: string
          iv: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          encrypted_content: string
          iv: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          encrypted_content?: string
          iv?: string
          created_at?: string
          updated_at?: string
        }
      }
      todos: {
        Row: {
          id: string
          user_id: string
          encrypted_content: string
          iv: string
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          encrypted_content: string
          iv: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          encrypted_content?: string
          iv?: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      files: {
        Row: {
          id: string
          user_id: string
          name: string
          storage_key: string
          iv: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          storage_key: string
          iv: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          storage_key?: string
          iv?: string
          created_at?: string
        }
      }
    }
  }
}import { useState, useEffect } from "react";
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

export default function Home() {
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const router = useRouter();

  const [encryptionKey, setEncryptionKey] = useState<string>("");
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
      console.error("Failed to decrypt data:", error);
      sessionStorage.removeItem("encryption_key");
      setEncryptionKey("");
    } finally {
      setIsDecrypting(false);
    }
  };

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
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function Register() {
  const router = useRouter()
  const supabase = useSupabaseClient()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/api/auth/callback`,
        },
      })

      if (error) throw error

      router.push('/login?message=Check your email to confirm your account')
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              required
            />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
            />
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <Button type="submit" className="w-full">
              Register
            </Button>
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState } from 'react';

export default function Login() {
  const supabase = useSupabaseClient();
  const [error, setError] = useState<string | null>(null);

  const handleDiscordLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: process.env.NEXT_PUBLIC_SITE_URL || "https://webdev-webjam-2025-secure-notes.vercel.app/", 
          scopes: 'identify email'
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Discord login error:', error);
      setError('Failed to login with Discord. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login with Discord</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              className="w-full bg-[#5865F2] hover:bg-[#4752C4]"
              onClick={handleDiscordLogin}
            >
              <svg 
                className="w-5 h-5 mr-2" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.419c0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z"/>
              </svg>
              Continue with Discord
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import type { Database } from '@/lib/database.types'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createPagesBrowserClient<Database>())

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};

export default nextConfig;
