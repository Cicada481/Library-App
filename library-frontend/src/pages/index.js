// src/pages/index.js
import { useState } from 'react';
import { Container, Typography, Box, Divider, Paper, Tabs, Tab } from '@mui/material';
import MembersSection from '../components/MembersSection';
import BooksSection from '../components/BooksSection';
import BorrowsSection from '../components/BorrowsSection';
import ReportsSection from '../components/ReportsSection';

export default function Home() {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Library Management System
                </Typography>
                
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={activeTab} onChange={handleTabChange}>
                        <Tab label="Members" />
                        <Tab label="Books" />
                        <Tab label="Borrows" />
                        <Tab label="Reports" />
                    </Tabs>
                </Box>

                {activeTab === 0 && (
                    <MembersSection />
                )}
                
                {activeTab === 1 && (
                    <BooksSection />
                )}
                
                {activeTab === 2 && (
                    <BorrowsSection />
                )}
                
                {activeTab === 3 && (
                    <ReportsSection />
                )}
            </Paper>
        </Container>
    );
}
