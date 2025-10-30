package com.ailehekimligikura;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

import android.os.Bundle;
import androidx.core.view.WindowCompat;

/**
 * T.C. Aile Hekimliği Kura Sistemi
 * Ana Activity sınıfı
 */
public class MainActivity extends ReactActivity {

  /**
   * React Native'de kayıtlı ana component adını döndürür
   */
  @Override
  protected String getMainComponentName() {
    return "AileHekimligiKura";
  }

  /**
   * Activity oluşturulduğında çağrılır
   */
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // Splash screen'den ana aktiviteye geçiş
    setTheme(R.style.AppTheme);
    super.onCreate(null);

    // Edge-to-edge display için
    WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
  }

  /**
   * ReactActivityDelegate oluşturur
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // New Architecture etkinse
        DefaultNewArchitectureEntryPoint.getFabricEnabled()
    );
  }
}