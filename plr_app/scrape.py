from bs4 import BeautifulSoup
import urllib2

# def scrape_page():
#     build_html("http://plrplr.com/48571/how-to-get-rid-of-acne-3-steps-toward-a-fair-complexion/")

class build_html():

    def __init__(self, page):
        # given some html page, get all content including title, remove extraneous html and word-count
        print self.get_html_content(page)

    def get_html_content(self, page):
        page_html = urllib2.urlopen(page)

        # get page
        soup = BeautifulSoup(page_html, 'html5lib')
        title = soup.find('h1', attrs={'class': 'entry-title'})
        content = soup.find('div', attrs={'class': 'entry-content'})

        # remove extraneous html and word-count
        content = content.text.encode('UTF-8', 'ignore').split("\n Word count: ")[0]

        return {"title": title.text,
                "content": content}


