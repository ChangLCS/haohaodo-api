module.exports = {
  apps: [
    {
      name: 'screen',
      script: 'main.js',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args: 'one two',
      autorestart: true,
      watch: true,
      ignore_watch: ['json', 'node_modules', 'logs'],
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
