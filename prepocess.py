# data_processing.py
import pandas as pd

def load_links():
    df = pd.read_csv('iit_roorkee_links.csv')
    return df

if __name__ == "__main__":
    df = load_links()
    print(df.head())