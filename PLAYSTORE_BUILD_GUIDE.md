# 📱 MediOP – Google Play Store Build & Release Guide

This guide details the **3 straightforward methods** to generate your Google Play Store ready App Bundle (`.aab`) and Android `.apk`.

---

## 🏗️ Method 1: Android Studio (Recommended Native Method)

The native Android project has been initialized under `frontend/android/`.

### Steps:
1. Open **[Android Studio](https://developer.android.com/studio)**.
2. Click **Open** and select the folder:
   ```
   HOSPITAL OP/frontend/android
   ```
3. Wait for Gradle to index and sync dependencies.
4. To build the **Google Play Store App Bundle (`.aab`)**:
   - In Android Studio menu, go to: **Build ➔ Generate Signed Bundle / APK...**
   - Select **Android App Bundle** (`.aab`) ➔ Click **Next**.
   - Create or select your upload keystore file.
   - Select **Release** build variant ➔ Click **Finish**.
5. Your production bundle will be generated at:
   ```
   frontend/android/app/release/app-release.aab
   ```
6. Upload this `.aab` file directly to your **Google Play Console** account!

---

## ⚡ Method 2: PWABuilder (Instant 60-Second No-Code Method)

Because MediOP includes full PWA 2.0 Manifest and Service Worker support:

1. Host or deploy your MediOP frontend on any public domain (e.g. Vercel, Netlify, Render, Cloudflare).
2. Visit **[PWABuilder.com](https://www.pwabuilder.com)**.
3. Enter your website URL and click **Start**.
4. Click **"Package for Stores" ➔ "Android" ➔ "Generate Package"**.
5. Download the `.zip` containing your signed **Google Play Store `.aab` & `.apk`** files!

---

## ☁️ Method 3: Automated GitHub Actions CI/CD

An automated workflow has been created at [`.github/workflows/build-android-playstore.yml`](file:///.github/workflows/build-android-playstore.yml).

1. Push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "Add Android Play Store build"
   git push origin main
   ```
2. In your GitHub repository, navigate to the **Actions** tab.
3. Select **"Build Android Play Store App"** ➔ Click **Run workflow**.
4. When the build finishes, download the generated **`MediOP-PlayStore-AAB`** and **`MediOP-Debug-APK`** under the **Artifacts** section.

---

## 📋 Google Play Store Publishing Checklist

| Item | Details | Status |
| :--- | :--- | :--- |
| **Package ID** | `in.gov.mediop.app` | ✅ Configured |
| **App Name** | `MediOP` | ✅ Configured |
| **Display Mode** | Standalone Fullscreen | ✅ Configured |
| **Theme Color** | `#0ea5e9` | ✅ Configured |
| **App Icons** | 192x192 & 512x512 adaptive | ✅ Included |
| **Network Security** | HTTPS + Cleartext fallback | ✅ Configured |



