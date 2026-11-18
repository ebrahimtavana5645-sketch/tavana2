# آموزش کامل ساخت EXE (ویندوز) و APK (اندروید) — اوقات شرعی v4.12.6

برنامه یک وب‌اپ (HTML) است. برای APK از **Capacitor** و برای EXE از **Electron** استفاده می‌شود.
همه‌چیز آماده است؛ فقط باید ساخته شود. سه روش دارید:

| روش | سختی | نیاز | خروجی |
|---|---|---|---|
| ۱) GitHub Actions | آسان‌ترین | فقط حساب GitHub و اینترنت | هر دو: APK و EXE |
| ۲) ویندوز خودتان – EXE | متوسط | Node.js | Setup و Portable |
| ۳) ویندوز خودتان – APK | سخت‌تر | Node.js + JDK 17 + Android Studio | app-debug.apk |

---

## روش ۱ — ساخت خودکار روی GitHub (پیشنهادی)

۱. در github.com حساب رایگان بسازید → New repository → نام: `tavana` (Public یا Private).
۲. **تمام محتوای پوشه‌ی برنامه** را آپلود کنید (Add file → Upload files)، شامل:
   `index.html`، `sw.js`، `manifest.webmanifest`، پوشه‌های `icons`، `cities`، `logo`، `build-kits` و پوشه‌ی **`.github`**.
   - پوشه‌ی `.github` مخفی است؛ در ویندوز Explorer → View → Hidden items را روشن کنید.
   - اگر آپلود وب پوشه‌ی مخفی را نپذیرفت، از Git استفاده کنید:
     ```
     git init
     git add .
     git commit -m "first"
     git branch -M main
     git remote add origin https://github.com/USERNAME/tavana.git
     git push -u origin main
     ```
۳. تب **Actions** → «build-apk-exe» → **Run workflow**.
۴. بعد از ۱۰ تا ۱۵ دقیقه وارد اجرای تمام‌شده شوید. پایین صفحه، بخش **Artifacts**:
   - `owqat-apk` ← فایل `app-debug.apk`
   - `owqat-exe` ← `Owqat-Setup-4.12.6.exe` و `Owqat-Portable-4.12.6.exe`
   دانلود کنید و از حالت زیپ دربیاورید.

---

## روش ۲ — ساخت EXE روی ویندوز

۱. Node.js (نسخه LTS، ۱۸ یا بالاتر) را از nodejs.org نصب کنید. بعد از نصب، در CMD بزنید: `node -v`
۲. روی `build-kits\ساخت-EXE-ویندوز.bat` دوبار کلیک کنید.
   (یا دستی در پوشه‌ی `build-kits\windows`: `npm install` و سپس `npm run dist`)
۳. خروجی در `build-kits\windows\dist`:
   - `Owqat-Setup-4.12.6.exe` : نصب‌کننده
   - `Owqat-Portable-4.12.6.exe` : بدون نصب، مستقیم اجرا می‌شود

آزمایش سریع بدون ساخت: در `build-kits\windows` دستور `npm install` و بعد `npm start`.

**مشکلات رایج:**
- خطای «Cannot create symbolic link» هنگام دانلود winCodeSign: فایل .bat را «Run as administrator» بزنید، یا Developer Mode ویندوز را روشن کنید (Settings → For developers).
- دانلود electron کند یا قطع شد: دوباره اجرا کنید؛ در صورت تحریم/قطعی، از روش ۱ (GitHub) استفاده کنید.
- هشدار SmartScreen هنگام اجرا: چون فایل امضا نشده است. More info → Run anyway.

---

## روش ۳ — ساخت APK روی ویندوز

پیش‌نیازها:
۱. Node.js 18+
۲. JDK 17 (مثلاً Temurin 17 از adoptium.net) و تنظیم `JAVA_HOME`
۳. Android Studio (یک‌بار باز کنید تا Android SDK نصب شود). سپس متغیر محیطی `ANDROID_HOME` را به
   `C:\Users\NAME\AppData\Local\Android\Sdk` بدهید.

