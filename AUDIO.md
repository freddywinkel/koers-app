# Geleide audio

De zes geleide oefeningen worden vooraf gegenereerd met de OpenAI Speech API. De API-sleutel blijft uitsluitend op de ontwikkelmachine en komt nooit in de PWA of GitHub-repository terecht.

## Opnieuw genereren

1. Stel lokaal `OPENAI_API_KEY` in.
2. Voer `npm run audio:generate` uit voor Nederlands of `npm run audio:generate -- --language=en` voor Engels.
3. Controleer alle zes MP3-bestanden in `public/audio` op uitspraak, tempo, stiltes en volume.
4. Gebruik `npm run audio:generate -- --force` om bestaande bestanden opnieuw te maken.

De standaardstem is `marin`. Een andere stem of een opvolgend TTS-model kan zonder codewijziging worden gekozen met `OPENAI_TTS_VOICE` en `OPENAI_TTS_MODEL`.

De generator maakt eerst ieder tekstsegment als WAV, voegt de exacte stiltes uit `src/content/audio.ts` toe en maakt daarna één doorlopend MP3-bestand per oefening. Nederlandse bestanden komen in `public/audio`; Engelse bestanden in `public/audio/en`. De app kiest automatisch de taal van de actieve profielinstelling en vermeldt duidelijk dat de stem met AI is gegenereerd.
