var main = function(toDoObjects) {
    "use strict";

    var toDos = toDoObjects.map(function(toDo) {
        return toDo.description;
    });

    $(".tabs a span").toArray().forEach(function(element) {
        $(element).on("click", function() {

            var $element = $(element),
                $content;

            $(".tabs a span").removeClass("active");
            $element.addClass("active");
            $("main .content").empty();

            if ($element.parent().is(":nth-child(1)")) {

                $content = $("<ul>");
                for (var i = toDos.length - 1; i > -1; i--) {
                    $content.append($("<li>").text(toDos[i]));
                }
                $("main .content").append($content);

            } else if ($element.parent().is(":nth-child(2)")) {

                $content = $("<ul>");
                toDos.forEach(function(todo) {
                    $content.append($("<li>").text(todo));
                });
                $("main .content").append($content);

            } else if ($element.parent().is(":nth-child(3)")) {

                var organizedByTag = tagOrg(toDoObjects);

                organizedByTag.forEach(function(tag) {

                    var $content = $("<ul>");
                    var $tagName = $("<p>").text(tag.name);

                    tag.todos.forEach(function(description) {
                        var $li = $("<li>").text(description);
                        $content.append($li);
                    });

                    $("main .content").append($tagName);
                    $("main .content").append($content);
                });
            } else if ($element.parent().is(":nth-child(4)")) {

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
                    var newToDo = { "description": description, "tags": tags };

                    $.post("todos", newToDo, function(result) {
                        console.log(result);
                        toDoObjects.push(newToDo);
                        toDos = toDoObjects.map(function(toDo) {
                            return toDo.description
                        })
                        $input.val("");
                        $tagInput.val("");
                    })
                });

            }
            return false;
        });
    });
    $(".tabs a:first-child span").trigger("click");
};

var liaWithEditOrDeleteOnClick = function(todo, callback) {
    var $todoListItem = $("<li>").text(todo.description),
        $todoEditLink = $("<a>").attr("href", "todos/" + todo._id),
        $todoRemoveLink = $("<a>").attr("href", "todos/" + todo._id);

    $todoEditLink.addClass("linkEdit");
    $todoRemoveLink.addClass("linkRemove");

    $todoRemoveLink.text("Удалить");
    $todoRemoveLink.on("click", function() {
        $.ajax({
            url: "/todos/" + todo._id,
            type: "DELETE"
        }).done(function(responde) {
            callback();
        }).fail(function(err) {
            console.log("error on delete 'todo'!");
        });
        return false;
    });
    $todoListItem.append($todoRemoveLink);

    $todoEditLink.text("Редактировать");
    $todoEditLink.on("click", function() {
        var newDescription = prompt("Введите новое наименование для задачи", todo.description);
        if (newDescription !== null && newDescription.trim() !== "") {
            $.ajax({
                "url": "/todos/" + todo._id,
                "type": "PUT",
                "data": { "description": newDescription },
            }).done(function(responde) {
                callback();
            }).fail(function(err) {
                console.log("Произошла ошибка: " + err);
            });
        }
        return false;
    });
    $todoListItem.append($todoEditLink);

    return $todoListItem;
}



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
    jQuery.getJSON("todos.json", function(toDoObjects) {
        main(toDoObjects);
    });
});