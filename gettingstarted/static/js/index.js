(function($){
  $(function(){

    $('.button-collapse').sideNav();
    // $('.carousel.carousel-slider').carousel();
    // $( "#frontSlider" ).on( "swipe", swipeHandler );
    //
    // function swipeHandler(event){
    //   console.log("swiped ", event);
    // }
    //
    // var swiper = new Swiper('.swiper-container', {
    //   spaceBetween: 30,
    //   loop: true,
    //   effect: 'flip',
    //   centeredSlides: true,
    //   // effect: 'coverflow',
    //   // grabCursor: true,
    //   // centeredSlides: true,
    //   // slidesPerView: 'auto',
    //   // coverflow: {
    //   //   rotate: 50,
    //   //   stretch: 0,
    //   //   depth: 100,
    //   //   modifier: 1,
    //   //   slideShadows : true
    //   // }
    // });


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
var FEATURED = [], NEW = [], POPULAR = [];
var FEATURED_CURRENT = 0, NEW_CURRENT = 0, POPULAR_CURRENT = 0;
(function() {
  var eventDisplay = new $.Event('displayChanged'),
      origShow = $.fn.show,
      origHide = $.fn.hide;
  //
  $.fn.show = function() {
    origShow.apply(this, arguments);
    $(this).trigger(eventDisplay,['show']);
  };
  //
  $.fn.hide = function() {
    origHide.apply(this, arguments);
    $(this).trigger(eventDisplay,['hide']);
  };
  //
})();
populateSections();

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

function populateSections(){
  $.ajax({
        type: 'POST',
        url: 'get_front_page/',
        headers: {
          "X-CSRFToken": getCookie("csrftoken")
        },
        data: {'index': 0},
        success: function (json) {
          console.log("json = ", json);
          FEATURED = json.featured;
          // $("#featuredProfileImg").attr("src", json.featured[0].user.profile_img);
          // $("#featuredProfileUser").html(json.featured[0].user.username);
          load_user("featured",
              json.featured[0].user,
              json.featured[0].liked,
              json.featured[0].total_likes);
          for(var i=0; i < json.featured[0].outfit.length; i++){
            load_outfit($("#featured"),
                json.featured[0].outfit[i],
                json.featured[0].outfit_pk,
                "featured"
            );
          }
          loadTags("featured", json.featured[0].tags);

          NEW = json.new;
          // $("#newProfileImg").attr("src", json.new[0].user.profile_img);
          // $("#newProfileUser").html(json.new[0].user.username);
          load_user("new",
              json.new[0].user,
              json.new[0].liked,
              json.new[0].total_likes);
          for(var i=0; i < json.new[0].outfit.length; i++){
            load_outfit($("#new"),
                json.new[0].outfit[i],
                json.new[0].outfit_pk,
                "new");
          }
          loadTags("new", json.new[0].tags);


          POPULAR = json.popular;
          // $("#popularProfileImg").attr("src", json.popular[0].user.profile_img);
          // $("#popularProfileUser").html(json.popular[0].user.username);
          load_user("popular",
              json.popular[0].user,
              json.popular[0].liked,
              json.popular[0].total_likes);
          for(var i=0; i < json.popular[0].outfit.length; i++){
            load_outfit($("#popular"),
                json.popular[0].outfit[i],
                json.popular[0].outfit_pk,
                "popular");
          }
          loadTags("popular", json.popular[0].tags);


        },
        error: function (json) {
          // $("#createRoutine").show();
          console.log("ERROR", json);
        }
      }
  )
}

function newNext(){
  NEW_CURRENT += 1;
  $("#new").empty();
  load_user("new",
      NEW[NEW_CURRENT % NEW.length].user,
      NEW[NEW_CURRENT % NEW.length].liked,
      NEW[NEW_CURRENT % NEW.length].total_likes
  );
  for(var i=0; i < NEW[NEW_CURRENT % NEW.length].outfit.length; i++ ){
    load_outfit($("#new"),
        NEW[NEW_CURRENT % NEW.length].outfit[i],
        NEW[NEW_CURRENT % NEW.length].outfit_pk,
        "new");
  }
  loadTags("new", NEW[NEW_CURRENT % NEW.length].tags);

}

function newPrev(){
  if(NEW_CURRENT > 0) {
    NEW_CURRENT -= 1;
  }
  $("#new").empty();
  load_user("new",
      NEW[NEW_CURRENT % NEW.length].user,
      NEW[NEW_CURRENT % NEW.length].liked,
      NEW[NEW_CURRENT % NEW.length].total_likes
  );
  for(var i=0; i < NEW[NEW_CURRENT % NEW.length].outfit.length; i++ ){
    load_outfit($("#new"),
        NEW[NEW_CURRENT % NEW.length].outfit[i],
        NEW[NEW_CURRENT % NEW.length].outfit_pk,
        "new");
  }
  loadTags("new", NEW[NEW_CURRENT % NEW.length].tags);
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

function featuredNext(){
  FEATURED_CURRENT += 1;
  $("#featured").empty();
  load_user("featured",
      FEATURED[FEATURED_CURRENT % FEATURED.length].user,
      FEATURED[FEATURED_CURRENT % FEATURED.length].liked,
      FEATURED[FEATURED_CURRENT % FEATURED.length].total_likes);
  for(var i=0; i < FEATURED[FEATURED_CURRENT % FEATURED.length].outfit.length; i++ ){
    load_outfit($("#featured"),
        FEATURED[FEATURED_CURRENT % FEATURED.length].outfit[i],
        FEATURED[FEATURED_CURRENT % FEATURED.length].outfit_pk,
        "featured");
  }
  loadTags("featured", FEATURED[FEATURED_CURRENT % FEATURED.length].tags);

}

function featuredPrev(){
  if(FEATURED_CURRENT > 0) {
    FEATURED_CURRENT -= 1;
  }
  $("#featured").empty();
  load_user("featured",
      FEATURED[FEATURED_CURRENT % FEATURED.length].user,
      FEATURED[FEATURED_CURRENT % FEATURED.length].liked,
      FEATURED[FEATURED_CURRENT % FEATURED.length].total_likes);
  for(var i=0; i < FEATURED[FEATURED_CURRENT % FEATURED.length].outfit.length; i++ ){
    load_outfit($("#featured"),
        FEATURED[FEATURED_CURRENT % FEATURED.length].outfit[i],
        FEATURED[FEATURED_CURRENT % FEATURED.length].outfit_pk,
        "featured");
  }
  loadTags("featured", FEATURED[FEATURED_CURRENT % FEATURED.length].tags);

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

function featuredVert(id){
  $(".featuredProfileSocial").toggle();
  if ($(".featuredProfileSocial").is(':hidden')) {
    $("#"+id).html('keyboard_arrow_up');
  }
  else{
    $("#"+id).html('keyboard_arrow_down');
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

function newVert(id){
  $(".newProfileSocial").toggle();
  if ($(".newProfileSocial").is(':hidden')) {
    $("#"+id).html('keyboard_arrow_up');
  }
  else{
    $("#"+id).html('keyboard_arrow_down');
  }
}

function loadTags(trey, tag_list){
  var tagList = "";
  for(var i=0; i < tag_list.length; i++){
    tagList += "<div class='chip'>"+tag_list[i]+"</div>";
  }
  $("#"+trey+"Tags").html(tagList);
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

function setOutfitLikeUnlike(outfitKey, likeVal){
  //Finds all occurences of the outfit in the outfit arrays and sets their 'liked' property accordingly
  //featured
  for(var i=0; i < FEATURED.length; i++){
    if(FEATURED[i].outfit_pk == outfitKey){
      FEATURED[i].liked = likeVal;
      if(likeVal==true){
        FEATURED[i].total_likes += 1;
      }
      else{
        FEATURED[i].total_likes -= 1;
      }
      break;
    }
  }
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
  //new
  for(var i=0; i < NEW.length; i++){
    if(NEW[i].outfit_pk == outfitKey){
      NEW[i].liked = likeVal;
      if(likeVal==true){
        NEW[i].total_likes += 1;
      }
      else{
        NEW[i].total_likes -= 1;
      }
      break;
    }
  }
}

function setUserFollowUnfollow(userKey, followVal){
  //Finds all occurences of the user in the outfit arrays and sets their 'is_following' property accordingly
  //featured
  for(var i=0; i < FEATURED.length; i++){
    if(FEATURED[i].user.user_id == userKey){
      FEATURED[i].user.is_following = followVal;
    }
  }
  //popular
  for(var i=0; i < POPULAR.length; i++){
    if(POPULAR[i].user.user_id == userKey){
      POPULAR[i].user.is_following = followVal;
    }
  }
  //new
  for(var i=0; i < NEW.length; i++){
    if(NEW[i].user.user_id == userKey){
      NEW[i].user.is_following = followVal;
    }
  }
}

function likeOutfit(id){
  console.log("id = ", id);
  var mainArr;
  var counterArr;
  if(id=="featuredLike"){
    mainArr = FEATURED;
    counterArr = FEATURED_CURRENT;
  }
  else if(id == "popularLike"){
    mainArr = POPULAR;
    counterArr = POPULAR_CURRENT;
  }
  else if(id == "newLike"){
    mainArr = NEW;
    counterArr = NEW_CURRENT;
  }
  //get current featured
  var currentOutfit = mainArr[counterArr % mainArr.length];
  console.log("curernt outfit = ", currentOutfit);
  $.ajax({
        type: 'POST',
        url: 'like_outfit/',
        headers: {
          "X-CSRFToken": getCookie("csrftoken")
        },
        data: {'outfit':currentOutfit.outfit_pk},
        success: function (json) {
          console.log("json = ", json);
          if(json == "Like"){
            console.log("liked");
            //find all outfits with this pk, set their like == true
            setOutfitLikeUnlike(currentOutfit.outfit_pk, true);
            //modify html of current outfit
            $("#"+id).html('favorite');
            if(currentOutfit.total_likes == 1){
              $("#"+id+"Comment").html("You like this.");
            }
            else {
              var total_likes = currentOutfit.total_likes - 1;
              if(total_likes == 1){
                $("#" + id + "Comment").html("You and " + total_likes + " person likes this.");
              }
              else {
                $("#" + id + "Comment").html("You and " + total_likes + " people like this.");
              }
            }

          }
          else if(json == "Unlike"){
            console.log("unliked");
            setOutfitLikeUnlike(currentOutfit.outfit_pk, false);
            $("#"+id).html('favorite_border');
            // var old_html = $("#"+id+"Comment").html().split("You and ")[1];
            if(currentOutfit.total_likes == 1){
              $("#" + id + "Comment").html(currentOutfit.total_likes + " person likes this.");
            }
            else {
              $("#" + id + "Comment").html(currentOutfit.total_likes + " people like this.");
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

function followClick(dom_id){
  var mainArr;
  var counterArr;
  var trey = dom_id.split("Follow")[0];
  if(dom_id == "featuredFollow"){
    mainArr = FEATURED;
    counterArr = FEATURED_CURRENT;
  }
  else if(dom_id == "popularFollow"){
    mainArr = POPULAR;
    counterArr = POPULAR_CURRENT;
  }
  else if(dom_id == "newFollow"){
    mainArr = NEW;
    counterArr = NEW_CURRENT;
  }
  var currentUser = mainArr[counterArr % mainArr.length].user;
  var domObject = $("#"+dom_id);
  $.ajax({
        type: 'POST',
        url: 'follow_user/',
        headers: {
          "X-CSRFToken": getCookie("csrftoken")
        },
        data: {'user':currentUser.user_id},
        success: function (json) {
          console.log("json = ", json);
          if(json == "Follow"){
            //add is_follow=True to all outfits of this user
            setUserFollowUnfollow(currentUser.user_id, true);
            //re-initialize any outfits whose user is the user we are following
            reloadOutfitIfFollowing(currentUser.user_id);
            
          }
          else if(json == "Unfollow"){
            setUserFollowUnfollow(currentUser.user_id, false);
            reloadOutfitIfFollowing(currentUser.user_id);

          }

        },
        error: function (json) {
          // $("#createRoutine").show();
          console.log("ERROR", json);
        }
      }
  )
}

function reloadOutfitIfFollowing(user_id){
  //featured
  if(FEATURED[FEATURED_CURRENT % FEATURED.length].user.user_id == user_id){
    $("#featured").empty();
    load_user("featured",
        FEATURED[FEATURED_CURRENT % FEATURED.length].user,
        FEATURED[FEATURED_CURRENT % FEATURED.length].liked,
        FEATURED[FEATURED_CURRENT % FEATURED.length].total_likes);
    for(var i=0; i < FEATURED[FEATURED_CURRENT % FEATURED.length].outfit.length; i++ ){
      load_outfit($("#featured"),
          FEATURED[FEATURED_CURRENT % FEATURED.length].outfit[i],
          FEATURED[FEATURED_CURRENT % FEATURED.length].outfit_pk,
          "featured");
    }
    loadTags("featured", FEATURED[FEATURED_CURRENT % FEATURED.length].tags);
  }
  //popular
  if(POPULAR[POPULAR_CURRENT % POPULAR.length].user.user_id == user_id){
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
  //new
  if(NEW[NEW_CURRENT % NEW.length].user.user_id == user_id){
    $("#new").empty();
    load_user("new",
        NEW[NEW_CURRENT % NEW.length].user,
        NEW[NEW_CURRENT % NEW.length].liked,
        NEW[NEW_CURRENT % NEW.length].total_likes);
    for(var i=0; i < NEW[NEW_CURRENT % NEW.length].outfit.length; i++ ){
      load_outfit($("#new"),
          NEW[NEW_CURRENT % NEW.length].outfit[i],
          NEW[NEW_CURRENT % NEW.length].outfit_pk,
          "new");
    }
    loadTags("new", NEW[NEW_CURRENT % NEW.length].tags);


  }
}

function outfitPage(trey){
  console.log("loading outfit page");
  var mainArr;
  var counterArr;
  if(trey == "featured"){
    mainArr = FEATURED;
    counterArr = FEATURED_CURRENT;
  }
  else if(trey == "popular"){
    mainArr = POPULAR;
    counterArr = POPULAR_CURRENT;
  }
  else if(trey == "new"){
    mainArr = NEW;
    counterArr = NEW_CURRENT;
  }
  var selectedObject = mainArr[counterArr % mainArr.length];
  console.log("loading ", selectedObject);
  window.location.href = "/outfit/"+selectedObject.outfit_pk;
}