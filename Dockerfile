FROM node:21-alpine as base
RUN apk add --no-cache g++ make py3-pip libc6-compat
#RUN addgroup -g 1001 -S nodejs
#RUN adduser -S nextjs -u 1001
#USER nextjs
#RUN mkdir /app
WORKDIR /app
COPY package*.json ./
EXPOSE 3000

FROM base as production
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD npm start
