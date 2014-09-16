

var express = require('express');
var app = express();
var bodyParser = require('body-parser'); // required to parse body that's coming with the request
var mongoose = require('mongoose');
//connect to our database
mongoose.connect('mongodb://user:password@ds035740.mongolab.com:35740/todo');
app.use(express.static(__dirname + '/public')); //This is a VERY important line, otherwise we will get errors loading javascript files from our html file.
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// define our model (mongoose will automatically create an _id field for us)
var Todo = mongoose.model('Todo', {
	text: String,
	done: Boolean
});

// ==== ROUTES ================================ //

// This is for debugging purpose. You do not need this
/*app.use(function(req, res, next){
	console.log('we got a page request !');
	next();
});*/

// get all the todos from our database
app.get('/api/todos', function(req, res){
	Todo.find(function(err, todos){
		if(err)
			res.send(err)
		// send in a json format
		res.json(todos);
	});	
});

app.get('/api/todos/:todo_id', function(req, res){
	Todo.findById(req.params.todo_id, function(err, todo){
	 	if(err)
	 		res.send("this id does not exist");
	 	res.json(todo);
	})



});

// create a new todo and return all todos (perhaps we can just return the recently added one and append it)
app.post('/api/todos', function(req, res){
	Todo.create({
		// this is why we need body parser !
		text: req.body.text,
		done: false
	}, function(err, todo){
		  if(err)
		  	res.send(err);

		  console.log("Created new todo " + req.body.text);
		  // since we are on the main page, we want to return all the todos again
		  Todo.find(function(err, todos){
		  	 if(err)
		  	 	res.send(err);
		  	 res.json(todos);
		  })
	});

});

// This is how you update one particular todo.
app.put('/api/todos/:todo_id', function(req, res){
	// this holds the information of the todo object.
	var todobody = req.body;
	var todo_id = Todo.find(req.params.todo_id);
	Todo.findById(req.params.todo_id, function(err, todo){
		todo.text = todobody.text;
		todo.done = todobody.done;
		todo.save(function(err){
			if (err)
				res.send(err)
			console.log("todo updated");
		})
	});
	
});

// delete todo
app.delete('/api/todos/:todo_id', function(req, res){
	Todo.remove({
		_id: req.params.todo_id
	}, function(err, todo){
		 if(err)
		 	res.send(err);

		 Todo.find(function(err, todos){
		 	if(err)
		 		res.send(err)

		 	console.log("deleted todo " + req.body.text);
		 	// send the todos again for rendering.
		 	// or if we just send confirmation, then delete it on the client end?
		 	res.json(todos);
		 })
	});

});


// =========== Application ========== (Connecting with our backbone.js front-end) ==== // 

// So anything that is not routed from the above gets automatically dumped into this part of the routing.
app.get('*', function(req, res){
	res.sendfile('./public/index.html'); // load the single page view
});

app.listen(3000);
console.log("Server has started, we're listening to port 3000");




