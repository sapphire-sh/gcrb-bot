FROM node:alpine

RUN mkdir -p /opt/project
WORKDIR /opt/project

RUN node --version
RUN npm --version

RUN apk update \
		&& apk add --no-cache git

COPY package* ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "start" ]
