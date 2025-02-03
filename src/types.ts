type Note = {
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
  };