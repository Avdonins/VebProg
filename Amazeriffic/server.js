var express = require("express"),
    http = require("http"),
    mongoose = require("mongoose"),
    app = express();

    app.use(express.static(__dirname + "/client"));
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