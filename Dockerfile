FROM node:10-alpine as songbox-api
LABEL maintainer="tonymtz <hello@tonymtz.com>"
WORKDIR /app
COPY . .
ARG PORT=$PORT
ENV NODE_ENV=production
RUN npm install
EXPOSE ${PORT}
CMD [ "npm", "start" ]