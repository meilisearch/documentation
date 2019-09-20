FROM node:12 AS builder

WORKDIR /build

COPY . .

RUN npm install -g vuepress

RUN vuepress build .



FROM nginx:latest

COPY --from=builder /build/.vuepress/dist /usr/share/nginx/html

COPY --from=builder /build/config/default.conf /etc/nginx/conf.d/default.conf
