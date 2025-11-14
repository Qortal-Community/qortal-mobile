# Development – Qortal Mobile (Qortal Go)

This guide explains how to set up a development environment, run the web experience, and produce Android builds for the Qortal Mobile (Qortal Go) app.

## Development requirements

- **Node.js & npm** – Install the current LTS release (Node 18+). The bundled npm CLI is used to install dependencies and run scripts defined in `package.json`.
- **Git & IDE** – Clone the repository and work in an editor such as VS Code, WebStorm, or IntelliJ with TypeScript support.
- **Android Studio & SDK** – Install Android Studio (Hedgehog+ recommended) with Android SDK Platform 34, emulator images, and the Android command-line tools.
- **Java Development Kit (JDK)** – Gradle 8.2.1 (see `android/build.gradle`) requires JDK 17. Set `JAVA_HOME` to this installation so Android Studio and the CLI use the same JDK.
- **Android device or emulator** – Enable USB debugging for physical devices or create an Android 12+ emulator through Android Studio’s Device Manager.

> Capacitor CLI (`@capacitor/cli`) and platform plugins are already declared in `package.json`, so `npx cap` commands work once dependencies are installed.

## Running Qortal Mobile while developing

### Web development server (Vite)

The React app is powered by Vite. This mode is useful for quickly iterating on UI and logic within a browser.

```bash
npm install
npm run dev
```

- Vite serves the app at `http://localhost:5173` by default (see the terminal output for the exact URL and LAN address).
- Hot Module Reloading (HMR) is enabled; edits under `src/` update automatically.
- Use this mode to validate UX changes before syncing assets into the Android shell.

### Android development build (Capacitor + Android Studio)

Use Capacitor to sync the web bundle into the native Android project and run it on a device or emulator.

```bash
npm install                  # required once per clone or when packages change
npm run build                # creates dist/ with production assets
npx cap sync android         # copies dist/ into android/app/src/main/assets/public
npx cap open android         # launches Android Studio using the synced project
```

- After Android Studio opens, select a device/emulator from the Run/Debug configuration and press **Run** to deploy the debug build.
- For quick CLI-based testing you can also execute `npx cap run android --target <deviceId>`, where `deviceId` comes from `adb devices`.
- Re-run `npm run build` followed by `npx cap copy android` whenever you change web assets and want the Android project to pick up the latest bundle.
- Debugging tips:
  - Use Chrome DevTools remote debugging (`chrome://inspect`) for the WebView.
  - Configure emulators with sufficient RAM/GPU acceleration for smoother Qortal rendering.

## Build Qortal Mobile from source

This process creates distributable Android artifacts using the Capacitor Android project.

### 1. Build the web bundle

```bash
npm install      # skip if already done
npm run build    # outputs production assets into dist/
```

The Vite build uses the rollup configuration in `vite.config.ts` and places JavaScript/CSS into `dist/`, which Capacitor consumes.

### 2. Sync assets into the Android project

```bash
npx cap sync android
```

- `sync` copies fresh assets and updates Capacitor-native dependencies under `android/`.
- If you only changed web code (no plugin changes), subsequent iterations can use `npx cap copy android` to avoid re-installing native modules.

### 3. Produce APK or AAB artifacts

Using Android Studio:

1. Run `npx cap open android`.
2. From Android Studio, choose **Build > Build Bundle(s) / APK(s)** and select either **APK** or **Android App Bundle**.
3. Configure your signing key under **Build > Generate Signed Bundle / APK** for release builds. Debug builds are signed automatically with the default debug keystore.

Using Gradle CLI (headless builds):

```bash
cd android
./gradlew assembleDebug      # creates app/build/outputs/apk/debug/app-debug.apk
./gradlew assembleRelease    # creates app/build/outputs/apk/release/app-release-unsigned.apk
```

- For release builds, configure `storeFile`, `storePassword`, `keyAlias`, and `keyPassword` in a `gradle.properties` file referenced by `android/app/build.gradle`, then re-run `assembleRelease` to produce a signed artifact.
- API/SDK levels come from `android/variables.gradle` (currently minSdk 22, target/compile 34); ensure your Android SDK Manager has these platforms installed before building.

## Contribution and support

- Discuss features and issues with the community via the chat on [https://qortal.dev](https://qortal.dev).
- Report bugs or propose enhancements with GitHub Issues/PRs in this repository. Include reproduction steps, platform details, and any logs captured from Vite or Android Studio.
- When submitting code changes, follow standard pull-request practices: create a feature branch, ensure `npm run build` succeeds, and, for Android updates, confirm you have rerun `npx cap sync android` so reviewers can reproduce your build.

Happy building!
