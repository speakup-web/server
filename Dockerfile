FROM node:20.11.1-alpine AS builder
WORKDIR /usr/src/app
COPY package.json ./
RUN yarn install
COPY . .
RUN yarn build

FROM node:20.11.1-alpine
WORKDIR /usr/src/app
COPY package.json ./
RUN yarn install --prod
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 8080
CMD ["yarn", "start"]