ساخت:
۱. روی `build-kits\ساخت-APK-اندروید.bat` دوبار کلیک کنید.
۲. خروجی:
   `build-kits\android\android\app\build\outputs\apk\debug\app-debug.apk`

دستی (همان مراحل .bat) در پوشه‌ی `build-kits\android`:
```
npm install
npm run prepare-web
npx cap add android
node apply-icons.js
npx cap sync android
cd android
gradlew.bat assembleDebug
```
یا بعد از `npx cap open android` در Android Studio: Build → Build APK(s).

**مشکلات رایج:**
- `SDK location not found`: فایل `build-kits\android\android\local.properties` بسازید:
  `sdk.dir=C\:\\Users\\NAME\\AppData\\Local\\Android\\Sdk`
- خطای نسخه Java: Gradle به JDK 17 نیاز دارد (نه 8 و نه 21 قدیمی).
- بعد از هر تغییر در index.html: `npm run sync` را اجرا و دوباره APK بسازید.

### نصب APK روی گوشی
فایل را به گوشی بفرستید → باز کنید → «نصب از منابع ناشناس» را برای همان برنامه (مرورگر/مدیر فایل) مجاز کنید.

---

## انتشار در فروشگاه (APK امضاشده)

APK بالا «debug» است و برای استفاده شخصی کافی است. برای Google Play، کافه‌بازار و مایکت:
۱. `npx cap open android` → Build → **Generate Signed Bundle / APK**.
۲. Keystore جدید بسازید و **حتماً از آن و رمزش نسخه پشتیبان نگه دارید** (برای آپدیت‌های بعدی لازم است).
۳. برای Google Play فرمت AAB و برای بازار/مایکت فرمت APK را انتخاب کنید.

---

## تغییر نام، شناسه و نسخه
- شناسه برنامه (`ir.owqat.prayertimes`) در `android/capacitor.config.json` و `windows/package.json`
- شماره نسخه در هر دو `package.json` (`version`)
- آیکن‌ها از پوشه‌ی `icons` گرفته می‌شود؛ با جایگزینی همان فایل‌ها آیکن عوض می‌شود.

## نکته آفلاین بودن
خروجی عکس/PDF/اکسل از کتابخانه‌های CDN (html2canvas، jsPDF، SheetJS، pdf.js) و فونت‌ها از Google Fonts می‌آیند.
بدون اینترنت در EXE و APK کار نمی‌کنند (بقیه برنامه کار می‌کند). برای آفلاین کامل، این فایل‌ها را دانلود کنید،
کنار index.html بگذارید و آدرس‌های داخل index.html (و sw.js) را به مسیر محلی تغییر دهید.

## اصلاحاتی که در این بسته انجام شد
۱. `prepare-web.js` و `prepare-app.js` اصلی با خطای `ERR_FS_CP_EINVAL` متوقف می‌شدند (کپی پوشه به زیرپوشه‌ی خودش)؛ با `build-kits/copy-app.js` جایگزین شد. **بدون این اصلاح هیچ‌کدام از روش‌ها کار نمی‌کرد.**
۲. نام فایل‌های خروجی EXE انگلیسی (ASCII) شد تا مشکل نام فارسی در نصب‌کننده پیش نیاید؛ نام میانبر فارسی ماند.

۳. خطای `Duplicate resources` در ساخت APK (آیکن‌ها داخل `mipmap-anydpi-v26` هم کپی می‌شدند) با اصلاح `build-kits/android/apply-icons.js` رفع شد.

## iOS (آیفون)
ساخت فایل نصبی iOS فقط با Mac + Xcode + حساب Apple Developer (سالانه ۹۹ دلار) ممکن است. راه رایگان: در Safari برنامه را باز کنید ← Share ← Add to Home Screen (کار آفلاین هم می‌کند).

> توجه: این بسته در محیط من با Node تست شد (مرحله‌ی آماده‌سازی فایل‌ها)، اما ساخت نهایی APK/EXE به اینترنت،
> Android SDK و Electron نیاز دارد که در آن محیط نبود. پس ساخت نهایی روی GitHub یا کامپیوتر شما انجام می‌شود.
