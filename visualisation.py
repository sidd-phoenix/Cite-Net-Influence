import csv
import time
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from scholarly import scholarly

# Input and output CSV file
INPUT_CSV = "./data/scholar_profile_data.csv"

# Load data from CSV
def load_data(file_path):
    df = pd.read_csv(file_path)
    df = df.fillna(0)  # Replace missing values with 0
    return df

# Generate Leaderboard
def generate_leaderboard(df):
    leaderboard = df.sort_values(by="h-index", ascending=False)
    print("Top Faculty by h-index:")
    print(leaderboard[["Name", "h-index"]].head(10))

# Generate Bar Charts
def plot_bar_charts(df):
    plt.figure(figsize=(12, 6))
    sns.barplot(x="h-index", y="Name", data=df.sort_values("h-index", ascending=True), palette="viridis")
    plt.xlabel("h-index")
    plt.ylabel("Faculty Name")
    plt.title("Top Faculty by h-index")
    plt.tight_layout()
    plt.savefig("./plots/h_index_chart.png")
    
    plt.figure(figsize=(12, 6))
    sns.barplot(x="Total Citations", y="Name", data=df.sort_values("Total Citations", ascending=True), palette="magma")
    plt.xlabel("Total Citations")
    plt.ylabel("Faculty Name")
    plt.title("Faculty by Total Citations")
    plt.tight_layout()
    plt.savefig("./plots/citations_chart.png")

# Generate Scatter Plot
def plot_scatter(df):
    plt.figure(figsize=(8, 6))
    sns.scatterplot(x="h-index", y="i10-index", size="Total Citations", hue="Total Citations", data=df, sizes=(10, 200), palette="coolwarm")
    plt.xlabel("h-index")
    plt.ylabel("i10-index")
    plt.title("h-index vs i10-index (Size: Total Citations)")
    plt.legend(title="Citations", loc="upper left")
    plt.savefig("./plots/scatter_plot.png")

# Main execution
df = load_data(INPUT_CSV)
generate_leaderboard(df)
plot_bar_charts(df)
plot_scatter(df)
print("Visualizations saved as PNG files.")
