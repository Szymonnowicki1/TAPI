import express from 'express';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();
const filePath = path.join(__dirname, '../dane.json');

const loadMatchData = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (error, data) => {
            if (error) reject(error);
            else resolve(JSON.parse(data));
        });
    });
};

const saveMatchData = (data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (error) => {
            if (error) reject(error);
            else resolve();
        });
    });
};

router.get('/matches', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Powered-By', 'Express');
    res.setHeader('Content-Type', 'application/json');

    try {
        const data = await loadMatchData();
        const matches = data.matches;

        res.status(200).json({
            matches,
            _links: {
                self: { href: 'http://localhost:3000/api/matches', method: 'GET' }
            }
        });
    } catch (error) {
        console.error('Error loading matches:', error);
        res.status(500).send('Error loading matches');
    }
});

router.get('/matches/:id', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Powered-By', 'Express');
    res.setHeader('Content-Type', 'application/json');

    const matchId = parseInt(req.params.id, 10);

    try {
        const data = await loadMatchData();
        const match = data.matches.find(m => m.id === matchId);

        if (!match) {
            return res.status(404).json({
                error: 'Match not found'
            });
        }

        res.status(200).json({
            match,
            _links: {
                self: { href: `http://localhost:3000/api/matches/${matchId}`, method: 'GET' },
                tournament: { href: `http://localhost:3000/api/tournaments/${match.tournament_id}`, method: 'GET' },
                players: { href: 'http://localhost:3000/api/players', method: 'GET' }
            }
        });
    } catch (error) {
        console.error('Error loading match details:', error);
        res.status(500).send('Error loading match details');
    }
});

router.post('/matches', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Powered-By', 'Express');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Action', 'Match Creation');
    res.setHeader('X-Request-ID', Date.now().toString());

    const newMatch = req.body;

    if (!newMatch.score || !newMatch.player1_id || !newMatch.player2_id || !newMatch.tournament_id) {
        return res.status(400).json({
            error: 'Missing required fields',
            requiredFields: ['score', 'player1_id', 'player2_id', 'tournament_id']
        });
    }

    try {
        const data = await loadMatchData();

        const matchId = data.matches.length ? Math.max(...data.matches.map(m => m.id), 0) + 1 : 1;
        
        const match = {
            id: matchId, 
            ...newMatch,
            duration_minutes: newMatch.duration_minutes || 90 
        };

        data.matches.push(match);
        await saveMatchData(data);

        res.status(201).json({
            message: 'Match created successfully',
            match,
            _links: {
                self: { href: `http://localhost:3000/api/matches/${matchId}`, method: 'GET' },
                tournament: { href: `http://localhost:3000/api/tournaments/${match.tournament_id}`, method: 'GET' },
                players: { href: 'http://localhost:3000/api/players', method: 'GET' }
            }
        });
    } catch (error) {
        console.error('Error creating match:', error);
        res.status(500).send('Error creating match');
    }
});


router.delete('/matches/:id', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Action', 'Match Deletion');
    res.setHeader('X-Powered-By', 'Express');

    const matchId = parseInt(req.params.id, 10);

    try {
        const data = await loadMatchData();
        const matchIndex = data.matches.findIndex(m => m.id === matchId);

        if (matchIndex === -1) {
            return res.status(404).send('Match not found');
        }

        data.matches.splice(matchIndex, 1);
        await saveMatchData(data);

        res.status(200).json({
            message: `Match with ID ${matchId} has been deleted`,
            _links: {
                matches: { href: 'http://localhost:3000/api/matches', method: 'GET' }
            }
        });
    } catch (error) {
        console.error('Error deleting match:', error);
        res.status(500).send('Error deleting match');
    }
});

router.get('/matches/:id/players', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Powered-By', 'Express');
    res.setHeader('Content-Type', 'application/json');

    const matchId = parseInt(req.params.id, 10);

    try {
        const data = await loadMatchData();
        
        const match = data.matches.find(m => m.id === matchId);
        if (!match) {
            return res.status(404).json({
                error: 'Match not found'
            });
        }

        const player1 = data.players.find(p => p.id === match.player1_id);
        const player2 = data.players.find(p => p.id === match.player2_id);

        if (!player1 || !player2) {
            return res.status(404).json({
                error: 'Player(s) not found for this match'
            });
        }

        res.status(200).json({
            match,
            players: {
                player1,
                player2
            },
            _links: {
                self: { href: `http://localhost:3000/api/matches/${matchId}/players`, method: 'GET' },
                match: { href: `http://localhost:3000/api/matches/${matchId}`, method: 'GET' },
                players: { href: `http://localhost:3000/api/players`, method: 'GET' }
            }
        });
    } catch (error) {
        console.error('Error fetching match and players:', error);
        res.status(500).send('Error fetching match and players');
    }
});


export default router;
