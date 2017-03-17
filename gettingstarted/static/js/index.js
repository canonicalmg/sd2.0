(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $('.carousel.carousel-slider').carousel();
    $( "#frontSlider" ).on( "swipe", swipeHandler );

    function swipeHandler(event){
      console.log("swiped ", event);
    }

    var swiper = new Swiper('.swiper-container', {
      spaceBetween: 30,
      loop: true,
      effect: 'flip',
      centeredSlides: true,
      // effect: 'coverflow',
      // grabCursor: true,
      // centeredSlides: true,
      // slidesPerView: 'auto',
      // coverflow: {
      //   rotate: 50,
      //   stretch: 0,
      //   depth: 100,
      //   modifier: 1,
      //   slideShadows : true
      // }
    });


  }); // end of document ready
})(jQuery); // end of jQuery name space