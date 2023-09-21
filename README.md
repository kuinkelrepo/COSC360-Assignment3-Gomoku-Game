# Gomoku App

## Project setup
## How to start backend service
After successfully cloning the project, create a .env file and add following variable:
sh
PORT=4000
MONGODB_URL='mongodb+srv://pkuinkel:pkuinkel@gomoku-app.yb403su.mongodb.net/?retryWrites=true&w=majority'
SECRET_KEY='secretKey'


After that run following commands in the terminal
sh
npm install
npm run db-seed
npm start


The console shows : 
Server is up and running on the port: 4000
Successfully connected to MongoDB server

## How to start web application (frontend)
Run following commands in the terminal after cloning the project.
sh
cd client
npm install
npm start


## Pre-configured username and password
Username: user
Password: User@123

## Link to your postman collection
Here is the link to my postman collection:
[https://elements.getpostman.com/redirect?entityId=29791395-805e86fd-44b0-4b9e-bbb9-3a4d74c71188&entityType=collection](https://elements.getpostman.com/redirect?entityId=29791395-805e86fd-44b0-4b9e-bbb9-3a4d74c71188&entityType=collection)