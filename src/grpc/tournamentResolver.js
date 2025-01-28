import data from "./dane.json" assert { type: "json" };
import { applyFilters } from "./filters.js";

const mapTournament = (tournament) => {
    return {
        id: tournament.id,
        name: tournament.name,
        location: tournament.location,
        year: tournament.year,
        surface: tournament.surface
    };
};

export const tournamentResolvers = {
    GetTournaments: (req, res) => {
        const { filter, sort } = req.request || {};
        let result = data.tournaments;

        if (filter) {
            result = result.filter((tournament) => applyFilters(tournament, filter));
        }

        if (sort) {
            const { field, order } = sort;
            result = result.sort((a, b) => {
                if (a[field] < b[field]) return order === "ASC" ? -1 : 1;
                if (a[field] > b[field]) return order === "ASC" ? 1 : -1;
                return 0;
            });
        }

        const tournaments = result.map(mapTournament);
        res(null, { tournaments });
    },

    GetTournament: (req, res) => {
        const id = req.request.id;
        const tournament = data.tournaments.find((item) => item.id === id);

        if (!tournament) {
            res({ code: 5, message: "Turniej nie został znaleziony" }, null);
            return;
        }

        const result = mapTournament(tournament);
        res(null, result);
    },

    UpdateTournament: (req, res) => {
        const { id, tournament: tournamentInput } = req.request;
        const tournamentIndex = data.tournaments.findIndex((item) => item.id === id);

        if (tournamentIndex === -1) {
            res({ code: 5, message: "Turniej nie został znaleziony" }, null);
            return;
        }

        data.tournaments[tournamentIndex] = {
            ...data.tournaments[tournamentIndex],
            ...tournamentInput,
            id,
        };

        const result = mapTournament(data.tournaments[tournamentIndex]);
        res(null, result);
    },

    DeleteTournament: (req, res) => {
        const id = req.request.id;
        const tournamentIndex = data.tournaments.findIndex((item) => item.id === id);

        if (tournamentIndex === -1) {
            return res(null, {
                success: false,
                message: "Turniej nie został znaleziony",
                code: "404",
            });
        }

        data.tournaments.splice(tournamentIndex, 1);
        res(null, {
            success: true,
            message: "Turniej został usunięty",
            code: "200",
        });
    },
};
