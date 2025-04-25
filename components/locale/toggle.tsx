"use client";

import { MdLanguage } from "react-icons/md";
import { localeNames } from "@/i18n/locale";

export default function ({ isIcon = false }: { isIcon?: boolean }) {
  return (
    <div className="flex items-center gap-x-2 text-muted-foreground">
      <MdLanguage className="text-xl" />
      {!isIcon && (
        <span className="hidden md:block">{localeNames["en"]}</span>
      )}
    </div>
  );
}
