import express from 'express';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();
const filePath = path.join(__dirname, '../dane.json');

const loadTournamentData = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (error, data) => {
            if (error) reject(error);
            else resolve(JSON.parse(data));
        });
    });
};

const saveTournamentData = (data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (error) => {
            if (error) reject(error);
            else resolve();
        });
    });
};

router.get('/tournaments', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Powered-By', 'Express');
    res.setHeader('Content-Type', 'application/json');

    try {
        const data = await loadTournamentData(); 
        const tournaments = data.tournaments;

        res.status(200).json({
            tournaments,
            _links: {
                self: { href: 'http://localhost:3000/api/tournaments', method: 'GET' }
            }
        });
    } catch (error) {
        console.error('Error loading tournaments:', error);
        res.status(500).send('Error loading tournaments');
    }
});

router.get('/tournaments/:id', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Powered-By', 'Express');
    res.setHeader('Content-Type', 'application/json');

    const tournamentId = parseInt(req.params.id, 10);

    try {
        const data = await loadTournamentData();
        const tournament = data.tournaments.find(t => t.id === tournamentId);

        if (!tournament) {
            return res.status(404).json({
                error: 'Tournament not found'
            });
        }

        res.status(200).json({
            tournament,
            _links: {
                self: { href: `http://localhost:3000/api/tournaments/${tournamentId}`, method: 'GET' },
                matches: { href: `http://localhost:3000/api/tournaments/${tournamentId}/matches`, method: 'GET' },
                players: { href: `http://localhost:3000/api/players`, method: 'GET' }
            }
        });
    } catch (error) {
        console.error('Error loading tournament details:', error);
        res.status(500).send('Error loading tournament details');
    }
});

router.get('/tournaments/:tournamentId/matches', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Powered-By', 'Express');
    res.setHeader('Content-Type', 'application/json');

    const tournamentId = parseInt(req.params.tournamentId, 10);

    try {
        const data = await loadTournamentData();
        const tournament = data.tournaments.find(t => t.id === tournamentId);

        if (!tournament) {
            return res.status(404).json({
                error: 'Tournament not found'
            });
        }

        const matches = tournament.matches.map(matchId => {
            const match = data.matches.find(m => m.id === matchId);
            return match ? match : null;
        }).filter(m => m !== null);

        res.status(200).json({
            matches,
            _links: {
                self: { href: `http://localhost:3000/api/tournaments/${tournamentId}/matches`, method: 'GET' },
                tournament: { href: `http://localhost:3000/api/tournaments/${tournamentId}`, method: 'GET' },
                allTournaments: { href: 'http://localhost:3000/api/tournaments', method: 'GET' }
            }
        });
    } catch (error) {
        console.error('Error loading tournament matches:', error);
        res.status(500).send('Error loading tournament matches');
    }
});

router.put('/tournaments/:id', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Powered-By', 'Express');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Action', 'Tournament Update');
    res.setHeader('X-Request-ID', Date.now().toString());

    const tournamentId = parseInt(req.params.id, 10);
    const updatedTournament = req.body;

    if (!updatedTournament.name || !updatedTournament.year) {
        return res.status(400).json({
            error: 'Missing required fields',
            requiredFields: ['name', 'year']
        });
    }

    try {
        const data = await loadTournamentData();
        const tournamentIndex = data.tournaments.findIndex(t => t.id === tournamentId);

        if (tournamentIndex === -1) {
            return res.status(404).send('Tournament not found');
        }

        data.tournaments[tournamentIndex] = {
            ...data.tournaments[tournamentIndex],
            name: updatedTournament.name,
            year: updatedTournament.year,
            location: updatedTournament.location,
            surface: updatedTournament.surface
        };

        await saveTournamentData(data);

        res.status(200).json({
            message: 'Tournament updated successfully',
            tournament: data.tournaments[tournamentIndex],
            _links: {
                self: { href: `http://localhost:3000/api/tournaments/${tournamentId}`, method: 'GET' }
            }
        });
    } catch (error) {
        console.error('Error updating tournament:', error);
        res.status(500).send('Error updating tournament');
    }
});

router.post('/tournaments', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Powered-By', 'Express');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Action', 'Tournament Creation');
    res.setHeader('X-Request-ID', Date.now().toString());

    const newTournament = req.body;

    if (!newTournament.name || !newTournament.year || !newTournament.location || !newTournament.surface) {
        return res.status(400).json({
            error: 'Missing required fields',
            requiredFields: ['name', 'year', 'location', 'surface']
        });
    }

    try {
        const data = await loadTournamentData();

        const tournamentId = data.tournaments.length ? Math.max(...data.tournaments.map(t => t.id), 0) + 1 : 1;
        
        const tournament = {
            id: tournamentId, 
            ...newTournament
        };

        data.tournaments.push(tournament);
        await saveTournamentData(data);

        res.status(201).json({
            message: 'Tournament created successfully',
            tournament,
            _links: {
                self: { href: `http://localhost:3000/api/tournaments/${tournamentId}`, method: 'GET' },
                allTournaments: { href: 'http://localhost:3000/api/tournaments', method: 'GET' }
            }
        });
    } catch (error) {
        console.error('Error creating tournament:', error);
        res.status(500).send('Error creating tournament');
    }
});

router.delete('/tournaments/:id', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Action', 'Tournament Deletion');
    res.setHeader('X-Powered-By', 'Express');

    const tournamentId = parseInt(req.params.id, 10);

    try {
        const data = await loadTournamentData();
        const tournamentIndex = data.tournaments.findIndex(t => t.id === tournamentId);

        if (tournamentIndex === -1) {
            return res.status(404).send('Tournament not found');
        }

        data.tournaments.splice(tournamentIndex, 1);
        await saveTournamentData(data);

        res.status(200).json({
            message: `Tournament with ID ${tournamentId} has been deleted`,
            _links: {
                tournaments: { href: 'http://localhost:3000/api/tournaments', method: 'GET' }
            }
        });
    } catch (error) {
        console.error('Error deleting tournament:', error);
        res.status(500).send('Error deleting tournament');
    }
});

export default router;
