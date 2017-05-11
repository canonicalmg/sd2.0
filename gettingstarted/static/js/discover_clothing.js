(function($){
    $(function(){
        $('.button-collapse').sideNav();
        $('.modal').modal();
        $('input.autocomplete').autocomplete({
            data: BRANDS,
            limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
            onAutocomplete: function(val) {
                populate_product(true);
            },
            minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
        });
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
var CLOTH_TYPE = "Shirt";
var CLOTH_SUB_TYPE = "All";
var GENDER = document.getElementById('gender_check').checked;
var REQUESTS = [];
var PAGINATION = [];
var OFFSET = 0;
populate_product(true);

function populate_product(new_search){
    var offsetVar = OFFSET;
    if(new_search) {
        $("#profile-page-sidebar").empty();
        offsetVar = 0;
    }
    $("#routineLoader").show();

    REQUESTS.push(
        $.ajax({
                type: 'POST',
                url: '/get_product_offset/',
                headers: {
                    "X-CSRFToken": getCookie("csrftoken")
                },
                data: {'cloth_type': CLOTH_TYPE,
                    'cloth_sub_type': CLOTH_SUB_TYPE,
                    'brand': $("#brandSelect").val(),
                    'gender': GENDER,
                    'offset': offsetVar},
                success: function (json) {
                    if(json.products.length == 0){
                        $("#noResults").show();
                    }
                    else{
                        $("#noResults").hide();
                    }
                    if(new_search){
                        PAGINATION = [];
                    }
                    OFFSET = json.offset;
                    var duplicate = false;
                    for(var i=0; i < json.products.length; i++){
                        duplicate = false;
                        for(var j=0; j < PAGINATION.length; j++){
                            if(json.products[i].pk == PAGINATION[j].pk){
                                duplicate = true;
                                break;
                            }
                        }
                        if(!duplicate) {
                            product_loader_template(json.products[i], false);
                            PAGINATION.push(json.products[i])
                        }
                    }


                    $("#loading_paginate").show();
                    // $("#routineLoader").hide();
                    $('.carousel').carousel();
                    if(json.less_than_pagesize){
                        OFFSET = "END";
                        $("#product_loader").hide();
                        $("#routineLoader").hide();
                        return 0;
                    }

                    //end
                    // PAGINATION = json.products;
                    // product_loader_template(json.products);
                    // $("#loading_paginate").show();
                    $("#routineLoader").hide();
                },
                error: function (json) {
                    // $("#createRoutine").show();
                    console.log("ERROR", json);
                }
            }
        )
    );
}

function product_loader_template(items, newSearch){
    if(newSearch){
        $("#profile-page-sidebar").empty();
    }
    var htmlString = "<br>"
        + "<hr>"
        + "<div class='card col s12'>"
        + "<div class='col s12 center-align' style='padding-top:25px;'>"
        + "<img class='responsive-img' style='height:20%;' src='"+items.large_url+"'>"
        + "</div>"
        + "<div class='col s12'>"
        + "<div class='card-content' style='word-wrap: break-word;'>"
        + "<h5>"+items.name+"</h5>"
        + "<div class='col s8'>";
    if (items.color){
        htmlString += "<p>Color: "+items.color+"</p>";
    }
    if (items.carrier) {
        htmlString += "<p>Vendor: "+items.carrier+"</p>";
    }
    if (items.brand) {
        htmlString += "<p>Brand: "+items.brand+"</p>";
    }
    htmlString += "</div>"
        + "<div class='col s4'>"
        + "<h5 style='float:right;'>Price: "+items.price+"</h5>"
        + "</div>"
        + "</div>"
        + "</div>"
        + "<div class='col s12' style='padding-bottom:15px;'>"
        + "<div class='col s12'>";
    if (items.is_in_cart) {
        htmlString += "<button id='add"+items.pk+"' style='margin:1%; width:100%; border: 1px solid rgb(43, 187, 173); background-color: rgb(43, 187, 173); color: white;' class='btn waves-effect waves-light btn'>"
            + "Item in Cart"
            + "</button>"
            + "</div>";
    }
    else {
        htmlString += "<button id='add"+items.pk+"' style='margin:1%; width:100%;' class='btn waves-effect waves-light btn'>"
            + "Add to Cart"
            + "</button>"
            + "</div>";
    }
    if(items.is_in_favorites){
        htmlString += "<div class='col s12'>"
        + "<button id='favorite"+items.pk+"' style='margin:1%; width:100%; border: 1px solid rgb(43, 187, 173); background-color: rgb(43, 187, 173); color: white;' class='btn waves-effect waves-light btn'>"
        + "Item in Favorites"
        + "</button>"
        + "</div>";
    }
    else{
        htmlString += "<div class='col s12'>"
            + "<button id='favorite"+items.pk+"' style='width:100%; margin:1%;' class='btn waves-effect waves-light btn'>"
            + "Add to Favorites"
            + "</button>"
            + "</div>";
    }
    htmlString += "<div class='col s12'>"
        + "<a href='../clothing/"+items.pk+"'>"
        + "<button style='width:100%; margin:1%;' class='btn waves-effect waves-light btn' href='/clothing/"+items.pk+"'>"
        + "More Info"
        + "</button>"
        + "</a>"
        + "</div>"
        + "</div>"
        + "</div>";
    $("#profile-page-sidebar").append(htmlString);
    $("#add"+items.pk).click(function(e){
        addToCartSingle(e.target.id.split("add")[1], -1);
    });
    $("#favorite"+items.pk).click(function(e){
        favoriteItem(e.target.id.split("favorite")[1]);
    });
}

function favoriteItem(id){
    $.ajax({
            type: 'POST',
            url: '/add_to_favorites/',
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            data: {'clothing': id},
            success: function (json) {
                var itemToAdd = $("#favorite" + id);
                if(json == "Added") {
                    itemToAdd.html("Item in Favorites");
                    itemToAdd.css('border', '1px solid rgb(43, 187, 173)');
                    itemToAdd.css('background-color', 'rgb(43, 187, 173)');
                    itemToAdd.css('color', 'white');
                    Materialize.toast('Item added to Favorites', 4000) // 4000 is the duration of the toast
                }
                else if(json == "Removed"){
                    itemToAdd.html("Add to Favorites");
                    itemToAdd.css('border', '');
                    itemToAdd.css('background-color', '');
                    itemToAdd.css('color', '');
                    Materialize.toast('Item removed from Favorites', 4000) // 4000 is the duration of the toast
                }

            },
            error: function (json) {
                // $("#createRoutine").show();
                console.log("ERROR", json);
            }
        }
    )
}


function clothingClick(clothingType, subtype){
    CLOTH_TYPE = clothingType;
    CLOTH_SUB_TYPE = subtype;
    populate_product(true);
    $("#ShirtBtn").html("Tops");
    $("#PantsBtn").html("Bottoms");
    $("#ShoesBtn").html("Shoes");
    $("#FavoritesBtn").html("Favorites");
    $("#AccessoriesBtn").html("Accessories");
    $(".clothType").removeClass("teal");
    $("#"+clothingType+"Btn").addClass("teal");
    $("#"+clothingType+"Btn").html(clothingType + " > " + subtype);
}

function addToCartSingle(clothingKey, outfitKey){
    console.log("clicked");
    $.ajax({
            type: 'POST',
            url: '/add_to_cart_single/',
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            data: {'clothing': clothingKey, 'outfit': outfitKey},
            success: function (json) {
                var itemToAdd = $("#add" + clothingKey);
                itemToAdd.html("Item in Cart");
                if(json == "Added") {
                    itemToAdd.css('border', '1px solid rgb(43, 187, 173)');
                    itemToAdd.css('background-color', 'rgb(43, 187, 173)');
                    itemToAdd.css('color', 'white');
                    Materialize.toast('Item added to cart', 4000) // 4000 is the duration of the toast
                }
                else if(json == "Removed"){
                    itemToAdd.css('border', '');
                    itemToAdd.css('background-color', '');
                    itemToAdd.css('color', '');
                    Materialize.toast('Outfit removed from cart', 4000) // 4000 is the duration of the toast
                }

            },
            error: function (json) {
                // $("#createRoutine").show();
                console.log("ERROR", json);
            }
        }
    )
}

$("#gender_check").change(function() {
    GENDER = this.checked;
    populate_product(true);
});

function signOut(){
    $.ajax({
        type:"GET",
        url:"/logout",
        headers : {
            "X-CSRFToken": getCookie("csrftoken")
        },
        success: function(data){
            window.location.replace("/");
        }
    });
}

function throttle(func, wait) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        if (!timeout) {
            // the first time the event fires, we setup a timer, which
            // is used as a guard to block subsequent calls; once the
            // timer's handler fires, we reset it and create a new one
            timeout = setTimeout(function() {
                timeout = null;
                func.apply(context, args);
            }, wait);
        }
    }
}

$(window).scroll(throttle(function (event) {
    if(OFFSET != "END") {
        var scroll = $(window).scrollTop();
        if (scroll >= $(window).height() / 2) {
            console.log("in half");
            populate_product(false);
        }
    }
    // Do something
},3000));

// $('#brandSelect').bind("enterKey",function(e){
//     //do stuff here
//     console.log("entered");
//     populate_product(true);
// });
// $('#brandSelect').keyup(function(e){
//     if(e.keyCode == 13)
//     {
//         $(this).trigger("enterKey");
//     }
// });

// $("#brandSelect").focusout(function(e){
//     console.log("focusout");
//     populate_product(true);
// });