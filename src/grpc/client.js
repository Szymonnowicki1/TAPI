import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const tournamentPackageDefinition = protoLoader.loadSync("src/grpc/proto/tournament.proto");
const matchPackageDefinition = protoLoader.loadSync("src/grpc/proto/match.proto");
const playerPackageDefinition = protoLoader.loadSync("src/grpc/proto/player.proto");

const tournamentProto = grpc.loadPackageDefinition(tournamentPackageDefinition);
const matchProto = grpc.loadPackageDefinition(matchPackageDefinition);
const playerProto = grpc.loadPackageDefinition(playerPackageDefinition);

const clientTournament = new tournamentProto.tournaments.TournamentService(
    "127.0.0.1:50051",
    grpc.ChannelCredentials.createInsecure(),
    (err) => err && console.error('Błąd połączenia z serwisem turniejów:', err)
);

clientTournament.getTournaments({}, (error, response) => {
    if (error) {
        console.error('Błąd podczas zapytania do serwisu turniejów:', error);
    } else {
        console.log('Odpowiedź z serwisu turniejów:', response);
    }
});

const clientMatch = new matchProto.matches.MatchService(
    "127.0.0.1:50051",
    grpc.ChannelCredentials.createInsecure(),
    (err) => err && console.error('Błąd połączenia z serwisem meczów:', err)
);

clientMatch.getMatches({}, (error, response) => {
    if (error) {
        console.error('Błąd podczas zapytania do serwisu meczów:', error);
    } else {
        console.log('Odpowiedź z serwisu meczów:', response);
    }
});

const clientPlayer = new playerProto.players.PlayerService(
    "127.0.0.1:50051",
    grpc.ChannelCredentials.createInsecure(),
    (err) => err && console.error('Błąd połączenia z serwisem graczy:', err)
);

clientPlayer.getPlayers({}, (error, response) => {
    if (error) {
        console.error('Błąd podczas zapytania do serwisu graczy:', error);
    } else {
        console.log('Odpowiedź z serwisu graczy:', response);
    }
});
clientPlayer.getPlayer({ id: 4 }, (error, response) => {
    if (error) {
        console.error('Błąd:', error);
    } else {
        console.log('Odpowiedź:', response);
    }
});
clientPlayer.DeletePlayer({ id: 2 }, (error, response) => {
    if (error) {
        console.error('Błąd podczas usuwania zawodnika:', error);
    } else {
        console.log('Odpowiedź z serwisu po usunięciu zawodnika:', response);
    }
});
const updateRequest = {
    id: 1,
    playerInput: {
        name: "Iga Świątek",
        age: 27,
        country: "Poland",
        ranking: 16
    }
};

clientPlayer.UpdatePlayer(updateRequest, (error, response) => {
    if (error) {
        console.error('Błąd podczas aktualizacji zawodnika:', error);
    } else {
        console.log('Odpowiedź z serwisu po aktualizacji zawodnika:', response);
    }
});