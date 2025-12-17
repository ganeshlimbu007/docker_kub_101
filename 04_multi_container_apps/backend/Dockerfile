FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

ENV MONGODB_URI=mongodb:27017/course-goals?authSource=admin
ENV MONGODB_USERNAME=max
ENV MONGODB_PASSWORD=secret

EXPOSE 80

CMD ["npm","start"]

