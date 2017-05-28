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
$(document).ready(function(){
    $('ul.tabs').tabs({'swipeable': true});
});
var POPULAR_CURRENT = 0;
populateSections();
// loadProfileOptions();

function followClick(dom_id){
    var domObject = $("#"+dom_id);
    $.ajax({
            type: 'POST',
            url: '/follow_user/',
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            data: {'user':dom_id.split("follow")[1]},
            success: function (json) {
                console.log("json = ", json);
                if(json == "Follow"){
                    //add is_follow=True to all outfits of this user
                    // setUserFollowUnfollow(currentUser.user_id, true);
                    domObject.text("Following");
                    domObject.css('color', 'white');
                    domObject.css('background-color', '#2bbbad');
                    domObject.css('border', '1px solid #2bbbad');
                    $("#profileFollowers").html(parseInt($("#profileFollowers").html()) + 1);

                }
                else if(json == "Unfollow"){
                    // setUserFollowUnfollow(currentUser.user_id, false);
                    domObject.text("Follow");
                    domObject.css('color', '#ff6e66');
                    domObject.css('background-color', 'white');
                    domObject.css('border', '1px solid #ff6e66');
                    $("#profileFollowers").html(parseInt($("#profileFollowers").html()) - 1);
                }
                else if(json == "Not Logged In"){
                    //tell user they are not logged in
                    Materialize.toast("You must be logged in to do that.", 2000);
                }

            },
            error: function (json) {
                // $("#createRoutine").show();
                console.log("ERROR", json);
            }
        }
    )
}

function popularNext(){
    POPULAR_CURRENT += 1;
    $("#popular").empty();
    load_user("popular",
        POPULAR[POPULAR_CURRENT % POPULAR.length].user,
        POPULAR[POPULAR_CURRENT % POPULAR.length].liked,
        POPULAR[POPULAR_CURRENT % POPULAR.length].total_likes);

    for(var i=0; i < POPULAR[POPULAR_CURRENT % POPULAR.length].outfit.length; i++ ){
        load_outfit($("#popular"),
            POPULAR[POPULAR_CURRENT % POPULAR.length].outfit[i],
            POPULAR[POPULAR_CURRENT % POPULAR.length].outfit_pk,
            "popular");
    }
    loadTags("popular", POPULAR[POPULAR_CURRENT % POPULAR.length].tags);
}

function popularPrev(){
    if(POPULAR_CURRENT > 0) {
        POPULAR_CURRENT -= 1;
    }
    $("#popular").empty();
    load_user("popular",
        POPULAR[POPULAR_CURRENT % POPULAR.length].user,
        POPULAR[POPULAR_CURRENT % POPULAR.length].liked,
        POPULAR[POPULAR_CURRENT % POPULAR.length].total_likes);
    for(var i=0; i < POPULAR[POPULAR_CURRENT % POPULAR.length].outfit.length; i++ ){
        load_outfit($("#popular"),
            POPULAR[POPULAR_CURRENT % POPULAR.length].outfit[i],
            POPULAR[POPULAR_CURRENT % POPULAR.length].outfit_pk,
            "popular");
    }
    loadTags("popular", POPULAR[POPULAR_CURRENT % POPULAR.length].tags);

}

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

function loadTags(trey, tag_list){
    var tagList = "";
    for(var i=0; i < tag_list.length; i++){
        tagList += "<div class='chip'>"+tag_list[i]+"</div>";
    }
    $("#"+trey+"Tags").html(tagList);
}

function populateSections(){
    console.log("popular = ", POPULAR);
    if(POPULAR.length > 0) {
        load_user("popular",
            POPULAR[0].user,
            POPULAR[0].liked,
            POPULAR[0].total_likes);
        for (var i = 0; i < POPULAR[0].outfit.length; i++) {
            load_outfit($("#popular"),
                POPULAR[0].outfit[i],
                POPULAR[0].outfit_pk,
                "popular");
        }
        loadTags("popular", POPULAR[0].tags);
    }
}

