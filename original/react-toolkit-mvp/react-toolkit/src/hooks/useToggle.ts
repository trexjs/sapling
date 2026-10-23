import { useCallback, useState } from "react";
export function useToggle(initial = false): [boolean, (next?: boolean) => void, () => void] {
 const [value, setValue] = useState(initial);
 const set = useCallback((next?: boolean) => setValue(current => next ?? !current), []);
 const toggle = useCallback(() => setValue(v => !v), []);
 return [value, set, toggle];
}
