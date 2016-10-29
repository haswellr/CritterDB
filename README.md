# CritterDB

A [web application](http://www.critterdb.com) to help you find and create custom creatures and NPCs for the 5th edition of the world's greatest role playing game.

![CritterDB Demo](https://raw.githubusercontent.com/haswellr/BestiaryManager/master/images/srd-bestiary.png)

## Submitting Feedback & Bugs

The best way to bring an issue to light is by submitting an issue right here on Github. If you wish to, however, you can also contact me directly at haswellrd@gmail.com.

## Working on CritterDB

Any help on the project is much appreciated. The goal is for CritterDB to be reliable, easy to use, and feature-rich, and that will be best achieved with the help of all the strong developers in the role playing community.

If do you want to help out with CritterDB, getting started is easy. The site runs on NodeJS with Angular 1 on the front end and a Mongo database. [Angular Material](https://github.com/angular/material) is used as a UI framework for the front end. CritterDB uses npm to manage back-end packages, and grunt to handle pre-deployment tasks such as code minification and compilation. Use the following instructions to set up a local development environment for CritterDB:

#### Install Prerequisites

1. Install nodejs + npm (Further instructions on the [Node.js website](https://nodejs.org/en/)). Npm is typically installed with Nodejs.
2. Install [Grunt](http://gruntjs.com/) globally by running the following command on the command line:
   1. npm install -g grunt-cli
3. Run a [MongoDB](https://www.mongodb.com/) server on your machine or set up a server in the cloud. This setup is up to you. Personally I use [mLab](https://mlab.com/) to host my MongoDB servers as they have a free sandbox tier and the site is very easy to use.

#### Get the code

Clone the code from Github.

#### Install Dependencies

CritterDB uses [npm](https://www.npmjs.com/) to manage its back-end dependencies. Navigate to the CritterDB/server/ folder on the command line, then execute the following command:

1. npm install

Settings and configuration for npm can be found in 'package.json'.

#### Configure

CritterDB has a config file which manages several values that must be set before you can run CritterDB. This file is not stored in git as it varies based on dev or deployment environment. Navigate to the 'server' folder within the CritterDB project. Copy 'sampleconfig.js' and name the new file 'config.js'.

![Copy sampleconfig.js](https://raw.githubusercontent.com/haswellr/BestiaryManager/master/images/dev-instructions/config1.png)

Now, open config.js and edit the fields to something that is appropriate for your development environment.

* *secret*: This is just an identifier used when storing and identifying user session tokens. It can be any random string of characters.
* *databaseUrl*: This is the full url including user, password, and database, to the MongoDB server that you will be using. The image shows a sample of what an mlab URL may look like, but you need to change this to point to your server.
* *tokens*
  * *duration*: This specifies how long persistent sessions will last. No need to change.
* *email*: These values set up what email address CritterDB will send from. Currently the only emails CritterDB sends out are welcome emails. You will need to configure this to use a gmail address (yes it must be gmail). If you don't care about emails you could probably just not set this and things would still work.
  * *address*: A gmail address.
  * *name*: The name the emails should be from.
  * *password*: The password to access that gmail account.

And that's it! The most important thing is making sure that the databaseUrl points to your database. Sample image shown below:

![Edit config.js](https://raw.githubusercontent.com/haswellr/BestiaryManager/master/images/dev-instructions/config2.png)

#### Compile

CritterDB uses [Grunt](http://gruntjs.com/) to perform code minification, obfuscation, and any other tasks that must be performed for the code to be ready for production. Grunt should also be used when developing code to simulate the production environment as closely as possible. Grunt scripts are stored in 'gruntfile.js'.

When first setting up the CritterDB code, you should run Grunt once. Navigate to the 'server' folder on the command line and run the following command to use Grunt to compile the code:

1. grunt

Grunt needs to be run every time the code changes. When you are developing the server you should run 'grunt watch' from the 'server' folder in a command line. This will constantly watch the directory for changes and recompile as needed so that you don't have to re-run grunt every time you want to test anything.

#### Running the Code

Now you're ready to run the server! Navigate to the 'server' folder on the command line and run the following command:

1. node server.js

The server should start up and tell you it's running on port 3000. Now you can navigate to 'localhost:3000' in your browser and you should see CritterDB. You will need to restart the server anytime you change back-end code by stopping and re-running 'node server.js'.

## Server File Structure

* *controllers*: These files determine what happens when a client interacts with a server endpoint, like creating a new critter or deleting a bestiary.
* *dist*: Not stored in git. Compiled files will be located here after running grunt.
* *models*: Javascript representations of database models. We use [Mongoose](https://www.npmjs.com/package/mongoose) to manage the database interactions.
* *public*: This holds the front end code, which uses the Angular v1 framework.
  * *css*: CSS files.
  * *data*: Holds SRD data or other static information that CritterDB uses.
  * *fonts*: Fonts.
  * *img*: Images.
  * *js*: Javascript files.
    * *controllers*: Angular controllers.
    * *directives*: Angular directives.
    * *services*: Angular services.
    * *vendor*: Any code from external sources is stored here.
    * *app.js*: The main angular application javascript file.
  * *partials*: Partial HTML files which are inserted into pages.
* *views*: Entire HTML pages. In this project the main HTML page is pretty simple and then partial HTML pages are loaded in using Angular's routing system.
* *config.js*: Contains configuration data specific to your machine. This is not stored in git. See 'Configure' section above for instructions on creating this file.
* *gruntfile.js*: The configuration file for [Grunt](http://gruntjs.com/). Grunt is a javascript task runner that we use for many tasks, mainly compiling, minifying, and obfuscating the front end code.
* *grunt-readme.txt*: A brief readme file as a reminder for how to use grunt with the project. It has no information that is not already covered by this readme.
* *package.json*: The configuration file for [NodeJS Package Manager (npm)](https://www.npmjs.com/). Here you can set what npm packages this project requires.
* *sampleconfig.js*: Included as a helper to define the fields that *config.js* expects. See 'Configure' section above for instructions on creating your config file.
* *server.js*: The main NodeJS application script.

## Contact

You can get in touch with me at haswellrd@gmail.com.
