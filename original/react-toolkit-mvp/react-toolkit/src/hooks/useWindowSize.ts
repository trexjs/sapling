import { useEffect, useState } from "react";
export function useWindowSize() {
 const get = () => ({ width: typeof window === "undefined" ? 0 : window.innerWidth, height: typeof window === "undefined" ? 0 : window.innerHeight });
 const [size, setSize] = useState(get);
 useEffect(() => { const update = () => setSize(get()); window.addEventListener("resize", update); return () => window.removeEventListener("resize", update); }, []);
 return size;
}
