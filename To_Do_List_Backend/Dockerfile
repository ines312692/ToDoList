FROM node:20

LABEL org.opencontainers.image.source="todo-backend"

WORKDIR /app

COPY . .

RUN npm install

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    git \
    curl \
    vim \
    && python3 -m venv /opt/venv \
    && /opt/venv/bin/pip install requests \
    && npm install -g typescript jest

ENV PATH="/opt/venv/bin:$PATH"

RUN dd if=/dev/zero of=/app/dummyfile bs=1M count=500

RUN mkdir -p /app/data

EXPOSE 3000

CMD ["npm", "start"]
