import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/",
    "/(en|zh|zh-TW|ja|ko|de|fr|it|es|pt|hi)/:path*",
    "/((?!privacy-policy|terms-of-service|api/|_next|_vercel|.*\\..*).*)",
  ],
};
