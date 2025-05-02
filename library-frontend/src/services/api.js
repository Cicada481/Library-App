// src/services/api.js
import axios from 'axios';

// --- Workaround for App Engine Env Variable Issue ---
// Variable to store the fetched API URL after it's retrieved
let fetchedApiUrl = null;

// Variable to store the Promise of the fetch operation, to avoid fetching multiple times simultaneously
let fetchingPromise = null;

// Internal function to fetch the API URL from our own frontend serverless function (/api/config)
const fetchApiUrl = async () => {
    try {
        // Call the API route we created in pages/api/config.js
        console.log('Fetching API URL from /api/config...'); // For debugging
        const response = await axios.get('/api/config');
        console.log('Successfully fetched API URL:', response.data.nodeApiUrl); // For debugging
        return response.data.nodeApiUrl; // Return the URL string from the server
    } catch (error) {
        console.error('Failed to fetch API URL from /api/config:', error); // Log error if fetching fails
        // Propagate the error upwards
        throw new Error('Could not retrieve API configuration: ' + (error.response?.data?.error || error.message));
    }
};

// Internal async function to ensure fetchedApiUrl is populated before any API call.
// It fetches if needed, or waits for an ongoing fetch.
const _ensureApiUrl = async () => {
    // If the URL is already fetched, just return
    if (fetchedApiUrl) {
        return;
    }

    // If a fetch is already in progress, wait for that one to complete
    if (fetchingPromise) {
        await fetchingPromise;
        // After awaiting, the URL should be fetched if the promise resolved successfully
        if (fetchedApiUrl) {
            return;
        }
        // If promise resolved but fetchedApiUrl is still null, the fetch likely failed but didn't throw
         throw new Error('API URL fetch promise completed, but URL is still missing.');
    }

    // No URL fetched and no fetch in progress, so start fetching
    // Store the promise so other calls can wait for this fetch
    fetchingPromise = fetchApiUrl();
    try {
        fetchedApiUrl = await fetchingPromise; // Wait for the fetch and store the result
    } finally {
        // Clear the promise after it settles (either resolves or rejects)
        fetchingPromise = null;
    }

    // If fetchedApiUrl is still null here, the fetchApiUrl must have thrown an error, which was caught above
    // and should have propagated. This check is a safeguard.
     if (!fetchedApiUrl) {
         throw new Error('API URL fetch completed but returned no URL.');
     }
};
// --- End Workaround ---


// --- Member functions (Original structure + added await _ensureApiUrl()) ---
export const addMember = async (memberData) => {
    await _ensureApiUrl(); // Ensure API URL is available before the call
    const response = await axios.post(`${fetchedApiUrl}/member`, memberData); // Use the fetched URL
    return response.data;
};

export const getMembers = async () => {
    await _ensureApiUrl(); // Ensure API URL is available before the call
    const response = await axios.get(`${fetchedApiUrl}/members`); // Use the fetched URL
    return response.data;
};

export const getMember = async (name) => {
    await _ensureApiUrl(); // Ensure API URL is available before the call
    const response = await axios.get(`${fetchedApiUrl}/member/${encodeURIComponent(name)}`); // Use the fetched URL
    return response.data;
};

export const updateMember = async (name, memberData) => {
    await _ensureApiUrl(); // Ensure API URL is available before the call
    const response = await axios.put(`${fetchedApiUrl}/member/${encodeURIComponent(name)}`, memberData); // Use the fetched URL
    return response.data;
};

export const deleteMember = async (name) => {
    await _ensureApiUrl(); // Ensure API URL is available before the call
    const response = await axios.delete(`${fetchedApiUrl}/member/${encodeURIComponent(name)}`); // Use the fetched URL
    return response.data;
};

// --- Book functions (Original structure + added await _ensureApiUrl()) ---
export const addBook = async (bookData) => {
    await _ensureApiUrl(); // Ensure API URL is available before the call
    const response = await axios.post(`${fetchedApiUrl}/book`, bookData); // Use the fetched URL
    return response.data;
};

export const getBooks = async () => {
    await _ensureApiUrl(); // Ensure API URL is available before the call
    const response = await axios.get(`${fetchedApiUrl}/books`); // Use the fetched URL
    return response.data;
};

export const getBook = async (title, author) => {
    await _ensureApiUrl(); // Ensure API URL is available before the call
    const response = await axios.get(
        `${fetchedApiUrl}/book/${encodeURIComponent(title)}/${encodeURIComponent(author)}` // Use the fetched URL
    );
    return response.data;
};

export const updateBook = async (title, author, bookData) => {
    await _ensureApiUrl(); // Ensure API URL is available before the call
    const response = await axios.put(
        `${fetchedApiUrl}/book/${encodeURIComponent(title)}/${encodeURIComponent(author)}`,
        bookData
    );
    return response.data;
};

export const deleteBook = async (title, author) => {
    await _ensureApiUrl(); // Ensure API URL is available before the call
    const response = await axios.delete(
        `${fetchedApiUrl}/book/${encodeURIComponent(title)}/${encodeURIComponent(author)}` // Use the fetched URL
    );
    return response.data;
};

// --- Borrow functions (Original structure + added await _ensureApiUrl()) ---
export const borrowBook = async (borrowData) => {
    await _ensureApiUrl(); // Ensure API URL is available before the call
    try {
        const response = await axios.post(`${fetchedApiUrl}/borrow`, borrowData); // Use the fetched URL
        return response.data;
    } catch (error) {
        // Extract the most meaningful error message
        console.error('Error in borrowBook:', error); // Added console.error
        return new Error(error.response?.data?.error || error.message);
    }
};

export const getBorrows = async () => {
    await _ensureApiUrl(); // Ensure API URL is available before the call
    const response = await axios.get(`${fetchedApiUrl}/borrows`); // Use the fetched URL
    return response.data;
};

export const returnBook = async (name, title, author) => {
    await _ensureApiUrl(); // Ensure API URL is available before the call
    const response = await axios.delete(
        `${fetchedApiUrl}/borrow/${encodeURIComponent(name)}/${encodeURIComponent(title)}/${encodeURIComponent(author)}` // Use the fetched URL
    );
    return response.data;
};

// --- Member Report function (Original structure + added await _ensureApiUrl()) ---
export const getMemberStats = async (name) => {
    await _ensureApiUrl(); // Ensure API URL is available before the call
    try {
        const response = await axios.get(`${fetchedApiUrl}/member-report/${encodeURIComponent(name)}`); // Use the fetched URL
        return response.data;
    } catch (error) {
        console.error('Error in getMemberStats:', error); // Added console.error
        return new Error(error.response?.data?.error || error.message);
    }
};


// --- Default Export (Keep original structure) ---
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