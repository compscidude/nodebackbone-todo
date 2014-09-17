nodebackbone-todo
=================


![Screenshot](http://imgur.com/ugAwA78.png?raw=true)

A classic todo example built using backbone.js, node.js, express.js, twitter bootstrap

This example was purely for learning purposes so you may find bits and pieces that are similar to examples from
the following links:

    http://backbonejs.org/docs/todos.html
    https://github.com/ccoenraets/backbone-jax-cellar/
    

The backend is running node.js with express.js and uses MongoDB via remote database from MongoLab (www.mongolab.com).
Node is set up as RESTful API using CRUD, and our front-end backbone.js is responsible for rendering data and handling events.

To run this on your local machine, please edit line 9 in server.js

Line 9: mongoose.connect('mongodb://user:password@ds035740.mongolab.com:35740/todo');
and locate to your mongoDB  


![Screenshot](http://i.imgur.com/7yJxC7L.png?raw=true)



