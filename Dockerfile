FROM node:9.11.1 AS builder

RUN ["npm" "install" "-g" "vuepress"]

RUN ["vuepress", "build", "."]

FROM nginx:latest

COPY --from=builder ./.vuepress/dist/ /usr/share/nginx/html

COPY --from=builder ./config/default.conf /etc/nginx/conf.d/default.conf
