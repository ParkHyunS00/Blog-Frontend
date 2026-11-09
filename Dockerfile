FROM node:24-alpine

WORKDIR /app

RUN npm install --global pnpm@10.33.2

# 의존성 복사 (캐시 최적화)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --strict-peer-dependencies

# 코드 복사
COPY . .

# 빌드
RUN pnpm run build
