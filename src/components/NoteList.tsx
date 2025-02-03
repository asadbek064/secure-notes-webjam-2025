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
}