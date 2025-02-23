import requests
import csv
import os
import pandas as pd
from bs4 import BeautifulSoup

def scrape_research_areas(url, save_path=".", csv_filename="research_areas.csv"):
    """
    Scrapes research areas and faculty members from the given URL and saves them to specified CSV and Excel file paths.

    Parameters:
    - url (str): The webpage URL to scrape data from.
    - save_path (str): The directory where files should be saved (default: current directory).
    - csv_filename (str): The name of the CSV file (default: "research_areas.csv").
    """

    # Ensure the save path exists
    os.makedirs(save_path, exist_ok=True)

    # Full paths for CSV files
    csv_filepath = os.path.join(save_path, csv_filename)

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

    else:
        print(f'Failed to retrieve the page. Status code: {response.status_code}')


def scrape_faculty_info(url, save_path=".", csv_filename="faculty_info.csv"):
    """
    Scrapes faculty names and their posts from the given URL and saves them to a CSV file.

    Parameters:
    - url (str): The webpage URL to scrape data from.
    - save_path (str): The directory where the CSV file should be saved (default: current directory).
    - csv_filename (str): The name of the CSV file (default: "faculty_info.csv").
    """

    # Ensure the save path exists
    os.makedirs(save_path, exist_ok=True)

    # Full path for the CSV file
    csv_filepath = os.path.join(save_path, csv_filename)

    # Send a GET request to the URL
    response = requests.get(url, verify=False)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find all faculty containers (inside divs with class 'info')
        faculty_list = soup.find_all('div', class_='info')

        if not faculty_list:
            print("No faculty data found on the webpage.")
            return

        # Prepare data storage
        data = []

        for idx, faculty in enumerate(faculty_list, start=1):
            name_div = faculty.find('div', class_='name')  # Extract faculty name
            post_div = faculty.find('div', class_='designation')  # Extract faculty post
            
            faculty_name = name_div.get_text(strip=True) if name_div else "N/A"
            faculty_post = post_div.get_text(strip=True) if post_div else "N/A"

            data.append([idx, faculty_name, faculty_post])

        if not data:
            print("No data extracted.")
            return

        # **Save as CSV**
        with open(csv_filepath, mode="w", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            writer.writerow(["Serial No.", "Faculty Name", "Post"])  # Header
            writer.writerows(data)  # Write rows
        
        print(f"Data successfully saved in {csv_filepath}")

    else:
        print(f'Failed to retrieve the page. Status code: {response.status_code}')
        
# Example usage
if __name__ == "__main__":
    scrape_research_areas(
        url="https://iitr.ac.in/Departments/Computer%20Science%20and%20Engineering%20Department/Research/Research%20Area.html",
        save_path="C:/Users/aadil/Downloads/Life/College/STUDY/SEM 6/SNA/Citation Project/data",  # Change this to your desired save location
        csv_filename="iit_research_areas.csv"
    )
    
    scrape_faculty_info(
        url="https://iitr.ac.in/Departments/Computer%20Science%20and%20Engineering%20Department/People/Faculty/index.html",
        save_path="C:/Users/aadil/Downloads/Life/College/STUDY/SEM 6/SNA/Citation Project/data",  # Change this to your desired save location
        csv_filename="iit_faculty_info.csv"
    )
    
    
