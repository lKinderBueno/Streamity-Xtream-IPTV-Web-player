FROM node:16-alpine as builder
WORKDIR /app
COPY . /app/
RUN npm install
RUN npm run build

FROM php:8.2-apache
COPY --from=builder /app/build /var/www/html/
WORKDIR /var/www/html/
