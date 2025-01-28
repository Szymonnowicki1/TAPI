import data from "./dane.json" assert { type: "json" };
import { applyFilters } from "./filters.js";

const mapPlayer = (player) => {
    return {
      id: player.id,
      name: String(player.name), 
      age: player.age,
      country: player.country,
      ranking: player.ranking,
    };
  };
  
  

export const playerResolvers = {
    GetPlayers: (req, res) => {
        const { filter, sort } = req.request || {};
        let result = data.players;

        if (filter) {
            result = result.filter((player) => applyFilters(player, filter));
        }

        if (sort) {
            const { field, order } = sort;
            result = result.sort((a, b) => {
                if (a[field] < b[field]) return order === "ASC" ? -1 : 1;
                if (a[field] > b[field]) return order === "ASC" ? 1 : -1;
                return 0;
            });
        }

        const players = result.map(mapPlayer);  
        res(null, { players });
    },

    GetPlayer: (req, res) => {
        const id = parseInt(req.request.id, 10);
        const player = data.players.find((item) => item.id === id);
    
        if (!player) {
            return res({ code: 5, message: "Gracz nie został znaleziony" }, null);
        }
    
        const result = {
            id: player.id,
            name: player.name,
            age: player.age,
            country: player.country,
            ranking: player.ranking,
        };
    
        res(null, result);
    },
    
    
    
    UpdatePlayer: (req, res) => {
        const { id, playerInput } = req.request;
        const playerIndex = data.players.findIndex((item) => item.id === id);
    
        if (playerIndex === -1) {
            res({ code: 5, message: "Gracz nie został znaleziony" }, null);
            return;
        }
            const updatedPlayer = {
            ...data.players[playerIndex],
            ...playerInput,
            id, 
        };
    
        data.players[playerIndex] = updatedPlayer;
    
        const result = mapPlayer(updatedPlayer);  
        res(null, result);
    },
    

    DeletePlayer: (req, res) => {
        const id = req.request.id;
        const playerIndex = data.players.findIndex((item) => item.id === id);

        if (playerIndex === -1) {
            return res(null, {
                success: false,
                message: "Gracz nie został znaleziony",
                code: "404",
            });
        }

        data.players.splice(playerIndex, 1);
        res(null, {
            success: true,
            message: "Gracz został usunięty",
            code: "200",
        });
    },
};
