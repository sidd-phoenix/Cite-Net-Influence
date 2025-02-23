# fetch_titles_and_authors.py
import pandas as pd
import requests
from bs4 import BeautifulSoup
import time
import os
import random
# Load the citation links from the CSV file
citation_links_df = pd.read_csv('data/citation_links.csv')

# File to store the last index
progress_file = './scripts/last_index.txt'
# CSV file to save results
output_csv_file = 'data/titles_and_authors.csv'

# Function to fetch title and authors from a citation link
def fetch_title_and_authors(citation_link):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(citation_link, headers=headers)
        response.raise_for_status()  # Raise an exception for bad status codes
        
        soup = BeautifulSoup(response.content, 'html.parser')
        # print(soup)

        # Extract the title
        title_div = soup.find('div', id='gsc_oci_title')
        if not title_div:
            raise ValueError("Title element not found")
        title = title_div.text.strip()

        # Extract the authors
        authors_div = soup.find('div', class_='gsc_oci_value')
        if not authors_div or authors_div.find_previous_sibling('div').text != 'Authors':
            raise ValueError("Authors element not found")
        authors = authors_div.text.strip()

        print(f"Successfully fetched: {title}, {authors}")
        return title, authors

    except requests.RequestException as e:
        print(f"Network error occurred: {e}")
        return None
    except Exception as e:
        print(f"Error processing {citation_link}: {e}")
        return None

# Load the last index if the progress file exists
start_index = 0
if os.path.exists(progress_file):
    with open(progress_file, 'r') as f:
        start_index = int(f.read().strip())

# Create or clear the output CSV file and write the header
# with open(output_csv_file, 'w', encoding='utf-8') as f:
#     f.write('Title,Authors\n')  # Write the header

# Iterate through the citation links and fetch titles and authors
try:
    for index in range(start_index, len(citation_links_df)):
        row = citation_links_df.iloc[index]
        print(f"Processing index {index}: {row['Citation Link']}")
        
        result = fetch_title_and_authors(row['Citation Link'])
        if result is None:
            print("Stopping due to error...")
            break
            
        title, authors = result

        # Append the result to the CSV file
        with open(output_csv_file, 'a', encoding='utf-8') as f:
            f.write(f'"{title}","{authors}"\n')

        # Save the current index to the progress file
        with open(progress_file, 'w') as f:
            f.write(str(index))

        # Introduce a delay between requests
        delay = random.randint(1, 3)
        print(f"Waiting {delay} seconds before next request...")
        time.sleep(delay)

except KeyboardInterrupt:
    print("\nScript interrupted by user. Progress has been saved.")
except Exception as e:
    print(f"Unexpected error occurred: {e}")
finally:
    print(f"Last processed index: {index}")
    print(f"Results saved to '{output_csv_file}'")

# Don't remove the progress file on error
# Only remove if we successfully completed all entries
if index >= len(citation_links_df) - 1:
    if os.path.exists(progress_file):
        os.remove(progress_file)