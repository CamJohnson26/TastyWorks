# TastyWorks
TastyWorks Full Stack code challenge, Cameron Johnson's submission


## Installation Steps
* Install npm and Node.js if they are not already
* Open a terminal and go into the client folder with `cd client` and run `npm install`
* Run `npm run build` to compile the Vue.js front end
* Change to the server folder with `cd ../server` and run `npm install`. Run `npm start` to launch the backend
* Go to `localhost:3000` in a browser. You should see the app and can search for stocks and see their prices over time.

## Project Notes

I wrote the backend in Node.js and Express and the Front End in Vue.js. I used the Canvas.js library for the charts, csv-parser for loading the csv files into express, Bootstrap for styles, and the vue-cli to generate a template Vue project. 

I don't have a shell script to load the csv files, instead the web server loads them once when the application starts. Clients fetch the resulting json on page load and filter their searches client side. The client makes the request to the 3rd party api for price data.

