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