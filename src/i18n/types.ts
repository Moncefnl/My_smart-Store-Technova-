export type SupportedLanguage = 'ar' | 'en';
export type TextDirection = 'rtl' | 'ltr';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  dir: TextDirection;
}

export type TranslationDict = Record<string, string>;
export type TranslationStore = Record<SupportedLanguage, TranslationDict>;
