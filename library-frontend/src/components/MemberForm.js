import { useState } from 'react';
import { TextField, Button, Box, Stack } from '@mui/material';
import { addMember } from '../services/api';

const MemberForm = ({ onMemberAdded }) => {
    const [member, setMember] = useState({
        name: '',
        email: '',
        age: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addMember({
                ...member,
                age: parseInt(member.age) // Convert age to number
            });
            // Reset form
            setMember({name: '', email: '', age: ''});;
            // Notify parent component to refresh member list
            if (onMemberAdded) onMemberAdded();
        } catch (error) {
            console.log('Error adding member:', error);
            alert('Failed to add member')
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                    label="Name"
                    value={member.name}
                    onChange={(e) => setMember({ ...member, name: e.target.value })}
                    required
                    size="small"
                />
                <TextField
                    label="Email"
                    type="email"
                    value={member.email}
                    onChange={(e) => setMember({ ...member, email: e.target.value })}
                    required
                    size="small"
                />
                <TextField
                    label="Age"
                    type="number"
                    value={member.age}
                    onChange={(e) => setMember({ ...member, age: e.target.value })}
                    required
                    size="small"
                />
                <Button type="submit" variant="contained" color="primary">
                    Add Member
                </Button>
            </Stack>
        </Box>
    );
};

export default MemberForm;