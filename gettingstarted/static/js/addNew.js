(function($){
    $(function(){



        $('.button-collapse').sideNav();




    }); // end of document ready
})(jQuery); // end of jQuery name space


function getCookie(c_name) {
    if(document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if(c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if(c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "";
}
var csrftoken = getCookie('csrftoken');
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

var PAGINATION = [];
var REQUESTS = [];
var CURRENT_PAGE = 1;
var CLOTH_TYPE = "Shirt";
populate_product();

function populate_product(){
    $("#product_list").empty();
    $("#routineLoader").show();
    console.log("CALLING POPULATE PRODUCT ON ", CLOTH_TYPE);
    console.log("REQUESTS = ", REQUESTS);
    REQUESTS.push(
        $.ajax({
                type: 'POST',
                url: 'get_product/',
                headers: {
                    "X-CSRFToken": getCookie("csrftoken")
                },
                data: {'cloth_type': CLOTH_TYPE},
                success: function (json) {
                    console.log("json = ", json);
                    PAGINATION = json.products;
                    product_loader_template(json.products);
                    load_pagination();
                    load_page(1);
                    $("#loading_paginate").show();
                    $("#routineLoader").hide();
                    back_load_product()
                },
                error: function (json) {
                    // $("#createRoutine").show();
                    console.log("ERROR", json);
                }
            }
        )
    );
}

function product_loader_template(items){
    $("#product_list").empty();
    for(var i=0; i < items.length; i++){
        $("#product_list").append("<img onclick=\"itemClick('" + items[i].item_id + "')\" id='item"+items[i].item_id+"' class='clothItem' src='"+items[i].small_url+"'>");
    }
}

function itemClick(id){
    console.log("clicked ", id);
    for(var i=0; i < PAGINATION.length; i++){
        if (PAGINATION[i].item_id == id){
            console.log("found");
            displayOnCanvas(PAGINATION[i]);
            break;
        }
    }
}

function displayOnCanvas(item){
    if(item.cloth_type == "Shirt"){
        $("#shirt").html("<img class='outfitCanvasItem' id='can"+item.item_id+"' src='"+item.large_url+"'>");
        var scale = 1,
            gestureArea = document.getElementById('shirt'),
            scaleElement = document.getElementById("can"+item.item_id),
            resetTimeout;

        interact(gestureArea)
            .gesturable({
                onstart: function (event) {
                    clearTimeout(resetTimeout);
                    scaleElement.classList.remove('reset');
                },
                onmove: function (event) {
                    scale = scale * (1 + event.ds);

                    scaleElement.style.webkitTransform =
                        scaleElement.style.transform =
                            'scale(' + scale + ')';

                    dragMoveListener(event);
                },
                onend: function (event) {
                }
            })
            .draggable({ onmove: dragMoveListener });
        function dragMoveListener (event) {
            var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            // translate the element
            target.style.webkitTransform =
                target.style.transform =
                    'translate(' + x + 'px, ' + y + 'px)';

            // update the posiion attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }
    }
    else if(item.cloth_type == "Pants"){
        $("#pants").html("<img class='outfitCanvasItem' src='"+item.large_url+"'>");
    }
    else if(item.cloth_type == "Shoes"){
        $("#shoes").html("<img class='outfitCanvasItem' src='"+item.large_url+"'>");
    }
}

function back_load_product(){
    REQUESTS.push(
        $.ajax({
                type: 'POST',
                url: 'get_product_full/',
                headers: {
                    "X-CSRFToken": getCookie("csrftoken")
                },
                data: {'cloth_type': CLOTH_TYPE},
                success: function (json) {
                    console.log("in back_load, json = ", json);
                    PAGINATION = json.products;
                    $("#loading_paginate").show();
                    load_pagination();
                    load_page(1);
                },
                error: function (json) {
                    // $("#createRoutine").show();
                    console.log("ERROR", json);
                }
            }
        )
    );
}

function load_pagination(){
    var itemsPerPage = 15;
    console.log("pagination - ", PAGINATION);
    var itemLength = PAGINATION.length;
    var pages = Math.ceil(itemLength / itemsPerPage);

    console.log("items per page = ", itemsPerPage);
    console.log("items length = ", itemLength);
    console.log("pages = ", pages);
    $("#pagination").empty();
    $("#pagination").append("<li onClick='page_prev()' class='disabled'><a href='#!'><i class='material-icons'>chevron_left</i></a></li>"
                            + "<li onClick='load_page(1)' id='pag1' class='active'><a href='#!'>1</a></li>");
    for(var i=2; i <= pages; i++){
        $("#pagination").append("<li onClick='load_page("+ i +")' id='pag"+i+"' class='waves-effect'><a href='#!'>"+i+"</a></li>");
    }
    $("#pagination").append("<li onClick='page_next()' class='waves-effect'><a href='#!'><i class='material-icons'>chevron_right</i></a></li>");
    $("#loading_paginate").hide();
}

function page_prev(){
    load_page(CURRENT_PAGE-1);
}

function page_next(){
    load_page(CURRENT_PAGE+1);
}

function load_page(page){
    console.log("loading page ", page);
    var itemsPerPage = 15;
    var itemLength = PAGINATION.length;
    var pages = Math.ceil(itemLength / itemsPerPage);

    if (pages >= page){
        if( page > 0) {
            $("li.active").removeClass("active");
            $("#pag"+page).addClass("active");
            CURRENT_PAGE = page;
            var items = [itemsPerPage * (page - 1), (itemsPerPage * (page)) - 1];
            product_loader_template(PAGINATION.slice(items[0], items[1]));
        }
    }
}

function remove_requests(){
    for(var i = 0; i < REQUESTS.length; i++) {
        REQUESTS[i].abort();
        REQUESTS.splice( i, 1 );
        console.log("request aborted");

    }
}

function shirtClick(elem){
    console.log("elem = ", elem);
    CLOTH_TYPE = "Shirt";
    $(".clothType").removeClass("red");
    $("#"+elem).addClass("red");
    remove_requests();
    populate_product();
}

function pantsClick(elem){
    console.log("elem = ", elem);
    CLOTH_TYPE = "Pants";
    $(".clothType").removeClass("red");
    $("#"+elem).addClass("red");
    remove_requests();
    populate_product();
}

function shoesClick(elem){
    console.log("elem = ", elem);
    CLOTH_TYPE = "Shoes";
    $(".clothType").removeClass("red");
    $("#"+elem).addClass("red");
    remove_requests();
    populate_product();
}

