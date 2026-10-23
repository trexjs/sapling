/**
 * Lightweight i18n/l10n runtime for UI and product requirements.
 * Supports locale fallback, interpolation, plural selection, Intl formatting and lazy locale loading.
 */
export type TranslationTree = { [key: string]: string | number | TranslationTree };
export type Messages = Record<string, TranslationTree>;
export type InterpolationValues = Record<string, string | number | Date>;
export interface I18nOptions {
  locale: string;
  fallbackLocale?: string;
  messages?: Messages;
  missingKey?: (key: string, locale: string) => string;
}
export interface NumberFormatOptions extends Intl.NumberFormatOptions {}
export interface DateFormatOptions extends Intl.DateTimeFormatOptions {}
export interface PluralOptions { count: number; values?: InterpolationValues; }
const getNested = (tree: TranslationTree | undefined, key: string): string | number | TranslationTree | undefined =>
  key.split(".").reduce<any>((node, part) => node && typeof node === "object" ? node[part] : undefined, tree);
const interpolate = (template: string, values: InterpolationValues = {}): string =>
  template.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (_, key: string) => {
    const value = values[key];
    return value instanceof Date ? value.toISOString() : value === undefined ? `{{${key}}}` : String(value);
  });
export class I18n {
  private locale: string;
  private readonly fallbackLocale: string;
  private readonly messages: Messages;
  private readonly missingKey: (key: string, locale: string) => string;
  private listeners = new Set<(locale: string) => void>();
  constructor(options: I18nOptions) {
    this.locale = options.locale;
    this.fallbackLocale = options.fallbackLocale ?? options.locale;
    this.messages = { ...(options.messages ?? {}) };
    this.missingKey = options.missingKey ?? (key => key);
  }
  getLocale(): string { return this.locale; }
  getFallbackLocale(): string { return this.fallbackLocale; }
  setLocale(locale: string): void {
    if (locale === this.locale) return;
    this.locale = locale;
    for (const listener of [...this.listeners]) listener(locale);
  }
  subscribe(listener: (locale: string) => void): () => void {
    this.listeners.add(listener); return () => this.listeners.delete(listener);
  }
  addMessages(locale: string, messages: TranslationTree, options: { merge?: boolean } = {}): void {
    this.messages[locale] = options.merge ? deepMerge(this.messages[locale] ?? {}, messages) : messages;
  }
  async loadLocale(locale: string, loader: () => Promise<TranslationTree>): Promise<void> {
    this.addMessages(locale, await loader());
  }
  has(key: string, locale = this.locale): boolean {
    return getNested(this.messages[locale], key) !== undefined || getNested(this.messages[this.fallbackLocale], key) !== undefined;
  }
  t(key: string, values: InterpolationValues = {}): string {
    const value = getNested(this.messages[this.locale], key) ?? getNested(this.messages[this.fallbackLocale], key);
    if (typeof value !== "string" && typeof value !== "number") return this.missingKey(key, this.locale);
    return interpolate(String(value), values);
  }
  plural(key: string, options: PluralOptions): string {
    const node = getNested(this.messages[this.locale], key) ?? getNested(this.messages[this.fallbackLocale], key);
    if (typeof node === "string") return interpolate(node, { ...options.values, count: options.count });
    if (!node || typeof node !== "object") return this.missingKey(key, this.locale);
    const category = new Intl.PluralRules(this.locale).select(options.count);
    const template = node[String(options.count)] ?? node[category] ?? node.other;
    return typeof template === "string" ? interpolate(template, { ...options.values, count: options.count }) : this.missingKey(key, this.locale);
  }
  number(value: number, options: NumberFormatOptions = {}): string {
    return new Intl.NumberFormat(this.locale, options).format(value);
  }
  currency(value: number, currency: string, options: Omit<NumberFormatOptions, "style" | "currency"> = {}): string {
    return new Intl.NumberFormat(this.locale, { ...options, style: "currency", currency }).format(value);
  }
  date(value: Date | number | string, options: DateFormatOptions = { dateStyle: "medium" }): string {
    return new Intl.DateTimeFormat(this.locale, options).format(value instanceof Date ? value : new Date(value));
  }
  relativeTime(value: number, unit: Intl.RelativeTimeFormatUnit, options: Intl.RelativeTimeFormatOptions = { numeric: "auto" }): string {
    return new Intl.RelativeTimeFormat(this.locale, options).format(value, unit);
  }
  list(values: readonly string[], options: Intl.ListFormatOptions = { style: "long", type: "conjunction" }): string {
    return new Intl.ListFormat(this.locale, options).format(values);
  }
  displayName(value: string, type: "language" | "region" | "currency" = "language"): string {
    return new Intl.DisplayNames([this.locale], { type }).of(value) ?? value;
  }
}
function deepMerge(left: TranslationTree, right: TranslationTree): TranslationTree {
  const result: TranslationTree = { ...left };
  for (const [key, value] of Object.entries(right)) {
    const existing = result[key];
    result[key] = existing && typeof existing === "object" && typeof value === "object"
      ? deepMerge(existing, value as TranslationTree) : value;
  }
  return result;
}
export const createI18n = (options: I18nOptions): I18n => new I18n(options);
export const getBrowserLocale = (): string => typeof navigator !== "undefined" ? navigator.language : "en";
export const negotiateLocale = (requested: readonly string[], supported: readonly string[], fallback: string): string => {
  for (const candidate of requested) {
    const exact = supported.find(locale => locale.toLowerCase() === candidate.toLowerCase());
    if (exact) return exact;
    const language = candidate.split("-")[0]!.toLowerCase();
    const match = supported.find(locale => locale.split("-")[0]!.toLowerCase() === language);
    if (match) return match;
  }
  return fallback;
};
export const formatNumber = (value: number, locale = "en", options?: Intl.NumberFormatOptions): string => new Intl.NumberFormat(locale, options).format(value);
export const formatCurrency = (value: number, currency: string, locale = "en", options?: Intl.NumberFormatOptions): string =>
  new Intl.NumberFormat(locale, { ...options, style: "currency", currency }).format(value);
export const formatDate = (value: Date | number | string, locale = "en", options?: Intl.DateTimeFormatOptions): string =>
  new Intl.DateTimeFormat(locale, options).format(value instanceof Date ? value : new Date(value));
