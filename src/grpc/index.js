import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { tournamentResolvers } from "./tournamentResolver.js";
import { matchResolvers } from "./matchResolver.js";
import { playerResolvers } from "./playerResolver.js";

const tournamentPackageDefinition = protoLoader.loadSync("src/grpc/proto/tournament.proto");
const matchPackageDefinition = protoLoader.loadSync("src/grpc/proto/match.proto");
const playerPackageDefinition = protoLoader.loadSync("src/grpc/proto/player.proto");

const tournamentProto = grpc.loadPackageDefinition(tournamentPackageDefinition);
const matchProto = grpc.loadPackageDefinition(matchPackageDefinition);
const playerProto = grpc.loadPackageDefinition(playerPackageDefinition);

const server = new grpc.Server();

server.addService(tournamentProto.tournaments.TournamentService.service, tournamentResolvers);
server.addService(matchProto.matches.MatchService.service, matchResolvers);
server.addService(playerProto.players.PlayerService.service, playerResolvers);

server.bindAsync(
    "127.0.0.1:50051",
    grpc.ServerCredentials.createInsecure(),
    (err) => {
        if (err) {
            console.error('Błąd podczas uruchamiania serwera:', err);
            return;
        }
        server.start();
        console.log('Serwer gRPC uruchomiony na http://127.0.0.1:50051');
    }
);
