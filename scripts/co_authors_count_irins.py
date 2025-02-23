import csv
import os
import requests
import pandas as pd
from bs4 import BeautifulSoup

# Read the irins_links.csv to get institute and department names
institute_department_map = {}
with open('data/irins_links.csv', mode='r') as file:
    reader = csv.reader(file)
    for row in reader:
        institute_name = row[0]
        department_name = row[2]
        institute_department_map[institute_name] = department_name

# Iterate through each institute and its corresponding profile links CSV
for institute_name, department_name in institute_department_map.items():
    # Construct the path to the profile_links.csv file
    csv_file_path = f"data/{institute_name}/{department_name}/profile_links.csv"

    # Read the profile links CSV file
    with open(csv_file_path, mode='r') as file:
        reader = csv.DictReader(file)  # Use DictReader for easier access to columns
        for row in reader:
            professor_name = row['Professor Name']
            profile_url = row['Profile URL']
            
            # Get the page source and check for chord-diagram
            response = requests.get(profile_url)
            soup = BeautifulSoup(response.content, 'html.parser')

            # Extract the number of co-authors
            co_authors_count = None
    
            co_authors_button = soup.find('button', class_='btn-u common_button badge-blue')
            if co_authors_button:
                co_authors_count = co_authors_button.text.split('-')[2].strip()

            # Prepare the output directory for the professor
            professor_dir = f"data/{institute_name}/{department_name}/{professor_name}"
            os.makedirs(professor_dir, exist_ok=True)

            # Save the results to a CSV file inside the professor's folder
            output_file = os.path.join(professor_dir, 'co_authors.csv')
            df = pd.DataFrame({
                'Co-Authors Count': [co_authors_count],
            })
            df.to_csv(output_file, index=False)
