from django.http import HttpResponse
from scrape import build_html

def signUpLogIn(request):
    return HttpResponse("done")

def scrape_content(request):
    build_html("http://plrplr.com/48571/how-to-get-rid-of-acne-3-steps-toward-a-fair-complexion/")
    return HttpResponse("done2")