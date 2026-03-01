FROM oven/bun:1 AS base

RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install

COPY src ./src
COPY index.ts .

EXPOSE 8080

CMD ["bun" , "run" , "index.ts"]
