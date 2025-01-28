import data from "./dane.json" assert { type: "json" };
import { applyFilters } from "./filters.js";

const mapMatch = (match) => {
    return {
        id: match.id,
        player1: match.player1,
        player2: match.player2,
        tournament: match.tournament,
        score: match.score,
        winner: match.winner,
        duration_minutes: match.duration_minutes,
    };
};

export const matchResolvers = {
    GetMatches: (req, res) => {
        const { filter, sort } = req.request || {};
        let result = data.matches;

        if (filter) {
            result = result.filter((match) => applyFilters(match, filter));
        }

        if (sort) {
            const { field, order } = sort;
            result = result.sort((a, b) => {
                if (a[field] < b[field]) return order === "ASC" ? -1 : 1;
                if (a[field] > b[field]) return order === "ASC" ? 1 : -1;
                return 0;
            });
        }

        const matches = result.map(mapMatch);
        res(null, { matches });
    },

    GetMatch: (req, res) => {
        const id = req.request.id;
        const match = data.matches.find((item) => item.id === id);

        if (!match) {
            res({ code: 5, message: "Mecz nie został znaleziony" }, null);
            return;
        }

        const result = mapMatch(match);
        res(null, result);
    },

    UpdateMatch: (req, res) => {
        const { id, match: matchInput } = req.request;
        const matchIndex = data.matches.findIndex((item) => item.id === id);

        if (matchIndex === -1) {
            res({ code: 5, message: "Mecz nie został znaleziony" }, null);
            return;
        }

        data.matches[matchIndex] = {
            ...data.matches[matchIndex],
            ...matchInput,
            id,
        };

        const result = mapMatch(data.matches[matchIndex]);
        res(null, result);
    },

    DeleteMatch: (req, res) => {
        const id = req.request.id;
        const matchIndex = data.matches.findIndex((item) => item.id === id);

        if (matchIndex === -1) {
            return res(null, {
                success: false,
                message: "Mecz nie został znaleziony",
                code: "404",
            });
        }

        data.matches.splice(matchIndex, 1);
        res(null, {
            success: true,
            message: "Mecz został usunięty",
            code: "200",
        });
    },
};
