# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ source code và build
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS runner

WORKDIR /app

# Copy only cần thiết từ builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Nếu bạn dùng next.config.js với output: 'standalone', thì copy thêm:
# COPY --from=builder /app/.next/standalone ./

EXPOSE 3000

CMD ["npm", "start"]
