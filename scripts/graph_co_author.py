# create_author_graph.py
import pandas as pd
import networkx as nx
import matplotlib.pyplot as plt

# Load the titles and authors from the CSV file
data = pd.read_csv('data/titles_and_authors.csv')

# Create a graph
G = nx.Graph()

# Iterate through the rows of the DataFrame
for index, row in data.iterrows():
    # Skip if Authors is N/A or empty
    if pd.isna(row['Authors']) or str(row['Authors']).strip() == '':
        continue
        
    authors = row['Authors'].split(',')  # Split authors by comma
    authors = [author.strip() for author in authors]  # Remove extra spaces
    # Filter out any empty strings or N/A values
    authors = [author for author in authors if author and author.lower() != 'n/a']

    # Only proceed if we have at least 2 valid authors
    if len(authors) >= 2:
        # Add edges between each pair of authors
        for i in range(len(authors)):
            for j in range(i + 1, len(authors)):
                G.add_edge(authors[i], authors[j])

# Calculate node sizes based on degree centrality
degree_dict = dict(G.degree())
node_sizes = [v * 100 + 500 for v in degree_dict.values()]

# Calculate edge weights based on collaboration frequency
edge_weights = {}
for (u, v) in G.edges():
    if (u, v) in edge_weights:
        edge_weights[(u, v)] += 1
    else:
        edge_weights[(u, v)] = 1

# Draw the graph with improved layout and styling
plt.figure(figsize=(15, 15))
pos = nx.spring_layout(G, k=1, iterations=50)  # Increase k for more spacing

# Draw edges with varying thickness based on weight
edge_widths = [edge_weights.get((u, v), 1) for (u, v) in G.edges()]
nx.draw_networkx_edges(G, pos, width=edge_widths, alpha=0.3, edge_color='gray')

# Draw nodes with varying sizes and a better color scheme
nx.draw_networkx_nodes(G, pos, 
                      node_size=node_sizes,
                      node_color='lightblue',
                      edgecolors='black',
                      alpha=0.7)

# Add labels with better formatting
nx.draw_networkx_labels(G, pos, 
                       font_size=8,
                       font_weight='bold',
                       bbox=dict(facecolor='white', 
                                edgecolor='none', 
                                alpha=0.7, 
                                pad=0.5))

# Improve plot appearance
plt.title("Co-Authorship Network", fontsize=10, pad=20)
plt.axis('off')
plt.tight_layout()
plt.show()