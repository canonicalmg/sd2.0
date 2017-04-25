(function($){
    $(function(){
        $('.button-collapse').sideNav();
        $('.carousel').carousel();
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

function remove_requests(){
    for(var i = 0; i < REQUESTS.length; i++) {
        REQUESTS[i].abort();
        REQUESTS.splice( i, 1 );
        console.log("request aborted");

    }
}

function populate_product(){
    $("#product_list").empty();
    $("#routineLoader").show();
    console.log("CALLING POPULATE PRODUCT ON ", CLOTH_TYPE);
    console.log("REQUESTS = ", REQUESTS);
    REQUESTS.push(
        $.ajax({
                type: 'POST',
                url: '/get_outfit_discover/',
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
                    $('.carousel').carousel();
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
    var tag_list = "";
    var brand_list = "";
    var htmlString = "";
    var hasLiked;
    var isFollowing;
    var numLikes;
    var likeString;
    var followString;
    var outfitPictures
    for(var i=0; i < items.length; i++){
        console.log(items[i]);
        tag_list = "";
        brand_list = "";
        htmlString = "";
        likeString = "";
        followString = "";
        outfitPictures = "";
        for(var j=0; j < items[i].tags.length; j++){
            tag_list += "<div class='chip'>"
                +   items[i].tags[j]
                +   "</div>";
        }
        for(var j=0; j < items[i].brands.length; j++){
            brand_list += "<div class='chip'>"
                +   items[i].brands[j]
                +   "</div>";
        }
        hasLiked = items[i].has_liked;
        isFollowing = items[i].is_following;
        numLikes = items[i].num_likes;
        if(hasLiked == true) {
            if (numLikes == 1) {
                likeString = "You like this.";
            }
            else {
                numLikes = numLikes - 1;
                if (numLikes == 1) {
                    likeString = "You and " + numLikes + " person like this.";
                }
                else {
                    likeString = "You and " + numLikes + " people like this.";
                }
            }
        }
        else if(hasLiked == false){
            if(numLikes == 1) {
                likeString = numLikes + " person likes this.";
            }
            else{
                likeString = numLikes + " people like this.";
            }
        }
        if(isFollowing){
            followString ="<a class='waves-effect waves-dark btn' onClick='followClick(this.id)' style='border:1px solid #2bbbad; background-color:#2bbbad; color:white;'>Following</a>";

        }
        else{
            followString = "<a class='waves-effect waves-dark btn' onClick='followClick(this.id)' style='border:1px solid #ff6e66; background-color:white; color:#ff6e66;'>Follow</a>";
        }
        for(var j=0; j < items[i].pictures.length; j++){
            outfitPictures += "<a class='carousel-item' href='#one!'><img src='"+items[i].pictures[j]+"'></a>";
        }
        console.log("hasLiked = ", outfitPictures);
        htmlString += "<div class='row'>"
        +"<div class='card col s12' style='padding-bottom:1%; padding-top:1%;'>"
        +"    <div class='col s12' style='margin-top:5%;'>"
        +"    <div class='col s3' style='float:left; margin-top:-15px; margin-left:-25px;'>"
        +"    <img src='"+items[i].userPhoto+"' alt='' class='circle responsive-img profile-post-uer-image'>"
        +"    </div>"
        +"    <div class='col s5' style='margin-top:-10px; margin-left:-20px;'>"
        +"    <h5 class='grey-text text-darken-4 margin profileUser' style='word-wrap:break-word; margin-bottom:0;'>"+items[i].username+"</h5>"
        +"<span class='grey-text text-darken-1 ultra-small'>"+items[i].location+"</span>"
        +"</div>"
        +"<div class='col s4'>"
        + followString
        +"    </div>"
        +"    </div>"
        +"    <div class='col s12 profileSocialBody'>"
        +"    <div class='col s10'>"
        +"    <div class='col s12 ' style='padding-top:5px;'>"
        +"    <i class='material-icons left socialIcons featuredProfileSocial'>shopping_cart</i>";
        if(hasLiked == true) {
            htmlString += "    <i onClick='likeOutfit(this.id)' class='material-icons left socialIcons featuredProfileSocial'>favorite</i>";
        }
        else{
            htmlString += "    <i onClick='likeOutfit(this.id)' class='material-icons left socialIcons featuredProfileSocial'>favorite_border</i>";
        }
        htmlString += "    <i class='material-icons left socialIcons featuredProfileSocial'>share</i>"
        +"    <i class='material-icons left socialIcons featuredProfileSocial'>comment</i>"
        +"    </div>"
        +"    <div class='col s12 featuredProfileSocial' style='padding-top:5px;'>"
        +"    <span class='left grey-text text-darken-2 ultra-small'>"+likeString+"</span>"
        +"    </div>"
        +"    </div>"
        +"    <div class='col s2'>"
        +"    <i onClick='featuredVert(this.id)'  class='material-icons left socialIcons right'>keyboard_arrow_down</i>"
        +"    </div>"
        +"    </div>"
        +"    <hr>"
        +"    <div class='col s12 center-align'>"
        +" <div class='carousel'>"
                + outfitPictures
        +"</div>"
        +"    </div>"
        +"    <div class='col s12 left-align' style='padding-left:0px;'>"
        +"    <div class='col s12 center-align' style='padding:2%;'>"
        +"    <a href='/outfit/"+items[i].pk+"' class='waves-effect waves-dark btn' style='width:50%; border:1px solid #ff6e66; background-color:white; color:#ff6e66;'>View Outfit</a>"
        +"</div>";
        if(items[i].description.length > 0){
            htmlString += "<div class='col s12'>"
            +"    <p style='margin:0px;padding-left:0px;'>Description: "+items[i].description+"</p>"
            +"</div>"
            +"<br>"
            +"<hr>";
        }

        if(tag_list.length > 0) {
            htmlString += "<div class='col s12'>"
            + "<p style='margin:0px;padding-left:0px;'>Tags:"
            + tag_list
            + "    </p>"
            + "    </div>"
            + "    <hr>";
        }
        if(brand_list.length > 0){
            htmlString += "<div class='col s12'>"
            +"    <p style='margin:0px;padding-left:0px;'>Brands:"
            + brand_list
            + "    </p>"
            +"</div>";
        }
        htmlString += "    </div>"
        +"</div>"
        +"</div>";
        $("#product_list").append(htmlString);
    }
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