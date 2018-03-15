# chaingear-backend
Server app for Chaingear. Provides an API for solving Chaingear administration tasks such as creation of applications for ICO Radar listing, submiting or rejecting applications. 

## Installation instructions
[Docs](https://docs.google.com/document/d/1w2y4RhL1VWloq9S_0_2KS0EyocXRJH22XkIAaV7oMHI/edit?usp=sharing)

## App structure
![architecture scheme](https://github.com/cyberFund/chaingear-backend/blob/master/docs/arch_scheme.png)
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

## Database structure
Currently, chaingear-backend database has three collections:
* projectsInWork - holds all applications that have not been reviewed yet
* approvedProjects - mock collection that temporarily holds information about approved projects. This collection will be removed when a real storage will be developed
* rejectedProjects - holds applications that was rejected

## Applications workflow
![](https://raw.githubusercontent.com/cyberFund/chaingear-backend/master/docs/api1.png)
One of the main puproses of chaingear-backend is creating a well-defined workflow for processing of listing applications. Generally, this process has a following structure:
1. User creates a new listing application through chaingear-form web interface. After clicking 'Commit changes' button this interface make a HTTP request to chaingear-backend `/create-application` API endpoint. If sent information satisfies requirements, chaingear-backend saves it in projectsInWork collection
2. After that application can be approved or rejected. 
  * In the first case one should make a request to the chaingear-backend `/approve-applications` API endpoint. After recieving a requset, chaingear-backend removes corresponding document from projectsInWork and saves it to the approvedProjects collection. Also, it sends this data to the Github API to save it in Chaingear repo
  * In the second case one should make a request to the chaingear-backend `/reject-applications` API endpoint. After recieving a request, chaingear-backend removes corresponding document from projectsInWork and saves it to the rejectedProjects collection
Note that currently the second step is disabled; but all of this functionality will be added in next release
