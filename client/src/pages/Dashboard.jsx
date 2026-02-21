import React from 'react';

const Dashboard = () => {
    return (
        <div style={{ padding: '2rem' }}>
            <h2>Dashboard</h2>
            <p>Welcome to the Digital Printing Shop Management System!</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2rem' }}>
                <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
                    <h3>Orders</h3>
                    <p>Manage pending and completed orders.</p>
                </div>
                <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
                    <h3>Inventory</h3>
                    <p>Track materials and stock.</p>
                </div>
                <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
                    <h3>AI Prediction</h3>
                    <p>Check delay risks.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
