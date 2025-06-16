# frontend/Dockerfile
FROM node:18

WORKDIR /app
COPY ./ ./

RUN npm install
RUN npm run build

# Dùng serve để chạy app production
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "5173"]
