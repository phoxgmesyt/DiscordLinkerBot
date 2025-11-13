# Dockerfile para el bot Linker en Replit/Railway
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar el código del bot
COPY . .

# Crear carpeta de logs
RUN mkdir -p logs

# Ejecutar el bot
CMD ["node", "index.js"]
