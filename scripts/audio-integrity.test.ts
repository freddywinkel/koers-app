import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { stat } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';
import { audioSessions } from '../src/content/audio';
import { AUDIO_ENGLISH_OVERRIDES } from '../src/content/audioEnglish';
import { ENGLISH_TRANSLATIONS } from '../src/i18n.generated';

const root = new URL('../', import.meta.url);

function englishText(source: string): string {
  return AUDIO_ENGLISH_OVERRIDES[source] ?? ENGLISH_TRANSLATIONS[source] ?? source;
}

test('alle begeleide sessies hebben complete Nederlandse en Engelse MP3-bestanden', async () => {
  assert.ok(ffmpegPath, 'ffmpeg-static hoort een bruikbaar uitvoerbaar bestand te leveren');
  assert.equal(audioSessions.length, 6);
  assert.equal(new Set(audioSessions.map((session) => session.id)).size, audioSessions.length);

  for (const session of audioSessions) {
    assert.equal(session.audioSrc, `audio/${session.id}.mp3`);
    for (const relativePath of [`public/audio/${session.id}.mp3`, `public/audio/en/${session.id}.mp3`]) {
      const fileUrl = new URL(relativePath, root);
      const info = await stat(fileUrl);
      assert.ok(info.size > 1_000_000, `${relativePath} is onverwacht klein of incompleet`);

      const decoded = spawnSync(ffmpegPath, ['-v', 'error', '-i', fileURLToPath(fileUrl), '-f', 'null', '-'], {
        encoding: 'utf8',
        windowsHide: true
      });
      assert.equal(decoded.status, 0, `${relativePath} kon niet volledig worden gedecodeerd: ${decoded.stderr}`);
    }
  }
});

test('ieder Nederlands audiosegment heeft een afzonderlijke Engelse tekst', () => {
  const untranslated: string[] = [];
  for (const session of audioSessions) {
    for (const segment of session.segments) {
      if (englishText(segment.text).trim() === segment.text.trim()) untranslated.push(`${session.id}: ${segment.text}`);
    }
  }

  assert.deepEqual(untranslated, []);
});
