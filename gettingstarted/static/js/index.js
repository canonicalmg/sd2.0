(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $('.carousel.carousel-slider').carousel();
    $( "#frontSlider" ).on( "swipe", swipeHandler );

    function swipeHandler(event){
      console.log("swiped ", event);
    }


  }); // end of document ready
})(jQuery); // end of jQuery name space