import os
import requests
import pandas as pd
from bs4 import BeautifulSoup
import csv

# Read URLs from a CSV file
urls = {}
with open('./data/irins_links.csv', mode='r', newline='', encoding='utf-8') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        if len(row) == 3:  # Ensure there are three columns
            institute_name, url, department_name = row
            urls[institute_name] = (url, department_name)

# Function to scrape data from a given URL
def scrape_data(url, institute_name, department_name):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Initialize a dictionary to store the data
    data = {}

    # Find all service blocks
    service_blocks = soup.find_all("div", class_="service-block-v3 article-box m125")
    # print(service_blocks)
    
    for block in service_blocks:
        # Get the number from the span
        number = block.find("span", class_="counter").text.strip()
        # Get the name from the h6
        name = block.find("h6").text.strip()
        data[name] = number
        
    # Find all service blocks for Scopus citations
    service_blocks = soup.find_all("div", class_="service-block-v3 article-box ml25 xs-citation")
    print(service_blocks)
    
    for block in service_blocks:
        # Get the number from the span
        number = block.find("span", class_="counter").text.strip()
        # Get the name from the h6
        name = block.find("h6").text.strip()
        # Check if the block has an additional h6 for Scopus
        if block.find("h6", class_="service-heading"):
            scopus_heading = block.find("h6", class_="service-heading").text.strip()
            if scopus_heading == "Scopus":
                data[f"Scopus {name}"] = number  # Modify key to include "Scopus"
            else:
                data[name] = number  # Default case
        else:
            data[name] = number  # Default case

    # Create the folder structure
    folder_path = f"./data/{institute_name}/{department_name}"
    os.makedirs(folder_path, exist_ok=True)

    # Create a DataFrame and save it to CSV
    df = pd.DataFrame(data.items(), columns=['Category', 'Count'])
    csv_file_path = os.path.join(folder_path, 'details.csv')
    df.to_csv(csv_file_path, index=False)
    
    
    # Either add Crossref data manually or add code to scrape it

    print(f"Data saved to {csv_file_path}")

# Scrape data for each URL
for institute, (url, department_name) in urls.items():
    print(institute, url, department_name)
    scrape_data(url, institute, department_name)