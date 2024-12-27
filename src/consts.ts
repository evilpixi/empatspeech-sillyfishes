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
  FISH_UPDATED: 'FISH_UPDATED',
  FISH_DELETED: 'FISH_DELETED'
}


const SOCKET_IO_URL = "http://localhost:3000";

export
{
  GAME_WIDTH, GAME_HEIGHT,
  GameModes, FishEvents, SOCKET_IO_URL
};