export const applyFilters = (item, filters) => {
    if (!filters || filters.length === 0) return true; 
    
    for (const { field, operation, value } of filters) {
        console.log("Applying filter", field, operation, value); 

        if (!operation || value === undefined) {
            throw new Error(`Invalid filter operation or value for field ${field}`);
        }

        const itemValue = item[field];
        let compareValue = value;
        let compareItemValue = itemValue;

        if (field === 'age' || field === 'ranking') {
            compareValue = parseInt(value, 10);
            compareItemValue = parseInt(itemValue, 10);
        }

        switch (operation) {
            case "EQUAL":
                if (compareItemValue !== compareValue) return false;
                break;
            case "NOT_EQUAL":
                if (compareItemValue === compareValue) return false;
                break;
            case "GREATER":
                if (compareItemValue <= compareValue) return false;
                break;
            case "GREATER_OR_EQUAL":
                if (compareItemValue < compareValue) return false;
                break;
            case "LESS":
                if (compareItemValue >= compareValue) return false;
                break;
            case "LESS_OR_EQUAL":
                if (compareItemValue > compareValue) return false;
                break;
            case "CONTAINS":
                if (typeof itemValue !== 'string' || !String(itemValue).toLowerCase().includes(String(value).toLowerCase())) return false;
                break;
            case "NOT_CONTAINS":
                if (typeof itemValue !== 'string' || String(itemValue).toLowerCase().includes(String(value).toLowerCase())) return false;
                break;
            default:
                throw new Error(`Unsupported filter operation: ${operation}`);
        }
    }
    return true;
};



export const validatePlayerData = (player) => {
    const requiredFields = ['name', 'age', 'country', 'ranking'];
    const missingFields = requiredFields.filter(field => !player[field]);

    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    if (typeof player.age !== 'number' || player.age < 18) {
        throw new Error('Age must be a number and at least 18');
    }

    if (typeof player.ranking !== 'number' || player.ranking <= 0) {
        throw new Error('Ranking must be a positive number');
    }
};

export const validateMatchData = (match) => {
    const requiredFields = ['player1Id', 'player2Id', 'score1', 'score2', 'tournamentId'];
    const missingFields = requiredFields.filter(field => !match[field]);

    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    if (typeof match.score1 !== 'number' || typeof match.score2 !== 'number') {
        throw new Error('Scores must be numbers');
    }
    
    if (match.score1 < 0 || match.score2 < 0) {
        throw new Error('Scores must be non-negative');
    }
};

export const validateTournamentData = (tournament) => {
    const requiredFields = ['name', 'location'];
    const missingFields = requiredFields.filter(field => !tournament[field]);

    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    
};
