# app.py
from flask import Flask, render_template
import pandas as pd
from scraper import scrape_iit_roorkee

app = Flask(__name__)

@app.route('/')
def index():
    base_url = 'https://www.iitr.ac.in/'
    df = scrape_iit_roorkee(base_url)
    df.to_csv('iit_roorkee_links.csv', index=False)
    return render_template('index.html', links=df['Links'].to_list())

if __name__ == "__main__":
    app.run(debug=True)