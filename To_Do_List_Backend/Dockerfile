FROM node:20

LABEL org.opencontainers.image.source="todo-backend"

WORKDIR /app


COPY . .


RUN npm install


RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    git \
    curl \
    vim \
    && pip3 install requests \
    && npm install -g typescript jest


RUN dd if=/dev/zero of=/app/dummyfile bs=1M count=500


RUN mkdir -p /app/data

EXPOSE 3000

CMD ["npm", "start"]