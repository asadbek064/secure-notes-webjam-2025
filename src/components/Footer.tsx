export function Footer() {
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
  }