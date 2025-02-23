import csv
import os
import requests
from bs4 import BeautifulSoup

# Function to fetch awards and publications of professors
def fetch_awards_and_publications(csv_file_path):
    with open(csv_file_path, mode='r', newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            if len(row) >= 3:  # Assuming the first column is the institute name, second is the URL, and third is the department name
                institute_name = row[0]
                url = row[1]
                department_name = row[2]
                try:
                    response = requests.get(url)
                    response.raise_for_status()  # Raise an error for bad responses
                    soup = BeautifulSoup(response.content, 'html.parser')

                    # Find all professors (assuming they are in a specific section of the page)
                    professors = soup.find_all('div', class_='cbp-item')  # Adjust the class name based on actual HTML structure

                    for professor in professors:
                        professor_name = professor.find('h3').text.strip()  # Get the professor's name
                        
                        # Initialize awards and publications counts
                        awards_count = 0
                        publications_count = 0

                        # Find all awards and publications (assuming they are in anchor tags with href="#")
                        for a in professor.find_all('a', href="#"):
                            if 'Publications' in a.text:
                                publications_count = int(a.text.split()[0])  # Extract the number of publications
                            elif 'Awards' in a.text:
                                awards_count = int(a.text.split()[0])  # Extract the number of awards

                        # Create the folder structure
                        folder_path = f"./data/{institute_name}/{department_name}/{professor_name}"
                        os.makedirs(folder_path, exist_ok=True)

                        # Save awards and publications to a CSV file
                        csv_file_path = os.path.join(folder_path, 'awards_and_publications.csv')
                        with open(csv_file_path, mode='w', newline='', encoding='utf-8') as award_file:
                            writer = csv.writer(award_file)
                            writer.writerow(['Awards', 'Publications'])  # Header
                            writer.writerow([awards_count, publications_count])  # Data

                        print(f"Saved awards and publications for {professor_name} in {csv_file_path}")

                except requests.RequestException as e:
                    print(f"Error fetching {url}: {e}")

# Path to the CSV file containing the links
csv_file_path = './data/irins_links.csv'
fetch_awards_and_publications(csv_file_path)