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
          $("#featuredProfileImg").attr("src", json.featured[0].user.profile_img);
          $("#featuredProfileUser").html(json.featured[0].user.username);
          for(var i=0; i < json.featured[0].outfit.length; i++){
            load_outfit($("#featured"),
                json.featured[0].outfit[i],
                json.featured[0].outfit_pk,
                "featured");
          }

          NEW = json.new;
          $("#newProfileImg").attr("src", json.new[0].user.profile_img);
          $("#newProfileUser").html(json.new[0].user.username);
          for(var i=0; i < json.new[0].outfit.length; i++){
            load_outfit($("#new"),
                json.new[0].outfit[i],
                json.new[0].outfit_pk,
                "new");
          }

          POPULAR = json.popular;
          $("#popularProfileImg").attr("src", json.popular[0].user.profile_img);
          $("#popularProfileUser").html(json.popular[0].user.username);
          for(var i=0; i < json.popular[0].outfit.length; i++){
            load_outfit($("#popular"),
                json.popular[0].outfit[i],
                json.popular[0].outfit_pk,
                "popular");
          }

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
  $("#newProfileImg").attr("src", NEW[NEW_CURRENT % NEW.length].user.profile_img);
  $("#newProfileUser").html(NEW[NEW_CURRENT % NEW.length].user.username);
  for(var i=0; i < NEW[NEW_CURRENT % NEW.length].outfit.length; i++ ){
    load_outfit($("#new"),
        NEW[NEW_CURRENT % NEW.length].outfit[i],
        NEW[NEW_CURRENT % NEW.length].outfit_pk,
        "new");
  }
}

function newPrev(){
  if(NEW_CURRENT > 0) {
    NEW_CURRENT -= 1;
  }
  $("#new").empty();
  $("#newProfileImg").attr("src", NEW[NEW_CURRENT % NEW.length].user.profile_img);
  $("#newProfileUser").html(NEW[NEW_CURRENT % NEW.length].user.username);
  for(var i=0; i < NEW[NEW_CURRENT % NEW.length].outfit.length; i++ ){
    load_outfit($("#new"),
        NEW[NEW_CURRENT % NEW.length].outfit[i],
        NEW[NEW_CURRENT % NEW.length].outfit_pk,
        "new");
  }
}

function popularNext(){
  POPULAR_CURRENT += 1;
  $("#popular").empty();
  $("#popularProfileImg").attr("src", POPULAR[POPULAR_CURRENT % POPULAR.length].user.profile_img);
  $("#popularProfileUser").html(POPULAR[POPULAR_CURRENT % POPULAR.length].user.username);
  for(var i=0; i < POPULAR[POPULAR_CURRENT % POPULAR.length].outfit.length; i++ ){
    load_outfit($("#popular"),
        POPULAR[POPULAR_CURRENT % POPULAR.length].outfit[i],
        POPULAR[POPULAR_CURRENT % POPULAR.length].outfit_pk,
        "popular");
  }
}

function popularPrev(){
  if(POPULAR_CURRENT > 0) {
    POPULAR_CURRENT -= 1;
  }
  $("#popular").empty();
  $("#popularProfileImg").attr("src", POPULAR[POPULAR_CURRENT % POPULAR.length].user.profile_img);
  $("#popularProfileUser").html(POPULAR[POPULAR_CURRENT % POPULAR.length].user.username);
  for(var i=0; i < POPULAR[POPULAR_CURRENT % POPULAR.length].outfit.length; i++ ){
    load_outfit($("#popular"),
        POPULAR[POPULAR_CURRENT % POPULAR.length].outfit[i],
        POPULAR[POPULAR_CURRENT % POPULAR.length].outfit_pk,
        "popular");
  }
}

function featuredNext(){
  FEATURED_CURRENT += 1;
  $("#featured").empty();
  $("#featuredProfileImg").attr("src", FEATURED[FEATURED_CURRENT % FEATURED.length].user.profile_img);
  $("#featuredProfileUser").html(FEATURED[FEATURED_CURRENT % FEATURED.length].user.username);
  for(var i=0; i < FEATURED[FEATURED_CURRENT % FEATURED.length].outfit.length; i++ ){
    load_outfit($("#featured"),
        FEATURED[FEATURED_CURRENT % FEATURED.length].outfit[i],
        FEATURED[FEATURED_CURRENT % FEATURED.length].outfit_pk,
        "featured");
  }
}

function featuredPrev(){
  if(FEATURED_CURRENT > 0) {
    FEATURED_CURRENT -= 1;
  }
  $("#featured").empty();
  $("#featuredProfileImg").attr("src", FEATURED[FEATURED_CURRENT % FEATURED.length].user.profile_img);
  $("#featuredProfileUser").html(FEATURED[FEATURED_CURRENT % FEATURED.length].user.username);
  for(var i=0; i < FEATURED[FEATURED_CURRENT % FEATURED.length].outfit.length; i++ ){
    load_outfit($("#featured"),
        FEATURED[FEATURED_CURRENT % FEATURED.length].outfit[i],
        FEATURED[FEATURED_CURRENT % FEATURED.length].outfit_pk,
        "featured");
  }
}

function load_outfit(whereToAdd, whatToAdd, outfit, trey){
  //remove existing
  // $("#can"+whatToAdd.item_id).remove();
  //add new
  whereToAdd.append("<img class='outfitCanvasItem' style='position:absolute;' id='fixed"+trey+outfit+"o"+whatToAdd.pk+"' src='"+whatToAdd.large_url+"'>");
  //change transform
  var curTransform = new WebKitCSSMatrix();
  curTransform.a = whatToAdd.transform[0];
  curTransform.b = whatToAdd.transform[1];
  curTransform.c = whatToAdd.transform[2];
  curTransform.d = whatToAdd.transform[3];
  console.log("what to add = ", Math.abs(whatToAdd.transform[4]));
  console.log("where to add = ", whereToAdd.width());
  // if(Math.abs(whatToAdd.transform[4]) > whereToAdd.width() ){
  //   console.log("bang ", trey);
  //   curTransform.e = whatToAdd.transform[4] + 100;
  //       // (Math.abs(whatToAdd.transform[4]) - whereToAdd.width());
  // }
  // else {
  //   curTransform.e = whatToAdd.transform[4];
  // }
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
  if(Math.abs(whatToAdd.transform[18]) > whereToAdd.width() ){
    console.log("bang ", trey);
    curTransform.m41 = whatToAdd.transform[18] + (Math.abs(whatToAdd.transform[4]) - whereToAdd.width());
  }
  else {
    curTransform.m41 = whatToAdd.transform[18];
  }
  // curTransform.m41 = whatToAdd.transform[18];
  curTransform.m42 = whatToAdd.transform[19];
  curTransform.m43 = whatToAdd.transform[20];
  curTransform.m44 = whatToAdd.transform[21];

  document.getElementById("fixed"+trey+outfit+"o"+whatToAdd.pk).style.WebkitTransform = curTransform;
}