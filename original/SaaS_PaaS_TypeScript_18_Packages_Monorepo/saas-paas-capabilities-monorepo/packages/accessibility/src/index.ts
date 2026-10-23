export type Severity='critical'|'major'|'minor';
export interface ComponentAccessibilityContract {name:string; accessibleName:boolean; keyboardActions:readonly string[]; focusStrategy:string; knownLimitations:readonly string[]}
export interface AccessibilityPreferences {reducedMotion:boolean; highContrast:boolean; fontScale:number}
export const defaultPreferences:AccessibilityPreferences={reducedMotion:false,highContrast:false,fontScale:1};
export function validatePreferences(p:AccessibilityPreferences){if(!Number.isFinite(p.fontScale)||p.fontScale<0.75||p.fontScale>3)throw new Error('fontScale must be 0.75..3');return Object.freeze({...p})}
export function requiredAriaAttributes(contract:ComponentAccessibilityContract){if(!contract.name.trim()||!contract.accessibleName||!contract.focusStrategy.trim())throw new Error('Incomplete accessibility contract');return {'aria-label':contract.name} as const}
export function isReadableContrast(foreground:string,background:string,min=4.5):boolean {
 const rgb=(s:string)=>{if(!/^#[\da-f]{6}$/i.test(s))throw new Error('Expected #RRGGBB');return [1,3,5].map(i=>parseInt(s.slice(i,i+2),16)/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4)};
 const lum=(v:number[])=>v[0]*0.2126+v[1]*0.7152+v[2]*0.0722;const a=lum(rgb(foreground)),b=lum(rgb(background));return (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05)>=min;
}
export function formErrorSummary(errors:Record<string,string>){return Object.entries(errors).map(([field,message])=>({field,message,anchor:'#'+encodeURIComponent(field)}))}
