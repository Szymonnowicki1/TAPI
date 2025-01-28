import data from "./dane.json" assert { type: 'json' };
import { applyFilters, validatePlayerData, validateMatchData, validateTournamentData } from './filters.js';

export const resolvers = {
    Query: {
        players: (_, { filter, sort }) => {
            let result = data.players;
        
            if (filter) {
                const { minAge, maxAge } = filter[0];
        
                if (minAge !== undefined) {
                    result = result.filter(player => player.age >= minAge);
                }
        
                if (maxAge !== undefined) {
                    result = result.filter(player => player.age <= maxAge);
                }
        
                if (filter[0].country) {
                    result = result.filter(player => player.country.toLowerCase().includes(filter[0].country.toLowerCase()));
                }
        
                if (filter[0].minRanking !== undefined) {
                    result = result.filter(player => player.ranking >= filter[0].minRanking);
                }
        
                if (filter[0].maxRanking !== undefined) {
                    result = result.filter(player => player.ranking <= filter[0].maxRanking);
                }
            }
        
            if (sort) {
                const { field, order } = sort;
                result = result.sort((a, b) => {
                    if (a[field] < b[field]) return order === "ASC" ? -1 : 1;
                    if (a[field] > b[field]) return order === "ASC" ? 1 : -1;
                    return 0;
                });
            }
        
            return result;
        },

        player: (_, { id }) => {
            const player = data.players.find(p => p.id === id);
            if (!player) {
                return {
                    __typename: "ErrorResponse",
                    message: "Player not found",
                    errorCode: "404"
                };
            }
            return player;
        },

        matches: (_, { sort }) => {
            let result = data.matches; 
        
            if (sort) {
                const { field, order } = sort;
        
                result = result.sort((a, b) => {
                    if (a[field] < b[field]) return order === "ASC" ? -1 : 1;
                    if (a[field] > b[field]) return order === "ASC" ? 1 : -1;
                    return 0;
                });
            }
        
            return result.map((match) => {
                const player1 = data.players.find((p) => p.id === match.player1_id);
                const player2 = data.players.find((p) => p.id === match.player2_id);
        
                return {
                    ...match,
                    player1: player1 || null, 
                    player2: player2 || null, 
                };
            });
        },
        


        match: (_, { id }) => {
            const match = data.matches.find(m => m.id === id);
            if (!match) {
                return {
                    __typename: "ErrorResponse",
                    message: "Match not found",
                    errorCode: "404"
                };
            }
        
            const player1 = data.players.find(p => p.id === match.player1_id);
            const player2 = data.players.find(p => p.id === match.player2_id);
            const tournament = data.tournaments.find(t => t.id === match.tournament_id);
        
            if (!player1 || !player2 || !tournament) {
                return {
                    __typename: "ErrorResponse",
                    message: "Player(s) or Tournament not found",
                    errorCode: "404"
                };
            }
        
            return {
                ...match,
                player1,
                player2,
                tournament
            };
        },
        

        tournaments: (_, { sort }) => {
            let result = data.tournaments;

            if (sort) {
                const { field, order } = sort;
                result = result.sort((a, b) => {
                    if (a[field] < b[field]) return order === "ASC" ? -1 : 1;
                    if (a[field] > b[field]) return order === "ASC" ? 1 : -1;
                    return 0;
                });
            }

            return result;
        },

        tournament: (_, { id }) => {
            const tournament = data.tournaments.find(t => t.id === id);
            if (!tournament) {
                return {
                    __typename: "ErrorResponse",
                    message: "Tournament not found",
                    errorCode: "404"
                };
            }
            return tournament;
        }
    },

    Mutation: {
        createPlayer: (_, { playerInput }) => {
            validatePlayerData(playerInput);

            const newPlayer = {
                id: data.players.length + 1, 
                ...playerInput
            };
            data.players.push(newPlayer);
            return newPlayer;
        },

        updatePlayer: (_, { id, playerInput }) => {
            validatePlayerData(playerInput);

            const playerIndex = data.players.findIndex(p => p.id === id);
            if (playerIndex === -1) {
                throw new Error("Player not found");
            }

            data.players[playerIndex] = {
                ...data.players[playerIndex],
                ...playerInput
            };

            return data.players[playerIndex];
        },

        deletePlayer: (_, { id }) => {
            const playerIndex = data.players.findIndex(p => p.id === id);
            if (playerIndex === -1) {
                return { success: false, message: "Player not found", code: "404" };
            }

            data.players.splice(playerIndex, 1);
            return { success: true, message: "Player deleted", code: "200" };
        },

        createMatch: (_, { matchInput }) => {
            const { player1Id, player2Id, score1, score2, tournamentId, round, durationMinutes } = matchInput;
      
            const player1 = data.players.find(p => p.id === player1Id);
            const player2 = data.players.find(p => p.id === player2Id);
      
            if (!player1 || !player2) {
              throw new Error("One or both players not found");
            }
      
            const newMatch = {
              id: data.matches.length + 1,
              player1Id,
              player2Id,
              score: `${score1}-${score2}`,
              round,
              tournamentId,
              durationMinutes,
              winnerId: score1 > score2 ? player1Id : player2Id,
            };
      
            data.matches.push(newMatch);
      
            return {
              ...newMatch,
              player1,
              player2,
            };
          },



          updateMatch: (_, { id, matchInput }) => {
            const matchIndex = data.matches.findIndex(match => match.id === id);
      
            if (matchIndex === -1) {
              throw new Error("Match not found");
            }
      
            const match = data.matches[matchIndex];
      
            if (matchInput.score1 !== undefined && matchInput.score2 !== undefined) {
              match.score = `${matchInput.score1}-${matchInput.score2}`;
            }
            if (matchInput.durationMinutes !== undefined) {
              match.duration_minutes = matchInput.durationMinutes;
            }
            if (matchInput.round !== undefined) {
              match.round = matchInput.round;
            }
            if (matchInput.tournamentId !== undefined) {
              match.tournament_id = matchInput.tournamentId;
            }
      
            const player1 = data.players.find(p => p.id === match.player1_id);
            const player2 = data.players.find(p => p.id === match.player2_id);
      
            if (!player1 || !player2) {
              throw new Error("One or both players not found");
            }
      
            return {
              ...match,
              player1: player1,
              player2: player2,
            };
          },
        
        

        deleteMatch: (_, { id }) => {
            const matchIndex = data.matches.findIndex(m => m.id === id);
            if (matchIndex === -1) {
                return { success: false, message: "Match not found", code: "404" };
            }

            data.matches.splice(matchIndex, 1);
            return { success: true, message: "Match deleted", code: "200" };
        },

        createTournament: (_, { tournamentInput }) => {
            validateTournamentData(tournamentInput);

            const newTournament = {
                id: data.tournaments.length + 1,
                ...tournamentInput
            };
            data.tournaments.push(newTournament);
            return newTournament;
        },

        updateTournament: (_, { id, tournamentInput }) => {
            validateTournamentData(tournamentInput);

            const tournamentIndex = data.tournaments.findIndex(t => t.id === id);
            if (tournamentIndex === -1) {
                throw new Error("Tournament not found");
            }

            data.tournaments[tournamentIndex] = {
                ...data.tournaments[tournamentIndex],
                ...tournamentInput
            };

            return data.tournaments[tournamentIndex];
        },

        deleteTournament: (_, { id }) => {
            const tournamentIndex = data.tournaments.findIndex(t => t.id === id);
            if (tournamentIndex === -1) {
                return { success: false, message: "Tournament not found", code: "404" };
            }

            data.tournaments.splice(tournamentIndex, 1);
            return { success: true, message: "Tournament deleted", code: "200" };
        }
    }
};
