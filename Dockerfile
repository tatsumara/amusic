FROM node:alpine

# create and set workdir
WORKDIR /usr/src/altair-music

# install dependencies 
COPY package.json ./
RUN npm install

RUN apt install ffmpeg

# copy bot to work dir
COPY . ./

# main command
CMD ["node", "index.js"]