import React, { useState } from 'react';
import axios from 'axios';
import { BrainCircuit, Loader2, ClipboardList, Navigation, AlertCircle, CheckCircle2 } from 'lucide-react';

const PredictiveIntelligence = () => {
    const [loading, setLoading] = useState(false);
    const [simulationData, setSimulationData] = useState(null);
    const [error, setError] = useState(null);

    const runIntelligenceHub = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Fetch from complaints collection
            const complaintResponse = await axios.get('http://localhost:4000/api/complaints');
            const allComplaints = complaintResponse.data;

            // 2. Process intelligence using complaint data
            const intelligenceRes = await axios.post('http://localhost:4000/api/intelligence/process-intelligence', {
                complaints: allComplaints 
            });

            setSimulationData(intelligenceRes.data);
        } catch (err) {
            console.error("Intelligence Hub Error:", err);
            setError("Failed to generate predictive intelligence. Ensure backend and Python services are running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <BrainCircuit size={32} color="#1a73e8" className={loading ? "pulse" : ""} />
                    <div>
                        <h2 style={styles.title}>Complaint Intelligence Hub</h2>
                        <p style={styles.subtitle}>ML-Powered Priority Prediction & Resolution Routing</p>
                    </div>
                </div>
            </header>

            <div style={styles.actionArea}>
                {!loading ? (
                    <button onClick={runIntelligenceHub} style={styles.button}>
                        Generate Optimal Resolution Path
                    </button>
                ) : (
                    <div style={styles.loaderContainer}>
                        <Loader2 className="spinner" size={40} color="#1a73e8" />
                        <p style={{ marginTop: '10px', color: '#1a73e8', fontWeight: 'bold' }}>
                            Analyzing Complaint Hotspots...
                        </p>
                        <div style={styles.progressBarBg}>
                            <div className="progress-bar-fill" style={styles.progressBarFill}></div>
                        </div>
                    </div>
                )}
            </div>

            {error && <div style={styles.error}>{error}</div>}

            {simulationData && (
                <div style={styles.dashboard}>
                    <div style={styles.statCard}>
                        <ClipboardList size={20} color="#888" style={{ marginBottom: '8px' }} />
                        <span style={styles.statLabel}>Complaints Analyzed</span>
                        <span style={styles.statValue}>{simulationData.results?.length || 0}</span>
                    </div>
                    
                    <div style={styles.statCard}>
                        <div style={{ ...styles.indicator, backgroundColor: '#ff4d4d' }}></div>
                        <AlertCircle size={20} color="#ff4d4d" style={{ marginBottom: '8px' }} />
                        <span style={styles.statLabel}>High Priority</span>
                        <span style={{ ...styles.statValue, color: '#ff4d4d' }}>
                            {/* Assuming your ML or data defines priority */}
                            {simulationData.results?.filter(c => c.priority === 'High' || c.urgency > 70).length || 0}
                        </span>
                    </div>

                    <div style={styles.statCard}>
                        <Navigation size={20} color="#00ff88" style={{ marginBottom: '8px' }} />
                        <span style={styles.statLabel}>Optimized Distance</span>
                        <span style={{ ...styles.statValue, color: '#00ff88' }}>
                            {simulationData.route?.distance || '0'} km
                        </span>
                    </div>

                    <div style={styles.statCard}>
                        <CheckCircle2 size={20} color="#1a73e8" style={{ marginBottom: '8px' }} />
                        <span style={styles.statLabel}>Est. Resolution Time</span>
                        <span style={styles.statValue}>{simulationData.route?.duration?.formatted || '--'}</span>
                    </div>
                </div>
            )}

            {simulationData && (
                <div className="fade-in" style={styles.routeBox}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', margin: '0 0 10px 0' }}>
                        <Navigation size={18} color="#1a73e8" /> Smart Resolution Sequence
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '15px' }}>
                        The Ant Colony Optimization (ACO) algorithm has sequenced the complaints to minimize response time for high-priority issues.
                    </p>
                    <div style={styles.pathList}>
                        {simulationData.route?.route?.map((node, index) => (
                            <span key={index}>
                                <strong style={{ color: '#fff' }}>
                                    {node.title || node.complaint_type || `Complaint #${node.id || index}`}
                                </strong>
                                {index < simulationData.route.route.length - 1 ? (
                                    <span style={{ color: '#1a73e8', margin: '0 8px' }}>→</span>
                                ) : ''}
                            </span>
                        )) || "No route data available"}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.1); } 100% { opacity: 1; transform: scale(1); } }
                @keyframes progress { 0% { width: 0%; } 100% { width: 100%; } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .spinner { animation: spin 2s linear infinite; }
                .pulse { animation: pulse 1.5s ease-in-out infinite; }
                .progress-bar-fill { animation: progress 3s ease-in-out infinite; }
                .fade-in { animation: fadeIn 0.5s ease-out; }
            `}</style>
        </div>
    );
};

const styles = {
    container: {
        padding: '30px',
        backgroundColor: '#0f0f0f',
        color: '#e0e0e0',
        borderRadius: '16px',
        maxWidth: '950px',
        margin: '20px auto',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        border: '1px solid #222',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
        borderBottom: '1px solid #222',
        paddingBottom: '20px',
        marginBottom: '30px'
    },
    title: { margin: 0, color: '#fff', fontSize: '1.5rem' },
    subtitle: { margin: '5px 0 0', color: '#666', fontSize: '0.9rem' },
    actionArea: { 
        textAlign: 'center', 
        padding: '40px',
        backgroundColor: '#161616',
        borderRadius: '12px',
        marginBottom: '30px',
        border: '1px dashed #333'
    },
    button: {
        padding: '14px 32px',
        fontSize: '1rem',
        backgroundColor: '#1a73e8',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        boxShadow: '0 4px 15px rgba(26, 115, 232, 0.3)',
        transition: 'all 0.3s'
    },
    loaderContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
    progressBarBg: {
        width: '250px',
        height: '4px',
        backgroundColor: '#222',
        borderRadius: '2px',
        marginTop: '15px',
        overflow: 'hidden'
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#1a73e8',
        borderRadius: '2px'
    },
    dashboard: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
    },
    statCard: {
        backgroundColor: '#161616',
        padding: '25px',
        borderRadius: '12px',
        textAlign: 'center',
        border: '1px solid #222',
        position: 'relative'
    },
    indicator: {
        position: 'absolute',
        top: '12px',
        right: '12px',
        width: '8px',
        height: '8px',
        borderRadius: '50%'
    },
    statLabel: { display: 'block', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' },
    statValue: { fontSize: '1.8rem', fontWeight: '800', fontFamily: 'monospace' },
    routeBox: {
        backgroundColor: '#161616',
        padding: '25px',
        borderRadius: '12px',
        borderLeft: '4px solid #1a73e8'
    },
    pathList: {
        marginTop: '15px',
        fontSize: '0.85rem',
        lineHeight: '1.8',
        color: '#888',
        backgroundColor: '#0a0a0a',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #222',
        wordBreak: 'break-word'
    },
    error: { 
        color: '#ff4d4d', 
        backgroundColor: 'rgba(255, 77, 77, 0.1)', 
        padding: '15px', 
        borderRadius: '8px', 
        textAlign: 'center', 
        marginBottom: '20px', 
        border: '1px solid rgba(255, 77, 77, 0.2)' 
    }
};

export default PredictiveIntelligence;