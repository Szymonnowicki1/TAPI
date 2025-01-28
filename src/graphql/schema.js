export const typeDefs = `#graphql
scalar Name

type Player {
    id: Int!
    name: Name!
    age: Int!
    country: String!
    ranking: Int!
}

type Match {
    id: ID!
    player1: Player 
    player2: Player
    tournament: Tournament
    score: String
    winner: Player
    duration_minutes: Int
}

type Tournament {
    id: Int!
    name: String!
    location: String!
    year: Int!
    surface: String!
}

input PlayerInput {
    name: Name! 
    age: Int!
    country: String!
    ranking: Int!
}

input MatchInput {
    player1Id: Int!
    player2Id: Int!
    score1: Int!
    score2: Int!
    tournamentId: Int!
    round: String!
}

input TournamentInput {
    name: String!
    location: String!
    date: String!
    surface: String!
}

input PlayerFilterInput {
    name: String
    country: String
    minAge: Int
    maxAge: Int
    minRanking: Int
    maxRanking: Int
}

input SortInput {
    field: String!
    order: String! 
}

type DeleteResponse {
    success: Boolean!
    message: String
    code: String!
}

type Query {
    players(filter: [PlayerFilterInput], sort: SortInput): [Player]!
    player(id: Int!): Player
    matches(sort: SortInput): [Match]!
    match(id: Int!): Match
    tournaments(sort: SortInput): [Tournament]!
    tournament(id: Int!): Tournament
}

type Mutation {
    createPlayer(playerInput: PlayerInput!): Player!
    updatePlayer(id: Int!, playerInput: PlayerInput!): Player!
    deletePlayer(id: Int!): DeleteResponse!

    createMatch(matchInput: MatchInput!): Match!
    updateMatch(id: Int!, matchInput: MatchInput!): Match!
    deleteMatch(id: Int!): DeleteResponse!

    createTournament(tournamentInput: TournamentInput!): Tournament!
    updateTournament(id: Int!, tournamentInput: TournamentInput!): Tournament!
    deleteTournament(id: Int!): DeleteResponse!
}

`;
