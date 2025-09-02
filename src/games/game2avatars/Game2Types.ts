export type Game2Data = {
  name: string,
  position: string,
  url: string,
  text: string,
}

export type Game2Avatar = Omit<Game2Data, 'text'>;
export type Game2Dialogue = Omit<Game2Data, 'position' | 'url'>;
export type Game2Emojis = Omit<Game2Data, 'position' | 'text'>;

export type GameData = {
  avatars: Game2Avatar[],
  dialogue: Game2Dialogue[],
  emojies: Game2Emojis[],
}