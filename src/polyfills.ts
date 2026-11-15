if (typeof window !== 'undefined' && typeof (window as any).process === 'undefined') {
  (window as any).process = {
    env: {},
    browser: true,
    version: '',
    platform: 'browser',
    nextTick: (fn: (...args: any[]) => void, ...args: any[]) => {
      Promise.resolve().then(() => fn(...args));
    },
  };
}
