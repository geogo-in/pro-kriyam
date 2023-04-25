FROM node:16.17.0-alpine3.15 as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile --silent --network-timeout=1000000

COPY . ./
RUN yarn run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
# new
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

COPY ./docker-prod-entrypoint.sh ./
RUN chmod +x ./docker-prod-entrypoint.sh

ENTRYPOINT ["./docker-prod-entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]