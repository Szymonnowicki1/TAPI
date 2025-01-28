import express from 'express';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();
const filePath = path.join(__dirname, '../dane.json');

const loadPlayerData = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (error, data) => {
            if (error) reject(error);
            else resolve(JSON.parse(data));
        });
    });
};

const savePlayerData = (data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (error) => {
            if (error) reject(error);
            else resolve();
        });
    });
};




router.get('/players', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Powered-By', 'Express');
    res.setHeader('Content-Type', 'application/json');

    try {
        const data = await loadPlayerData();
        const players = data.players;

        res.status(200).json({
            players,
            _links: {
                self: { href: 'http://localhost:3000/api/players', method: 'GET' },
                create: { href: 'http://localhost:3000/api/players', method: 'POST' },
                tournaments: { href: 'http://localhost:3000/api/tournaments', method: 'GET' }
            }
        });
    } catch (error) {
        console.error('Error loading players:', error);
        res.status(500).send('Error loading players');
    }
});

router.get('/players/:id/tournaments', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Powered-By', 'Express');
    res.setHeader('Content-Type', 'application/json');
    
    const playerId = parseInt(req.params.id, 10);

    try {
        const data = await loadPlayerData();
        const player = data.players.find(p => p.id === playerId);

        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }

        const playerTournaments = player.tournaments || [];

        res.status(200).json({
            playerId: player.id,
            tournaments: playerTournaments,
            _links: {
                self: { href: `http://localhost:3000/api/players/${playerId}/tournaments`, method: 'GET' },
                player: { href: `http://localhost:3000/api/players/${playerId}`, method: 'GET' }
            }
        });
    } catch (error) {
        console.error('Error loading player tournaments:', error);
        res.status(500).send('Error loading player tournaments');
    }
});

router.get('/players/:id', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Powered-By', 'Express');
    res.setHeader('Content-Type', 'application/json');

    const playerId = parseInt(req.params.id, 10);

    try {
        const data = await loadPlayerData();
        const player = data.players.find(p => p.id === playerId);

        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }

        res.status(200).json({
            player,
            _links: {
                self: { href: `http://localhost:3000/api/players/${playerId}`, method: 'GET' },
                players: { href: 'http://localhost:3000/api/players', method: 'GET' },
                update: { href: `http://localhost:3000/api/players/${playerId}`, method: 'PUT' },
                delete: { href: `http://localhost:3000/api/players/${playerId}`, method: 'DELETE' },
                tournaments: { href: `http://localhost:3000/api/tournaments`, method: 'GET' }
            }
        });
    } catch (error) {
        console.error('Error loading player details:', error);
        res.status(500).send('Error loading player details');
    }
});

router.put('/players/:id', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Powered-By', 'Express');
    res.setHeader('Content-Type', 'application/json');

    const playerId = parseInt(req.params.id, 10);
    const updatedPlayer = req.body;

    if (!updatedPlayer.ranking) {
        return res.status(400).json({
            error: 'Missing required field ranking',
            requiredFields: ['ranking']
        });
    }

    try {
        const data = await loadPlayerData();
        const playerIndex = data.players.findIndex(p => p.id === playerId);

        if (playerIndex === -1) {
            return res.status(404).send('Player not found');
        }

        data.players[playerIndex] = {
            ...data.players[playerIndex],
            ranking: updatedPlayer.ranking
        };

        await savePlayerData(data);

        res.status(200).json({
            message: 'Player ranking updated successfully',
            player: data.players[playerIndex],
            _links: {
                self: { href: `http://localhost:3000/api/players/${playerId}`, method: 'GET' },
                players: { href: 'http://localhost:3000/api/players', method: 'GET' },
                tournaments: { href: 'http://localhost:3000/api/tournaments', method: 'GET' }
            }
        });
    } catch (error) {
        console.error('Error updating player:', error);
        res.status(500).send('Error updating player');
    }
});

router.post('/players', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Powered-By', 'Express');
    res.setHeader('Content-Type', 'application/json');

    const newPlayer = req.body;

    if (!newPlayer.name || !newPlayer.age || !newPlayer.country || !newPlayer.ranking) {
        return res.status(400).json({
            error: 'Missing required fields',
            requiredFields: ['name', 'age', 'country', 'ranking']
        });
    }

    try {
        const data = await loadPlayerData();
        const newId = data.players.length ? Math.max(...data.players.map(player => player.id)) + 1 : 1;

        const playerToAdd = {
            id: newId,
            name: newPlayer.name,
            age: newPlayer.age,
            country: newPlayer.country,
            ranking: newPlayer.ranking
        };

        data.players.push(playerToAdd);
        await savePlayerData(data);

        res.status(201).json({
            message: 'Player added successfully',
            player: playerToAdd,
            _links: {
                self: { href: `http://localhost:3000/api/players/${newId}`, method: 'GET' },
                players: { href: 'http://localhost:3000/api/players', method: 'GET' },
                update: { href: `http://localhost:3000/api/players/${newId}`, method: 'PUT' },
                delete: { href: `http://localhost:3000/api/players/${newId}`, method: 'DELETE' }
            }
        });
    } catch (error) {
        console.error('Error adding player:', error);
        res.status(500).send('Error adding player');
    }
});

router.delete('/players/:id', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Powered-By', 'Express');
    res.setHeader('Content-Type', 'application/json');

    const playerId = parseInt(req.params.id, 10);

    try {
        const data = await loadPlayerData();
        const playerIndex = data.players.findIndex(p => p.id === playerId);

        if (playerIndex === -1) {
            return res.status(404).send('Player not found');
        }

        data.players.splice(playerIndex, 1);
        await savePlayerData(data);

        res.status(200).json({
            message: `Player with ID ${playerId} has been deleted`,
            _links: {
                players: { href: 'http://localhost:3000/api/players', method: 'GET' }
            }
        });
    } catch (error) {
        console.error('Error deleting player:', error);
        res.status(500).send('Error deleting player');
    }
});

export default router;
