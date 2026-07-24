require('dotenv').config();

module.exports = {
  apps: [
    {
      name: 'pulseping',
      script: './.next/standalone/server.js',
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      node_args: '--max-old-space-size=512',
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3000,
        ...process.env,
      },
      error_file: './logs/web-error.log',
      out_file: './logs/web-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
    {
      name: 'pulseping-worker',
      script: 'npx',
      args: 'tsx scripts/worker.ts',
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      node_args: '--max-old-space-size=384',
      max_memory_restart: '300M',
      restart_delay: 5000,
      max_restarts: 10,
      env: {
        NODE_ENV: 'production',
        ...process.env,
      },
      error_file: './logs/worker-error.log',
      out_file: './logs/worker-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
