import { useCallback, useState } from "react";
export function useCopyToClipboard(): [string | null, (text: string) => Promise<boolean>] {
 const [copied, setCopied] = useState<string | null>(null);
 const copy = useCallback(async (text: string) => { try { if (!navigator.clipboard?.writeText) return false; await navigator.clipboard.writeText(text); setCopied(text); return true; } catch { return false; } }, []);
 return [copied, copy];
}
