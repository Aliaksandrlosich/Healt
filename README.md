# Healt
-I did not implement through docker container, the task is optional. If necessary, I can add an image with postgress, and initialisation
The configuration files are in ./config/config.json Specify the path to the database and the table. 
npm run initDatabase - install new table
npm run server - Run server

comments: 
-In the terms of reference, it was not specified which authorisation to do. I made a light copy of jwt (hash generation, access/refresh operation)) the header.payload.signature structure was not added. I store the tokens in the database rather than generating and verifying. Again, I'm not sure it was necessary to make such a mess, so I didn't do it according to "canon".
-The database is generated as simply as possible, with no orm, by simply running it through a pg lib
