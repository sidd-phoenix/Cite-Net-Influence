import csv
import time
from scholarly import scholarly
from urllib.parse import urlparse, parse_qs

# Input and output file paths
INPUT_CSV = "./data/iit_faculty_info.csv"  # Change this to your actual file
OUTPUT_CSV = "./data/scholar_profile_data.csv"
RECORD_LIMIT = 5  # Change this to limit the number of profiles to process

# Read faculty information from CSV
def read_faculty_data(file_path, limit):
    faculty_data = []
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for i, row in enumerate(reader):
            if i >= limit:
                break
            faculty_data.append((row["Faculty Name"].strip(), row["Google Scholar Link"].strip()))
    return faculty_data

# Extract Google Scholar profile ID from URL
def extract_profile_id(scholar_url):
    parsed_url = urlparse(scholar_url)
    query_params = parse_qs(parsed_url.query)
    return query_params.get("user", [None])[0]

# Fetch Google Scholar data from profile ID
def fetch_scholar_data(profile_id):
    try:
        author = scholarly.search_author_id(profile_id)
        author = scholarly.fill(author, sections=["basics", "indices", "publications"])
        
        # Extract relevant details
        name = author.get("name", "N/A")
        affiliation = author.get("affiliation", "N/A")
        interests = ", ".join(author.get("interests", []))
        citations = author.get("citedby", 0)
        h_index = author.get("hindex", 0)
        i10_index = author.get("i10index", 0)
        
        # Get all publications
        # publications = [
        #     (p["bib"].get("title", "N/A"), p.get("num_citations", 0)) 
        #     for p in author.get("publications", [])
        # ]
        
        return [name, affiliation, interests, citations, h_index, i10_index]
        # return [name, affiliation, interests, citations, h_index, i10_index, publications]
    except Exception as e:
        print(f"Error fetching data for profile {profile_id}: {e}")
        return ["Error", "Error", "Error", "Error", "Error", "Error"]
        # return ["Error", "Error", "Error", "Error", "Error", "Error", "Error"]

# Write results to CSV
def write_to_csv(data, output_file):
    with open(output_file, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(["Faculty Name", "Name", "Affiliation", "Research Interests", "Total Citations", "h-index", "i10-index"])
        # writer.writerow(["Faculty Name", "Name", "Affiliation", "Research Interests", "Total Citations", "h-index", "i10-index", "Publications (Title, Citations)"])
        writer.writerows(data)

# Main execution
faculty_list = read_faculty_data(INPUT_CSV, RECORD_LIMIT)
data = []

for faculty_name, scholar_link in faculty_list:
    print(f"Fetching data for {faculty_name}...")
    profile_id = extract_profile_id(scholar_link)
    if profile_id:
        result = fetch_scholar_data(profile_id)
        data.append([faculty_name] + result)
    else:
        print(f"Invalid Google Scholar link for {faculty_name}")
        data.append([faculty_name, "Invalid Link", "N/A", "N/A", "N/A", "N/A", "N/A"])
        # data.append([faculty_name, "Invalid Link", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"])
    time.sleep(3)  # Minimal delay to avoid detection

write_to_csv(data, OUTPUT_CSV)
print(f"Data saved to {OUTPUT_CSV}")
