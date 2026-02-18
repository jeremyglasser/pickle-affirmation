/**
 * Utility for safe logging that is completely stripped from production builds.
 * Vite handles 'import.meta.env.DEV' at compile-time, ensuring dead code elimination.
 */

const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (isDev) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    if (isDev) {
      console.error(...args);
    }
    // Note: If you ever add a production error tracking service (like Sentry),
    // you would call it here, outside of the isDev block.
  }
};
