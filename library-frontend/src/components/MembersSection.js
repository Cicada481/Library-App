// src/components/MembersSection.js
import { useState, useEffect } from 'react';
import { Typography, Box, Divider } from '@mui/material';
import MemberForm from './MemberForm';
import MemberList from './MemberList';
import { getMembers } from '../services/api';

const MembersSection = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const data = await getMembers();
            setMembers(data);
        } catch (error) {
            console.error('Error fetching members:', error);
            setMembers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    return (
        <Box>
            <Typography variant="h5" component="h2" gutterBottom>
                Members
            </Typography>
            <MemberForm onMemberAdded={fetchMembers} />
            <Divider sx={{ my: 2 }} />
            {loading ? (
                <Typography>Loading members...</Typography>
            ) : (
                <MemberList 
                    members={members} 
                    onMemberUpdated={fetchMembers}
                    onMemberDeleted={fetchMembers}
                />
            )}
        </Box>
    );
};

export default MembersSection;
