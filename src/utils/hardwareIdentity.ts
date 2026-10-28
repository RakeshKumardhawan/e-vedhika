export interface DeviceHardwareIdentity {
  hardwareUuid: string;
  osName: string;
  browser: string;
  screenResolution: string;
}

export function getDeviceHardwareIdentity(): DeviceHardwareIdentity {
  let storedUuid = '';
  try {
    storedUuid = localStorage.getItem('evedhika_device_uuid') || '';
    if (!storedUuid) {
      storedUuid = 'EVD-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
      localStorage.setItem('evedhika_device_uuid', storedUuid);
    }
  } catch {
    storedUuid = 'EVD-TEMP-DEV';
  }

  return {
    hardwareUuid: storedUuid,
    osName: typeof navigator !== 'undefined' ? (navigator as any).userAgentData?.platform || navigator.platform || 'Windows' : 'Windows',
    browser: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
    screenResolution: typeof window !== 'undefined' ? `${window.screen?.width || 1920}x${window.screen?.height || 1080}` : '1920x1080',
  };
}
