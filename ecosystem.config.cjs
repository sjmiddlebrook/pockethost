module.exports = {
  apps: [
    {
      name: `firewall`,
      script: 'pockethost firewall serve',
    },
    {
      name: `edge-daemon`,
      script: 'pockethost edge daemon ',
    },
    {
      name: `edge-ftp`,
      script: 'pockethost edge ftp serve',
    },
    {
      name: `edge-syslog`,
      script: 'pockethost edge syslog serve',
    },
    {
      name: `mothership`,
      script: 'pockethost mothership serve',
    },
    {
      name: `downloader`,
      restart_delay: 60 * 60 * 1000, // 1 hour
      script: 'dotenv pockethost download',
    },
    {
      name: `edge-health`,
      restart_delay: 60 * 1000, // 1 minute
      script: 'dotenv pockethost health',
    },
  ],
}
