import pandas as pd
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
import time

# Load the faculty information from the CSV file
faculty_info = pd.read_csv('data/iit_faculty_info.csv')

# Prepare lists to store citation links and records with missing data
all_citation_links = []
missing_data_records = []

# Function to fetch citation links from a given Google Scholar profile URL
def fetch_citation_links(scholar_url):
    citation_links = []
    
    # Set up Selenium WebDriver
    driver = webdriver.Chrome()  # Make sure to have the correct driver for your browser
    driver.get(scholar_url)
    
    while True:
        # Parse the page source with BeautifulSoup
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        
        # Find all citation links
        citations = soup.find_all('td', class_='gsc_a_t')
        for citation in citations:
            link = citation.find('a')
            if link and 'href' in link.attrs:
                citation_links.append('https://scholar.google.com' + link['href'])
        
        # Check if the "Show more" button is disabled
        try:
            show_more_button = driver.find_element(By.ID, 'gsc_bpf_more')
            if show_more_button.get_attribute('disabled') is not None:
                break  # Exit the loop if the button is disabled
            else:
                show_more_button.click()  # Click the button to load more citations
                time.sleep(2)  # Wait for the new citations to load
        except Exception as e:
            print("Error finding the button:", e)
            break

    driver.quit()  # Close the browser
    return list(set(citation_links))  # Return unique citation links

# Iterate through the faculty information and fetch citation links for professors
for index, row in faculty_info.iterrows():
    google_scholar_url = row['Google Scholar Link']
    
    # Check for missing data
    if pd.isna(google_scholar_url) or google_scholar_url.strip() == "":
        missing_data_records.append(row)  # Append the entire row if data is missing
        continue  # Skip to the next iteration
    
    print(f"Fetching citations for: {row['Faculty Name']}")
    citations = fetch_citation_links(google_scholar_url)
    print(f"Citation links for {row['Faculty Name']}:")
    for citation in citations:
        print(citation)
        all_citation_links.append({'Faculty Name': row['Faculty Name'], 'Citation Link': citation})

# Create a DataFrame from the collected citation links
citation_df = pd.DataFrame(all_citation_links)

# Save the DataFrame to a CSV file
citation_df.to_csv('data/citation_links.csv', index=False)
print("Citation links have been saved to 'data/citation_links.csv'.")

# Create a DataFrame from the missing data records
missing_data_df = pd.DataFrame(missing_data_records)

# Save the missing data records to a separate CSV file
if not missing_data_df.empty:
    missing_data_df.to_csv('data/missing_data_records_co_authors.csv', index=False)
    print("Records with missing data have been saved to 'data/missing_data_records_co_authors.csv'.")
else:
    print("No records with missing data found.")