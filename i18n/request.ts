import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Always use English locale
  const locale = "en";

  try {
    const messages = (await import(`./messages/${locale.toLowerCase()}.json`))
      .default;
    return {
      locale: locale,
      messages: messages,
    };
  } catch (e) {
    return {
      locale: "en",
      messages: (await import(`./messages/en.json`)).default,
    };
  }
});
