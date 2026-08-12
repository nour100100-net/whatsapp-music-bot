FROM node:24-bookworm

RUN apt-get update && apt-get install -y python3 ffmpeg && \
    ln -s /usr/bin/python3 /usr/bin/python && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start"]