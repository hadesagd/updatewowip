#This file is to deploy this application in a container

# specify the node base image with your desired version node:<version>
FROM node:8
# add the files from the current directory to the build
WORKDIR /app
# copy the files to the workdirectory
ADD . /app
# replace this with your application's default port
EXPOSE 4000
# run the app when the container launches
CMD [ "npm start" ]