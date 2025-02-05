# scraper.py
import requests
from bs4 import BeautifulSoup
import pandas as pd
from urllib.parse import urljoin

def scrape_iit_roorkee(base_url):
    visited = set()
    links = []

    def scrape(url):
        if url in visited:
            return
        visited.add(url)
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')

        for link in soup.find_all('a', href=True):
            full_url = urljoin(base_url, link['href'])
            if full_url not in visited:
                links.append(full_url)
                scrape(full_url)  # Recursively scrape the linked page

    scrape(base_url)
    return pd.DataFrame(links, columns=['Links'])

if __name__ == "__main__":
    base_url = 'https://www.iitr.ac.in/'
    df = scrape_iit_roorkee(base_url)
    df.to_csv('iit_roorkee_links.csv', index=False)
    print(df)