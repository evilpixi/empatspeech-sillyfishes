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

const Sound = {
  BUBBLE: "sfx_bubbles",
  POP1: "sfx_pop1",
  POP2: "sfx_pop2",
}

const Music = {
  MUSIC_WATER_1: "music_little-water-dreams",
  MUSIC_WATER_2: "music_electronica-ambient-idm-water",
  MUSIC_WATER_3: "music_voice-of-the-water",
  MUSIC_WATER_4: "music_water-droplets",
}

export
{
  GAME_WIDTH, GAME_HEIGHT,
  GameModes, FishEvents,
  Sound, Music
};