# server-mobile-app

![Data Flow Diagram] (https://github.com/alijarasyidi/smart-meter/blob/master/repo-image/diagram-mobile-server.jpg)

## Description
This server is in charge of controlling and processing data from and to mobile app interface. There are two main functions of this server : first for query and process data 
from database to later display it on interface, second is for push notification function on mobile app. Firebase Cloud Messagging is used for push notification service. This project 
use Node.js framework and Express.js to create API.

## Requirement
1. Node.js installed

## Setup
1. Clone / download repository project
2. `npm install` on directory project to install depedencies

## Usage
1. `node index.js` or `nodemon index.js` on project directory
