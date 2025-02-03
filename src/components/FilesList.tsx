import { useState } from 'react';
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
}