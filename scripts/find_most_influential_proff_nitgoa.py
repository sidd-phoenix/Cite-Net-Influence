# Finding MOST INFLUENTIAL PROFESSOR in NIT Goa based on Composite Influence Score (CIS): A Metric created by Misbah & Aadil
import pandas as pd
import numpy as np
import networkx as nx
import matplotlib.pyplot as plt
import seaborn as sns

data = pd.read_csv("C://Users//misba//Downloads//NITGoa_data.csv")

print("Do you want to focus on collaborations? (Yes/No)")
collaboration_focus = input().strip().lower()

print("Is recent research impact more important? (Yes/No)")
recent_impact_focus = input().strip().lower()

print("Do you want to minimize self-citations? (Yes/No)")
minimize_self_citation = input().strip().lower()

#Default weights
weights = {
    'G': 0.2,
    'CCR': 0.2,
    'CAI': 0.2,
    'One_minus_SCI': 0.2,
    'h_norm': 0.1,
    'CoAuth': 0.1
}

#Changing weights based on input
if collaboration_focus == 'yes':
    weights['CoAuth'] += 0.1
    weights['G'] -= 0.05
    weights['h_norm'] -= 0.05

if recent_impact_focus == 'yes':
    weights['CAI'] += 0.1
    weights['h_norm'] -= 0.05
    weights['One_minus_SCI'] -= 0.05

if minimize_self_citation == 'yes':
    weights['One_minus_SCI'] += 0.1
    weights['CCR'] -= 0.05
    weights['G'] -= 0.05

#Normalizing weights to make sure they sum up to 1
total_weight = sum(weights.values())
weights = {k: v / total_weight for k, v in weights.items()}

#Finding CIS for all proffs
data['CIS'] = (
    weights['G'] * data['G (pivot: 2020 to 2025)'] +
    weights['CCR'] * data['CrossRef Citation Ratio '] +
    weights['CAI'] * data['Citation Aging Index'] +
    weights['One_minus_SCI'] * data['1 - SCI (Self Citattion Index)'] +
    weights['h_norm'] * data['Normalized h-index'] +
    weights['CoAuth'] * data['Num of Co-Authors']
)

#Findging the most influential proff
most_influential = data.loc[data['CIS'].idxmax()]

print("\nThe most influential professor is:")
print(f"Name: {most_influential['Professor']}")
print(f"University: {most_influential['University']}")
print(f"Speciality: {most_influential['Speciality']}")
print(f"Composite Influence Score (CIS): {most_influential['CIS']:.4f}")


# ---------------------------
# VISUALIZATIONS
# ---------------------------

# 1. Collaboration Network Graph
G = nx.Graph()


for index, row in data.iterrows():
    G.add_node(row['Professor'], size=row['CIS'], h_index=row['h-index'])  
    # for co_author in data['Professor']:
    #     if co_author != row['Professor']:
    #         G.add_edge(row['Professor'], co_author, weight=row['Num of Co-Authors'])

edges=[]
for i, row1 in data.iterrows():
    for j, row2 in data.iterrows():
        if i < j:  
            if row1['Num of Co-Authors'] > 0 and row2['Num of Co-Authors'] > 0:
                edges.append((row1['Professor'], row2['Professor']))
# print(edges)
G.add_edges_from(edges)

sizes = [G.nodes[node]['size'] * 100 for node in G.nodes()]
colors = [G.nodes[node]['h_index'] for node in G.nodes()]

plt.figure(figsize=(15, 10))
pos = nx.spring_layout(G, seed=42)
nx.draw_networkx(G, pos, node_size=sizes, node_color=colors, cmap='viridis', with_labels=True, font_size=10)
plt.title('Collaboration Network Graph')


h_indices = data['h-index'].tolist()
labels = dict(zip(G.nodes(), data['Professor']))
nodes = nx.draw_networkx_nodes(G, pos, node_color=h_indices, cmap='viridis', node_size=800)
nx.draw_networkx_labels(G, pos, labels, font_size=8)
nx.draw_networkx_edges(G, pos, edgelist=edges, edge_color='gray')
plt.colorbar(nodes, label='h-index')

plt.show()

# 2. Influence Distribution Bar Chart
plt.figure(figsize=(15, 8))
sns.barplot(x='CIS', y='Professor', data=data.sort_values('CIS', ascending=False), palette='viridis')
plt.title('Composite Influence Score (CIS) Distribution')
plt.xlabel('Composite Influence Score (CIS)')
plt.ylabel('Professor')
plt.grid(True, linestyle='--', alpha=0.5)
plt.show()

# 3. Co-Authorship Heatmap
coauth_matrix = pd.DataFrame(np.zeros((len(data), len(data))), index=data['Professor'], columns=data['Professor'])


for index, row in data.iterrows():
    for co_author in data['Professor']:
        if co_author != row['Professor']:
            coauth_matrix.loc[row['Professor'], co_author] = row['Num of Co-Authors']

plt.figure(figsize=(15, 12))
sns.heatmap(coauth_matrix, cmap='YlGnBu', annot=True, fmt=".0f")
plt.title('Co-Authorship Heatmap')
plt.xlabel('Co-Author')
plt.ylabel('Professor')
plt.show()