function load_user(trey, item, liked, total_likes){
    console.log("item location = ", item.location);
    console.log("trey = ", trey);
    $("#"+trey+"ProfileLoc").text(item.location);
    $("#"+trey+"ProfileImg").attr("src", item.profile_img);
    $("#"+trey+"ProfileUser").html("<a href='/user/"+item.user_id+"'>"+item.username+"</a>");
    if(liked == true){
        $("#"+trey+"Like").html('favorite');
        console.log("total likes = ", typeof(total_likes));
        if(total_likes == 1){
            $("#" + trey + "LikeComment").html("You like this.");
        }
        else {
            total_likes = total_likes - 1;
            if(total_likes == 1){
                $("#" + trey + "LikeComment").html("You and " + total_likes + " person like this.");
            }
            else {
                $("#" + trey + "LikeComment").html("You and " + total_likes + " people like this.");
            }
        }
    }
    else if(liked == false){
        $("#"+trey+"Like").html('favorite_border');
        if(total_likes == 1) {
            $("#" + trey + "LikeComment").html(total_likes + " person likes this.");
        }
        else{
            $("#" + trey + "LikeComment").html(total_likes + " people like this.");
        }
    }
    var domObject = $("#"+trey+"Follow");
    if(item.is_self){
        domObject.hide();
    }
    else{
        domObject.show();
    }
    if(item.is_following == true){
        domObject.text("Following");
        domObject.css('color', 'white');
        domObject.css('background-color', '#2bbbad');
        domObject.css('border', '1px solid #2bbbad');
    }
    else if(item.is_following == false){
        domObject.text("Follow");
        domObject.css('color', '#ff6e66');
        domObject.css('background-color', 'white');
        domObject.css('border', '1px solid #ff6e66');
    }
}

function popularVert(id){
    $(".popularProfileSocial").toggle();
    if ($(".popularProfileSocial").is(':hidden')) {
        $("#"+id).html('keyboard_arrow_up');
    }
    else{
        $("#"+id).html('keyboard_arrow_down');
    }
}

function load_outfit(whereToAdd, whatToAdd, outfit, trey){
    //remove existing
    $('#fixed'+trey+outfit+"o"+whatToAdd.pk).remove();
    //add new
    whereToAdd.append("<img class='outfitCanvasItem' style='position:absolute;' id='fixed"+trey+outfit+"o"+whatToAdd.pk+"' src='"+whatToAdd.large_url+"'>");
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


    document.getElementById("fixed"+trey+outfit+"o"+whatToAdd.pk).style.zIndex = whatToAdd.zIndex;
    document.getElementById("fixed"+trey+outfit+"o"+whatToAdd.pk).style.WebkitTransform = curTransform;
    if (window.getComputedStyle(document.body).mixBlendMode !== undefined)
        $(".outfitCanvasItem").addClass("curtain");

}

function showViewableOptions(){
    $(".viewableTab").fadeIn();
    $(".settingsTab").hide();
    $(".paymentTab").hide();
}

function showSettingsOptions(){
    $(".viewableTab").hide();
    $(".paymentTab").hide();
    $(".settingsTab").fadeIn();
}

function showPaymentOptions(){
    $(".viewableTab").hide();
    $(".settingsTab").hide();
    $(".paymentTab").fadeIn();
}

function loadProfileOptions() {
    if(CURRENT_PROFILE_JSON.fullName != null){
        $("#fullName").val(CURRENT_PROFILE_JSON.fullName);
        $("#fullNameLabel").addClass('active');
    }
    if(CURRENT_PROFILE_JSON.email != null){
        $("#email").val(CURRENT_PROFILE_JSON.email);
        $("#emailLabel").addClass('active');
    }
    if(CURRENT_PROFILE_JSON.location != null){
        $("#location").val(CURRENT_PROFILE_JSON.location);
        $("#locationLabel").addClass('active');
    }
    if(CURRENT_PROFILE_JSON.description != null){
        $("#description").val(CURRENT_PROFILE_JSON.description);
        $("#descriptionLabel").addClass('active');
    }
}

function getProfileSave(){
    var fullName = $("#fullName").val();
    var email = $("#email").val();
    var location = $("#location").val();
    var description = $("#description").val();
    var gender = $("#gender").is(":checked");
    var displayFullName = $("#displayFullName").is(":checked");
    var displayGender = $("#displayGender").is(":checked");
    var displayJoinedDate = $("#displayJoinedDate").is(":checked");
    var displayEmail = $("#displayEmail").is(":checked");
    var displayWebsite = $("#displayWebsite").is(":checked");
    var displayLocation = $("#displayLocation").is(":checked");
    var displayDescription = $("#displayDescription").is(":checked");

    var dataToSend = {};

    if(fullName != CURRENT_PROFILE_JSON.fullName){
        dataToSend['fullName'] = fullName;
    }
    if(email != CURRENT_PROFILE_JSON.email){
        dataToSend['email'] = email;
    }
    if(location != CURRENT_PROFILE_JSON.location){
        dataToSend['location'] = location;
    }
    if(description != CURRENT_PROFILE_JSON.description){
        dataToSend['description'] = description;
    }
    if(description != CURRENT_PROFILE_JSON.gender){
        dataToSend['gender'] = gender;
    }
    if(displayFullName != CURRENT_PROFILE_JSON.displayFullName){
        dataToSend['displayFullName'] = displayFullName;
    }
    if(displayGender != CURRENT_PROFILE_JSON.displayGender){
        dataToSend['displayGender'] = displayGender;
    }
    if(displayFullName != CURRENT_PROFILE_JSON.displayFullName){
        dataToSend['displayFullName'] = displayFullName;
    }
    if(displayJoinedDate != CURRENT_PROFILE_JSON.displayJoinedDate){
        dataToSend['displayJoinedDate'] = displayJoinedDate;
    }
    if(displayEmail != CURRENT_PROFILE_JSON.displayEmail){
        dataToSend['displayEmail'] = displayEmail;
    }
    if(displayWebsite != CURRENT_PROFILE_JSON.displayWebsite){
        dataToSend['displayWebsite'] = displayWebsite;
    }
    if(displayLocation != CURRENT_PROFILE_JSON.displayLocation){
        dataToSend['displayLocation'] = displayLocation;
    }
    if(displayDescription != CURRENT_PROFILE_JSON.displayDescription){
        dataToSend['displayDescription'] = displayDescription;
    }

    return dataToSend;
}

