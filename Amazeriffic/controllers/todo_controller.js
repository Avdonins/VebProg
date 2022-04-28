const User = require("../models/user.js");

var ToDo = require("../models/todo.js"),
    toDosController = {};

toDosController.index = function(req, res){
    console.log("вызвано действие: индекс");
    var username = req.params.username || null,
    respondWithToDos;
    respondWithToDos = function(query){
        ToDo.find(query, function(err, toDos){
            if(err !== null){
                res.json(500, err);
            }
            else {
                res.status(200).json(toDos);
            }
        });
    };
    if(username !== null){
        console.log("Поиск пользователя: " + username);
        User.find({"username": username}, function(err, result){
            if(err !== null){
                res.json(500, err);
            }
            else if(result.length === 0){
                res.status(400).json({"result_length" : 0});
            }
            else {
                respondWithToDos({});
            }
        });
    }
    else {
        res.status(400).json({"username": username});
    }
};

toDosController.create = function(req, res){
    console.log("Вызвано действие: создать");
    res.send(200);
};

toDosController.update = function(req, res){
    console.log("Вызвано действие: обновить");
    res.send(200);
};

toDosController.destroy = function(req, res){
    console.log("Вызвано действие: удалить");
    res.send(200);
};
module.exports = toDosController;