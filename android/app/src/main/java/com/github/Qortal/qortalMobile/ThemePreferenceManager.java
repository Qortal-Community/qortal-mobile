package com.github.Qortal.qortalMobile;

import android.app.UiModeManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.util.Base64;
import android.util.Log;

import androidx.appcompat.app.AppCompatDelegate;

import org.json.JSONException;
import org.json.JSONObject;

import java.nio.charset.StandardCharsets;
import java.util.Locale;

/**
 * Applies the preferred night mode before the WebView initialises so the splash
 * screen and first render honour the stored Qortal theme.
 */
public final class ThemePreferenceManager {

    private static final String TAG = "ThemePreferenceManager";
    private static final String CAPACITOR_STORAGE = "CapacitorStorage";
    private static final String[] THEME_KEYS = new String[]{
            "ui-theme-preference",
            "themePreference",
            "theme-preference",
            "app-theme",
            "appearance",
            "qortal-theme-mode"
    };

    private ThemePreferenceManager() {
    }

    public enum ThemeMode {
        LIGHT,
        DARK,
        SYSTEM
    }

    public static ThemeMode applyPreferredTheme(Context context) {
        ThemeMode mode = resolvePreferredMode(context);
        applyMode(context, mode);
        return mode;
    }

    private static ThemeMode resolvePreferredMode(Context context) {
        if (context == null) {
            return ThemeMode.SYSTEM;
        }
        SharedPreferences prefs = context.getSharedPreferences(CAPACITOR_STORAGE, Context.MODE_PRIVATE);
        for (String key : THEME_KEYS) {
            String storedValue = prefs.getString(key, null);
            ThemeMode mode = parseStoredValue(storedValue);
            if (mode != null) {
                return mode;
            }
        }
        return ThemeMode.SYSTEM;
    }

    private static ThemeMode parseStoredValue(String storedValue) {
        if (storedValue == null) {
            return null;
        }
        String decoded = decodeBase64(storedValue);
        if (decoded == null) {
            decoded = storedValue;
        }
        String candidate = extractThemeToken(decoded);
        if (candidate == null) {
            return null;
        }
        String normalized = candidate.trim().toLowerCase(Locale.US);
        if (normalized.contains("dark")) {
            return ThemeMode.DARK;
        }
        if (normalized.contains("light")) {
            return ThemeMode.LIGHT;
        }
        if (normalized.contains("system") || normalized.contains("auto")) {
            return ThemeMode.SYSTEM;
        }
        return null;
    }

    private static String decodeBase64(String raw) {
        try {
            byte[] data = Base64.decode(raw, Base64.DEFAULT);
            return new String(data, StandardCharsets.UTF_8);
        } catch (IllegalArgumentException ex) {
            Log.d(TAG, "Value is not base64 encoded, falling back to raw string");
            return null;
        }
    }

    private static String extractThemeToken(String raw) {
        if (raw == null) {
            return null;
        }
        String trimmed = raw.trim();
        if (trimmed.isEmpty()) {
            return null;
        }
        if (trimmed.startsWith("{")) {
            try {
                JSONObject json = new JSONObject(trimmed);
                if (json.has("mode")) {
                    return json.optString("mode", null);
                }
                if (json.has("theme")) {
                    return json.optString("theme", null);
                }
                if (json.has("value")) {
                    return json.optString("value", null);
                }
            } catch (JSONException ignored) {
            }
        }
        if (trimmed.startsWith("\"") && trimmed.endsWith("\"") && trimmed.length() >= 2) {
            return trimmed.substring(1, trimmed.length() - 1);
        }
        return trimmed;
    }

    private static void applyMode(Context context, ThemeMode mode) {
        int compatMode = AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM;
        if (mode == ThemeMode.DARK) {
            compatMode = AppCompatDelegate.MODE_NIGHT_YES;
        } else if (mode == ThemeMode.LIGHT) {
            compatMode = AppCompatDelegate.MODE_NIGHT_NO;
        }
        AppCompatDelegate.setDefaultNightMode(compatMode);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            UiModeManager uiModeManager = context.getSystemService(UiModeManager.class);
            if (uiModeManager != null) {
                int targetMode = UiModeManager.MODE_NIGHT_AUTO;
                if (mode == ThemeMode.DARK) {
                    targetMode = UiModeManager.MODE_NIGHT_YES;
                } else if (mode == ThemeMode.LIGHT) {
                    targetMode = UiModeManager.MODE_NIGHT_NO;
                }
                uiModeManager.setApplicationNightMode(targetMode);
            }
        }
    }
}
