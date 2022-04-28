const ToDosController = require("./controllers/todo_controller");
const UsersController = require("./controllers/user_controller");

var express = require("express"),
    http = require("http"),
    mongoose = require("mongoose"),
    app = express();

app.use('/', express.static(__dirname + '/client'));
app.use('/user/:username', express.static(__dirname + '/client'));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost/amazeriffic');
var ToDoSchema = mongoose.Schema({
    description: String,
    tags: [String]
});
var ToDo = mongoose.model("ToDo", ToDoSchema);
http.createServer(app).listen(3000);

app.post("/todos", function(req, res) {
    console.log(req.body);
    var newToDo = new ToDo({"description": req.body.description,
    "tags": req.body.tags});
    newToDo.save(function(err, result){
        if(err !== null){
            console.log(err);
            res.send("ERROR");
        }
        else {
            ToDo.find({}, function(err, result){
                if(err !== null){
                    res.send("ERROR");
                }
                res.json(result);
            });
        }
    });
});


app.get("/todos.json", function(req, res) {
    ToDo.find({}, function(err, toDos){
        try{
            res.json(toDos);
        }
        catch(err) { console.log(err); }
    })
});

app.post("/todos", function(req, res) {
    console.log("Данные были отправлены на сервер");
    res.json({ "message": "Вы размещаетесь на сервере!" })
});

app.get("/user/:username/todos.json", ToDosController.index);
app.post("/user/:username/todos", ToDosController.create);
app.put("/user/:username/todos/:id", ToDosController.update);
app.delete("/user/:username/todos/:id", ToDosController.destroy);

app.get("/users.json", UsersController.index);
app.post("/users", UsersController.create);
app.get("/users/:username", UsersController.show);
app.put("/users/:username", UsersController.update);
app.delete("/users/:username", UsersController.destroy);