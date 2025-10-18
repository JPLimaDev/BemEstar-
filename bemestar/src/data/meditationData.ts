
export interface MeditationAudio {
  id: string
  name: string
  uri: string
  durationSeconds: number
}

export const AVAILABLE_AUDIOS: MeditationAudio[] = [
  {
    id: '1',
    name: 'Ondas Relaxantes (5 min)',
    uri : 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    durationSeconds: 5 * 60,
  },
  {
    id: '2',
    name: 'Sino do Tibet (10 min)',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 
    durationSeconds: 10 * 60, 
  },
  {
    id: '3',
    name: 'Som Profundo (15 min)',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    durationSeconds: 15 * 60, 
  },
  {
    id: '4',
    name: 'Silêncio Profundo (3 min)',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    durationSeconds: 3 * 60,
  },
];