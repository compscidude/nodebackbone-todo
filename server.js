<!DOCTYPE html>
<html>

<head>
    <title> Socket.io Chat application </title>
    <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/jquery-ui-bootstrap/0.5pre/assets/css/bootstrap.min.css">

    <link href="css/style.css" rel="stylesheet">
</head>Skip to content This repository Search Pull requests Issues Gist @compscidude Sign out Unwatch 1 Star 0 Fork 0 compscidude/nodebackbone-todo Code Issues 0 Pull requests 0 Projects 0 Wiki Pulse Graphs Settings Branch: master Find file Copy pathnodebackbone-todo/server.js 62fdb9f on Sep 17, 2014 @compscidude compscidude initial commit 1 contributor RawBlameHistory 121 lines (93 sloc) 3 KB var express = require('express'); var app = express(); var bodyParser = require('body-parser'); // required to parse body that's coming with the request var mongoose = require('mongoose'); //connect to our database mongoose.connect('mongodb://user:password@ds035740.mongolab.com:35740/todo'); app.use(express.static(__dirname + '/public')); //This is a VERY important line, otherwise we will get errors loading javascript files from our html file. app.use(bodyParser.urlencoded({extended: true})); app.use(bodyParser.json()); // define our model (mongoose will automatically create an _id field for us) var Todo = mongoose.model('Todo', { text: String, done: Boolean }); // ==== ROUTES ================================ // // This is for debugging purpose. You do not need this /*app.use(function(req, res, next){ console.log('we got a page request !'); next(); });*/ // get all the todos from our database app.get('/api/todos', function(req, res){ Todo.find(function(err, todos){ if(err) res.send(err) // send in a json format res.json(todos); }); }); app.get('/api/todos/:todo_id', function(req, res){ Todo.findById(req.params.todo_id, function(err, todo){ if(err) res.send("this id does not exist"); res.json(todo); }) }); // create a new todo and return all todos (perhaps we can just return the recently added one and append it) app.post('/api/todos', function(req, res){ Todo.create({ // this is why we need body parser ! text: req.body.text, done: false }, function(err, todo){ if(err) res.send(err); console.log("Created new todo " + req.body.text); // since we are on the main page, we want to return all the todos again Todo.find(function(err, todos){ if(err) res.send(err); res.json(todos); }) }); }); // This is how you update one particular todo. app.put('/api/todos/:todo_id', function(req, res){ // this holds the information of the todo object. var todobody = req.body; var todo_id = Todo.find(req.params.todo_id); Todo.findById(req.params.todo_id, function(err, todo){ todo.text = todobody.text; todo.done = todobody.done; todo.save(function(err){ if (err) res.send(err) console.log("todo updated"); }) }); }); // delete todo app.delete('/api/todos/:todo_id', function(req, res){ Todo.remove({ _id: req.params.todo_id }, function(err, todo){ if(err) res.send(err); Todo.find(function(err, todos){ if(err) res.send(err) console.log("deleted todo " + req.body.text); // send the todos again for rendering. // or if we just send confirmation, then delete it on the client end? res.json(todos); }) }); }); // =========== Application ========== (Connecting with our backbone.js front-end) ==== // // So anything that is not routed from the above gets automatically dumped into this part of the routing. app.get('*', function(req, res){ res.sendfile('./public/index.html'); // load the single page view }); app.listen(3000); console.log("Server has started, we're listening to port 3000"); Contact GitHub API Training Shop Blog About © 2017 GitHub, Inc. Terms Privacy Security Status Help

<!-- This is all it takes to get the client set up -->
<!-- And gives access to the global io() -->
<script src="/socket.io/socket.io.js"></script>
<script src="/app.js"></script>

<body>

    <a href="https://github.com/compscidude/nodesocket-chatapp"><img style="position: absolute; top: 0; left: 0; border: 0;" src="https://camo.githubusercontent.com/567c3a48d796e2fc06ea80409cc9dd82bf714434/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_left_darkblue_121621.png"></a>


    <div class="container-fluid fluid top30">


        <div class="row-fluid">
            <div class="row page-header text-center">
                <h1> Node.js + Socket.io v1.0
                    <br> Chat application </h1>
                <small> With Backbone.js </small>
            </div>

            <div class="row span8 offset1">
                <div id="userCount"></div>
            </div>

            <div id="chatarea" class="span8 offset1">
                <div id="chat" class="chatwindow">
                    <div id="chatmessages"> </div>
                </div>
                <input id="chat_input" class="row-fluid span12 top5" type="text" placeholder="Type here to chat"> </input>
            </div>

            <div class="span2">
                <div id="sideBar">
                    You are in room: <span id="channel" style="color: orange"> </span>
                    <div id="usersOnline"> </div>
                    <div id="chatRooms">
                        <p class="text-success"> Chatrooms </p>
                        <div id="chatRoomsList"></div>
                        <input id="chatroom_input" class="span12" type="text" placeholder="Create a new chatroom"> </input>
                    </div>
                </div>
            </div>
        </div>



        <!-- Private Message Modal -->
        <div class="modal fade" style="display: none" id="myModal">
            <div class="modal-header">
                <a class="close" data-dismiss="modal">×</a>
                <h3>Private Message</h3>
            </div>

            <div class="modal-body">
                <p style="float:left"> To: </p> <label id="msg_to"></label>
                <label id="msg_to_id" style="display:none"></label>
                <label id="msg_from" style="clear: both"></label>
                <label id="messagebox"> Message </label>
                <textarea rows="9" class="span5" id="privateMessage"> </textarea>
            </div>
            <div class="modal-footer">
                <a href="#" class="btn" data-dismiss="modal">Close</a>
                <a href="#" id="send" class="btn btn-primary">Send</a>
            </div>
        </div>

        <!-- closes off the main row fluid -->
    </div>

    <!-- closes off the container -->
    </div>


    <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js"></script>
    <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js"></script>
    <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.2.0/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.2.0/js/modal.js"></script>
    <link href="//fonts.googleapis.com/css?family=Gloria+Hallelujah:400" rel="stylesheet" type="text/css">


    <script>
    </script>

</body>

</html>
