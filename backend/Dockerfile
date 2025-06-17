FROM node:18

WORKDIR /app

COPY package*.json ./

# Cài luôn cả devDependencies, để có nodemon
RUN npm install --include=dev

# Fix lỗi thiếu quyền execute
RUN chmod +x ./node_modules/.bin/nodemon

COPY . .

CMD ["npm", "run", "start"]