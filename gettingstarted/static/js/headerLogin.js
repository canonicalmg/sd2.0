(function($){
    $(function(){
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

function showLogin(){
    $("#register-page").hide();
    $("#login").fadeIn();
}

function login(){
    var user = $("#username1").val() || null;
    var pass = $("#password1").val() || null;
    if(user == null){
        Materialize.toast("Please enter your username", 2000);
        return 0;
    }
    if(pass == null){
        Materialize.toast("Please enter your password", 2000);
        return 0;
    }
    $.ajax({
            type: 'POST',
            url: 'headerSignIn/',
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            data: {'data': [user,pass]},
            success: function (json) {
                if(json == "Does not match"){
                    //display error
                    Materialize.toast("Info does not match our records.");
                }
                else if(json == "Success"){
                    document.location.href="/";
                }
            },
            error: function (json) {
                console.log("ERROR", json);
            }
        }
    );
}

function registerClick(){
    var user = $("#register-username").val() || null;
    var pass = $("#register-password").val() || null;
    var passAgain = $("#register-password-again").val() || null;
    var email = $("#email").val() || null;
    var gender = document.getElementById('gender_check').checked;
    if((user == null) || (pass == null) || (passAgain == null) || (email == null)){
        Materialize.toast("All fields required", 2000);
        return 0;
    }
    if($("#email").hasClass('invalid')){
        Materialize.toast("Invalid email", 2000);
        return 0;
    }
    if(pass != passAgain){
        Materialize.toast("Passwords do not match", 2000);
        return 0;
    }
    $.ajax({
            type: 'POST',
            url: 'headerSignUp/',
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            data: {'data': [user,pass,email,gender]},
            success: function (json) {
                //hide scroll wheel
                //redirect
                if(json == "Success"){
                    document.location.href="/";
                }
                if(json == "Username Exists"){
                    Materialize.toast("An Account with this username already exists.");
                    return 0;
                }
                
            },
            error: function (json) {
                console.log("ERROR", json);
            }
        }
    );
}

function register(){
    $("#login").hide();
    $("#register-page").fadeIn();
}

function forgotPassword(){
    console.log("reset pass");
}