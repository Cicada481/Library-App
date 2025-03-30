// src/components/BorrowsSection.js
import { useState, useEffect } from 'react';
import { Typography, Box, Divider } from '@mui/material';
import BorrowForm from './BorrowForm';
import BorrowList from './BorrowList';
import { getBorrows } from '../services/api';

const BorrowsSection = () => {
    const [borrows, setBorrows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const fetchBorrows = async () => {
        try {
            setLoading(true);
            const data = await getBorrows();
            setBorrows(data);
            setError('');
        } catch (error) {
            console.error('Error fetching borrows:', error);
            setError('Failed to load borrowed books');
            setBorrows([]);
        } finally {
            setLoading(false);
        }
    };

    const doRefresh = async () => {
        setRefreshTrigger(refreshTrigger => refreshTrigger + 1);
    }

    const handleRefresh = async () => {
        await doRefresh();
    }

    useEffect(() => {
        fetchBorrows();
    }, []);

    const handleBorrowAdded = async () => {
        await fetchBorrows();
    };

    const handleBorrowReturned = async () => {
        await fetchBorrows();

    };
    

    return (
        <Box>
            <Typography variant="h5" component="h2" gutterBottom>
                Borrow Management
            </Typography>
            
            <BorrowForm
                onBorrowAdded={handleBorrowAdded}
                refreshTrigger={refreshTrigger}
                handleRefresh={handleRefresh}
            />
            
            <Divider sx={{ my: 2 }} />
            
            {loading ? (
                <Typography>Loading borrowed books...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <>
                    <Typography variant="h6" gutterBottom>
                        Currently Borrowed Books
                    </Typography>
                    <BorrowList 
                        borrows={borrows} 
                        onBorrowReturned={handleBorrowReturned}
                        handleRefresh={handleRefresh}
                    />
                </>
            )}
        </Box>
    );
};

export default BorrowsSection;