function applySettings(){
    console.log("CURRENT PROFILE = ", CURRENT_PROFILE_JSON);
    var dataToSend = getProfileSave();
    console.log("sending data = ", dataToSend);
    $.ajax({
            type: 'POST',
            url: '/change_profile_settings/',
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            data: {'data': JSON.stringify(dataToSend)},
            success: function (json) {
                console.log("json = ", json);
                location.reload();
            },
            error: function (json) {
                // $("#createRoutine").show();
                console.log("ERROR", json);
            }
        }
    );
}

function shareOutfit(){
    var mainArr;
    var counterArr;
    mainArr = POPULAR;
    counterArr = POPULAR_CURRENT;
    var selectedObject = mainArr[counterArr % mainArr.length];
    $("#popularShareBtnDiv").toggle();
    $("#popularFbLike").data('href', "fashion-ly.com/outfit/"+selectedObject.outfit_pk);
    // $("#"+trey+"TwitterShare")
    $("#popularPinterestShare").data('href', "https://www.pinterest.com/pin/create/button/?url=fashion-ly.com/outfit/"+selectedObject.outfit_pk);
}

function addToCart(){
    var mainArr;
    var counterArr;
    mainArr = POPULAR;
    counterArr = POPULAR_CURRENT;
    var selectedObject = mainArr[counterArr % mainArr.length];
    $.ajax({
            type: 'POST',
            url: '/add_to_cart_whole/',
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            data: {'outfit':selectedObject.outfit_pk},
            success: function (json) {
                Materialize.toast('Outfit added to cart', 4000) // 4000 is the duration of the toast
            },
            error: function (json) {
                // $("#createRoutine").show();
                console.log("ERROR", json);
            }
        }
    )
}

function setOutfitLikeUnlike(outfitKey, likeVal){
    //Finds all occurences of the outfit in the outfit arrays and sets their 'liked' property accordingly
    //popular
    for(var i=0; i < POPULAR.length; i++){
        if(POPULAR[i].outfit_pk == outfitKey){
            POPULAR[i].liked = likeVal;
            if(likeVal==true){
                POPULAR[i].total_likes += 1;
            }
            else{
                POPULAR[i].total_likes -= 1;
            }
            break;
        }
    }
}

function likeOutfit(id){
    console.log("id = ", id);
    //get current featured
    var currentOutfit = POPULAR[POPULAR_CURRENT % POPULAR.length];
    console.log("curernt outfit = ", currentOutfit);
    $.ajax({
            type: 'POST',
            url: '/like_outfit/',
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            data: {'outfit':currentOutfit.outfit_pk},
            success: function (json) {
                console.log("json = ", json);
                var numLikes = json.likes;
                console.log("numlikes = ", numLikes);
                console.log("type = ", typeof(numLikes));
                if(json.status == "Like"){
                    console.log("liked");
                    //find all outfits with this pk, set their like == true
                    setOutfitLikeUnlike(currentOutfit.outfit_pk, true);
                    //modify html of current outfit
                    $("#popularLike").html('favorite');
                    if(numLikes == 1){
                        $("#"+id+"Comment").html("You like this.");
                    }
                    else {
                        numLikes -= 1;
                        if(numLikes == 1){
                            $("#" + id + "Comment").html("You and " + numLikes + " person likes this.");
                        }
                        else {
                            $("#" + id + "Comment").html("You and " + numLikes + " people like this.");
                        }
                    }

                }
                else if(json.status == "Unlike"){
                    console.log("unliked");
                    setOutfitLikeUnlike(currentOutfit.outfit_pk, false);
                    $("#popularLike").html('favorite_border');
                    // var old_html = $("#"+id+"Comment").html().split("You and ")[1];
                    if(numLikes == 1){
                        $("#" + id + "Comment").html(numLikes + " person likes this.");
                    }
                    else {
                        $("#" + id + "Comment").html(numLikes + " people like this.");
                    }
                }

            },
            error: function (json) {
                // $("#createRoutine").show();
                console.log("ERROR", json);
            }
        }
    )
}