module.exports = {
  apps: [
    {
      name: 'ark-linker-bot',
      script: './index.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      // Reinicio automático si falla
      restart_delay: 4000,
      // Logs
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      combine_logs: true,
      // Environment
      env: {
        NODE_ENV: 'production'
      },
      // Auto-restart si hay cambio (opcional, desactivo para producción)
      watch: false,
      ignore_watch: ['node_modules', 'logs']
    }
  ]
};
