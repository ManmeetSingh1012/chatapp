module.exports = {
  apps: [
    {
      name: 'react-app-chat',
      script: 'npm',
      args: 'run dev',
      env: {
        PORT: 4000,  // This will set the PORT environment variable, though Vite will use the one in vite.config.js
      },
      watch: false, // Typically, watch mode is handled by Vite itself
    },
  ],
};
