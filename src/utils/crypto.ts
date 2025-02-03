export class CryptoService {
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
  }