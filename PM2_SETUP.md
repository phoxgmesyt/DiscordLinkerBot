# PM2 Setup para Discord Linker Bot

Este documento explica cómo configurar **PM2** para que el bot Linker corra 24/7 con reinicio automático.

## ¿Qué es PM2?

PM2 es un gestor de procesos Node.js que:
- Mantiene el bot ejecutándose continuamente (24/7).
- Reinicia automáticamente el bot si se detiene o falla.
- Captura logs en archivos para depuración.
- Permite monitoreo en tiempo real del uso de memoria/CPU.

---

## Instalación

### 1. Instalar PM2 globalmente (una sola vez)

```powershell
npm install -g pm2
```

### 2. Verificar instalación

```powershell
pm2 -v
```

Deberías ver un número de versión (ej: "5.3.0").

---

## Configuración y Arranque

### 1. Navega a la carpeta del bot

```powershell
cd "C:\Users\Yefrid Valverde\Desktop\weblatinoland\ark-linker"
```

### 2. Arranca el bot con PM2

Opción A: Usar la configuración automática (recomendado):
```powershell
pm2 start ecosystem.config.js
```

Opción B: Arrancarlo manualmente:
```powershell
pm2 start index.js --name "ark-linker-bot"
```

### 3. Verifica que está corriendo

```powershell
pm2 status
```

Deberías ver algo como:
```
┌─────────┬────────────────────┬──────────┬──────┬───────────┬──────────┐
│ App     │ id │ version │ mode │ pid  │ status │ restart │ uptime │ memory   │
├─────────┼────────────────────┼──────────┼──────┼───────────┼──────────┤
│ ark...  │ 0  │ N/A     │ fork │ 12345 │ online │ 0      │ 2m     │ 75MB     │
└─────────┴────────────────────┴──────────┴──────┴───────────┴──────────┘
```

Status debe ser **online**.

---

## Comandos Útiles

### Ver logs en tiempo real
```powershell
pm2 logs ark-linker-bot
```

### Detener el bot
```powershell
pm2 stop ark-linker-bot
```

### Reiniciar el bot
```powershell
pm2 restart ark-linker-bot
```

### Detener y eliminar el bot de PM2
```powershell
pm2 delete ark-linker-bot
```

### Ver monitoreo (CPU/RAM/PID)
```powershell
pm2 monit
```

### Listar todos los procesos gestionados
```powershell
pm2 list
```

### Guardar la configuración actual para que se inicie al arrancar Windows (opcional)
```powershell
pm2 save
```

(Nota: Esto requiere pm2 Plus o configuración manual de tareas programadas en Windows).

---

## Archivos de Log

Los logs se guardan en:
- `./logs/out.log` — salida estándar del bot
- `./logs/error.log` — errores y warnings

Para ver los logs:
```powershell
Get-Content ".\logs\out.log" -Tail 50
```

(Muestra las últimas 50 líneas)

---

## Reinicio Automático en Caso de Fallo

PM2 está configurado para:
1. **Reintentar automáticamente** si el bot muere.
2. **Esperar 4 segundos** entre reintentos (puedes cambiar `restart_delay` en `ecosystem.config.js`).
3. **Limitar memoria** a 500MB (si se excede, reinicia automáticamente).

---

## Arranque Automático al Iniciar Windows (Opcional)

Para que PM2 inicie el bot automáticamente cada vez que Windows arranca:

### Opción 1: Usar PM2 Plus (requiere login)
```powershell
pm2 plus
```

### Opción 2: Crear una Tarea Programada en Windows

1. Abre **Tareas Programadas** (busca en el menú Inicio).
2. **Acción → Crear Tarea Básica**.
3. Nombre: `ARK Linker Bot Startup`
4. **Desencadenador**: Al iniciar el sistema.
5. **Acción**:
   - Programa: `powershell.exe`
   - Argumentos: `-NoProfile -ExecutionPolicy Bypass -Command "cd 'C:\Users\Yefrid Valverde\Desktop\weblatinoland\ark-linker' && pm2 start ecosystem.config.js"`
6. Marca la opción de ejecutar con privilegios de administrador.
7. Clic en **Crear**.

---

## Troubleshooting

### El bot no inicia con PM2
1. Verifica que `config.json` existe y tiene valores correctos.
2. Prueba a ejecutar manualmente: `node index.js`
3. Mira los logs: `pm2 logs ark-linker-bot`

### PM2 no reconoce comandos
Asegúrate de haber ejecutado `npm install -g pm2` globalmente y que está en el PATH.

### El bot se reinicia continuamente
1. Revisa los logs: `pm2 logs ark-linker-bot`
2. Verifica que RCON_HOST, RCON_PASSWORD están correctos en `config.json`.
3. Comprueba que el servidor ARK está disponible.

### Los logs no se guardan
1. Verifica que la carpeta `./logs` existe (debería estar creada).
2. Comprueba permisos de escritura en la carpeta.
3. Reinicia el bot: `pm2 restart ark-linker-bot`

---

## Monitoreo

Para un monitoreo más avanzado, puedes usar:

### Dashboard Web de PM2 (requiere PM2 Plus)
```powershell
pm2 plus
```

### Monitoreo local
```powershell
pm2 monit
```

---

## Notas Finales

- **No olvides actualizar `config.json`** con tus tokens y credenciales RCON antes de arrancar PM2.
- **Revisa los logs regularmente** (`./logs/`) para detectar problemas.
- PM2 es muy útil para **producción** pero también funciona perfecto para desarrollo local 24/7.

¡Listo! Tu bot ahora corre 24/7. 🚀
