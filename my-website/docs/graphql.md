odpalenie node src/graphql/index.js

ZAPYTANIA W GRAPHQL

QUERY

## pokauje wszystkich zawodnikow rosnaco wedlug wieku

query {
players(sort: { field: "age", order: "ASC" }) {
id
name
age
ranking
}
}

## pokazuje wszystkich zawodnikow malejaco wedlug rankingu

query {
players(sort: { field: "ranking", order: "DESC" }) {
id
name
ranking
}
}

## pokazuje wszystkich zawodnikow posortowanych alfabetycznie

query {
players(sort: { field: "name", order: "ASC" }) {
id
name
ranking
}
}

## pokazuje wszystkich zawodnikow ktorzy sa w wieku 20-25 i sa z polski

query {
players(
filter: [
{ minAge: 20, maxAge: 25, country: "Poland" }
],
sort: {
field: "ranking",
order: "ASC"
}
) {
id
name
age
ranking
country
}
}

## pokazuje wszystkich zawdonikow powyzej 26 wieku

query {
players(
filter: [
{ minAge: 26, }
],
sort: {
field: "ranking",
order: "ASC"
}
) {
id
name
age
ranking
country
}
}

## pokazuje zawodnika z danym ID

query {
player(id: 4) {
id
name
age
country
ranking
}
}

## pokazuje mecze kto z kim gral i soruje wedlug czasu rosnaco

query {
matches(
sort: {
field: "duration_minutes",
order: "ASC"
}
) {
id
player1 {
name
}
player2 {
name
}
score
duration_minutes
}
}

## pokazuje mecz o danym ID ( id meczy zaczyna sie od 101)

query {
match(id: 101) {
id
score
duration_minutes
player1 {
name
}
player2 {
name
}
}
}

## pokazuje posortowan alfabetycznie turnieje

query {
tournaments(sort: { field: "name", order: "ASC" }) {
id
name
location
}
}

## pokazuje posortowane alfabetycznie(od tylu) turnieje

query {
tournaments(sort: { field: "location", order: "DESC" }) {
id
name
location
}
}

## pokazuje turniej o danym ID

query {
tournament(id: 3) {
id
name
location
year
surface
}
}

MUTACJE

## dodaje zawodnika z wybranymi danymi ( walidacja na name mus byc od 3 do 40 znakow)

mutation {
createPlayer(playerInput: { name: "Aga Novak", age: 25, country: "Serbia", ranking: 10 }) {
id
name
age
country
}
}

## aktualizuje dane zawodnika

mutation {
updatePlayer(id: 1, playerInput: { name: "Iga Świątek", age: 73, country: "Poland", ranking: 1 }) {
id
name
age
country
}
}

## usuwa zawodnika o danym ID

mutation {
deletePlayer(id: 1) {
success
message
}
}

## tworzenie meczu

mutation {
createMatch(
matchInput: {
player1Id: 3
player2Id: 2
score1: 6
score2: 4
tournamentId: 1
round: "Final"
}
) {
id
player1 {
name
}
player2 {
name
}
score

}
}

## aktualizacj meczu

mutation {
updateMatch(
id: 103
matchInput: {
player1Id: 5
player2Id: 2
score1: 6
score2: 4
tournamentId: 1
round: "Final"
}

) {
id
player1 {
name
}
player2 {
name
}
score
}
}

## usuwanie meczu

mutation {
deleteMatch(id: 101) {
success
message
}
}

## dodanie turnieju

mutation {
createTournament(tournamentInput: { name: "Roland Garros", location: "Paris, France", date: "2025-06-01",surface: "Clay" }) {
id
name
location
surface
}
}

## aktualizacja turnieju

mutation {
updateTournament(id: 1, tournamentInput: { name: "Australian Open", location: "Melbourne, Australia", date: "2025-01-20",surface: "Maka" }) {
id
name
location
surface
}
}

## usuniecie turnieju

mutation {
deleteTournament(id: 1) {
success
message
}
}
