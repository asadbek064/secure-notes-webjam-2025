import { useState } from 'react';
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
}