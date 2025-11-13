const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { RCONClient } = require('rcon.js');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('playerlist')
    .setDescription('Show list of players on the server'),
  async execute(interaction) {
        // Create a fresh RCON client per command to avoid reused/closed clients
        const rconClient = new RCONClient({ host: config.RCON_HOST, port: Number(config.RCON_PORT) });

        const doCommand = async () => {
            try {
                await rconClient.login(config.RCON_PASSWORD);
                const response = await rconClient.command('ListPlayers');
                const players = response.body.trim().split('\n').filter(Boolean);
                const playerCount = players.length;

                // Helper to parse a player line into name, steam64 and epic id when present
                const parsePlayerLine = (line) => {
                    const raw = line.trim();
                    const parts = raw.split(',').map(p => p.trim()).filter(Boolean);
                    const first = parts[0] || raw;
                    const name = (first.includes('. ') ? first.split('. ')[1].trim() : first).trim();

                    let steamId = null;
                    for (const p of parts.slice(1)) {
                        const m = p.match(/(7656\d{10,})/);
                        if (m) { steamId = m[1]; break; }
                    }

                    let epicId = null;
                    for (const p of parts.slice(1)) {
                        const mLabel = p.match(/(?:EPIC|EpicAccountId)[:=]?\s*([A-Za-z0-9\-:_]{6,})/i);
                        if (mLabel) { epicId = mLabel[1].trim(); break; }
                    }
                    if (!epicId) {
                        for (const p of parts.slice(1)) {
                            const candidate = p.replace(/[^A-Za-z0-9]/g, '');
                            if (candidate && candidate.length >= 6 && (!steamId || !candidate.includes(steamId))) {
                                if (!/^\d{1,3}$/.test(candidate)) { epicId = candidate; break; }
                            }
                        }
                    }

                    return { name, steamId, epicId, raw };
                };

                const parsed = players.map(parsePlayerLine);

                // Pagination: 10 players per page
                const playersPerPage = 10;
                const pages = [];
                for (let i = 0; i < parsed.length; i += playersPerPage) {
                    pages.push(parsed.slice(i, i + playersPerPage));
                }

                // Handle no players case
                if (playerCount === 0) {
                    const embed = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle('📋 Lista de Jugadores')
                        .setDescription('No hay jugadores en línea.')
                        .setFooter({ text: '📊 Estado del Servidor ARK' })
                        .setTimestamp();
                    await interaction.reply({ embeds: [embed] });
                    return true;
                }

                // Create paginated embeds
                let currentPage = 0;

                const createEmbed = (pageIndex) => {
                    const pageData = pages[pageIndex];
                    const embed = new EmbedBuilder()
                        .setColor('#00ff00')
                        .setTitle('🎮 Lista de Jugadores')
                        .setDescription(`**Jugadores Totales: ${playerCount}**`)
                        .setFooter({ text: `Página ${pageIndex + 1} de ${pages.length} • 📊 Estado del Servidor ARK` })
                        .setTimestamp();

                    pageData.forEach((p) => {
                        const value = [];
                        value.push(`**Nombre:** ${p.name}`);
                        if (p.steamId) value.push(`**ID Steam:** \`${p.steamId}\``);
                        if (p.epicId) value.push(`**ID Epic:** \`${p.epicId}\``);
                        embed.addFields({ name: `\u200B`, value: value.join('\n') });
                    });

                    return embed;
                };

                const createButtons = (pageIndex) => {
                    const row = new ActionRowBuilder();
                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId(`playerlist_prev_${pageIndex}`)
                            .setLabel('⬅️ Anterior')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(pageIndex === 0),
                        new ButtonBuilder()
                            .setCustomId(`playerlist_close`)
                            .setLabel('✖️ Cerrar')
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId(`playerlist_next_${pageIndex}`)
                            .setLabel('Siguiente ➡️')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(pageIndex === pages.length - 1)
                    );
                    return row;
                };

                const message = await interaction.reply({
                    embeds: [createEmbed(currentPage)],
                    components: [createButtons(currentPage)],
                    fetchReply: true
                });

                // Collector for button interactions
                const collector = message.createMessageComponentCollector({
                    time: 5 * 60 * 1000 // 5 minutes
                });

                collector.on('collect', async (buttonInteraction) => {
                    if (buttonInteraction.customId === 'playerlist_close') {
                        await buttonInteraction.update({ components: [] });
                        collector.stop();
                    } else if (buttonInteraction.customId.startsWith('playerlist_prev_')) {
                        currentPage = Math.max(0, currentPage - 1);
                        await buttonInteraction.update({
                            embeds: [createEmbed(currentPage)],
                            components: [createButtons(currentPage)]
                        });
                    } else if (buttonInteraction.customId.startsWith('playerlist_next_')) {
                        currentPage = Math.min(pages.length - 1, currentPage + 1);
                        await buttonInteraction.update({
                            embeds: [createEmbed(currentPage)],
                            components: [createButtons(currentPage)]
                        });
                    }
                });

                collector.on('end', () => {
                    console.log('Player list pagination collector ended.');
                });

                return true;
            } catch (err) {
                console.error('RCON command error:', err);
                return err;
            } finally {
                // try to close if supported
                try {
                    if (typeof rconClient.end === 'function') await rconClient.end();
                    else if (typeof rconClient.close === 'function') await rconClient.close();
                    else if (typeof rconClient.disconnect === 'function') await rconClient.disconnect();
                } catch (closeErr) {
                    console.warn('RCON close warning:', closeErr);
                }
            }
        };

        // Try once, then one retry on failure (useful for transient network issues)
        const result = await doCommand();
        if (result !== true) {
            // retry once
            console.log('Retrying RCON command once...');
            const retry = await doCommand();
            if (retry !== true) {
                const message = retry && retry.message ? retry.message : 'Error al conectar con el servidor RCON.';
                await interaction.reply(`❌ Error al obtener la lista de jugadores: ${message}`);
            }
        }
  }
};
