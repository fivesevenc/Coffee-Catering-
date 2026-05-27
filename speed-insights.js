// Vercel Speed Insights initialization
// This script loads and initializes Speed Insights for the website

(function() {
  // Initialize the Speed Insights queue
  window.si = window.si || function() { 
    (window.siq = window.siq || []).push(arguments); 
  };

  // Load the Speed Insights script
  const script = document.createElement('script');
  script.defer = true;
  
  // Check if we're in development mode
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '';
  
  // Use debug script in development, production script otherwise
  if (isDevelopment) {
    script.src = 'https://va.vercel-scripts.com/v1/speed-insights/script.debug.js';
  } else {
    script.src = 'https://va.vercel-scripts.com/v1/speed-insights/script.js';
  }
  
  // Add error handling
  script.onerror = function() {
    console.warn('Failed to load Vercel Speed Insights');
  };
  
  // Insert the script
  document.head.appendChild(script);
})();
