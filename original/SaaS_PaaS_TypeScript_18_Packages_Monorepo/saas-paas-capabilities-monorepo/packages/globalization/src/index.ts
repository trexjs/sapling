export interface LocaleContext { locale: string; timeZone: string; region: string; direction: 'ltr'|'rtl' }
export type Catalog = Record<string, Record<string,string>>;
export function resolveLocale(input: {user?:Partial<LocaleContext>; tenant?:Partial<LocaleContext>; defaults:LocaleContext}, supported:readonly string[]): LocaleContext {
  const d=input.defaults; const locale=[input.user?.locale,input.tenant?.locale,d.locale].find(x=>x && supported.includes(x)) ?? d.locale;
  const timeZone=[input.user?.timeZone,input.tenant?.timeZone,d.timeZone].find(x=>{if(!x)return false;try{new Intl.DateTimeFormat('en',{timeZone:x});return true}catch{return false}}) ?? 'UTC';
  const lang=locale.split('-')[0]; return {locale,timeZone,region:input.user?.region??input.tenant?.region??d.region,direction:['ar','he','fa','ur'].includes(lang)?'rtl':'ltr'};
}
export class Globalization {
  constructor(private readonly catalogs:Catalog, readonly fallbackLocale='en') {}
  message(key:string,context:LocaleContext,params:Record<string,string|number>={}) { const template=this.catalogs[context.locale]?.[key]??this.catalogs[this.fallbackLocale]?.[key]; if(template===undefined)throw new Error('Translation missing: '+key);return template.replace(/\{([A-Za-z0-9_]+)\}/g,(_,k:string)=>String(params[k]??'{'+k+'}')); }
  date(value:Date,context:LocaleContext){return new Intl.DateTimeFormat(context.locale,{timeZone:context.timeZone,dateStyle:'medium',timeStyle:'short'}).format(value)}
  number(value:number,context:LocaleContext){return new Intl.NumberFormat(context.locale).format(value)}
  money(value:number,currency:string,context:LocaleContext){return new Intl.NumberFormat(context.locale,{style:'currency',currency}).format(value)}
  compare(a:string,b:string,context:LocaleContext){return new Intl.Collator(context.locale,{sensitivity:'base'}).compare(a,b)}
}
