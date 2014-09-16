
var Todo = Backbone.Model.extend ({
	// we must add idAttribute otherwise, backbone won't send the proper request.
	// '/api/todos/:todo_id' this is how it should be sent to our server when performing delete
	urlRoot: '/api/todos',
	idAttribute: '_id',
	defaults: {
		"text": "",
		"done": false
	},
	toggle: function(){
		this.set('done', !this.get('done'));
		this.save();
		console.log("toggle complete");
	},
	setDone: function(){
		this.set('done', true);
	}
});

var Todos = Backbone.Collection.extend ({
	url: '/api/todos',
	model: Todo,
	getDone: function() {
		return this.where({done: true});
	},
	getNotDone: function(){
		return this.where({done: false});
	},	
	// not being used at the moment
	deleteDone: function() {
		var donetodos = this.getDone();
		_.each(donetodos, function(todo){
			todo.destroy();
		});
	}
});

// high level view, that manages input.
var mainView = Backbone.View.extend({
	el: $('#container'),
	events: {
		"keypress #new-todo" : "newTodo",
		"click #delete_completed" : "clearCompleted",
		"click #select_all" : "selectAll"
		//or we can delete all lists here.
	},
	newTodo: function(e){
		if (e.keyCode != 13) return;
		var userinput = $('#new-todo').val();
		if ( userinput == '') return;
		
		var newTodo = new Todo({"text": userinput, "done" : false});
		// here we want to create a new todo 
		// we know the todoList has a url associated with it.
		app.todoList.create(newTodo, {
			success: function(){
				// if succesful, then we clear the input
				$('#new-todo').val('');
				}
			}
		);	
	},
	// efficient way of deleting members of our collection
	clearCompleted: function(){
		_.invoke(app.todoList.getDone(), 'destroy');
		return false;
	},

	selectAll: function(){
		_.each(app.todoList.getNotDone(), function(todo){
			todo.setDone();
		});
	}
});

var statsView = Backbone.View.extend({
	el: $('#footer'),
	events:{
		"click #delete_completed" : "delete_completed"
	},
	initialize: function(){
		//this.listenTo(app.todoList, 'change', this.render);
		this.template = _.template($('#tmpl-footer').html());
		this.render();
	},
	render: function(){
		$(this.el).html(this.template({'done_total' : app.todoList.getDone().length}));
		return this;
	}
});


// let's create a very simple todo view.
// This is the parent, and the entirity of the view.
var TodoListView = Backbone.View.extend ({
	//el: $("#container")
	tagName: 'ul',
	initialize: function(){
		this.model.bind("reset", this.render, this);
		// if something gets added to our collection, then we re-render
		this.listenTo(app.todoList, 'add', this.addOne);
		this.listenTo(app.todoList, 'change', this.render);
		this.listenTo(app.todoList, 'destroy', this.render);
	}, 
	render: function() {
		// Loops through the entire collection and 
		// creates an individual view for each todo item.
		$(this.el).html("");

		_.each(this.model.models, function(todo){
			$(this.el).append(new TodoItemView({model:todo}).render().el);
		}, this);

		// allows for chaining of views !
		window.statView.render();

		return this;
	},
	addOne: function(todo){
		$(this.el).append(new TodoItemView({model:todo}).render().el);
	}
});

// we only have two views.

var TodoItemView = Backbone.View.extend({
	tagName: 'li',
	events: {
		"click #delete" : "deleteTodo",
		"click #check" : "toggle",
		"dblclick #todo-text" : "edit",
		"blur .edit" : "close",
		"keypress .edit" : "updateOnEnter"

	},
	initialize: function() {
		this.template = _.template($("#tmpl-each-item").html());
		//this.listenTo(this.model, 'destroy', );
	},
	render: function() {
		$(this.el).html(this.template(this.model.toJSON()));
		this.$el.toggleClass('done', this.model.get('done'));
		this.$('input').prop('checked', this.model.get('done'));
		this.input = this.$('.edit');
		return this;
	},
	deleteTodo: function(){
		// we can get this.model which gives reference to the todo that was clicked.
		// since our url is properly set in the todo model, it sends proper delete request
		this.model.destroy({
			success: function(){
				// re-render our list of todos
				app.todoList.trigger('change');
			}
		})
	},
	edit: function(){
		// since we didn't specify el, it is by default our tagName (<li>)
		this.$el.addClass("editing");
		this.input.focus();
	},
	updateOnEnter: function(e){
		if (e.keyCode == 13) this.close();
	},
	close: function(todo) {
		value = this.input.val();
		console.log(this.model);
		this.model.save({"text": value});
		this.$el.removeClass("editing");
	},
	toggle: function(){
		this.model.toggle();
	}

});

var AppRouter = Backbone.Router.extend({

	initialize: function() {
		// we can decide to render some views here
		// maybe add some dynamic content or so.

	},

	routes: {
		"" : "list"
	},

	before: function(callback){
		if (this.todoList) {
			if (callback)
				callback();
		}
		 else {
			// the wine list does not exist !
			this.todoList = new Todos();
			this.todoList.fetch({
				success:function(){
					// this view listens for input (keep global reference)
					// we can instantiate the view here since we only have one page
					window.mainView = new mainView();
					window.statView = new statsView();
					$("#todo-list").html(new TodoListView({model: app.todoList}).render().el);
					// we do the rendering here, since we always want to show a list of todos
					// populate using template
					if(callback)
						callback();
				}
			});
		}
	},

	list: function(){
		// this is simply how we first render the page.
		this.before();
	}, 
});


app = new AppRouter();
Backbone.history.start();


