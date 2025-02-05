# visualization.py
import plotly.express as px
import pandas as pd

def plot_links(df):
    fig = px.scatter(df, x=df.index, y=[1]*len(df), text='Links', title='Links from IIT Roorkee Website')
    fig.update_traces(textposition='top center')
    fig.update_layout(yaxis=dict(showgrid=False, zeroline=False, showticklabels=False))
    fig.show()

if __name__ == "__main__":
    df = pd.read_csv('iit_roorkee_links.csv')
    plot_links(df)