import { inject } from 'https://cdn.jsdelivr.net/npm/@vercel/analytics@2.0.1/+esm';
import { injectSpeedInsights } from 'https://cdn.jsdelivr.net/npm/@vercel/speed-insights@2.0.0/+esm';

const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);

if (!isLocal) {
  try {
    inject();
    injectSpeedInsights();
  } catch (err) {
    // Silently ignore analytics errors
  }
}
