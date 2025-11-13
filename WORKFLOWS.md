# GitHub Workflows para Despliegue Automático

Este documento explica cómo configurar **GitHub Actions** para desplegar automáticamente el bot en Replit.

## ¿Qué son los Workflows?

Los **GitHub Workflows** son scripts automatizados que se ejecutan cuando haces push a GitHub. En nuestro caso:
- **Validan** que el código es correcto
- **Despliegan** automáticamente a Replit
- **Notifican** del estado

---

## Configurar Secrets en GitHub

Los secrets son variables cifradas que solo GitHub y tus workflows pueden ver. Necesitamos guardar credenciales allí.

### Paso 1: Abre el repositorio en GitHub

Ve a: https://github.com/phoxgmesyt/DiscordLinkerBot

### Paso 2: Abre Settings

1. Haz clic en **Settings** (pestaña arriba)
2. En el menú izquierdo, haz clic en **Secrets and variables**
3. Expande y selecciona **Actions**

### Paso 3: Agregar Secrets

Para cada uno de estos, haz clic en **New repository secret** y agrega:

#### Secret 1: REPLIT_URL
- **Name:** `REPLIT_URL`
- **Value:** Tu URL de Replit (ej: `https://DiscordLinkerBot.username.repl.co`)

Para obtenerla:
1. Ve a tu proyecto en Replit
2. Arriba a la derecha, haz clic en **Share**
3. Copia la **URL del sitio web**

#### Secret 2: REPLIT_KEY (Opcional, pero recomendado)
- **Name:** `REPLIT_KEY`
- **Value:** Token de API de Replit (si quieres deploy automático)

Para obtenerlo:
1. Ve a https://replit.com/account
2. **Tools** → **API Key**
3. Copia la clave

---

## Workflows Disponibles

### 1️⃣ **validate.yml** — Validar código

**Cuándo se ejecuta:** Cada vez que haces push a `main`

**Qué hace:**
- ✅ Instala dependencias
- ✅ Verifica que existen archivos requeridos
- ✅ Valida `config.json`
- ✅ Comprueba que Node.js puede ejecutar `index.js`

**Ver logs:**
1. Ve a tu repo en GitHub
2. Pestaña **Actions**
3. Selecciona **Validate Code**
4. Haz clic en el workflow más reciente
5. Verás los logs en tiempo real

### 2️⃣ **deploy-replit.yml** — Desplegar automáticamente

**Cuándo se ejecuta:** Después de que `validate.yml` pase

**Qué hace:**
- 🚀 Detecta cambios en GitHub
- 🚀 Notifica a Replit para que actualice el código
- 🚀 Reinicia automáticamente el bot

**Requisito:** Necesitas `REPLIT_KEY` configurado en Secrets

---

## Cómo Usar los Workflows

### Flujo Normal (Actualizar el Bot):

```powershell
# 1. Edita código localmente (ej: commands/list.js)
# 2. Haz commit y push
git add .
git commit -m "Update: improve playerlist command"
git push

# 3. Ve a GitHub → Actions
# 4. Verás los workflows ejecutándose automáticamente
# 5. Si todo pasa ✅, el bot se actualiza en Replit

# 6. Espera ~30 segundos y tu bot en Replit tiene los cambios nuevos
```

---

## Archivos del Workflow

```
.github/
└── workflows/
    ├── validate.yml       # Validar código cada push
    └── deploy-replit.yml  # Desplegar a Replit
```

### validate.yml — Qué valida

```yaml
- Node.js 18 instalado
- npm install funciona
- Archivos requeridos presentes
- config.json es válido
- index.js puede ser parseado por Node.js
```

### deploy-replit.yml — Qué hace

```yaml
- Detecta push a rama 'main'
- Ejecuta validate.yml primero
- Si valida OK, notifica a Replit
- Replit actualiza el código
- Bot se reinicia automáticamente
```

---

## Solucionar Problemas

### "El workflow no se ejecuta"

1. Verifica que los archivos `.yml` están en `.github/workflows/`
2. Ve a GitHub → **Actions**
3. Si ves error rojo, haz clic para ver detalles

### "validate.yml falla"

Causas comunes:
- `package.json` tiene error de JSON → Abre y verifica formato
- `config.json` tiene error → Valida con un validador JSON online
- `index.js` tiene sintaxis incorrecta → Revisa errores

**Para arreglarlo:**
1. Edita el archivo localmente
2. Valida sintaxis (puedes usar un editor de código)
3. Haz commit y push
4. El workflow se ejecutará nuevamente

### "deploy-replit.yml falla"

Causa: `REPLIT_KEY` no está configurado o es incorrecto

**Solución:**
1. Abre GitHub Settings → Secrets
2. Verifica que `REPLIT_KEY` existe
3. Si no, copia uno nuevo de Replit (https://replit.com/account)
4. Actualiza el secret en GitHub

---

## Ejemplo: Actualizar el Bot Completo

**Paso 1:** Edita `commands/list.js` localmente

```javascript
// Cambio: agregar más info
if (p.steamId) parts.push(`**ID Steam:** \`${p.steamId}\``);
```

**Paso 2:** Haz commit

```powershell
cd "C:\Users\Yefrid Valverde\Desktop\weblatinoland\ark-linker"
git add commands/list.js
git commit -m "Feature: add more player info"
git push
```

**Paso 3:** GitHub ejecuta workflows automáticamente

- **validate.yml** → Verifica que el código es válido ✅
- **deploy-replit.yml** → Notifica a Replit 🚀
- **Replit** → Se actualiza automáticamente ⚡

**Paso 4:** En ~1 minuto, tu bot en Replit tiene los cambios

Puedes verlo en: https://github.com/phoxgmesyt/DiscordLinkerBot/actions

---

## Desactivar o Modificar Workflows

**Para desactivar un workflow:**

1. Abre el archivo `.yml` en GitHub
2. Edita y comenta la línea `on:`
3. Haz commit

**Para modificar cuándo se ejecuta:**

Abre el archivo `.yml` y edita la sección `on:`:

```yaml
on:
  push:
    branches:
      - main        # Se ejecuta en push a main
  pull_request:     # También en pull requests
    branches:
      - main
  schedule:         # O en horario específico
    - cron: '0 0 * * 0'  # Cada domingo a las 00:00
```

---

## Referencias

- 📖 GitHub Actions: https://docs.github.com/en/actions
- 📖 Replit API: https://docs.replit.com/api
- 📖 YAML syntax: https://yaml.org/

---

## Resumen

✅ Los workflows **automatizan** tu flujo de desarrollo  
✅ No necesitas hacer nada manual después de push  
✅ GitHub valida, GitHub despliega, todo funciona  
✅ Los logs te muestran exactamente qué ocurrió

**¡Tu bot ahora se actualiza automáticamente! 🚀**
