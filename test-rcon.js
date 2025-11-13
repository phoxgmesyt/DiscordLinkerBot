const { RCONClient } = require('rcon.js');
const config = require('./config.json');

(async () => {
  try {
    const client = new RCONClient({
      host: config.RCON_HOST,
      port: Number(config.RCON_PORT)
    });

    console.log('Attempting RCON connect to', config.RCON_HOST + ':' + config.RCON_PORT);
    await client.login(config.RCON_PASSWORD);
    console.log('RCON login successful');

    const res = await client.command('ListPlayers');
    console.log('ListPlayers response:', res.body);

    // Close the RCON client gracefully if method exists (different versions expose different APIs)
    try {
      if (typeof client.end === 'function') {
        await client.end();
      } else if (typeof client.close === 'function') {
        await client.close();
      } else if (typeof client.disconnect === 'function') {
        await client.disconnect();
      } else if (typeof client.logout === 'function') {
        await client.logout();
      } else {
        // No known close method; log and continue
        console.log('No client close method found; leaving connection to be garbage-collected');
      }
    } catch (closeErr) {
      console.warn('Warning: error while closing RCON client:', closeErr);
    }
  } catch (err) {
    console.error('RCON connection error:');
    console.error(err);
    process.exitCode = 1;
  }
})();
