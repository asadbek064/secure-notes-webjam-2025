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
}