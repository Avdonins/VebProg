var main = function(toDoObjects) {
    "use strict";

    var toDos = toDoObjects.map(function(toDo) {
        return toDo.description;
    });

    $(".tabs a span").toArray().forEach(function(element){
        $(element).on("click", function(){
            var $element = $(element), 
            $content;
            
            $(".tabs a span").removeClass("active");
            $element.addClass("active");
            $("main .content").empty();

            if($element.parent().is(":nth-child(1)")){
                $content = $("<ul>");
                for(var i = toDos.length - 1; i > -1; i--){
                    $content.append($("<li>").text(toDos[i]));
                }
                $("main .content").append($content);
            }
            else if($element.parent().is(":nth-child(2)")){
                $content = $("<ul>");
                toDos.forEach(function(todo){
                    $content.append($("<li>").text(todo));
                });
                $("main .content").append($content);
            }
            else if ($element.parent().is(":nth-child(3)")) {
                var organizedByTag = tagOrg(toDoObjects);

                organizedByTag.forEach(function(tag) {

                    var $content = $("<ul>");
                    var $tagName = $("<h3>").text(tag.name);

                    tag.todos.forEach(function(description) {
                        var $li = $("<li>").text(description);
                        $content.append($li);
                    });

                    $("main .content").append($tagName);
                    $("main .content").append($content);
                });
            }
            else if($element.parent().is(":nth-child(4)")){
                var $input = $("<input>").addClass("description"),
                    $inputLabel = $("<p>").text("Новая задача: "),
                    $tagInput = $("<input>").addClass("tags"),
                    $tagLabel = $("<p>").text("Тэги: "),
                    $button = $("<button>").text("+");

                $("main .content").append($inputLabel);
                $("main .content").append($input);
                $("main .content").append($tagLabel);
                $("main .content").append($tagInput);
                $("main .content").append($button);

                $button.on("click", function() {
                    var description = $input.val(),
                        tags = $tagInput.val().split(",");
                    toDoObjects.push({ "description": description, "tags": tags });

                    $.post("todos", {}, function(response){
                        console.log("Мы отправили данные и получили ответ сервера!");
                        console.log(response);
                    });

                    toDos = toDoObjects.map(function(toDo) {
                        return toDo.description;
                    });

                    $input.val("");
                    $tagInput.val("");
                });
            }
            return false;
        });
    });
    $(".tabs a:first-child span").trigger("click");
};

var tagOrg = function(toDoObjects) {
    var tagList = [],
        tagsObject = [];
    toDoObjects.forEach(function(todo) {
        todo.tags.forEach(function(tag) {
            if (tagList.includes(tag)) {
                tagsObject[tagList.indexOf(tag)].todos.push(todo.description);
            } else {
                tagList.push(tag);
                tagsObject.push({ "name": tag, "todos": [todo.description] });
            }
        });
    });
    return tagsObject;
};

$(document).ready(function() {
    $.getJSON("todos.json", function(toDoObjects) {
        main(toDoObjects);
    });
});