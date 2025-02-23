import csv
import os
import pandas as pd
import requests
from bs4 import BeautifulSoup

# Read the CSV file
with open('data/irins_links.csv', mode='r') as file:
    reader = csv.reader(file)
    for row in reader:
        institute_name = row[0]
        dept_name = row[2]
        base_url = row[1]
        print(institute_name, dept_name, base_url)

        # Send a GET request to the department link
        response = requests.get(base_url)
        response.raise_for_status()  # Raise an error for bad responses

        # Parse the page content with BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract profile links and professor names
        profile_data = []
        profile_links = soup.select('a.btn-u.btn-u-xs.btn-u-sea.mt10')

        for a in profile_links:
            profile_url = a['href']
            # Find the corresponding professor name in the previous sibling <h3> tag
            professor_name_tag = a.find_previous('h3')  # Adjust this if the structure is different
            professor_name = professor_name_tag.get_text(strip=True) if professor_name_tag else "Unknown"

            profile_data.append({'Professor Name': professor_name, 'Profile URL': profile_url})

        # Prepare the output directory
        output_dir = f"data/{institute_name}/{dept_name}"
        os.makedirs(output_dir, exist_ok=True)

        # Save the profile links to a CSV file
        output_file = os.path.join(output_dir, 'profile_links.csv')
        df = pd.DataFrame(profile_data)
        df.to_csv(output_file, index=False)

print("Profile URLs and names have been successfully fetched and stored.")