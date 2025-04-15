// src/services/api.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_NODE_API_URL;

// Member functions
export const addMember = async (memberData) => {
    const response = await axios.post(`${API_URL}/member`, memberData);
    return response.data;
};

export const getMembers = async () => {
    const response = await axios.get(`${API_URL}/members`);
    return response.data;
};

export const getMember = async (name) => {
    const response = await axios.get(`${API_URL}/member/${encodeURIComponent(name)}`);
    return response.data;
};

export const updateMember = async (name, memberData) => {
    const response = await axios.put(`${API_URL}/member/${encodeURIComponent(name)}`, memberData);
    return response.data;
};

export const deleteMember = async (name) => {
    const response = await axios.delete(`${API_URL}/member/${encodeURIComponent(name)}`);
    return response.data;
};

// Book functions
export const addBook = async (bookData) => {
    const response = await axios.post(`${API_URL}/book`, bookData);
    return response.data;
};

export const getBooks = async () => {
    const response = await axios.get(`${API_URL}/books`);
    return response.data;
};

export const getBook = async (title, author) => {
    const response = await axios.get(
        `${API_URL}/book/${encodeURIComponent(title)}/${encodeURIComponent(author)}`
    );
    return response.data;
};

export const updateBook = async (title, author, bookData) => {
    const response = await axios.put(
        `${API_URL}/book/${encodeURIComponent(title)}/${encodeURIComponent(author)}`, 
        bookData
    );
    return response.data;
};

export const deleteBook = async (title, author) => {
    const response = await axios.delete(
        `${API_URL}/book/${encodeURIComponent(title)}/${encodeURIComponent(author)}`
    );
    return response.data;
};

// Borrow functions
export const borrowBook = async (borrowData) => {
    try {
        const response = await axios.post(`${API_URL}/borrow`, borrowData);
        return response.data;
    } catch (error) {
        // Extract the most meaningful error message
        return new Error(error.response?.data?.error || error.message);
    }
};

export const getBorrows = async () => {
    const response = await axios.get(`${API_URL}/borrows`);
    return response.data;
};

export const returnBook = async (name, title, author) => {
    const response = await axios.delete(
        `${API_URL}/borrow/${encodeURIComponent(name)}/${encodeURIComponent(title)}/${encodeURIComponent(author)}`
    );
    return response.data;
};

export const getMemberStats = async (name) => {
    try {
        const response = await axios.get(`${API_URL}/member-report/${encodeURIComponent(name)}`);
        return response.data;
    } catch (error) {
        return new Error(error.response?.data?.error || error.message);
    }
};


export default {
    addMember,
    getMembers,
    getMember,
    updateMember,
    deleteMember,
    addBook,
    getBooks,
    getBook,
    updateBook,
    deleteBook,
    borrowBook,
    getBorrows,
    returnBook,
    getMemberStats
};
