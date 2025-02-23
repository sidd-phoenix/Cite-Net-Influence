import './About_main.css';

export default function About_main() {
  return (
    <main className="about-main">
      <h1>About Cite-Net Influence</h1>
      
      <div className="about-content">
        <section className="about-section">
          <p className="about-intro">
            Cite-Net Influence is an AI-powered platform that analyzes citation networks
            to help researchers understand academic influence and relationships between papers.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            We aim to make academic research more accessible and interconnected by
            providing powerful tools for understanding citation networks and research impact.
          </p>
        </section>

        <section className="about-section feature-section">
          <h2>Key Features</h2>
          <ul className="feature-list">
            <li>AI-powered citation analysis</li>
            <li>Interactive network visualization</li>
            <li>Research impact metrics</li>
            <li>Collaborative research tools</li>
          </ul>
        </section>
      </div>
    </main>
  );
}