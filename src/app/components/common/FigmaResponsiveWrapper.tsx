import { useState, useEffect, useRef, ReactNode } from 'react';

const DESIGN_WIDTH = 1536;

export default function FigmaResponsiveWrapper({ children, className = '' }: { children: ReactNode; className?: string }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const s = vw < DESIGN_WIDTH ? vw / DESIGN_WIDTH : 1;
      setScale(s);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (innerRef.current) {
      setHeight(innerRef.current.scrollHeight * scale);
    }
  }, [scale, children]);

  return (
    <div className={`relative w-full overflow-x-hidden ${className}`} style={{ height: height || 'auto' }}>
      <div ref={innerRef} style={{ width: DESIGN_WIDTH, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        {children}
      </div>
    </div>
  );
}