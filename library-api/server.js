require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PYTHON_API_URL = process.env.FLASK_API_URL;

// Member endpoints
app.post('/member', async(req, res) => {
    try {
        const response = await axios.post(`${PYTHON_API_URL}/member`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Error adding member:', error.message);
        res.status(error.response?.status || 500).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

app.get('/members', async (req, res) => {
    try {
        console.log('Fetching members from Python API...');
        const response = await axios.get(`${PYTHON_API_URL}/members`);
        console.log('Response received:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching members:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        res.status(error.response?.status || 500).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

app.get('/member/:name', async (req, res) => {
    try {
        const response = await axios.get(`${PYTHON_API_URL}/member/${encodeURIComponent(req.params.name)}`);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

app.put('/member/:name', async (req, res) => {
    try {
        const response = await axios.put(`${PYTHON_API_URL}/member/${encodeURIComponent(req.params.name)}`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

app.delete('/member/:name', async (req, res) => {
    try {
        const response = await axios.delete(`${PYTHON_API_URL}/member/${encodeURIComponent(req.params.name)}`);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

// Book endpoints
app.post('/book', async (req, res) => {
    try {
        const response = await axios.post(`${PYTHON_API_URL}/book`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Error adding book:', error.message);
        res.status(error.response?.status || 500).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

app.get('/books', async (req, res) => {
    try {
        console.log('Fetching books from Python API...');
        const response = await axios.get(`${PYTHON_API_URL}/books`);
        console.log('Response received:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching books:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        res.status(error.response?.status || 500).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

app.get('/book/:title/:author', async (req, res) => {
    try {
        const { title, author } = req.params;
        const response = await axios.get(
            `${PYTHON_API_URL}/book/${encodeURIComponent(title)}/${encodeURIComponent(author)}`
        );
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

app.put('/book/:title/:author', async (req, res) => {
    try {
        const { title, author } = req.params;
        const response = await axios.put(
            `${PYTHON_API_URL}/book/${encodeURIComponent(title)}/${encodeURIComponent(author)}`, 
            req.body
        );
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

app.delete('/book/:title/:author', async (req, res) => {
    try {
        const { title, author } = req.params;
        const response = await axios.delete(
            `${PYTHON_API_URL}/book/${encodeURIComponent(title)}/${encodeURIComponent(author)}`
        );
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

// Borrow endpoints
app.post('/borrow', async (req, res) => {
    try {
        const response = await axios.post(`${PYTHON_API_URL}/borrow`, req.body);
        res.json(response.data);
    } catch (error) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.error || 'An unexpected error occurred';
        res.status(status).json({ error: message });
    }
});

app.get('/borrows', async (req, res) => {
    try {
        const response = await axios.get(`${PYTHON_API_URL}/borrows`);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

app.delete('/borrow/:name/:title/:author', async (req, res) => {
    try {
        const { name, title, author } = req.params;
        const response = await axios.delete(
            `${PYTHON_API_URL}/borrow/${encodeURIComponent(name)}/${encodeURIComponent(title)}/${encodeURIComponent(author)}`
        );
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

// Add this to your existing server.js file

// Member report endpoint
app.get('/member-report/:name', async (req, res) => {
    try {
        const { name } = req.params;
        console.log(`Fetching member report for ${name} from Python API...`);
        const response = await axios.get(`${PYTHON_API_URL}/member-report/${encodeURIComponent(name)}`);
        console.log('Response received:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching member report:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        res.status(error.response?.status || 500).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});


// Test endpoint
app.get('/test', (req, res) => {
    res.json({ message: 'API server is working' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
