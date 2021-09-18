FROM node:alpine

# create and set workdir
WORKDIR /usr/src/altair-music

# install dependencies 
COPY package.json ./
RUN npm install

RUN apk add --no-cache ffmpeg

# copy bot to work dir
COPY . ./

# main command
CMD ["node", "index.js"]