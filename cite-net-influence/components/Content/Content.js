'use client';
import { useState } from 'react';
import './Content.css';

export default function Content() {
    const [showDetails, setShowDetails] = useState(false);
    const [selectedUniv1, setSelectedUniv1] = useState('');
    const [selectedUniv2, setSelectedUniv2] = useState('');
    const [selectedProf1, setSelectedProf1] = useState('');
    const [selectedProf2, setSelectedProf2] = useState('');

    // Dummy university data
    const universities = [
        { id: 1, name: "Stanford University" },
        { id: 2, name: "MIT" },
        { id: 3, name: "Harvard University" },
        { id: 4, name: "UC Berkeley" },
        // Add more universities...
    ];

    // Dummy professor data with university IDs
    const professors = [
        // Stanford Professors (universityId: 1)
        {
            id: 1,
            name: "Prof. Alan Smith",
            universityId: 1,
            department: "Computer Science",
            metrics: {
                hIndex: 85,
                i10Index: 245,
                citations: 52000,
                coAuthors: 120,
                publications: 320,
                yearsActive: 25,
                topField: "Machine Learning",
                recentCitations: 12000
            }
        },
        {
            id: 2,
            name: "Prof. Sarah Johnson",
            universityId: 1,
            department: "Artificial Intelligence",
            metrics: {
                hIndex: 78,
                i10Index: 210,
                citations: 45000,
                coAuthors: 95,
                publications: 280,
                yearsActive: 20,
                topField: "Deep Learning",
                recentCitations: 15000
            }
        },
        {
            id: 3,
            name: "Prof. David Chen",
            universityId: 1,
            department: "Data Science",
            metrics: {
                hIndex: 92,
                i10Index: 300,
                citations: 65000,
                coAuthors: 150,
                publications: 400,
                yearsActive: 28,
                topField: "Big Data Analytics",
                recentCitations: 18000
            }
        },

        // MIT Professors (universityId: 2)
        {
            id: 4,
            name: "Prof. Maria Garcia",
            universityId: 2,
            department: "Computer Science",
            metrics: {
                hIndex: 92,
                i10Index: 280,
                citations: 68000,
                coAuthors: 150,
                publications: 380,
                yearsActive: 28,
                topField: "Artificial Intelligence",
                recentCitations: 15000
            }
        },
        {
            id: 5,
            name: "Prof. James Wilson",
            universityId: 2,
            department: "Robotics",
            metrics: {
                hIndex: 88,
                i10Index: 260,
                citations: 55000,
                coAuthors: 130,
                publications: 340,
                yearsActive: 23,
                topField: "Robot Learning",
                recentCitations: 14000
            }
        },
        {
            id: 6,
            name: "Prof. Emily Brown",
            universityId: 2,
            department: "AI Ethics",
            metrics: {
                hIndex: 75,
                i10Index: 200,
                citations: 42000,
                coAuthors: 85,
                publications: 250,
                yearsActive: 18,
                topField: "Ethical AI",
                recentCitations: 11000
            }
        },

        // Harvard Professors (universityId: 3)
        {
            id: 7,
            name: "Prof. Michael Taylor",
            universityId: 3,
            department: "Computer Science",
            metrics: {
                hIndex: 95,
                i10Index: 320,
                citations: 72000,
                coAuthors: 160,
                publications: 420,
                yearsActive: 30,
                topField: "Natural Language Processing",
                recentCitations: 20000
            }
        },
        {
            id: 8,
            name: "Prof. Lisa Anderson",
            universityId: 3,
            department: "Machine Learning",
            metrics: {
                hIndex: 82,
                i10Index: 240,
                citations: 48000,
                coAuthors: 110,
                publications: 300,
                yearsActive: 22,
                topField: "Computer Vision",
                recentCitations: 13000
            }
        },
        {
            id: 9,
            name: "Prof. Robert Kim",
            universityId: 3,
            department: "AI Applications",
            metrics: {
                hIndex: 79,
                i10Index: 220,
                citations: 46000,
                coAuthors: 100,
                publications: 290,
                yearsActive: 21,
                topField: "Applied AI",
                recentCitations: 12500
            }
        },

        // UC Berkeley Professors (universityId: 4)
        {
            id: 10,
            name: "Prof. Jennifer Lee",
            universityId: 4,
            department: "Computer Science",
            metrics: {
                hIndex: 90,
                i10Index: 275,
                citations: 62000,
                coAuthors: 140,
                publications: 360,
                yearsActive: 26,
                topField: "Distributed Systems",
                recentCitations: 16000
            }
        },
        {
            id: 11,
            name: "Prof. Thomas Martinez",
            universityId: 4,
            department: "AI Research",
            metrics: {
                hIndex: 86,
                i10Index: 255,
                citations: 54000,
                coAuthors: 125,
                publications: 330,
                yearsActive: 24,
                topField: "Reinforcement Learning",
                recentCitations: 14500
            }
        },
        {
            id: 12,
            name: "Prof. Rachel Wong",
            universityId: 4,
            department: "Data Systems",
            metrics: {
                hIndex: 81,
                i10Index: 235,
                citations: 49000,
                coAuthors: 115,
                publications: 310,
                yearsActive: 23,
                topField: "Database Systems",
                recentCitations: 13500
            }
        }
    ];

    // Filter professors based on selected university
    const getFilteredProfessors = (universityId) => {
        return professors.filter(prof => prof.universityId === parseInt(universityId));
    };

    // Handle university selection changes
    const handleUniv1Change = (e) => {
        const newUnivId = e.target.value;
        setSelectedUniv1(newUnivId);
        setSelectedProf1(''); // Reset professor selection when university changes
    };

    const handleUniv2Change = (e) => {
        const newUnivId = e.target.value;
        setSelectedUniv2(newUnivId);
        setSelectedProf2(''); // Reset professor selection when university changes
    };

    // Handle professor selection changes
    const handleProf1Change = (e) => {
        const newProfId = e.target.value;
        if (newProfId !== selectedProf2) {
            setSelectedProf1(newProfId);
        }
    };

    const handleProf2Change = (e) => {
        const newProfId = e.target.value;
        if (newProfId !== selectedProf1) {
            setSelectedProf2(newProfId);
        }
    };

    // Helper function to calculate percentage
    const calculatePercentage = (value1, value2) => {
        const total = value1 + value2;
        return (value1 / total) * 100;
    };

    return (
        <main className="content-main">
            {/* Description Section */}
            <div className="description-section">
                <button
                    className="expand-button"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    <span>🔍 Expand to see details of {professors.length} professors</span>
                    <span className={`arrow ${showDetails ? 'open' : ''}`}>▼</span>
                </button>

                {showDetails && (
                    <div className="professors-table">
                        <table>
                            <tbody>
                                {professors.map((prof) => (
                                    <tr key={prof.id}>
                                        <td>
                                            <strong>{prof.name}</strong>
                                            <br />
                                            {prof.universityId === 1 ? "Stanford University" : prof.universityId === 2 ? "MIT" : "Unknown University"} - {prof.department}
                                        </td>
                                        <td>
                                            h-index: {prof.metrics.hIndex}
                                            <br />
                                            Citations: {prof.metrics.citations}
                                        </td>
                                        <td>
                                            Publications: {prof.metrics.publications}
                                            <br />
                                            Co-authors: {prof.metrics.coAuthors}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Comparison Section */}
            <div className="comparison-section">
                <div className="selectors">
                    {/* University selectors */}
                    <div className="selector-pair">
                        <select
                            value={selectedUniv1}
                            onChange={handleUniv1Change}
                            className="university-select"
                        >
                            <option value="">Select University 1</option>
                            {universities.map(univ => (
                                <option key={univ.id} value={univ.id}>
                                    {univ.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedUniv2}
                            onChange={handleUniv2Change}
                            className="university-select"
                        >
                            <option value="">Select University 2</option>
                            {universities.map(univ => (
                                <option key={univ.id} value={univ.id}>
                                    {univ.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Professor selectors */}
                    <div className="selector-pair">
                        <select
                            value={selectedProf1}
                            onChange={handleProf1Change}
                            disabled={!selectedUniv1}
                        >
                            <option value="">Select Professor 1</option>
                            {selectedUniv1 && getFilteredProfessors(selectedUniv1).map(prof => (
                                <option
                                    key={prof.id}
                                    value={prof.id}
                                    disabled={prof.id === parseInt(selectedProf2)}
                                >
                                    {prof.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedProf2}
                            onChange={handleProf2Change}
                            disabled={!selectedUniv2}
                        >
                            <option value="">Select Professor 2</option>
                            {selectedUniv2 && getFilteredProfessors(selectedUniv2).map(prof => (
                                <option
                                    key={prof.id}
                                    value={prof.id}
                                    disabled={prof.id === parseInt(selectedProf1)}
                                >
                                    {prof.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="comparison-cards">
                    {/* Professor 1 Card */}
                    <div className="prof-card">
                        <h2>Professor A</h2>
                        {selectedProf1 && (
                            <div className="prof-details">
                                <h3>{professors.find(p => p.id === parseInt(selectedProf1))?.name}</h3>
                                <div className="metrics">
                                    <div className="metric">
                                        <label>h-index</label>
                                        <span>{professors.find(p => p.id === parseInt(selectedProf1))?.metrics.hIndex}</span>
                                    </div>
                                    <div className="metric">
                                        <label>Citations</label>
                                        <span>{professors.find(p => p.id === parseInt(selectedProf1))?.metrics.citations}</span>
                                    </div>
                                    <div className="metric">
                                        <label>i10-index</label>
                                        <span>{professors.find(p => p.id === parseInt(selectedProf1))?.metrics.i10Index}</span>
                                    </div>
                                    <div className="metric">
                                        <label>Co-authors</label>
                                        <span>{professors.find(p => p.id === parseInt(selectedProf1))?.metrics.coAuthors}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Professor 2 Card */}
                    <div className="prof-card">
                        <h2>Professor B</h2>
                        {selectedProf2 && (
                            <div className="prof-details">
                                <h3>{professors.find(p => p.id === parseInt(selectedProf2))?.name}</h3>
                                <div className="metrics">
                                    <div className="metric">
                                        <label>h-index</label>
                                        <span>{professors.find(p => p.id === parseInt(selectedProf2))?.metrics.hIndex}</span>
                                    </div>
                                    <div className="metric">
                                        <label>Citations</label>
                                        <span>{professors.find(p => p.id === parseInt(selectedProf2))?.metrics.citations}</span>
                                    </div>
                                    <div className="metric">
                                        <label>i10-index</label>
                                        <span>{professors.find(p => p.id === parseInt(selectedProf2))?.metrics.i10Index}</span>
                                    </div>
                                    <div className="metric">
                                        <label>Co-authors</label>
                                        <span>{professors.find(p => p.id === parseInt(selectedProf2))?.metrics.coAuthors}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Progress Bar Comparisons */}
            {selectedProf1 && selectedProf2 && (
                <div className="metrics-comparison">
                    <h2>Metrics Comparison</h2>

                    <div className="progress-metrics">
                        {/* h-index comparison */}
                        <div className="metric-row">
                            <span className="metric-label">h-index</span>
                            <div className="progress-container">
                                <div
                                    className="progress-bar"
                                    style={{
                                        width: `${calculatePercentage(
                                            professors.find(p => p.id === parseInt(selectedProf1))?.metrics.hIndex,
                                            professors.find(p => p.id === parseInt(selectedProf2))?.metrics.hIndex
                                        )}%`
                                    }}
                                >
                                    <span className="progress-value">
                                        {professors.find(p => p.id === parseInt(selectedProf1))?.metrics.hIndex}
                                    </span>
                                </div>
                                <span className="progress-value right">
                                    {professors.find(p => p.id === parseInt(selectedProf2))?.metrics.hIndex}
                                </span>
                            </div>
                        </div>

                        {/* i10-index comparison */}
                        <div className="metric-row">
                            <span className="metric-label">i10-index</span>
                            <div className="progress-container">
                                <div
                                    className="progress-bar"
                                    style={{
                                        width: `${calculatePercentage(
                                            professors.find(p => p.id === parseInt(selectedProf1))?.metrics.i10Index,
                                            professors.find(p => p.id === parseInt(selectedProf2))?.metrics.i10Index
                                        )}%`
                                    }}
                                >
                                    <span className="progress-value">
                                        {professors.find(p => p.id === parseInt(selectedProf1))?.metrics.i10Index}
                                    </span>
                                </div>
                                <span className="progress-value right">
                                    {professors.find(p => p.id === parseInt(selectedProf2))?.metrics.i10Index}
                                </span>
                            </div>
                        </div>

                        {/* Citations comparison */}
                        <div className="metric-row">
                            <span className="metric-label">Citations</span>
                            <div className="progress-container">
                                <div
                                    className="progress-bar"
                                    style={{
                                        width: `${calculatePercentage(
                                            professors.find(p => p.id === parseInt(selectedProf1))?.metrics.citations,
                                            professors.find(p => p.id === parseInt(selectedProf2))?.metrics.citations
                                        )}%`
                                    }}
                                >
                                    <span className="progress-value">
                                        {professors.find(p => p.id === parseInt(selectedProf1))?.metrics.citations}
                                    </span>
                                </div>
                                <span className="progress-value right">
                                    {professors.find(p => p.id === parseInt(selectedProf2))?.metrics.citations}
                                </span>
                            </div>
                        </div>

                        {/* Co-authors comparison */}
                        <div className="metric-row">
                            <span className="metric-label">Co-authors</span>
                            <div className="progress-container">
                                <div
                                    className="progress-bar"
                                    style={{
                                        width: `${calculatePercentage(
                                            professors.find(p => p.id === parseInt(selectedProf1))?.metrics.coAuthors,
                                            professors.find(p => p.id === parseInt(selectedProf2))?.metrics.coAuthors
                                        )}%`
                                    }}
                                >
                                    <span className="progress-value">
                                        {professors.find(p => p.id === parseInt(selectedProf1))?.metrics.coAuthors}
                                    </span>
                                </div>
                                <span className="progress-value right">
                                    {professors.find(p => p.id === parseInt(selectedProf2))?.metrics.coAuthors}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
