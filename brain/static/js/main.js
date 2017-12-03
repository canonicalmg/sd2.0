$(window).load(function() {
    $("#preloader").fadeOut("slow");
});

$("#view_more_reviews").click(function(e){
    $("#reviews_more").show();
    $("#reviews_more").append("<div class='wow fadeInUp' style='padding-top:25px;'>"+reviewStrings()+"</div>");
    $("#view_more_reviews").hide();
});
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

$("#sendForm").click(function(e){

});

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
                                var name = $("#name").val();
                                var email = $("#email").val();
                                var address = $("#address").val();
                                var city = $("#city").val();
                                var state = $("#state").val();
                                var country = $("#country").val();
                                $.ajax({
                                    type:"POST",
                                    url:"/submit-info-form",
                                    headers : {
                                        "X-CSRFToken": getCookie("csrftoken")
                                    },
                                    data: {
                                        'data': [name, email, address, city, state, country],
                                    },
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