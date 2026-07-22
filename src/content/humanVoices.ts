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

/**
 * Engelstalige sessies van Victoria Mlynko, Registered Psychotherapist.
 * Deze selectie volgt dezelfde vier behoeften als de Nederlandse collectie.
 */
export const englishHumanVoiceSessions: HumanVoiceSession[] = [
  {
    id: 'difficult-moments',
    title: 'A Stressful Moment',
    creator: 'Victoria Mlynko',
    show: 'Meditations for Mental Health',
    minutes: 10,
    description: 'A grounding meditation for finding steadiness and calm during a stressful moment.',
    spotifyEpisodeId: '3XYCcjeJdrSdfFNf1UD9CU'
  },
  {
    id: 'body-scan-total-relaxation',
    title: 'Body Scan for Total Relaxation',
    creator: 'Victoria Mlynko',
    show: 'Meditations for Mental Health',
    minutes: 14,
    description: 'A gentle body scan for noticing tension and allowing your whole body to relax.',
    spotifyEpisodeId: '73UBuaeqs2d0NOV2woYTcF'
  },
  {
    id: 'prepare-for-restful-sleep',
    title: 'Prepare for Restful Sleep',
    creator: 'Victoria Mlynko',
    show: 'Meditations for Mental Health',
    minutes: 10,
    description: 'A calming practice to release the day, soften tension and prepare for restorative sleep.',
    spotifyEpisodeId: '5KbmyZAgrKegLsFqr025JH'
  },
  {
    id: 'facing-self-doubt',
    title: 'Facing Self-Doubt',
    creator: 'Victoria Mlynko',
    show: 'Meditations for Mental Health',
    minutes: 8,
    description: 'Meet self-doubt and self-criticism with kindness, self-compassion and greater acceptance.',
    spotifyEpisodeId: '1kFsyh4n9Po3kIbIwH093O'
  }
];

export const mindfulMinuutSpotifyUrl = 'https://open.spotify.com/show/3NE5fr4jeAxNr8GyhiREPd';
export const meditationsForMentalHealthSpotifyUrl = 'https://open.spotify.com/show/4uyKWORKqfkYH0wQi5t4qb';

export function spotifyEpisodeUrl(episodeId: string) {
  return `https://open.spotify.com/episode/${episodeId}`;
}

export function spotifyEmbedUrl(episodeId: string) {
  return `https://open.spotify.com/embed/episode/${episodeId}?utm_source=generator&theme=0`;
}
