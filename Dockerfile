FROM node:latest as build
WORKDIR /usr/local/app
COPY ./ /usr/local/app/
RUN npm install
RUN npm run build
FROM nginx:latest
COPY nginx.config /etc/nginx/conf.d/default.conf
COPY --from=build /usr/local/app/dist/FrontBTG /usr/share/nginx/html
EXPOSE 80   