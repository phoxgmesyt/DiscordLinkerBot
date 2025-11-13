require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, Events, GatewayIntentBits, REST, Routes } = require('discord.js');

// Cargar configuración desde .env o config.json
let config = {};
if (fs.existsSync('./config.json')) {
  config = require('./config.json');
}
// Sobrescribir con variables de entorno si existen
if (process.env.TOKEN) config.TOKEN = process.env.TOKEN;
if (process.env.CLIENT_ID) config.clientId = process.env.CLIENT_ID;
if (process.env.GUILD_ID) config.guildId = process.env.GUILD_ID;
if (process.env.RCON_HOST) config.RCON_HOST = process.env.RCON_HOST;
if (process.env.RCON_PORT) config.RCON_PORT = process.env.RCON_PORT;
if (process.env.RCON_PASSWORD) config.RCON_PASSWORD = process.env.RCON_PASSWORD;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Logger mejorado con timestamps
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, 'bot.log');
const errorFile = path.join(logDir, 'error.log');

const getTimestamp = () => new Date().toISOString();

const logger = {
  info: (msg) => {
    const timestamp = getTimestamp();
    const log = `[${timestamp}] [INFO] ${msg}`;
    console.log(log);
    fs.appendFileSync(logFile, log + '\n');
  },
  warn: (msg) => {
    const timestamp = getTimestamp();
    const log = `[${timestamp}] [WARN] ${msg}`;
    console.warn(log);
    fs.appendFileSync(logFile, log + '\n');
  },
  error: (msg, error = null) => {
    const timestamp = getTimestamp();
    const errorMsg = error ? `${msg}\n${error.stack}` : msg;
    const log = `[${timestamp}] [ERROR] ${errorMsg}`;
    console.error(log);
    fs.appendFileSync(errorFile, log + '\n');
  }
};

const commands = [];

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(config.TOKEN);
(async () => {
	
  try {
    logger.info(`Iniciando sincronización de ${commands.length} comandos de aplicación.`);
    const data = await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands },
    );

    logger.info(`Sincronización exitosa: ${data.length} comandos registrados.`);
  } catch (error) {
    logger.error('Error al sincronizar comandos', error);
  }
})();

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    logger.info(`Comando cargado: ${command.data.name}`);
  } else {
    logger.warn(`Comando inválido en ${filePath}: falta 'data' o 'execute'.`);
  }
}

client.once(Events.ClientReady, c => {
  logger.info(`✅ Bot conectado como ${c.user.tag}`);
  logger.info(`Servidor configurado: ${config.guildId}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    logger.error(`Comando no encontrado: ${interaction.commandName}`);
    return;
  }

  // Add a condition to check if the command is executed on the correct server
  if (interaction.guild.id !== config.guildId) {
    logger.warn(`Comando ejecutado fuera del servidor configurado: ${interaction.commandName} en ${interaction.guild.id}`);
    return;
  }

  logger.info(`Ejecutando comando: ${interaction.commandName} (usuario: ${interaction.user.tag})`);

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(`Error ejecutando comando ${interaction.commandName}`, error);
    await interaction.reply({ content: '❌ Error ejecutando el comando.', ephemeral: true });
  }
});


client.login(config.TOKEN);

logger.info('Bot iniciando...');
