export const applyFilters = (item, filter) => {
    if (!filter) return true;

    return Object.entries(filter).every(([key, value]) => {
        if (!value) return true;

        if (key === 'base' && typeof value === 'object') {
            return applyFilters(item, value);
        }

        if (Array.isArray(item[key])) {
            return item[key].includes(value);
        }

        if (typeof item[key] === 'string' && typeof value === 'string') {
            return item[key].toLowerCase().includes(value.toLowerCase());
        }

        return item[key] === value;
    });
};

export const validatePlayerId = (id) => {
    return typeof id === 'string' && id.length > 0;
};

export const validatePlayerData = (player) => {
    const requiredFields = ['id', 'name', 'ranking'];
    const missingFields = requiredFields.filter(field => !player[field]);

    if (missingFields.length > 0) {
        throw new Error(`Brakujące wymagane pola: ${missingFields.join(', ')}`);
    }

    if (isNaN(Number(player.ranking))) {
        throw new Error('Ranking musi być liczbą');
    }
};

export const validateTournamentData = (tournament) => {
    const requiredFields = ['id', 'name', 'startDate', 'endDate'];
    const missingFields = requiredFields.filter(field => !tournament[field]);

    if (missingFields.length > 0) {
        throw new Error(`Brakujące wymagane pola: ${missingFields.join(', ')}`);
    }

    if (isNaN(Date.parse(tournament.startDate)) || isNaN(Date.parse(tournament.endDate))) {
        throw new Error('Nieprawidłowy format daty turnieju');
    }

    if (new Date(tournament.startDate) > new Date(tournament.endDate)) {
        throw new Error('Data rozpoczęcia nie może być późniejsza niż data zakończenia');
    }
};

export const validateMatchData = (match) => {
    const requiredFields = ['id', 'tournamentId', 'player1Id', 'player2Id', 'score'];
    const missingFields = requiredFields.filter(field => !match[field]);

    if (missingFields.length > 0) {
        throw new Error(`Brakujące wymagane pola: ${missingFields.join(', ')}`);
    }

    if (typeof match.score !== 'string' || !/^(\d+-\d+)$/.test(match.score)) {
        throw new Error('Nieprawidłowy format wyniku meczu (np. "2-1")');
    }
};

export const sortItems = (items, sort) => {
    if (!sort || !sort.field) return items;

    const { field, order = 'ASC' } = sort;
    return [...items].sort((a, b) => {
        const aValue = a[field];
        const bValue = b[field];

        if (aValue < bValue) return order === 'ASC' ? -1 : 1;
        if (aValue > bValue) return order === 'ASC' ? 1 : -1;
        return 0;
    });
};
