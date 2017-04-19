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

function removeFromCart(clothingKey, outfitKey){
    console.log("removing ", clothingKey, outfitKey);
    swal({    title: "Are you sure?",
            text: "This item will be removed from your cart!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, remove it!",
            closeOnConfirm: false },
        function(){
            swal("Removed!", "The item has been removed from your cart.", "success");
            removeClothing(clothingKey, outfitKey);
        });
}

function removeClothing(clothingKey, outfitKey){
    $.ajax({
            type: 'POST',
            url: '/remove_from_cart/',
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            data: {'clothing': clothingKey, 'outfit': outfitKey},
            success: function (json) {
                console.log("json = ", json);
                if(json == "Removed"){
                    $("#clothing"+clothingKey+"x"+outfitKey).remove();
                }
                if(json == "Removed, Empty"){
                    $("#clothing"+clothingKey+"x"+outfitKey).remove();
                    $("#emptyCart").show();
                }
            },
            error: function (json) {
                // $("#createRoutine").show();
                console.log("ERROR", json);
            }
        }
    )
}