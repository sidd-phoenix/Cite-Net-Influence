'use client';
import { useState, useEffect } from 'react';
import './Graph_main.css';

export default function Graph_main() {
  const [selectedView, setSelectedView] = useState('network');

  // Dummy data for network
  const networkNodes = [
    { id: 1, label: 'Paper A', citations: 150 },
    { id: 2, label: 'Paper B', citations: 80 },
    { id: 3, label: 'Paper C', citations: 120 },
    { id: 4, label: 'Paper D', citations: 60 },
    { id: 5, label: 'Paper E', citations: 90 },
  ];

  const networkLinks = [
    { source: 1, target: 2 },
    { source: 1, target: 3 },
    { source: 2, target: 4 },
    { source: 3, target: 4 },
    { source: 3, target: 5 },
    { source: 4, target: 5 },
  ];

  // Dummy data for tree
  const treeData = {
    id: 1,
    label: 'Root Paper',
    citations: 200,
    children: [
      {
        id: 2,
        label: 'Citation 1',
        citations: 150,
        children: [
          { id: 4, label: 'Sub-Citation 1', citations: 80 },
          { id: 5, label: 'Sub-Citation 2', citations: 70 },
        ],
      },
      {
        id: 3,
        label: 'Citation 2',
        citations: 120,
        children: [
          { id: 6, label: 'Sub-Citation 3', citations: 60 },
        ],
      },
    ],
  };

  // Draw network visualization
  const drawNetwork = () => {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw links
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 1;
    networkLinks.forEach(link => {
      const source = networkNodes.find(n => n.id === link.source);
      const target = networkNodes.find(n => n.id === link.target);
      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();
    });

    // Draw nodes
    networkNodes.forEach(node => {
      ctx.beginPath();
      ctx.fillStyle = '#2563eb';
      ctx.arc(node.x, node.y, Math.sqrt(node.citations) / 2, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw labels
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + 20);
    });
  };

  // Draw tree visualization
  const drawTree = () => {
    const canvas = document.getElementById('treeCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawNode = (node, x, y, level) => {
      // Draw node
      ctx.beginPath();
      ctx.fillStyle = '#2563eb';
      ctx.arc(x, y, Math.sqrt(node.citations) / 2, 0, 2 * Math.PI);
      ctx.fill();

      // Draw label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, x, y + 20);

      // Draw children
      if (node.children) {
        const spacing = 150;
        const startX = x - (node.children.length - 1) * spacing / 2;
        node.children.forEach((child, i) => {
          const childX = startX + i * spacing;
          const childY = y + 100;

          // Draw connection line
          ctx.beginPath();
          ctx.strokeStyle = '#2563eb';
          ctx.moveTo(x, y);
          ctx.lineTo(childX, childY);
          ctx.stroke();

          // Recursively draw child nodes
          drawNode(child, childX, childY, level + 1);
        });
      }
    };

    // Start drawing from root
    drawNode(treeData, canvas.width / 2, 50, 0);
  };

  // Initialize node positions
  useEffect(() => {
    // Set random positions for network nodes
    networkNodes.forEach(node => {
      node.x = 100 + Math.random() * 400;
      node.y = 100 + Math.random() * 300;
    });

    // Draw initial visualization
    if (selectedView === 'network') {
      drawNetwork();
    } else {
      drawTree();
    }
  }, [selectedView]);

  return (
    <main className="graph-main">
      <h1>Citation Network Visualization</h1>

      <div className="view-selector">
        <button 
          className={`view-button ${selectedView === 'network' ? 'active' : ''}`}
          onClick={() => setSelectedView('network')}
        >
          Network View
        </button>
        <button 
          className={`view-button ${selectedView === 'tree' ? 'active' : ''}`}
          onClick={() => setSelectedView('tree')}
        >
          Tree View
        </button>
      </div>

      <div className="graph-content">
        <section className="graph-section">
          <div className="graph-container">
            {selectedView === 'network' ? (
              <canvas 
                id="networkCanvas" 
                width="600" 
                height="400"
                className="visualization-canvas"
              />
            ) : (
              <canvas 
                id="treeCanvas" 
                width="600" 
                height="400"
                className="visualization-canvas"
              />
            )}
          </div>
        </section>

        <section className="controls-section">
          <h2>Graph Controls</h2>
          <div className="control-group">
            <label>Filter by Year</label>
            <input type="range" min="2000" max="2024" defaultValue="2024" />
          </div>
          <div className="control-group">
            <label>Citation Threshold</label>
            <input type="number" min="0" defaultValue="10" />
          </div>
          <div className="control-group">
            <label>Show Labels</label>
            <input type="checkbox" defaultChecked />
          </div>
        </section>
      </div>
    </main>
  );
} 