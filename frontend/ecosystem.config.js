module.exports = {
  apps: [
    {
      name: 'hr-chatbot-frontend',
      script: 'serve',
      args: ['-s', 'build', '-l', '3006'],
      env: {
        NODE_ENV: 'production',
        PORT: 3006,
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      instances: 1,
      exec_mode: 'fork',
    },
    // Development mode (optional)
    // {
    //   name: 'hr-chatbot-frontend-dev',
    //   script: 'npm',
    //   args: ['start'],
    //   env: {
    //     NODE_ENV: 'development',
    //     PORT: 3006,
    //   },
    //   error_file: './logs/pm2-error-dev.log',
    //   out_file: './logs/pm2-out-dev.log',
    //   log_file: './logs/pm2-combined-dev.log',
    //   time: true,
    //   autorestart: true,
    //   watch: false,
    //   instances: 1,
    //   exec_mode: 'fork',
    // },
  ],
};

