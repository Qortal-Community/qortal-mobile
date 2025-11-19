package com.github.Qortal.qortalMobile;

import android.app.Application;

public class QortalApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        ThemePreferenceManager.applyPreferredTheme(this);
    }
}
