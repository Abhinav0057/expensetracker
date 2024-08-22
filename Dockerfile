FROM node:19.6

#  create a app dir
WORKDIR /application

#  copy package json for all depencencies

COPY package.json .

#  inatall dependencies
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ];\
        then npm install;\
        else npm install --only=production;\
        fi

# RUN npm install 

#  copy code to our docer container

COPY . .


ENV PORT 3000

EXPOSE $PORT


# CMD ["node","src/app.js"]
CMD ["npm", "start"]

