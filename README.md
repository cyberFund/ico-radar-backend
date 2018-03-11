# chaingear-backend
Server app for Chaingear. Provides an API for solving Chaingear administration tasks such as creation of applications for ICO Radar listing, submiting or rejecting applications. 

## App structure
chaingear-backend is written with Express.js and have following structure:
* server.js - an entry point used to initialize the app. It defines third-party middlewares, used in app, connects to specified Mongo database, initislizes API enty points and listens to specified port for HTTP requests
* Routes - a list of API entry points which can receive and handle HTTP GET or POST request. For now chaingear-backend API have following routes:

  * `/create-application` - recives an HTTP POST request. Request body should contain a JSON document with information about application. After recieving a request this route search for documents with `project_name` field identical to recieved document in MongoDB `projectsInWork` collection. If it finds such document, it sends an 400 status, otherwise, it saves document to DB

  * `/get-all-applications` - recives an HTTP GET request and sends a responce with all documents stored in `projectsInWork` collection

  * `/update-application` - recives an HTTP POST request. Request body should contain a JSON document with information about application. After recieving a request this route search for documents with `_id` field identical to recieved document `_id` field in MongoDB `projectsInWork` collection. If it finds, it replace this document by recived with request, otherwise, it sends an error response

  * `/approve-application` - recives an HTTP POST request. Request body should contain a JSON document with information about application. After recieving a request this route search for documents with `_id` field identical to recieved document `_id` field in MongoDB `projectsInWork` collection. If it finds, it moves this document from the `projectsInWork` collection to the `approvedProjects` collection; otherwise it sends an error response. Also this route uses the `git-commit-middleware` to send data to Chaingear repository

* Middlewares

  * `git-commit-middleware` - used with `/approve-application` route. It takes a a JSON document with information about application and converts it to a toml file. After that it converts JSON document to the old data format, downloads chaingear.json file from Chaingear repo and add converted document to this file. Finally, it takes both files and commits it to the Chaingear repository 

* Helpers

  * `github-api` - export the class that defines methods to interact with Github API

  * `logger` - initializes an winston logger instance which can be subsequentially used in other modules 

  * `new_to_old` - exports a function that recives an object with new data structure and returns the old structure used in ICO Radar

  * `plot_generator` - exports a function that recives an array with objects which have 2 keys: `description` and `percent` and creates a donut plot based on this array

  * `post-generator`  - exports a class that contains methods for generating human-readable post from raw object with project description
