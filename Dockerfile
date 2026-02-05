FROM node:24-alpine

WORKDIR /app

# 의존성 복사 (캐시 최적화)
COPY package.json package-lock.json ./
RUN npm ci

# 코드 복사
COPY . .

# 빌드
RUN npm run build