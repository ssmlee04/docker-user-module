# take default image of node boron i.e  node 6.x
FROM node:7.6

MAINTAINER Shih-Min Lee <ssmlee04@gmail.com>

# create app directory in container
RUN mkdir -p /app

# set /app directory as default working directory
WORKDIR /app

# # only copy package.json initially so that `RUN yarn` layer is recreated only
# # if there are changes in package.json
# ADD package.json yarn.lock /app/

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package.json yarn.lock /tmp/
RUN cd /tmp && npm install
RUN mkdir -p /app && cp -a /tmp/node_modules /app/

# --pure-lockfile: Don’t generate a yarn.lock lockfile
# RUN yarn --pure-lockfile

# copy all file from current dir to /app in container
COPY . /app/

# expose port 4040
EXPOSE 4040

# cmd to start service
CMD [ "yarn", "start" ]
