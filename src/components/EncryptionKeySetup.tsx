import { useState } from 'react';
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
}