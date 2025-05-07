const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const API_KEY = process.env.API_FOOTBALL_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

const leagues = {
  anglia: 39,
  niemcy: 78,
  hiszpania: 140,
  włochy: 135,
  francja: 61,
  polska: 106,
  rosja: 235,
  turcja: 203,
};

app.get('/matches/:country', async (req, res) => {
  const country = req.params.country.toLowerCase();
  const leagueId = leagues[country];
  
  if (!leagueId) {
    return res.status(400).json({ error: 'Błędny kraj' });
  }

  try {
    const response = await axios.get(`${BASE_URL}/fixtures`, {
      headers: {
        'x-apisports-key': API_KEY,
      },
      params: {
        league: leagueId,
        season: 2023, 
      }
    });

    res.json(response.data.response || []);
  } catch (err) {
    res.status(500).json({ 
      error: 'API Error',
      details: err.response?.data || err.message 
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));