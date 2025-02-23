import './Doc_main.css';

export default function Doc_main() {
    return (
      <main className="docs-main">
        <h1>Documentation</h1>
  
        <div className="docs-grid">
          <section className="docs-section">
            <h2>Getting Started</h2>
            <p>
              Learn how to use Cite-Net Influence to analyze citation networks and
              understand research impact.
            </p>
            <div className="quick-start">
              <h3>Quick Start Guide</h3>
              <ol>
                <li>Enter your research query</li>
                <li>Review the generated citation network</li>
                <li>Analyze relationships and impact metrics</li>
                <li>Export or share your findings</li>
              </ol>
            </div>
          </section>
  
          <section className="docs-section">
            <h2>API Reference</h2>
            <p>
              Detailed documentation for integrating with our API.
            </p>
            <div className="code-block">
              <code>
                GET /api/citations<br/>
                POST /api/analyze<br/>
                GET /api/metrics
              </code>
            </div>
          </section>
        </div>
      </main>
    );
  }