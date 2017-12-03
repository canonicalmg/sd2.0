$(window).load(function() {
    $("#preloader").fadeOut("slow");
});

$("#view_more_reviews").click(function(e){
    $("#reviews_more").show();
    $("#reviews_more").append("<div class='wow fadeInUp' style='padding-top:25px;'>"+reviewStrings()+"</div>");
    $("#view_more_reviews").hide();
});

function reviewTemplate(name, location, verbiage){
    return "<div class='row'>"
        + "<div class='col-md-2 testimonials'>"
        + "<div class='carousel-info'>"
        + "<div class='pull-left'>"
        + "<span class='testimonials-name'>"+name+"</span>"
        + "<span class='testimonials-post'>"+location+"</span>"
        + "</div>"
        + "</div>"
        + "</div>"
        + "<div class='col-md-10'>"
        + "<div class='testimonials' style='margin-top:25px;'>"
        + "<div class='active item'>"
        + "<blockquote><p>"+verbiage+"</p></blockquote>"
        + "</div>"
        + "</div>"
        + "</div>"
        + "</div>";
}

function reviewStrings(){
    var dataObjs = [
        {
            'name': "Erin",
            'location': "Software Engineer",
            'verbiage': "Interestingly, I noticed a similar potentiating effect from brain revitalize towards coffee. Sampling this product was a joy and I will gladly buy a bottle when it becomes available."
        },
        {
            'name': "Austin",
            'location': "Musician",
            'verbiage': "10/10"
        },
        {
            'name': "Steven",
            'location': "Student",
            'verbiage': "The absolutely worst thing about smoking is feeling so sluggish and lazy the next day. I didn't get that at all with this."
        },
        {
            'name': "Raj",
            'location': "Weightlifter",
            'verbiage': "I have been looking for something like this on the market for years now. Keep up the good work!"
        },
        {
            'name': "Beverly",
            'location': "Student",
            'verbiage': "If you smoke a lot of weed then you need to get this. Period"
        }
    ];

    var templateString = "";
    for(var i=0; i < dataObjs.length; i++){
        templateString += reviewTemplate(dataObjs[i].name,dataObjs[i].location,dataObjs[i].verbiage);
    }

    return templateString;
}

$(document).ready(function(){

    wow = new WOW({
        mobile:       false,       // default
      }
    )
    wow.init();

     $('#top-nav').onePageNav({
        currentClass: 'current',
        changeHash: true,
        scrollSpeed: 1200
    });

     
    //animated header class
    $(window).scroll(function () {
        if ($(window).scrollTop() > 100) {
            $(".navbar-default").addClass("animated");
        } else {
            $(".navbar-default").removeClass('animated');
        }
    });

    $('#countdown_dashboard').countDown({
        targetDate: {
            'day':      12,
            'month':    3,
            'year':     2017,
            'hour':     00,
            'min':      00,
            'sec':      01,
        },
        omitWeeks: true
    });

    $('.init-slider').owlCarousel({
        items:1,
        merge:true,
        loop:true,
        video:true,
        smartSpeed: 600
    });

    /*$('input, textarea').data('holder', $('input, textarea').attr('placeholder'));

    $('input, textarea').focusin(function () {
        $(this).attr('placeholder', '');
    });
    $('input, textarea').focusout(function () {
        $(this).attr('placeholder', $(this).data('holder'));
    });*/


    //contact form validation
    $("#contact-form").validate({
        rules: {
            name: {
                required: true,
                minlength: 2
            },
            message: {
                required: true,
                minlength: 2
            },
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            name: {
                required: "Please enter Your Name",
                minlength: "Your name must consist of at least 2 characters"
            },
            message: {
                required: "Please Write Something",
                minlength: "Your message must consist of at least 2 characters"
            },
            email: "Please enter a valid email address"
        },
        submitHandler: function(form) {
            $(form).ajaxSubmit({
                type:"POST",
                data: $(form).serialize(),
                url:"mail.php",
                success: function() {
                    $('#contact-form :input').attr('disabled', 'disabled');
                    $('#contact-form').fadeTo( "slow", 0.15, function() {
                        $(this).find(':input').attr('disabled', 'disabled');
                        $(this).find('label').css('cursor','default');
                        $('#success').fadeIn();
                    });
                },
                error: function() {
                    $('#contact-form').fadeTo( "slow", 0.15, function() {
                        $('#error').fadeIn();
                    });
                }
            });
        }
    });

});

// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', init);

function init() {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 16,

        // The latitude and longitude to center the map (always required)
        center: new google.maps.LatLng(23.751945, 90.384590), // Dhaka ,
        scrollwheel: false,

        // How you would like to style the map. 
        // This is where you would paste any style found on Snazzy Maps.
        styles: [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}]
    };

    // Get the HTML DOM element that will contain your map 
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById('map-canvas');

    // Create the Google Map using our element and options defined above
    var map = new google.maps.Map(mapElement, mapOptions);

    // Let's also add a marker while we're at it
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(23.751945, 90.384590),
        map: map,
        icon: 'img/map.png',
        title: 'Twing!'
    });
}