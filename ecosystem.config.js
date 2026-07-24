const fs = require("fs");
const path = require("path");

const hasStandaloneServer = fs.existsSync(
  path.join(__dirname, ".next/standalone/server.js")
);

module.exports = {
  apps: [
    {
      name: "pulseping-web",
      script: hasStandaloneServer
        ? ".next/standalone/server.js"
        : "node_modules/next/dist/bin/next",
      args: hasStandaloneServer ? "" : "start",
      instances: 1,
      exec_mode: "fork",
      node_args: "--max-old-space-size=512",
      max_memory_restart: "400M",
      restart_delay: 5000,
      max_restarts: 10,
      min_uptime: 10000,
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3000,
      },
      error_file: "./logs/web-error.log",
      out_file: "./logs/web-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
    {
      name: "pulseping-worker",
      script: "npx",
      args: "tsx scripts/worker.ts",
      instances: 1,
      exec_mode: "fork",
      node_args: "--max-old-space-size=384",
      max_memory_restart: "300M",
      restart_delay: 5000,
      max_restarts: 10,
      min_uptime: 10000,
      env: {
        NODE_ENV: "production",
      },
      error_file: "./logs/worker-error.log",
      out_file: "./logs/worker-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
