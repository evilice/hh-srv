# Используем официальный образ Node.js 24
FROM node:24-alpine AS base

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем исходный код
COPY . .

RUN npm ci --only=production && npm cache clean --force

# --- Финальный образ ---
FROM base as development

# Устанавливаем рабочую директорию
WORKDIR /app

COPY . .
COPY --from=base /app ./

RUN npm ci && npm cache clean --force

EXPOSE 3000

CMD ["npm", "run", "start:dev"]