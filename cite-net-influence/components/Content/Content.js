'use client';
import { useState, useEffect } from 'react';
import './Content.css';

export default function Content() {
    const [universities, setUniversities] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedUniv1, setSelectedUniv1] = useState('');
    const [selectedUniv2, setSelectedUniv2] = useState('');
    const [selectedDept1, setSelectedDept1] = useState('');
    const [selectedDept2, setSelectedDept2] = useState('');
    const [selectedProf1, setSelectedProf1] = useState('');
    const [selectedProf2, setSelectedProf2] = useState('');
    const [departments, setDepartments] = useState({});
    const [professorsByDept, setProfessorsByDept] = useState({});

    // Fetch universities and departments data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get universities
                const response = await fetch('/api/universities');
                const univList = await response.json();
                
                setUniversities(univList.map((univ, index) => ({
                    id: index + 1,
                    name: univ
                })));

                // Initialize departments data structure
                const deptData = {};
                
                // Fetch departments for each university
                for (const univ of univList) {
                    const deptResponse = await fetch(`/api/departments/${encodeURIComponent(univ)}`);
                    const deptList = await deptResponse.json();
                    deptData[univ] = deptList;
                }
                
                setDepartments(deptData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Fetch professors when department is selected
    const fetchProfessorsForDepartment = async (university, department) => {
        try {
            const response = await fetch(
                `/api/professors/${encodeURIComponent(university)}/${encodeURIComponent(department)}`
            );
            const profList = await response.json();
            
            // Fetch metrics for each professor
            const professorsWithMetrics = await Promise.all(profList.map(async (prof) => {
                try {
                    // Fetch awards and publications data
                    const awardsResponse = await fetch(
                        `/api/data/${encodeURIComponent(university)}/${encodeURIComponent(department)}/${encodeURIComponent(prof)}/awards_and_publications.csv`
                    );
                    const awardsData = await awardsResponse.text();
                    
                    // Fetch co-authors data
                    const coAuthorsResponse = await fetch(
                        `/api/data/${encodeURIComponent(university)}/${encodeURIComponent(department)}/${encodeURIComponent(prof)}/co_authors.csv`
                    );
                    const coAuthorsData = await coAuthorsResponse.text();

                    // Parse CSV data
                    const awardsLines = awardsData.split('\n').filter(line => line.trim());
                    const coAuthorsLines = coAuthorsData.split('\n').filter(line => line.trim());

                    // Skip header row and get first data row
                    const awardsValues = awardsLines[1]?.split(',') || [];
                    const coAuthorsValues = coAuthorsLines[1]?.split(',') || [];

                    return {
                        id: `${university}-${department}-${prof}`,
                        name: prof,
                        university: university,
                        department: department,
                        metrics: {
                            awards: parseInt(awardsValues[0]) || 0,
                            publications: parseInt(awardsValues[1]) || 0,
                            coAuthors: parseInt(coAuthorsValues[0]) || 0,
                            // Add any other metrics from your CSV files here
                        }
                    };
                } catch (error) {
                    console.error(`Error fetching metrics for professor ${prof}:`, error);
                    return {
                        id: `${university}-${department}-${prof}`,
                        name: prof,
                        university: university,
                        department: department,
                        metrics: {
                            awards: 0,
                            publications: 0,
                            coAuthors: 0
                        }
                    };
                }
            }));

            return professorsWithMetrics;
        } catch (error) {
            console.error('Error fetching professors:', error);
            return [];
        }
    };

    // Handle university selection changes
    const handleUniv1Change = (e) => {
        const newUnivId = e.target.value;
        setSelectedUniv1(newUnivId);
        setSelectedDept1('');
        setSelectedProf1('');
    };

    const handleUniv2Change = (e) => {
        const newUnivId = e.target.value;
        setSelectedUniv2(newUnivId);
        setSelectedDept2('');
        setSelectedProf2('');
    };

    // Handle department selection changes
    const handleDept1Change = async (e) => {
        const newDept = e.target.value;
        setSelectedDept1(newDept);
        setSelectedProf1('');
        
        if (newDept && selectedUniv1) {
            const university = universities.find(u => u.id === parseInt(selectedUniv1))?.name;
            const profs = await fetchProfessorsForDepartment(university, newDept);
            setProfessorsByDept(prev => ({
                ...prev,
                [`${selectedUniv1}-${newDept}`]: profs
            }));
        }
    };

    const handleDept2Change = async (e) => {
        const newDept = e.target.value;
        setSelectedDept2(newDept);
        setSelectedProf2('');
        
        if (newDept && selectedUniv2) {
            const university = universities.find(u => u.id === parseInt(selectedUniv2))?.name;
            const profs = await fetchProfessorsForDepartment(university, newDept);
            setProfessorsByDept(prev => ({
                ...prev,
                [`${selectedUniv2}-${newDept}`]: profs
            }));
        }
    };

    // Handle professor selection changes
    const handleProf1Change = (e) => {
        setSelectedProf1(e.target.value);
    };

    const handleProf2Change = (e) => {
        setSelectedProf2(e.target.value);
    };

    // Helper function to calculate percentage
    const calculatePercentage = (value1, value2) => {
        const total = value1 + value2;
        return (value1 / total) * 100;
    };

    // Get departments for selected university
    const getUniversityDepartments = (univId) => {
        if (!univId) return [];
        const university = universities.find(u => u.id === parseInt(univId));
        return departments[university?.name] || [];
    };

    // Get professors for selected department
    const getDepartmentProfessors = (univId, dept) => {
        if (!univId || !dept) return [];
        return professorsByDept[`${univId}-${dept}`] || [];
    };

    // Helper function to find professor data
    const findProfessorData = (profId) => {
        if (!profId) return null;
        
        // Search through all professor lists to find matching ID
        for (const profList of Object.values(professorsByDept)) {
            const professor = profList.find(p => p.id === profId);
            if (professor) {
                return professor;
            }
        }
        return null;
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

                    {/* Department selectors */}
                    <div className="selector-pair">
                        <select
                            value={selectedDept1}
                            onChange={handleDept1Change}
                            disabled={!selectedUniv1}
                            className="department-select"
                        >
                            <option value="">Select Department 1</option>
                            {getUniversityDepartments(selectedUniv1).map((dept, index) => (
                                <option key={index} value={dept}>
                                    {dept}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedDept2}
                            onChange={handleDept2Change}
                            disabled={!selectedUniv2}
                            className="department-select"
                        >
                            <option value="">Select Department 2</option>
                            {getUniversityDepartments(selectedUniv2).map((dept, index) => (
                                <option key={index} value={dept}>
                                    {dept}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Professor selectors */}
                    <div className="selector-pair">
                        <select
                            value={selectedProf1}
                            onChange={handleProf1Change}
                            disabled={!selectedDept1}
                        >
                            <option value="">Select Professor 1</option>
                            {getDepartmentProfessors(selectedUniv1, selectedDept1).map(prof => (
                                <option
                                    key={prof.id}
                                    value={prof.id}
                                    disabled={prof.id === selectedProf2}
                                >
                                    {prof.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedProf2}
                            onChange={handleProf2Change}
                            disabled={!selectedDept2}
                        >
                            <option value="">Select Professor 2</option>
                            {getDepartmentProfessors(selectedUniv2, selectedDept2).map(prof => (
                                <option
                                    key={prof.id}
                                    value={prof.id}
                                    disabled={prof.id === selectedProf1}
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
                                <h3>{findProfessorData(selectedProf1)?.name}</h3>
                                <div className="metrics">
                                    <div className="metric">
                                        <label>Awards</label>
                                        <span>{findProfessorData(selectedProf1)?.metrics?.awards || 0}</span>
                                    </div>
                                    <div className="metric">
                                        <label>Publications</label>
                                        <span>{findProfessorData(selectedProf1)?.metrics?.publications || 0}</span>
                                    </div>
                                    <div className="metric">
                                        <label>Co-authors</label>
                                        <span>{findProfessorData(selectedProf1)?.metrics?.coAuthors || 0}</span>
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
                                <h3>{findProfessorData(selectedProf2)?.name}</h3>
                                <div className="metrics">
                                    <div className="metric">
                                        <label>Awards</label>
                                        <span>{findProfessorData(selectedProf2)?.metrics?.awards || 0}</span>
                                    </div>
                                    <div className="metric">
                                        <label>Publications</label>
                                        <span>{findProfessorData(selectedProf2)?.metrics?.publications || 0}</span>
                                    </div>
                                    <div className="metric">
                                        <label>Co-authors</label>
                                        <span>{findProfessorData(selectedProf2)?.metrics?.coAuthors || 0}</span>
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
                        {/* Awards comparison */}
                        <div className="metric-row">
                            <span className="metric-label">Awards</span>
                            <div className="progress-container">
                                <div
                                    className="progress-bar"
                                    style={{
                                        width: `${calculatePercentage(
                                            findProfessorData(selectedProf1)?.metrics?.awards || 0,
                                            findProfessorData(selectedProf2)?.metrics?.awards || 0
                                        )}%`
                                    }}
                                >
                                    <span className="progress-value">
                                        {findProfessorData(selectedProf1)?.metrics?.awards || 0}
                                    </span>
                                </div>
                                <span className="progress-value right">
                                    {findProfessorData(selectedProf2)?.metrics?.awards || 0}
                                </span>
                            </div>
                        </div>

                        {/* Publications comparison */}
                        <div className="metric-row">
                            <span className="metric-label">Publications</span>
                            <div className="progress-container">
                                <div
                                    className="progress-bar"
                                    style={{
                                        width: `${calculatePercentage(
                                            findProfessorData(selectedProf1)?.metrics?.publications || 0,
                                            findProfessorData(selectedProf2)?.metrics?.publications || 0
                                        )}%`
                                    }}
                                >
                                    <span className="progress-value">
                                        {findProfessorData(selectedProf1)?.metrics?.publications || 0}
                                    </span>
                                </div>
                                <span className="progress-value right">
                                    {findProfessorData(selectedProf2)?.metrics?.publications || 0}
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
                                            findProfessorData(selectedProf1)?.metrics?.coAuthors || 0,
                                            findProfessorData(selectedProf2)?.metrics?.coAuthors || 0
                                        )}%`
                                    }}
                                >
                                    <span className="progress-value">
                                        {findProfessorData(selectedProf1)?.metrics?.coAuthors || 0}
                                    </span>
                                </div>
                                <span className="progress-value right">
                                    {findProfessorData(selectedProf2)?.metrics?.coAuthors || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
