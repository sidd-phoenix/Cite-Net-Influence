import requests
import csv
import os
import pandas as pd
from bs4 import BeautifulSoup

def scrape_research_areas(url, save_path=".", csv_filename="research_areas.csv", excel_filename="research_areas.xlsx"):
    """
    Scrapes research areas and faculty members from the given URL and saves them to specified CSV and Excel file paths.

    Parameters:
    - url (str): The webpage URL to scrape data from.
    - save_path (str): The directory where files should be saved (default: current directory).
    - csv_filename (str): The name of the CSV file (default: "research_areas.csv").
    - excel_filename (str): The name of the Excel file (default: "research_areas.xlsx").
    """

    # Ensure the save path exists
    os.makedirs(save_path, exist_ok=True)

    # Full paths for CSV and Excel files
    csv_filepath = os.path.join(save_path, csv_filename)
    excel_filepath = os.path.join(save_path, excel_filename)

    # Send a GET request to the URL
    response = requests.get(url, verify=False)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find the table containing research areas and faculty members
        table = soup.find('table')

        if not table:
            print("No table found on the webpage.")
            return
        
        # Prepare data storage
        data = []
        
        # Iterate through each row of the table
        for idx, row in enumerate(table.find_all('tr')[1:], start=1):  # Skip the header row
            columns = row.find_all('td')
            if len(columns) >= 3:
                research_area = columns[1].get_text(strip=True)
                faculty_members = columns[2].get_text(strip=True)
                data.append([idx, research_area, faculty_members])

        if not data:
            print("No data found in the table.")
            return

        # **Save as CSV**
        with open(csv_filepath, mode="w", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            writer.writerow(["Serial No.", "Research Area", "Faculty Members"])  # Header
            writer.writerows(data)  # Write rows
        print(f"Data successfully saved in {csv_filepath}")

        # **Save as Excel**
        df = pd.DataFrame(data, columns=["Serial No.", "Research Area", "Faculty Members"])
        df.to_excel(excel_filepath, index=False, engine="openpyxl")
        print(f"Data successfully saved in {excel_filepath}")

    else:
        print(f'Failed to retrieve the page. Status code: {response.status_code}')

# Example usage
if __name__ == "__main__":
    scrape_research_areas(
        url="https://iitr.ac.in/Departments/Computer%20Science%20and%20Engineering%20Department/Research/Research%20Area.html",
        save_path="C:/Users/aadil/Downloads/Life/College/STUDY/SEM 6/SNA/Citation Project/data",  # Change this to your desired save location
        csv_filename="iit_research_areas.csv",
        excel_filename="iit_research_areas.xlsx"
    )
