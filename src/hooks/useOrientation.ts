import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useDeviceLayout - Ultra-robust device layout detection that no device can escape.
 * Returns: { isMobile, isHorizontal, isPortrait, orientation, deviceType, screenSize }
 */
export function useDeviceLayout() {
  const frameRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);

  const getLayout = useCallback(() => {
    // Server-side rendering fallback
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return {
        isMobile: false,
        isHorizontal: false,
        isPortrait: true,
        orientation: 'portrait' as const,
        deviceType: 'desktop' as const,
        screenSize: 'large' as const
      };
    }

    // Get dimensions from multiple sources for maximum reliability
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const screenWidth = window.screen?.width || windowWidth;
    const screenHeight = window.screen?.height || windowHeight;
    const clientWidth = document.documentElement?.clientWidth || windowWidth;
    const clientHeight = document.documentElement?.clientHeight || windowHeight;
    const bodyWidth = document.body?.clientWidth || windowWidth;
    const bodyHeight = document.body?.clientHeight || windowHeight;

    // Use the most reliable dimensions
    const width = Math.max(windowWidth, clientWidth, bodyWidth);
    const height = Math.max(windowHeight, clientHeight, bodyHeight);
    const actualScreenWidth = Math.max(screenWidth, screenHeight);
    const actualScreenHeight = Math.min(screenWidth, screenHeight);

    // Multi-layer orientation detection
    let orientation: 'portrait' | 'landscape' = 'portrait';
    
    // Method 1: Screen orientation API (most modern)
    if (window.screen?.orientation?.type) {
      orientation = window.screen.orientation.type.includes('landscape') ? 'landscape' : 'portrait';
    }
    // Method 2: Deprecated orientation property
    else if (typeof window.orientation !== 'undefined') {
      orientation = Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait';
    }
    // Method 3: matchMedia queries
    else if (window.matchMedia) {
      if (window.matchMedia('(orientation: landscape)').matches) {
        orientation = 'landscape';
      } else if (window.matchMedia('(orientation: portrait)').matches) {
        orientation = 'portrait';
      }
    }
    // Method 4: Dimension comparison (fallback)
    else {
      orientation = width > height ? 'landscape' : 'portrait';
    }

    // Comprehensive mobile detection
    const userAgent = (window.navigator?.userAgent || '').toLowerCase();
    const platform = (window.navigator?.platform || '').toLowerCase();
    const vendor = (window.navigator?.vendor || '').toLowerCase();
    const appVersion = (window.navigator?.appVersion || '').toLowerCase();

    // Enhanced user agent patterns
    const mobilePatterns = [
      /android/i, /webos/i, /iphone/i, /ipad/i, /ipod/i, /blackberry/i, /iemobile/i,
      /opera mini/i, /mobile/i, /tablet/i, /kindle/i, /silk/i, /playbook/i,
      /bb10/i, /bb\d+/i, /rim tablet/i, /phone/i, /touch/i, /fennec/i,
      /mobile.*firefox/i, /android.*mobile/i, /windows phone/i, /wp7/i, /wp8/i,
      /lumia/i, /nokia/i, /samsung/i, /htc/i, /lg/i, /motorola/i, /sony/i
    ];

    // Platform-based detection
    const mobilePlatforms = [
      /android/i, /iphone/i, /ipad/i, /ipod/i, /blackberry/i, /webos/i,
      /windows phone/i, /wp7/i, /wp8/i, /iemobile/i
    ];

    // Vendor-based detection
    const mobileVendors = [
      /apple/i, /google/i, /samsung/i, /htc/i, /lg/i, /motorola/i, /nokia/i, /sony/i
    ];

    const isMobileUA = mobilePatterns.some(pattern => pattern.test(userAgent)) ||
                      mobilePlatforms.some(pattern => pattern.test(platform)) ||
                      mobileVendors.some(pattern => pattern.test(vendor)) ||
                      mobilePatterns.some(pattern => pattern.test(appVersion));

    // Touch capability detection
    const hasTouchScreen = (
      'ontouchstart' in window ||
      (window.navigator?.maxTouchPoints ?? 0) > 0 ||
      ((window.navigator as any)?.msMaxTouchPoints ?? 0) > 0 ||
      window.TouchEvent !== undefined ||
      ((window as any).DocumentTouch !== undefined && document instanceof (window as any).DocumentTouch)
    );

    // Hardware-based detection
    const hasLimitedRAM = (window.navigator as any)?.deviceMemory && (window.navigator as any).deviceMemory <= 4;
    const hasSlowConnection = (window.navigator as any)?.connection?.effectiveType === 'slow-2g' ||
                              (window.navigator as any)?.connection?.effectiveType === '2g' ||
                              (window.navigator as any)?.connection?.effectiveType === '3g';

    // Screen size categories with device pixel ratio consideration
    const devicePixelRatio = window.devicePixelRatio || 1;
    const physicalWidth = width * devicePixelRatio;
    const physicalHeight = height * devicePixelRatio;

    // Multiple mobile detection criteria
    const isMobileBySize = width <= 768 || actualScreenWidth <= 768;
    const isMobileByRatio = devicePixelRatio >= 2 && width <= 1024;
    const isMobileByScreen = actualScreenWidth <= 1024 && actualScreenHeight <= 768;
    const isMobileByPointer = window.matchMedia?.('(pointer: coarse)')?.matches;
    const isMobileByHover = !window.matchMedia?.('(hover: hover)')?.matches;

    // Final mobile determination (multiple criteria)
    const isMobile = isMobileUA || 
                     isMobileBySize || 
                     isMobileByRatio || 
                     isMobileByScreen ||
                     (hasTouchScreen && (isMobileByPointer || isMobileByHover)) ||
                     hasLimitedRAM ||
                     hasSlowConnection;

    // Device type classification
    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
    if (isMobile) {
      if (width >= 768 && width <= 1024) {
        deviceType = 'tablet';
      } else {
        deviceType = 'mobile';
      }
    }

    // Screen size classification
    let screenSize: 'small' | 'medium' | 'large' | 'xlarge' = 'large';
    if (width < 576) screenSize = 'small';
    else if (width < 768) screenSize = 'medium';
    else if (width < 1200) screenSize = 'large';
    else screenSize = 'xlarge';

    return {
      isMobile,
      isHorizontal: orientation === 'landscape',
      isPortrait: orientation === 'portrait',
      orientation,
      deviceType,
      screenSize,
      // Additional debugging info
      ...(process.env.NODE_ENV === 'development' && {
        debug: {
          width,
          height,
          screenWidth: actualScreenWidth,
          screenHeight: actualScreenHeight,
          devicePixelRatio,
          userAgent: userAgent.slice(0, 50) + '...',
          hasTouchScreen,
          detectionMethod: {
            byUA: isMobileUA,
            bySize: isMobileBySize,
            byRatio: isMobileByRatio,
            byScreen: isMobileByScreen,
            byPointer: isMobileByPointer,
            byHover: isMobileByHover
          }
        }
      })
    };
  }, []);

  const [layout, setLayout] = useState(getLayout);

  // Throttled update function to prevent excessive re-renders
  const throttledUpdate = useCallback(() => {
    const now = Date.now();
    if (now - lastUpdateRef.current < 16) { // ~60fps throttling
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = requestAnimationFrame(() => {
        setLayout(getLayout());
        lastUpdateRef.current = Date.now();
      });
    } else {
      setLayout(getLayout());
      lastUpdateRef.current = now;
    }
  }, [getLayout]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleLayoutChange = () => {
      // Clear any existing timeout
      if (timeoutId) clearTimeout(timeoutId);
      
      // Immediate update for faster response
      throttledUpdate();
      
      // Delayed update to catch slow orientation changes
      timeoutId = setTimeout(() => {
        setLayout(getLayout());
      }, 200);
    };

    // Event listeners for all possible layout change triggers
    const events = [
      'resize',
      'orientationchange',
      'load',
      'DOMContentLoaded',
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange'
    ];

    // Add all event listeners
    events.forEach(event => {
      window.addEventListener(event, handleLayoutChange, { passive: true });
    });

    // Modern orientation change detection
    if (window.screen?.orientation?.addEventListener) {
      window.screen.orientation.addEventListener('change', handleLayoutChange);
    }

    // Media query listeners for additional coverage
    const mediaQueries = [
      window.matchMedia?.('(orientation: portrait)'),
      window.matchMedia?.('(orientation: landscape)'),
      window.matchMedia?.('(max-width: 768px)'),
      window.matchMedia?.('(max-width: 1024px)'),
      window.matchMedia?.('(hover: hover)'),
      window.matchMedia?.('(pointer: coarse)')
    ].filter(Boolean);

    mediaQueries.forEach(mq => {
      if (mq && mq.addEventListener) {
        mq.addEventListener('change', handleLayoutChange);
      } else if (mq && mq.addListener) {
        // Fallback for older browsers
        mq.addListener(handleLayoutChange);
      }
    });

    // Visual viewport API for mobile browsers
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleLayoutChange);
      window.visualViewport.addEventListener('scroll', handleLayoutChange);
    }

    // Intersection observer for additional layout detection
    let observer: IntersectionObserver | null = null;
    if (window.IntersectionObserver && document.body) {
      observer = new IntersectionObserver(handleLayoutChange, { threshold: 0.1 });
      observer.observe(document.body);
    }

    // Initial layout detection after a brief delay
    const initialTimeout = setTimeout(() => {
      setLayout(getLayout());
    }, 100);

    // Cleanup function
    return () => {
      // Clear timeouts and animation frames
      if (timeoutId) clearTimeout(timeoutId);
      if (initialTimeout) clearTimeout(initialTimeout);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);

      // Remove all event listeners
      events.forEach(event => {
        window.removeEventListener(event, handleLayoutChange);
      });

      // Remove orientation listener
      if (window.screen?.orientation?.removeEventListener) {
        window.screen.orientation.removeEventListener('change', handleLayoutChange);
      }

      // Remove media query listeners
      mediaQueries.forEach(mq => {
        if (mq && mq.removeEventListener) {
          mq.removeEventListener('change', handleLayoutChange);
        } else if (mq && mq.removeListener) {
          mq.removeListener(handleLayoutChange);
        }
      });

      // Remove visual viewport listeners
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleLayoutChange);
        window.visualViewport.removeEventListener('scroll', handleLayoutChange);
      }

      // Disconnect intersection observer
      if (observer) {
        observer.disconnect();
      }
    };
  }, [throttledUpdate, getLayout]);

  return layout;
}