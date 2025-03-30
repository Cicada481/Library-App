// src/components/MemberList.js
import { useState } from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Stack
} from '@mui/material';
import { getMembers, deleteMember, updateMember } from '../services/api';

const MemberList = ({ members, onMemberUpdated, onMemberDeleted }) => {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentMember, setCurrentMember] = useState(null);
    const [editedMember, setEditedMember] = useState({ name: '', email: '', age: '' });

    const handleEditClick = (member) => {
        setCurrentMember(member);
        setEditedMember({
            name: member.name,
            email: member.email,
            age: member.age
        });
        setEditDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setEditDialogOpen(false);
    };

    const handleSaveEdit = async () => {
        try {
            await updateMember(currentMember.name, {
                email: editedMember.email,
                age: parseInt(editedMember.age)
            });
            setEditDialogOpen(false);
            if (onMemberUpdated) onMemberUpdated();
        } catch (error) {
            console.error('Error updating member:', error);
            alert('Failed to update member');
        }
    };

    const handleDeleteClick = async (name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            try {
                await deleteMember(name);
                if (onMemberDeleted) onMemberDeleted();
            } catch (error) {
                console.error('Error deleting member:', error);
                alert('Failed to delete member');
            }
        }
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {members.map((member) => (
                            <TableRow key={member.name}>
                                <TableCell>{member.name}</TableCell>
                                <TableCell>{member.email}</TableCell>
                                <TableCell>{member.age}</TableCell>
                                <TableCell>
                                    <Button 
                                        size="small" 
                                        onClick={() => handleEditClick(member)}
                                        sx={{ mr: 1 }}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        size="small" 
                                        color="error" 
                                        onClick={() => handleDeleteClick(member.name)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit Member Dialog */}
            <Dialog open={editDialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Edit Member</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Name"
                            value={currentMember?.name || ''}
                            disabled
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            value={editedMember.email}
                            onChange={(e) => setEditedMember({ ...editedMember, email: e.target.value })}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Age"
                            type="number"
                            value={editedMember.age}
                            onChange={(e) => setEditedMember({ ...editedMember, age: e.target.value })}
                            fullWidth
                            required
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSaveEdit} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default MemberList;
