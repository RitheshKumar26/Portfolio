import { useState, useEffect } from 'react';

// Terminal Command Typing Effect Component
export function TerminalTyping({ commands }: { commands: string[] }) {
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    const currentCommand = commands[currentCommandIndex];
    
    if (currentCharIndex < currentCommand.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(currentCommand.slice(0, currentCharIndex + 1));
        setCurrentCharIndex(currentCharIndex + 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        const nextIndex = (currentCommandIndex + 1) % commands.length;
        setCurrentCommandIndex(nextIndex);
        setCurrentCharIndex(0);
        setDisplayedText('');
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [currentCharIndex, currentCommandIndex, commands]);

  return (
    <div style={{ fontFamily: 'Fragment Mono, monospace' }} className="text-[#66FF00] space-y-2 min-h-[120px] md:min-h-[150px] text-base md:text-lg lg:text-[22px]">
      {commands.map((cmd, index) => (
        <p key={index} className={index === currentCommandIndex ? 'opacity-100' : 'opacity-30'}>
          {index === currentCommandIndex ? (
            <>
              &gt; {displayedText}
              <span className="inline-block w-[2px] h-4 md:h-5 bg-[#66FF00] ml-1 animate-pulse" />
            </>
          ) : (
            `> ${cmd}`
          )}
        </p>
      ))}
    </div>
  );
}
export function TypingText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted && delay > 0) {
      const startTimeout = setTimeout(() => setHasStarted(true), delay);
      return () => clearTimeout(startTimeout);
    }
    
    if (delay === 0) setHasStarted(true);
    
    if (!hasStarted) return;

    const typingSpeed = isDeleting ? 20 : 50;
    const pauseTime = isDeleting ? 300 : 3000;

    if (!isDeleting && currentIndex === text.length) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseTime);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && currentIndex === 0) {
      const timeout = setTimeout(() => setIsDeleting(false), pauseTime);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      if (isDeleting) {
        setDisplayedText(text.slice(0, currentIndex - 1));
        setCurrentIndex(currentIndex - 1);
      } else {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, text, delay, hasStarted]);

  return (
    <span>
      {displayedText}
      <span className="inline-block w-[2px] h-5 bg-[#00D23B] ml-1 animate-pulse" />
    </span>
  );
}
