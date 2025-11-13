# ARK Discord Linker Bot

Bot de Discord para vincular cuentas de Steam/Epic Games con el servidor ARK y obtener información del servidor en tiempo real.

## Características

✅ **Listar Jugadores** — Ver quién está en línea (con Steam ID y Epic ID)  
✅ **Información del Servidor** — Estado y detalles en tiempo real  
✅ **RCON Integration** — Conecta directamente con tu servidor ARK  
✅ **Paginación** — Listas grandes con navegación intuitiva  
✅ **Logs** — Seguimiento completo de eventos  
✅ **24/7 Disponible** — Ejecuta en Replit o localmente con PM2  

---

## Instalación Rápida

### Opción A: Replit (Recomendado para 24/7)

1. **Lee la guía completa:** [`REPLIT_SETUP.md`](./REPLIT_SETUP.md)
2. **Pasos resumidos:**
   - Clone el repo en GitHub
   - Importa a Replit
   - Configura variables en **Secrets**
   - ¡Listo!

**Ventaja:** Corre automáticamente 24/7, sin necesidad de una PC encendida.

### Opción B: Local con PM2

1. **Lee la guía:** [`PM2_SETUP.md`](./PM2_SETUP.md)
2. **Pasos resumidos:**
   ```powershell
   npm install -g pm2
   npm install
   pm2 start ecosystem.config.js
   ```

**Ventaja:** Control total, sin dependencias externas.

---

## Configuración Inicial

### 1. Obtener Token del Bot Discord

1. Ve a https://discord.com/developers/applications
2. Crea una **New Application**
3. En la pestaña **Bot**, copia el **Token**
4. En **TOKEN PERMISSIONS**, habilita:
   - ✅ `applications.commands`
   - ✅ `bot`

### 2. Obtener IDs

En Discord, activa **Modo Desarrollador** (User Settings → Advanced):

- **CLIENT_ID:** Copia de _Application Settings → General_
- **GUILD_ID:** Haz clic derecho en tu servidor → **Copy Server ID**

### 3. Configurar RCON

- **RCON_HOST:** IP de tu servidor ARK
- **RCON_PORT:** Puerto RCON (default: 30116)
- **RCON_PASSWORD:** Contraseña RCON configurada en tu servidor

---

## Uso

### En Replit

Configura estas variables en **Secrets** 🔒:

```
TOKEN=your_token
CLIENT_ID=your_id
GUILD_ID=your_guild
RCON_HOST=your_server_ip
RCON_PORT=30116
RCON_PASSWORD=your_password
```

Haz clic en **Run** — ¡Listo!

### Localmente

1. Copia `.env.example` a `.env`:
   ```powershell
   Copy-Item .env.example .env
   ```

2. Edita `.env` con tus valores

3. Instala dependencias:
   ```powershell
   npm install
   ```

4. Ejecuta:
   ```powershell
   node index.js
   ```

---

## Comandos Discord

### `/playerlist`

Muestra lista paginada de jugadores en línea:

```
🎮 Lista de Jugadores
Jugadores Totales: 3
─────────────────
Nombre: PhOxGmeS
ID Steam: 76561199140421833
ID Epic: ...
```

Botones: ⬅️ **Anterior** | ✖️ **Cerrar** | **Siguiente** ➡️

---

## Troubleshooting

### El bot no inicia

1. Verifica que `TOKEN` es válido
2. Mira los logs: `pm2 logs` o consola de Replit
3. Asegúrate de que RCON está habilitado en tu servidor ARK

### RCON connection failed

1. Verifica `RCON_HOST`, `RCON_PORT`, `RCON_PASSWORD`
2. Prueba con: `node test-rcon.js`
3. Si el servidor está detrás de firewall, abre el puerto RCON

### El bot se reinicia continuamente

- Revisa los logs para errores específicos
- Verifica que todas las variables de entorno están configuradas

---

## Documentación Completa

- 📖 [`REPLIT_SETUP.md`](./REPLIT_SETUP.md) — Desplegar en Replit 24/7
- 📖 [`PM2_SETUP.md`](./PM2_SETUP.md) — Ejecutar localmente con PM2
- 📖 [`DISCORD_LINKER_SETUP.md`](./DISCORD_LINKER_SETUP.md) — Configuración inicial
- 📖 Original: https://discord-linker-bot.vercel.app/#/

---

## Estructura del Proyecto

```
ark-linker/
├── index.js              # Punto de entrada
├── package.json          # Dependencias
├── .env.example          # Plantilla variables
├── Dockerfile            # Para containerización
├── ecosystem.config.js   # Configuración PM2
├── commands/             # Comandos del bot
│   └── list.js          # Comando /playerlist
├── logs/                # Logs automáticos
├── PM2_SETUP.md         # Guía PM2 local
├── REPLIT_SETUP.md      # Guía Replit
└── README.md            # Este archivo
```

---

## Desarrollo

### Agregar un nuevo comando

1. Crea `commands/tucomando.js`:
   ```javascript
   const { SlashCommandBuilder } = require('discord.js');
   
   module.exports = {
     data: new SlashCommandBuilder()
       .setName('tucomando')
       .setDescription('Descripción'),
     async execute(interaction) {
       await interaction.reply('¡Hola!');
     }
   };
   ```

2. El bot lo cargará automáticamente al reiniciar

### Testing local

```powershell
node test-rcon.js    # Prueba RCON
node index.js        # Ejecuta bot
```

---

## Licencia

ISC

---

## Soporte

Para más ayuda:
- Revisa los logs en `logs/`
- Consulta las guías de configuración
- Abre un issue en GitHub

**¡Disfruta tu bot! 🚀**
