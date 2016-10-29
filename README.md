# CritterDB

A [web application](http://www.critterdb.com) to help you find and create custom creatures and NPCs for the 5th edition of the world's greatest role playing game.

![CritterDB Demo](https://raw.githubusercontent.com/haswellr/BestiaryManager/master/images/srd-bestiary.png)

## Working on CritterDB

Any help on the project is much appreciated. The goal is for CritterDB to be reliable, easy to use, and feature-rich, and that will be best achieved with the help of all the strong developers in the role playing community.

If you want to help out with CritterDB, getting started is easy. The site runs on NodeJS with Angular 1 on the front end and a Mongo database. CritterDB uses npm to manage back-end packages, and grunt to handle pre-deployment tasks such as code minification and compilation. Use the following instructions to set up a local development environment for CritterDB:

##### Install Prerequisites

1. Install nodejs + npm (Further instructions on the [Node.js website](https://nodejs.org/en/)). Npm is typically installed with Nodejs.
2. Install [Grunt](http://gruntjs.com/) globally by running the following command on the command line:
   1. npm install -g grunt-cli
3. Run a [MongoDB](https://www.mongodb.com/) server on your machine or set up a server in the cloud. This setup is up to you. Personally I use [mLab](https://mlab.com/) to host my MongoDB servers as they have a free sandbox tier and the site is very easy to use.

##### Get the code
Clone the code from Github.

##### Install Dependencies
CritterDB uses [npm](https://www.npmjs.com/) to manage its back-end dependencies. Navigate to the CritterDB/server/ folder on the command line, then execute the following command:
1. npm install

Settings and configuration for npm can be found in 'package.json'.

##### Configure
CritterDB has a config file which manages several values that must be set before you can run CritterDB. This file is not stored in git as it varies based on dev or deployment environment. Navigate to the 'server' folder within the CritterDB project. Copy 'sampleconfig.js' and name the new file 'config.js'.

![Copy sampleconfig.js](https://raw.githubusercontent.com/haswellr/BestiaryManager/master/images/dev-instructions/config1.png)

Now,

##### Compile
We use [Grunt](http://gruntjs.com/) to perform code minification, obfuscation, and any other tasks that must be performed for the code to be ready for production. Grunt should also be used when developing code to simulate the production environment as closely as possible. After first retrieving the Beam code, you should run Grunt once. Run the following command to use Grunt to compile the code:
1. grunt

You are now ready to run the Beam server. If you are making changes to the code, run 'grunt watch' in a command line somewhere. This will watch the directory for changes and recompile as needed.

## Running the Code

The Beam server lives in the "Nodejs Server" folder. Navigate there on the command line and run the following command:
1. node app.js

### Submitting Feedback & Bugs

The best way to bring an issue to light is by submitting an issue right here on Github. If you wish to, however, you can also contact me directly at haswellrd@gmail.com.