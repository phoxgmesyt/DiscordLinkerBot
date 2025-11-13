# Guía: Desplegar Bot Linker en Replit (24/7)

## ¿Por qué Replit?

✅ Gratis (hasta ciertos recursos)  
✅ Interfaz web simple  
✅ Ejecuta Node.js sin instalación  
✅ Reinicia automáticamente si el bot cae  
✅ Perfect para 24/7  
✅ No necesita Docker

---

## Opción A: Desplegar desde GitHub (Recomendado)

### Paso 1: Preparar el repositorio en GitHub

1. **Crea un repositorio público en GitHub** (si no tienes):
   - Nombre: `ark-linker-bot`
   - Descripción: "Discord Linker Bot para ARK Server"
   - Público

2. **Clona localmente** (en PowerShell):
   ```powershell
   cd C:\Users\Yefrid Valverde\Desktop
   git clone https://github.com/tu_usuario/ark-linker-bot.git
   cd ark-linker-bot
   ```

3. **Copia los archivos** desde `weblatinoland\ark-linker\`:
   ```powershell
   Copy-Item "C:\Users\Yefrid Valverde\Desktop\weblatinoland\ark-linker\*" "C:\Users\Yefrid Valverde\Desktop\ark-linker-bot\" -Recurse -Force
   ```

4. **Verifica que estén estos archivos** en el repo:
   - `index.js`
   - `package.json`
   - `Dockerfile`
   - `.env.example`
   - `.gitignore`
   - `commands/` (carpeta)

5. **Crea un `.env` local** (no lo subirás a GitHub):
   ```powershell
   # Crea el archivo .env con tus valores
   echo "TOKEN=tu_token_aqui" > .env
   echo "CLIENT_ID=tu_application_id" >> .env
   echo "GUILD_ID=tu_guild_id" >> .env
   echo "RCON_HOST=tu_ip_servidor" >> .env
   echo "RCON_PORT=30116" >> .env
   echo "RCON_PASSWORD=tu_password" >> .env
   ```

6. **Sube a GitHub**:
   ```powershell
   git add .
   git commit -m "Add Discord Linker Bot"
   git push -u origin main
   ```

### Paso 2: Conectar a Replit

1. Ve a **https://replit.com** y crea una cuenta (o inicia sesión).

2. **Import a GitHub Repository**:
   - Haz clic en **+ New** → **Import from GitHub**
   - Autoriza GitHub si te lo pide
   - Selecciona tu repo `ark-linker-bot`
   - Replit clonará automáticamente

3. **Espera a que termine** la clonación (verás el archivo tree).

### Paso 3: Configurar Variables de Entorno en Replit

1. En el panel izquierdo, haz clic en **Secrets** (icono de candado 🔒).

2. **Añade cada variable**:
   - **Name:** `TOKEN` → **Value:** tu_token_discord
   - **Name:** `CLIENT_ID` → **Value:** tu_application_id
   - **Name:** `GUILD_ID` → **Value:** tu_guild_id
   - **Name:** `RCON_HOST` → **Value:** tu_ip_servidor
   - **Name:** `RCON_PORT` → **Value:** 30116
   - **Name:** `RCON_PASSWORD` → **Value:** tu_password

3. Haz clic en **Add Secret** para cada una.

### Paso 4: Ejecutar el Bot

1. Haz clic en **Run** (botón verde arriba).

2. **Espera a que instale dependencias** (primera vez tarda ~30s).

3. **Deberías ver en la consola**:
   ```
   [2025-11-12T10:30:45.123Z] [INFO] Bot iniciando...
   [2025-11-12T10:30:50.456Z] [INFO] Iniciando sincronización de X comandos de aplicación.
   [2025-11-12T10:30:55.789Z] [INFO] ✅ Bot conectado como ark-linker-bot#1234
   ```

4. **¡Listo!** El bot está corriendo 24/7 en Replit.

### Paso 5: Mantener el Bot Activo 24/7

Replit puede pausar proyectos inactivos después de 1 hora. Para evitarlo:

**Opción A: Usar Always On (requiere Replit Pro)**
- Haz clic en **Settings** → **Always On** → Activa la opción

**Opción B: Usar Uptime Robot (Gratis)**
1. Ve a **https://uptimerobot.com** y crea una cuenta gratis.
2. **Add Monitor** → **HTTP(s)**:
   - URL: tu_replit_url (algo como `https://ark-linker-bot.username.repl.co`)
   - Interval: 5 minutos
3. Replit recibirá "pings" cada 5 minutos y no se pausará.

---

## Opción B: Crear un Replit desde Cero (sin GitHub)

1. Ve a **https://replit.com**
2. **+ New** → **Node.js**
3. **Upload files**:
   - Sube `index.js`, `package.json`, `Dockerfile`, `commands/` desde tu PC
4. En la terminal de Replit:
   ```bash
   npm install
   ```
5. Configura **Secrets** (ver Paso 3 arriba)
6. Haz clic en **Run**

---

## Actualizar el Bot en Replit

### Desde GitHub (Recomendado)
1. Edita los archivos localmente (p.ej., `commands/list.js`)
2. Haz commit y push:
   ```powershell
   git add .
   git commit -m "Update playerlist command"
   git push
   ```
3. En Replit, haz clic en **Source Control** (icono de rama) → **Pull from main**
4. Haz clic en **Run** para reiniciar el bot

### Directamente en Replit
1. Haz clic en **Edit** sobre el archivo en Replit
2. Modifica el código
3. Haz clic en **Run** (se reiniciará automáticamente)

---

## Troubleshooting

### "Error: DISCORD_TOKEN not found"
- Ve a **Secrets** 🔒
- Verifica que `TOKEN` está configurada
- Haz clic en **Run** nuevamente

### "Cannot find module 'discord.js'"
- En la terminal de Replit:
  ```bash
  npm install
  ```
- Haz clic en **Run** nuevamente

### El bot no responde a comandos
- Verifica `CLIENT_ID` y `GUILD_ID` en Secrets
- Verifica que el bot tiene permisos en Discord
- Mira los logs en la consola de Replit

### "RCON connection failed"
- Verifica `RCON_HOST`, `RCON_PORT`, `RCON_PASSWORD`
- Asegúrate de que el servidor ARK tiene RCON habilitado
- Si el servidor está detrás de firewall, abre el puerto RCON

---

## Comandos de Replit (Terminal)

```bash
# Ver logs
tail -f logs/bot.log

# Ver uso de recursos
top

# Reiniciar bot manualmente
npm start
```

---

## Resumen: Local vs Replit

| Aspecto | Local (PM2) | Replit |
|--------|-----------|--------|
| **Setup** | ~5 minutos | ~3 minutos |
| **Costo** | Gratis | Gratis (con límites) |
| **24/7** | Requiere PC encendida | Automático |
| **Actualizar** | Git push + Pull | Git pull o editar en web |
| **Logs** | Archivos locales | Panel de Replit |
| **Monitoreo** | PM2 monit | Replit dashboard |

---

## ¿Necesitas ayuda?

1. Ve a https://replit.com/support
2. Revisa los logs en Replit (la consola mostrada al hacer Run)
3. Verifica que todas las variables de entorno están en **Secrets**

¡Listo! Tu bot Linker corre 24/7 en Replit. 🚀
