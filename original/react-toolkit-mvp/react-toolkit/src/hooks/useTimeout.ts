import { useEffect, useRef } from "react";
export function useTimeout(callback: () => void, delay: number | null) {
 const saved = useRef(callback); useEffect(() => { saved.current = callback; }, [callback]);
 useEffect(() => { if (delay === null) return; const id = setTimeout(() => saved.current(), Math.max(0, delay)); return () => clearTimeout(id); }, [delay]);
}
