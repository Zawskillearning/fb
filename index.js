const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

// Define the port (Vercel automatically sets a port variable)
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Route to handle requests
app.get('/api/fb', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ success: false, message: 'Please provide the URL' });
    }

    try {
        const headers = {
            'sec-fetch-user': '?1',
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-site': 'none',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'cache-control': 'max-age=0',
            'authority': 'www.facebook.com',
            'upgrade-insecure-requests': '1',
            'accept-language': 'en-GB,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,en-US;q=0.6',
            'sec-ch-ua': '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
        };

        const response = await axios.get(url, { headers });
        const data = response.data;

        const hdLink = getHDLink(data);
        const sdLink = getSDLink(data);

        const result = {
            success: true,
            hdlink: hdLink,
            sdlink: sdLink,
            join: '@Yagami_xlight'
        };

        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Helper function to clean strings
function cleanStr(str) {
    return JSON.parse(`{"text": "${str}"}`).text;
}

// Function to extract the SD link
function getSDLink(content) {
    const regex = /browser_native_sd_url":"([^"]+)"/;
    const match = content.match(regex);
    if (match) {
        return cleanStr(match[1]);
    } else {
        return false;
    }
}

// Function to extract the HD link
function getHDLink(content) {
    const regex = /browser_native_hd_url":"([^"]+)"/;
    const match = content.match(regex);
    if (match) {
        return cleanStr(match[1]);
    } else {
        return false;
    }
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
