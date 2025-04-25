import { Pathnames } from "next-intl/routing";

export const locales = ["en", "zh", "zh-TW", "ja", "ko", "de", "fr", "it", "es", "pt", "hi"];

export const localeNames: any = {
  en: "English",
  zh: "简体中文",
  "zh-TW": "繁體中文",
  ja: "日本語",
  ko: "한국어",
  de: "Deutsch",
  fr: "Français",
  it: "Italiano",
  es: "Español",
  pt: "Português",
  hi: "हिन्दी",
};

export const defaultLocale = "en";

export const localePrefix = "as-needed";

export const localeDetection =
  process.env.NEXT_PUBLIC_LOCALE_DETECTION === "true";

export const pathnames = {
  en: {
    "privacy-policy": "/privacy-policy",
    "terms-of-service": "/terms-of-service",
  },
} satisfies Pathnames<typeof locales>;
