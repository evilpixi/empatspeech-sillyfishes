const GAME_WIDTH: number = 1920;
const GAME_HEIGHT: number = 1080;

const GameModes = {
  PACIENT: "pacient",
  THERAPIST: "therapist"
}

const FishEvents = {
  SPAWN_FISH: 'SPAWN_FISH',
  FISH_INITIALIZE: 'FISH_INITIALIZE',
  USER_CONNECTED: 'USER_CONNECTED',
  FISH_SPAWNED: 'FISH_SPAWNED',
  FISH_START_MOVING: 'FISH_START_MOVING',
  FISH_END_MOVE: 'FISH_END_MOVE',
  FISH_UPDATED: 'FISH_UPDATED',
  FISH_MARKED_FOR_DELETE: 'FISH_MARKET_FOR_DELETE',
  FISH_DELETED: 'FISH_DELETED',
  SCORE_UPDATED: 'SCORE_UPDATED',
  FULL_RESET: 'FULL_RESET',
  GAME_RESETED: 'GAME_RESETED',
}


//const SOCKET_IO_URL = "http://localhost:3000";
const SOCKET_IO_URL = "https://empatspeech-silly-fishes-server.onrender.com";

export
{
  GAME_WIDTH, GAME_HEIGHT,
  GameModes, FishEvents, SOCKET_IO_URL
};