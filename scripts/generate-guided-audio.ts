import { spawn } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';
import { audioSessions } from '../src/content/audio.ts';
import { ENGLISH_TRANSLATIONS } from '../src/i18n.generated.ts';
import { AUDIO_ENGLISH_OVERRIDES } from '../src/content/audioEnglish.ts';

const MODEL = process.env.OPENAI_TTS_MODEL ?? 'gpt-4o-mini-tts';
const VOICE = process.env.OPENAI_TTS_VOICE ?? 'marin';
const API_KEY = process.env.OPENAI_API_KEY;
const FORCE = process.argv.includes('--force');
const LANGUAGE = process.argv.includes('--language=en') ? 'en' : 'nl';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT_DIR = path.join(ROOT, 'public', 'audio', ...(LANGUAGE === 'en' ? ['en'] : []));
const WORK_DIR = path.join(ROOT, '.audio-work', LANGUAGE);

const INSTRUCTIONS = LANGUAGE === 'en'
  ? [
      'Speak clear, natural British English as an experienced mindfulness guide.',
      'Sound warm, calm, grounded and human. Speak slowly, at about 105 words per minute.',
      'Use gentle intonation and low energy without becoming monotonous.',
      'Do not sound like an advertisement, podcast or newsreader. Do not whisper.',
      'Let every sentence land calmly. Do not add anything or change the supplied text.'
    ].join(' ')
  : [
      'Spreek helder Nederlands met een natuurlijk Nederlands accent, als een ervaren mindfulnessbegeleider.',
      'Klink warm, rustig, gegrond en menselijk. Spreek langzaam, ongeveer 105 woorden per minuut.',
      'Gebruik zachte intonatie en lage energie, zonder monotoon te worden.',
      'Klink niet als een reclame-, podcast- of nieuwslezer. Fluister niet.',
      'Laat iedere zin rustig landen. Voeg niets toe en verander de aangeleverde tekst niet.'
    ].join(' ');

if (!API_KEY) {
  throw new Error('OPENAI_API_KEY ontbreekt. Stel de variabele lokaal in en voer npm run audio:generate uit.');
}

if (!ffmpegPath) {
  throw new Error('De meegeleverde ffmpeg-binary is niet beschikbaar op dit platform.');
}

async function run(command: string, args: string[]): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.once('error', reject);
    child.once('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${command} stopte met code ${code}`))));
  });
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await readFile(filePath);
    return true;
  } catch {
    return false;
  }
}

async function generateSpeech(text: string, destination: string): Promise<void> {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        voice: VOICE,
        input: text,
        instructions: INSTRUCTIONS,
        response_format: 'wav'
      })
    });

    if (response.ok) {
      await writeFile(destination, Buffer.from(await response.arrayBuffer()));
      return;
    }

    const errorBody = await response.text();
    if (response.status !== 429 || attempt === 7) {
      throw new Error(`OpenAI TTS gaf ${response.status}: ${errorBody}`);
    }

    const retryHeader = response.headers.get('retry-after-ms');
    const retryMs = retryHeader ? Number(retryHeader) : 500 * 2 ** attempt;
    const waitMs = Number.isFinite(retryMs) ? Math.max(250, retryMs) : 1000;
    console.log(`Snelheidslimiet bereikt; ${waitMs} ms wachten en opnieuw proberen.`);
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
}

async function createSilence(seconds: number, destination: string): Promise<void> {
  await run(ffmpegPath, [
    '-hide_banner', '-loglevel', 'error', '-y',
    '-f', 'lavfi', '-i', 'anullsrc=r=24000:cl=mono',
    '-t', String(seconds), '-c:a', 'pcm_s16le', destination
  ]);
}

function concatEntry(filePath: string): string {
  return `file '${filePath.replaceAll('\\', '/').replaceAll("'", "'\\''")}'`;
}

async function generateSession(session: (typeof audioSessions)[number]): Promise<void> {
  const destination = path.join(OUTPUT_DIR, `${session.id}.mp3`);
  if (!FORCE) {
    try {
      await readFile(destination);
      console.log(`Overslaan: ${session.title} bestaat al (${path.relative(ROOT, destination)})`);
      return;
    } catch {
      // Nog niet gegenereerd.
    }
  }

  const sessionWorkDir = path.join(WORK_DIR, session.id);
  if (FORCE) await rm(sessionWorkDir, { recursive: true, force: true });
  await mkdir(sessionWorkDir, { recursive: true });

  const concatFiles: string[] = [];
  for (const [index, segment] of session.segments.entries()) {
    const clip = path.join(sessionWorkDir, `${String(index + 1).padStart(2, '0')}.wav`);
    if (!(await exists(clip))) {
      console.log(`${session.title}: stem ${index + 1}/${session.segments.length}`);
      await generateSpeech(segment.text, clip);
    }
    concatFiles.push(clip);

    if (segment.pauze && index < session.segments.length - 1) {
      const silence = path.join(sessionWorkDir, `${String(index + 1).padStart(2, '0')}-stilte.wav`);
      if (!(await exists(silence))) await createSilence(segment.pauze, silence);
      concatFiles.push(silence);
    }
  }

  const concatList = path.join(sessionWorkDir, 'concat.txt');
  await writeFile(concatList, `${concatFiles.map(concatEntry).join('\n')}\n`, 'utf8');
  await run(ffmpegPath, [
    '-hide_banner', '-loglevel', 'error', '-y',
    '-f', 'concat', '-safe', '0', '-i', concatList,
    '-c:a', 'libmp3lame', '-b:a', '64k', '-ar', '24000', '-ac', '1',
    destination
  ]);
  console.log(`Klaar: ${path.relative(ROOT, destination)}`);
}

function translateSession(session: (typeof audioSessions)[number]): (typeof audioSessions)[number] {
  if (LANGUAGE !== 'en') return session;
  const translateRequired = (source: string): string => {
    const translated = AUDIO_ENGLISH_OVERRIDES[source] ?? ENGLISH_TRANSLATIONS[source];
    if (!translated || translated === source) {
      throw new Error(`Engelse audiovertaling ontbreekt voor: ${source}`);
    }
    return translated;
  };
  return {
    ...session,
    title: translateRequired(session.title),
    doel: translateRequired(session.doel),
    segments: session.segments.map((segment) => ({ ...segment, text: translateRequired(segment.text) }))
  };
}

await mkdir(OUTPUT_DIR, { recursive: true });
await mkdir(WORK_DIR, { recursive: true });

for (const session of audioSessions) {
  await generateSession(translateSession(session));
}

await writeFile(
  path.join(OUTPUT_DIR, 'generation.json'),
  `${JSON.stringify({ language: LANGUAGE, model: MODEL, voice: VOICE, generatedAt: new Date().toISOString() }, null, 2)}\n`,
  'utf8'
);
await rm(WORK_DIR, { recursive: true, force: true });
console.log(`Alle ${audioSessions.length} ${LANGUAGE === 'en' ? 'Engelse' : 'Nederlandse'} oefeningen zijn gegenereerd met stem ${VOICE}.`);
