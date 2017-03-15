(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $('.carousel.carousel-slider').carousel();
    $( "#frontSlider" ).on( "swipe", swipeHandler );

    function swipeHandler(event){
      console.log("swiped ", event);
    }

    var swiper = new Swiper('.swiper-container', {
    });


  }); // end of document ready
})(jQuery); // end of jQuery name space