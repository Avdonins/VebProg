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
            else if($element.parent().is(":nth-child(3)")){
                var $input = $("<input>");
                var $button = $("<button>").text("+")
                $button.on("click", function() {
                    toDos.push($input.val());
                    $input.val("");
                });
                $content = $("<div>").append($input).append($button);
                $("main .content").append($content)
            }
            return false;
        });
    });
    $(".tabs a:first-child span").trigger("click");
};

$(document).ready(function() {
    $.getJSON("todos.json", function(toDoObjects) {
        main(toDoObjects);
    });
});