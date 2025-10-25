// Standalone Mode Detection and Enforcement

export const isStandaloneMode = () => {
  // Check multiple indicators for standalone mode
  const isStandaloneDisplay = window.matchMedia('(display-mode: standalone)').matches;
  const isNavigatorStandalone = window.navigator.standalone === true;
  const isAndroidApp = document.referrer.includes('android-app://');
  const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches;
  const hasStandaloneParam = window.location.search.includes('source=homescreen');

  return isStandaloneDisplay || isNavigatorStandalone || isAndroidApp || isMinimalUI || hasStandaloneParam;
};

export const detectBrowserMode = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isChrome = userAgent.includes('chrome') && !userAgent.includes('edg');
  const isSamsung = userAgent.includes('samsungbrowser');
  const isFirefox = userAgent.includes('firefox');
  const isEdge = userAgent.includes('edg');

  return {
    isChrome,
    isSamsung,
    isFirefox,
    isEdge,
    isStandalone: isStandaloneMode(),
    userAgent
  };
};

export const forceStandaloneMode = () => {
  // Add standalone class to body for CSS targeting
  if (isStandaloneMode()) {
    document.body.classList.add('standalone-mode');
    document.body.classList.remove('browser-mode');
  } else {
    document.body.classList.add('browser-mode');
    document.body.classList.remove('standalone-mode');
  }
};

export const showInstallPrompt = () => {
  // Show a custom install prompt if not in standalone mode
  if (!isStandaloneMode()) {
    const browserInfo = detectBrowserMode();
    let message = 'Bu uygulamayı ana ekranınıza ekleyerek daha iyi deneyim yaşayın.';

    if (browserInfo.isChrome) {
      message += ' Chrome menüsünden "Ana ekrana ekle" seçeneğini kullanın.';
    } else if (browserInfo.isSamsung) {
      message += ' Samsung Internet menüsünden "Ana ekrana ekle" seçeneğini kullanın.';
    }

    return message;
  }
  return null;
};

// Initialize standalone mode detection
export const initStandaloneMode = () => {
  forceStandaloneMode();

  // Log detection info for debugging
  const browserInfo = detectBrowserMode();
  console.log('Standalone Mode Detection:', {
    isStandalone: browserInfo.isStandalone,
    browser: browserInfo,
    displayMode: window.matchMedia('(display-mode: standalone)').matches ? 'standalone' :
                 window.matchMedia('(display-mode: fullscreen)').matches ? 'fullscreen' :
                 window.matchMedia('(display-mode: minimal-ui)').matches ? 'minimal-ui' : 'browser'
  });

  return browserInfo;
};