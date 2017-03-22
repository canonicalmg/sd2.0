(function($){
    $(function(){



        $('.button-collapse').sideNav();




    }); // end of document ready
})(jQuery); // end of jQuery name space
populate_product();

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

function populate_product(){
    $.ajax({
            type: 'POST',
            url: 'get_product/',
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            data: {},
            success: function (json) {
                $("#routineLoader").hide();
                // for(var i=0; i < json.products.length; i++){
                //     console.log("url = ", json.products[i].small_url);
                //     $("#product_list").append("<img src='"+json.products[i].small_url+"'>");
                // }
                PAGINATION = json.products;
                product_loader_template(PAGINATION);

                back_load_product()
            },
            error: function (json) {
                // $("#createRoutine").show();
                console.log("ERROR", json);
            }
        }
    );
}

function product_loader_template(items){
    $("#product_list").empty();
    for(var i=0; i < items.length; i++){
        $("#product_list").append("<img src='"+items[i].small_url+"'>");
    }
}

function back_load_product(){
    $.ajax({
            type: 'POST',
            url: 'get_product_full/',
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            data: {},
            success: function (json) {
                PAGINATION = json.products;
                load_pagination();
            },
            error: function (json) {
                // $("#createRoutine").show();
                console.log("ERROR", json);
            }
        }
    );
}

function load_pagination(){
    var itemsPerPage = 15;
    var itemLength = PAGINATION.length;
    var pages = Math.ceil(itemLength / itemsPerPage);

    console.log("items per page = ", itemsPerPage);
    console.log("items length = ", itemLength);
    console.log("pages = ", pages);
    $("#pagination").empty();
    $("#pagination").append("<li class='disabled'><a href='#!'><i class='material-icons'>chevron_left</i></a></li>"
                            + "<li onClick='load_page(1)' id='pag1' class='active'><a href='#!'>1</a></li>");
    for(var i=2; i < pages; i++){
        $("#pagination").append("<li onClick='load_page("+ i +")' id='pag"+i+"' class='waves-effect'><a href='#!'>"+i+"</a></li>");
    }
    $("#pagination").append("<li class='waves-effect'><a href='#!'><i class='material-icons'>chevron_right</i></a></li>");
}

function load_page(page){
    console.log("loading page ", page);
    $("li.active").removeClass("active");
    $("#pag"+page).addClass("active");
    var itemsPerPage = 15;
    var items = [itemsPerPage*(page-1), (itemsPerPage*(page))-1];
    // console.log("slice = ", PAGINATION.slice(items[0], items[1]));
    product_loader_template(PAGINATION.slice(items[0], items[1]));
}