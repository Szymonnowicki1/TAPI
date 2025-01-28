odpalenie node src/rest/index.js

URL: http://localhost:3000/

ZAPYTANIA DO REST

## pokazuje wszystkich zawodnikow

GET http://localhost:3000/api/players

## pokazuje wszystkei turnieje danego zawdonika

GET http://localhost:3000/api/players/1/tournaments

## pokazuje wszystkie dane zawwodnika o ID

GET http://localhost:3000/api/players/1

## Aktualizuje ranking danego gracz

PUT http://localhost:3000/api/players/1

{
"ranking": 45
}

## dodawanie zawodnik

POST http://localhost:3000/api/players

{
"name": "Ada Kowalska",
"age": 37,
"country": "Poland",
"ranking": 55
}

## usuwanie zawodnika

DELETE http://localhost:3000/api/players/11

## pokazuje wszystkie mecze

GET http://localhost:3000/api/matches

## pokazuje dane konkretnego meczu

GET http://localhost:3000/api/matches/105

## dodawanie meczu

POST http://localhost:3000/api/matches

{
"score": "6-2, 6-3",
"player1_id": 2,
"player2_id": "5",
"tournament_id": 4
}

## usuwanie meczu

DELETE http://localhost:3000/api/matches/112

## pokazuje kto gral w anym meczu

GET http://localhost:3000/api/matches/107/players

## pokazuje wszystkie turnieje

GET http://localhost:3000/api/tournaments

## pokazuje turniej o danym ID

GET http://localhost:3000/api/tournaments/3

## pokazuje mecze w danym turnieju jakie byly

GET http://localhost:3000/api/tournaments/3/matches

## aktualizuje dane turnieju

PUT http://localhost:3000/api/tournaments/3

{
"name": "Roland Garos",
"year": 2022,
"surface": "maka"
}

## usuwanie turnieju

DELETE http://localhost:3000/api/tournaments/6

## dodawanie turnieju

POST http://localhost:3000/api/tournaments

{
"name": "US Open",
"year": 2025,
"location": "New York, USA",
"surface": "Hard"
}
