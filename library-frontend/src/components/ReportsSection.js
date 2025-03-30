// src/components/ReportsSection.js
import { useState, useEffect } from 'react';
import { 
    Typography, Box, FormControl, InputLabel, Select, MenuItem, 
    Button, Paper, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Card, CardContent, Grid, Alert, Stack
} from '@mui/material';
import { getMembers, getMemberStats } from '../services/api';

const ReportsSection = () => {
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState('');
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch members for dropdown
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const data = await getMembers();
                setMembers(data || []);
            } catch (err) {
                console.error('Error fetching members:', err);
                setError('Failed to load members');
            }
        };

        fetchMembers();
    }, []);

    const handleGenerateReport = async () => {
        if (!selectedMember) {
            setError('Please select a member');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const data = await getMemberStats(selectedMember);
            setReport(data);
        } catch (err) {
            console.error('Error fetching member report:', err);
            setError(err.message || 'Failed to generate report');
            setReport(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h5" component="h2" gutterBottom>
                Member Statistics Report
            </Typography>
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            
            <Box sx={{ mb: 4 }}>
                <Stack spacing={2}>
                    <FormControl fullWidth>
                        <InputLabel id="member-select-label">Select Member</InputLabel>
                        <Select
                            labelId="member-select-label"
                            value={selectedMember}
                            label="Select Member"
                            onChange={(e) => setSelectedMember(e.target.value)}
                        >
                            {members.map((member) => (
                                <MenuItem key={member.name} value={member.name}>
                                    {member.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box>
                        <Button 
                            variant="contained" 
                            onClick={handleGenerateReport}
                            disabled={!selectedMember || loading}
                        >
                            {loading ? 'Generating...' : 'Generate Report'}
                        </Button>
                    </Box>
                </Stack>
            </Box>

            {report && (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Report for {report.member_details.name}
                    </Typography>

                    <TableContainer component={Paper} sx={{ mb: 4 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Age</TableCell>
                                    <TableCell>Books Borrowed</TableCell>
                                    <TableCell>Avg. Book Length</TableCell>
                                    <TableCell>Avg. Book Year</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>{report.member_details.email}</TableCell>
                                    <TableCell>{report.member_details.age}</TableCell>
                                    <TableCell>{report.statistics.books_borrowed}</TableCell>
                                    <TableCell>{report.statistics.avg_book_length ? `${report.statistics.avg_book_length} pages` : 'N/A'}</TableCell>
                                    <TableCell>{report.statistics.avg_book_year || 'N/A'}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {report.borrowed_books && report.borrowed_books.length > 0 && (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Borrowed Books
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Author</TableCell>
                                            <TableCell>Year Published</TableCell>
                                            <TableCell>Number of Pages</TableCell>
                                            <TableCell>Available Copies</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {report.borrowed_books.map((book) => (
                                            <TableRow key={`${book.title}-${book.author}`}>
                                                <TableCell>{book.title}</TableCell>
                                                <TableCell>{book.author}</TableCell>
                                                <TableCell>{book.year_published}</TableCell>
                                                <TableCell>{book.num_pages} pages</TableCell>
                                                <TableCell>{book.num_copies}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )}
                </Box>
            )}

        </Box>
    );
};

export default ReportsSection;
