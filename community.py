import pandas as pd
import networkx as nx
import matplotlib.pyplot as plt
import numpy as np

SAVE_PATH = "./plots/community.png"
# Load the data from the CSV file
data = pd.read_csv('data/iit_research_areas.csv')

# Clean column names by stripping whitespace
data.columns = data.columns.str.strip()

# Create a graph
G = nx.Graph()

# Create a mapping of professors to research areas
for index, row in data.iterrows():
    research_area = row['Research Area']
    professors = [prof.strip() for prof in row['Faculty Members'].split(',')]
    
    # Add edges between professors for the same research area
    if len(professors) > 1:  # Only add edges if there are multiple professors
        for i in range(len(professors)):
            for j in range(i + 1, len(professors)):
                G.add_edge(professors[i], professors[j], research_area=research_area)

# Draw the graph
plt.figure(figsize=(16, 12))  # Increased figure size for better visibility
pos = nx.spring_layout(G, k=0.6)  # Adjusted k for better separation

# Create a color map for edges based on research areas
edge_colors = {}
for index, row in data.iterrows():
    research_area = row['Research Area']
    if research_area not in edge_colors and len(row['Faculty Members'].split(',')) > 1:
        edge_colors[research_area] = np.random.rand(3,)  # Random color for each community

# Draw edges with community colors
for u, v, data in G.edges(data=True):
    color = edge_colors[data['research_area']]
    nx.draw_networkx_edges(G, pos, edgelist=[(u, v)], edge_color=[color], alpha=0.6)  # Adjusted alpha for visibility

# Draw all nodes with distinct colors
node_colors = ['lightblue' if G.degree(node) > 1 else 'lightgray' for node in G.nodes()]
nx.draw_networkx_nodes(G, pos, node_color=node_colors, node_size=800)  # Increased node size

# Draw labels
nx.draw_networkx_labels(G, pos, font_size=12)

# Create a legend for edges
handles = [plt.Line2D([0], [0], marker='o', color='w', label=area, 
                       markerfacecolor=color, markersize=10) for area, color in edge_colors.items()]

# Add single-member research areas to the legend
data = pd.read_csv('data/iit_research_areas.csv')
single_member_areas = data[data['Faculty Members'].str.count(',') == 0]['Research Area']
for area in single_member_areas:
    handles.append(plt.Line2D([0], [0], marker='o', color='w', label=area, 
                                markerfacecolor='lightgray', markersize=10))

plt.legend(handles=handles, title='Research Areas', loc='upper left', bbox_to_anchor=(1, 1))

# Show the plot
plt.title('Community Structure of Professors Based on Research Areas')
plt.axis('off')  # Turn off the axis
plt.tight_layout()  # Adjust layout to prevent clipping
plt.savefig(SAVE_PATH)
plt.show()