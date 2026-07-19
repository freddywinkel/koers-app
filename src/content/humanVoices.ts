export type HumanVoiceSession = {
  id: string;
  title: string;
  creator: string;
  show: string;
  minutes: number;
  description: string;
  spotifyEpisodeId: string;
};

/**
 * Publieke Spotify-afleveringen die als menselijke aanvulling op de eigen
 * Koers-oefeningen worden aangeboden. De audio blijft bij Spotify gehost.
 */
export const humanVoiceSessions: HumanVoiceSession[] = [
  {
    id: 'moeilijke-momenten',
    title: 'Meditatie voor moeilijke momenten',
    creator: 'Marjolein van der Aar',
    show: 'Mindful Minuut',
    minutes: 15,
    description: 'Voor als gevoelens zwaar of pijnlijk zijn en je er met zachte aandacht bij wilt blijven.',
    spotifyEpisodeId: '7uFShKoVrRLLMZMb32Iq1s'
  },
  {
    id: 'bodyscan-15-minuten',
    title: 'Bodyscan 15 minuten',
    creator: 'Marjolein van der Aar',
    show: 'Mindful Minuut',
    minutes: 16,
    description: 'Een liggende bodyscan met muziek om spanning op te merken en het lichaam te laten ontspannen.',
    spotifyEpisodeId: '5B9G8DvDicmlfhTLHR7WMc'
  },
  {
    id: 'slaapmeditatie',
    title: 'Slaapmeditatie',
    creator: 'Marjolein van der Aar',
    show: 'Mindful Minuut',
    minutes: 11,
    description: 'Een rustige begeleiding om de dag los te laten en makkelijker in slaap te komen.',
    spotifyEpisodeId: '5a42a4G0yTHHT7J77PVeXT'
  },
  {
    id: 'zelfliefde-en-zelfacceptatie',
    title: 'Zelfliefde en zelfacceptatie',
    creator: 'Marjolein van der Aar',
    show: 'Mindful Minuut',
    minutes: 12,
    description: 'Een oefening in liefdevolle, zachte aandacht voor jezelf, precies zoals je nu bent.',
    spotifyEpisodeId: '2CWf5740pFrSnGVVvv4XRT'
  }
];

export const mindfulMinuutSpotifyUrl = 'https://open.spotify.com/show/3NE5fr4jeAxNr8GyhiREPd';

export function spotifyEpisodeUrl(episodeId: string) {
  return `https://open.spotify.com/episode/${episodeId}`;
}

export function spotifyEmbedUrl(episodeId: string) {
  return `https://open.spotify.com/embed/episode/${episodeId}?utm_source=generator&theme=0`;
}
