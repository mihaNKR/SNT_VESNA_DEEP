# Базовый образ
FROM node:18-alpine as builder

# Установка зависимостей
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN npm run build:prod

# Продакшен сервер
FROM nginx:1.25-alpine

# Копирование конфига nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копирование собранного приложения
COPY --from=builder /app/build /usr/share/nginx/html

# Порт
EXPOSE 80

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]
