/// <reference path="./types.d.ts" />

declare module 'dayjs/locale/*' {
  namespace locale {
    type Locale = ILocale
  }

  const locale: locale.Locale

  export = locale
}
