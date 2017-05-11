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
var CLOTH_TYPE = "Shirt";
var CLOTH_SUB_TYPE = "All";
var GENDER = document.getElementById('gender_check').checked;
var REQUESTS = [];
populate_product();

function populate_product(){
    $("#profile-page-sidebar").empty();
    $("#routineLoader").show();
    console.log("CALLING POPULATE PRODUCT ON ", CLOTH_TYPE);
    console.log("REQUESTS = ", REQUESTS);
    REQUESTS.push(
        $.ajax({
                type: 'POST',
                url: '/get_product/',
                headers: {
                    "X-CSRFToken": getCookie("csrftoken")
                },
                data: {'cloth_type': CLOTH_TYPE,
                    'cloth_sub_type': CLOTH_SUB_TYPE,
                    'gender': GENDER},
                success: function (json) {
                    console.log("json = ", json);
                    PAGINATION = json.products;
                    product_loader_template(json.products);
                    // load_pagination();
                    // load_page(1);
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
    $("#profile-page-sidebar").empty();
    for(var i=0; i < items.length; i++) {
        var htmlString = "<br>"
            + "<hr>"
            + "<div class='card col s12'>"
            + "<div class='col s12 center-align' style='padding-top:25px;'>"
            + "<img style='height:20%;' src='"+items[i].large_url+"'>"
            + "</div>"
            + "<div class='col s12'>"
            + "<div class='card-content' style='word-wrap: break-word;'>"
            + "<h5>"+items[i].name+"</h5>"
            + "<div class='col s8'>";
        if (items[i].color){
            htmlString += "<p>Color: "+items[i].color+"</p>";
        }
        if (items[i].carrier) {
            htmlString += "<p>Vendor: "+items[i].carrier+"</p>";
        }
        if (items[i].brand) {
            htmlString += "<p>Brand: "+items[i].brand+"</p>";
        }
        htmlString += "</div>"
            + "<div class='col s4'>"
            + "<h5 style='float:right;'>Price: "+items[i].price+"</h5>"
            + "</div>"
            + "</div>"
            + "</div>"
            + "<div class='col s12' style='padding-bottom:15px;'>"
            + "<div class='col s5'>"
            + "<a href='../clothing/"+items[i].pk+"'>"
            + "<button class='btn waves-effect waves-light btn' href='/clothing/"+items[i].pk+"'>"
            + "More"
            + "</button>"
            + "</a>"
            + "</div>"
            + "<div class='col s7'>";
        if (items[i].is_in_cart) {
            htmlString += "<button id='add"+items[i].pk+"' style='border: 1px solid rgb(43, 187, 173); background-color: rgb(43, 187, 173); color: white;' class='btn waves-effect waves-light btn'>"
                + "Item in Cart"
                + "</button>";
        }
        else {
            htmlString += "<button id='add"+items[i].pk+"' class='btn waves-effect waves-light btn'>"
                + "Add to Cart"
                + "</button>";
        }
        htmlString += "</div>"
            + "</div>"
            + "</div>";
        $("#profile-page-sidebar").append(htmlString);
        $("#add"+items[i].pk).click(function(e){
            console.log("e = ", e);
            addToCartSingle(e.target.id.split("add")[1], -1);
        });
    }
}

function remove_requests(){
    for(var i = 0; i < REQUESTS.length; i++) {
        REQUESTS[i].abort();
        REQUESTS.splice( i, 1 );
        console.log("request aborted");

    }
}

function clothingClick(clothingType, subtype){
    console.log("clothing type = ", clothingType);
    console.log("subtype = ", subtype);
    CLOTH_TYPE = clothingType;
    CLOTH_SUB_TYPE = subtype;
    populate_product();
    $("#ShirtsBtn").html("Tops");
    $("#PantsBtn").html("Bottoms");
    $("#ShoesBtn").html("Shoes");
    $("#AccessoriesBtn").html("Accessories");
    console.log("removing teal");
    $(".clothType").removeClass("teal");
    console.log("adding teal");
    $("#"+clothingType+"Btn").addClass("teal");
    console.log("changing name");
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
                console.log("json = ", json);
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
    populate_product();
});