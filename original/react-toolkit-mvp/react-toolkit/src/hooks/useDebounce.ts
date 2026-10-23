import { useEffect, useState } from "react";
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => { const id = setTimeout(() => setDebounced(value), Math.max(0, delay)); return () => clearTimeout(id); }, [value, delay]);
  return debounced;
}
