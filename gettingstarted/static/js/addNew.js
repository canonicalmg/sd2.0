(function($){
    $(function(){
        $('.button-collapse').sideNav();
        $('.modal').modal();
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
var HAMMERS = [];
var CURRENT_PAGE = 1;
var CLOTH_TYPE = "Shirt";
var GENDER = document.getElementById('gender_check').checked;
var TAG_LIST = [];
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
                data: {'cloth_type': CLOTH_TYPE,
                        'gender': GENDER},
                success: function (json) {
                    console.log("json = ", json);
                    PAGINATION = json.products;
                    product_loader_template(json.products);
                    load_pagination();
                    load_page(1);
                    $("#loading_paginate").show();
                    $("#routineLoader").hide();
                    // back_load_product()
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
            openItemModal(PAGINATION[i]);
            break;
        }
    }
}

function openItemModal(item){
    return swal({   title: "Add this item?",
                text: "Price: " + item.price +
                "<br>Vendor: "+item.carrier+ "" +
                "<br>Brand: "+item.brand,
                imageUrl:item.large_url,
                html:true,
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                cancelButtonText: "No!",
                confirmButtonText: "Yes!",
                closeOnConfirm: false,
                closeOnCancel: true },
            function(isConfirm){
                if (isConfirm) {
                    swal("Added!", "Feel free to move the item around and pinch to resize.", "success");
                    displayOnCanvas(item);
                }
                else {
                    swal("Cancelled", "Your imaginary file is safe :)", "error");   }
            });
}

function displayOnCanvas(item){
    var max_pos_y, max_pos_x, transform;
    if(item.cloth_type == "Shirt"){
        $("#shirt").append("<img class='outfitCanvasItem' style='position:absolute;' id='can"+item.item_id+"' src='"+item.large_url+"'>");
        max_pos_y = document.getElementById('addNewBody').clientHeight * .45;
        max_pos_x = document.getElementById('addNewBody').clientWidth * .5;
        transform = "translate3d(-"+max_pos_x+"px, -"+max_pos_y+"px, 0) "
            + "scale3d(0.35, 0.35, 1)";
    }
    else if(item.cloth_type == "Pants"){
        $("#shirt").append("<img class='outfitCanvasItem' style='position:absolute;' id='can"+item.item_id+"' src='"+item.large_url+"'>");
        max_pos_y = document.getElementById('addNewBody').clientHeight * .15;
        max_pos_x = document.getElementById('addNewBody').clientWidth / 2;
        transform = "translate3d(-"+max_pos_x+"px, -"+max_pos_y+"px, 0) "
            + "scale3d(0.5, 0.5, 1)";
    }
    else if(item.cloth_type == "Shoes"){
        $("#shirt").append("<img class='outfitCanvasItem' style='position:absolute;' id='can"+item.item_id+"' src='"+item.large_url+"'>");
        max_pos_y = document.getElementById('addNewBody').clientHeight * .3;
        max_pos_x = document.getElementById('addNewBody').clientWidth * .4;
        transform = "translate3d(-"+max_pos_x+"px, "+max_pos_y+"px, 0) "
            + "scale3d(0.3, 0.3, 1)";
    }


    document.getElementById("can"+item.item_id).style.WebkitTransform = transform;

    //remove any items with the same item type (?) //what if the user wants multiple shirts?
    for(var i=0; i < HAMMERS.length; i++){
        if(HAMMERS[i][1] == item.cloth_type){
            //remove this item
            try {
                var element = document.getElementById(HAMMERS[i][0]);
                element.outerHTML = "";
                delete element;
            }
            catch(a){
                console.log("pass");
            }
            HAMMERS.splice(i, 1);
        }
    }
    hammerIt(document.getElementById("can"+item.item_id));
    var large_url = "";
    var carrier = "";
    for(var j=0; j < PAGINATION.length; j++){
        if (PAGINATION[j].item_id == item.item_id){
            console.log("ajax found");
            large_url = PAGINATION[j].large_url;
            carrier = PAGINATION[j].carrier;
            break;
        }
    }
    HAMMERS.push(["can"+item.item_id, item.cloth_type, large_url, carrier]);
    if(HAMMERS.length > 0){
        $("#submitBtn").fadeIn();
        window.scrollTo(0,document.body.scrollHeight);
    }
    else{
        $("#submitBtn").fadeOut();
    }

}

var top_index = 1;
function hammerIt(elm) {
    hammertime = new Hammer(elm, {});
    hammertime.get('pinch').set({
        enable: true
    });
    var curTransform = new WebKitCSSMatrix(window.getComputedStyle(elm).webkitTransform);
    console.log("cur trans = ", curTransform);
    var posX = curTransform.e,
        posY = curTransform.f,
        scale = curTransform.a,
        last_scale = curTransform.a,
        last_posX = curTransform.e,
        last_posY = curTransform.f,
        max_pos_x = 0,
        max_pos_y = 0,
        transform = "",
        el = elm;
    top_index = top_index + 1;
    el.style.zIndex = top_index;
    // var static_height = 368;
    // var static_width = 394;
    // var client_height;
    // var client_width;

    hammertime.on('doubletap pan pinch panend pinchend', function(ev) {
        if (ev.type == "doubletap") {
            Hammer(el,{prevent_default: true});
            el.remove();
            transform =
                "translate3d(0, 0, 0) " +
                "scale3d(0.5, 0.5, 1) ";
            scale = 0.5;
            last_scale = 0.5;
            try {
                if (window.getComputedStyle(el, null).getPropertyValue('-webkit-transform').toString() != "matrix(1, 0, 0, 1, 0, 0)") {
                    transform =
                        "translate3d(0, 0, 0) " +
                        "scale3d(0.5, 0.5, 1) ";
                    scale = 0.5;
                    last_scale = 0.5;
                }
            } catch (err) {}
            el.style.WebkitTransform = transform;
            transform = "";
        }

        console.log("top = ", top_index);
        top_index = top_index + 1;
        el.style.zIndex = top_index;
        console.log("top = ", top_index);
        //pan
        // client_height = document.getElementById('addNewBody').clientHeight;
        // client_width = document.getElementById('addNewBody').clientWidth;
        // last_posX = last_posX * (client_width / static_width);
        // last_posY = last_posY * (client_height / static_height);
        posX = last_posX + ev.deltaX;
        posY = last_posY + ev.deltaY;

        // posX = posX * (client_width / static_width);
        // posY = posY * (client_height / static_height);
        // console.log("client height = ", document.getElementById('addNewBody').clientHeight);
        // console.log("client width = ", document.getElementById('addNewBody').clientWidth);
        max_pos_y = document.getElementById('addNewBody').clientHeight * .45;
        max_pos_x = document.getElementById('addNewBody').clientWidth * .45;
        // console.log("pos x = ", posX);
        // console.log("max_pos_x = ", max_pos_x);
        if (posX > max_pos_x * 0.1) {
            posX = max_pos_x * 0.1;
        }
        if (posX < -max_pos_x * 2.2) { //left
            posX = -max_pos_x * 2.2;
        }
        if (posY > max_pos_y * 1.1) { //bottom
            posY = max_pos_y * 1.1;
        }
        if (posY < -max_pos_y * 1.9) { //top, plus goes up
            posY = -max_pos_y * 1.9;
        }


        //pinch
        if (ev.type == "pinch") {
            scale = Math.max(.3, Math.min(last_scale * (ev.scale), 0.7));
        }
        if(ev.type == "pinchend"){last_scale = scale;}

        //panend
        if(ev.type == "panend"){
            last_posX = posX < max_pos_x ? posX : max_pos_x;
            last_posY = posY < max_pos_y ? posY : max_pos_y;
        }
        transform =
            "translate3d(" + posX + "px," + posY + "px, 0) " +
            "scale3d(" + scale + ", " + scale + ", 0.5)";

        if (transform) {
            el.style.WebkitTransform = transform;
        }
    });
}

function submit_outfit(){
    var items = [];
    var transformList = [];
    var zIndex;
    for(var i=0; i < HAMMERS.length; i++){
        var currentItem = $("#"+HAMMERS[i][0])[0];
        var curTransform = new WebKitCSSMatrix(window.getComputedStyle(currentItem).webkitTransform);
        console.log("curtransform = ", curTransform);
        console.log("cur a ", curTransform.a);
        console.log("cur b ", curTransform.b);
        transformList = [];
        transformList.push(curTransform.a);
        transformList.push(curTransform.b);
        transformList.push(curTransform.c);
        transformList.push(curTransform.d);
        transformList.push(curTransform.e);
        transformList.push(curTransform.f);
        transformList.push(curTransform.m11);
        transformList.push(curTransform.m12);
        transformList.push(curTransform.m13);
        transformList.push(curTransform.m14);
        transformList.push(curTransform.m21);
        transformList.push(curTransform.m22);
        transformList.push(curTransform.m23);
        transformList.push(curTransform.m24);
        transformList.push(curTransform.m31);
        transformList.push(curTransform.m32);
        transformList.push(curTransform.m33);
        transformList.push(curTransform.m34);
        transformList.push(curTransform.m41);
        transformList.push(curTransform.m42);
        transformList.push(curTransform.m43);
        transformList.push(curTransform.m44);

        zIndex = currentItem.style.zIndex;

        items.push({"item_id": currentItem.id.split("can")[1],
                    "transform": transformList,
                    "zIndex": zIndex,
                    "type": HAMMERS[i][1],
                    "large_url": HAMMERS[i][2],
                    "carrier": HAMMERS[i][3]});
    }

    console.log("ITEMS = ", items);
    //gather outfit name(?), items, gender, etc
    var checkbox = document.getElementById('gender_check');
    var caption = $("#caption_field");
    var tags = $(".chip");
    var tagList = [];
    console.log("tags = ", $(".materialize-tags").materialtags('items'));
    if($(".materialize-tags").length > 0) {
        tagList = $(".materialize-tags").materialtags('items')[1];
    }
    // for(var i=0; i < tags.length; i++){
    //     console.log(tags[i]);
    //     tagList.push(tags[i].innerHtml());
    // }
    console.log("caption = ", caption.val());
    console.log("tag = ", tagList);
    //ajax post
    var data = {"items": items,
                'gender': checkbox.checked,
                'caption': caption.val(),
                'tag': TAG_LIST.split(","),
                'canvasHeight': document.getElementById("addNewBody").clientHeight,
                'canvasWidth': document.getElementById("addNewBody").clientWidth};
    $.ajax({
            type: 'POST',
            url: 'user_submit_outfit/',
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            data: {'data[]': JSON.stringify(data)},
            success: function (json) {
                //if not logged in
                //success
                console.log("success, ", json);
                $("#addNewButtonGroup").hide();
                $("#addNewAfterSuccess").show();
                $(".task-card-title").html("Success");
                $("#userTitle").show();
                for(var i=0; i < items.length; i++){
                    load_outfit($("#shirt"), items[i]);
                }
                //load tags
                var splitTags = TAG_LIST.split(",");
                var tagList = "";
                for(var i=0; i < splitTags.length; i++){
                    tagList += "<div class='chip'>"+splitTags[i]+"</div>";
                }
                $("#newTags").html(tagList);
                $('#modal1').modal('close');
                swal("Good job!", "You have created your outfit!", "success")
            },
            error: function (json) {
                // $("#createRoutine").show();
                console.log("ERROR", json);
            }
        }
    );
    console.log("after saving");
}

function load_outfit(whereToAdd, whatToAdd){
    //remove existing
    $("#can"+whatToAdd.item_id).remove();
    //add new
    whereToAdd.append("<img class='outfitCanvasItem' style='position:absolute;' id='fixed"+whatToAdd.item_id+"' src='"+whatToAdd.large_url+"'>");
    //change transform
    var curTransform = new WebKitCSSMatrix();
    curTransform.a = whatToAdd.transform[0];
    curTransform.b = whatToAdd.transform[1];
    curTransform.c = whatToAdd.transform[2];
    curTransform.d = whatToAdd.transform[3];
    curTransform.e = whatToAdd.transform[4];
    curTransform.f = whatToAdd.transform[5];
    curTransform.m11 = whatToAdd.transform[6];
    curTransform.m12 = whatToAdd.transform[7];
    curTransform.m13 = whatToAdd.transform[8];
    curTransform.m14 = whatToAdd.transform[9];
    curTransform.m21 = whatToAdd.transform[10];
    curTransform.m22 = whatToAdd.transform[11];
    curTransform.m23 = whatToAdd.transform[12];
    curTransform.m24 = whatToAdd.transform[13];
    curTransform.m31 = whatToAdd.transform[14];
    curTransform.m32 = whatToAdd.transform[15];
    curTransform.m33 = whatToAdd.transform[16];
    curTransform.m34 = whatToAdd.transform[17];
    curTransform.m41 = whatToAdd.transform[18];
    curTransform.m42 = whatToAdd.transform[19];
    curTransform.m43 = whatToAdd.transform[20];
    curTransform.m44 = whatToAdd.transform[21];

    document.getElementById("fixed"+whatToAdd.item_id).style.zIndex = whatToAdd.zIndex;
    document.getElementById("fixed"+whatToAdd.item_id).style.WebkitTransform = curTransform;
    if (window.getComputedStyle(document.body).mixBlendMode !== undefined)
        $(".outfitCanvasItem").addClass("curtain");
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
    $(".clothType").removeClass("teal");
    $("#"+elem).addClass("teal");
    remove_requests();
    populate_product();
}

function pantsClick(elem){
    console.log("elem = ", elem);
    CLOTH_TYPE = "Pants";
    $(".clothType").removeClass("teal");
    $("#"+elem).addClass("teal");
    remove_requests();
    populate_product();
}

function shoesClick(elem){
    console.log("elem = ", elem);
    CLOTH_TYPE = "Shoes";
    $(".clothType").removeClass("teal");
    $("#"+elem).addClass("teal");
    remove_requests();
    populate_product();
}

$("#gender_check").change(function() {
    GENDER = this.checked;
    populate_product();
});

$('#tag_list').on('change', function (event)
{
    var $element   = $(event.target),
        $container = $element.closest('.example');

    if (!$element.data('materialtags'))
    {
        return;
    }

    var val = $element.val();
    if (val === null)
    {
        val = "null";
    }
    console.log("val = ", val);
    TAG_LIST = val;
    // $('code', $('pre.val', $container)).html(($.isArray(val) ? JSON.stringify(val) : "\"" + val.replace('"', '\\"') + "\""));
    // $('code', $('pre.items', $container)).html(JSON.stringify($element.materialtags('items')));

}).trigger('change');

if( /Android|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
    // if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $("#visitApp").hide();
    console.log("is app, hiding");
}
else{
    $("#visitApp").show();
    console.log("is not app, showing");
}


