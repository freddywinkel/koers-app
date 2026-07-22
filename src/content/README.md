# Content schrijven voor Koers — schrijversgids (stage 2)

Deze map is de enige plek waar cursusteksten wonen. De app rendert alles
automatisch; je hoeft **geen code buiten `src/content/` aan te raken**.

## Eindstructuur (na integratie)

De volledige cursus is live: 12 weken (51 lessen) staan elk in
`weeks/weekNN.ts` (export `weekNN: Week` + `weekNNFlashcards: Flashcard[]`).
`curriculum.ts`, `flashcards.ts` en `skills.ts` zijn **barrels** die de
weekbestanden, alle kaarten (127 weekkaarten + 2 voorbeeldkaarten = 129) en
de volledige vaardighedenbibliotheek (24 uit `skillLibrary.ts` + 2 extra =
26) aggregeren — schermen importeren alleen de barrels, met ongewijzigde
namen (`curriculum`, `flashcards`/`getFlashcards`, `skills`/`getSkill`).
Id-conventies: lessen `wNN-lMM`; flashcards in weekbestanden `wNN-lMM-fK`,
de twee stage-1-voorbeeldkaarten `fc-w02-l03-a/b`; bij id-conflicten wint de
week-/skillLibrary-versie. `audio.ts` (audioSessions), `onboarding.ts` en
`crisis.ts` zijn uitgebreid en klaar voor UI-aansluiting.

## Bestanden

| Bestand | Wat staat er |
|---|---|
| `types.ts` | Het schema (Week, Lesson, ExerciseStep, MetaphorCard, SkillCard, Flashcard). Lees dit eerst. |
| `curriculum.ts` | De 12 weken met 4–6 lessen per week. Nu stubs; jij vult de teksten. |
| `skills.ts` | Vaardigheden voor de Oefenen-toolbox. |
| `flashcards.ts` | Flashcards voor actieve recall. |
| `crisis.ts` | Teksten voor het crisis-scherm (feitelijke hulplijnen niet wijzigen). |
| `helpers.ts` | Alleen-lezen functies voor de app; niet aanpassen. |

## De voorbeeldles

`w02-l03` **"Ademhalen met aandacht"** in `curriculum.ts` is volledig
uitgewerkt en dient als **schema-referentie**: zo ziet een afgeronde les eruit.
Bekijk hem in de app op `/les/w02-l03`.

## Schema in het kort (Lesson)

```ts
{
  id: 'w03-l02',              // conventie: w{week:00}-l{order:00} — niet veranderen bij bestaande lessen
  weekId: 'w03',
  order: 2,                   // positie binnen de week
  kind: 'lesson',             // 'lesson' | 'oefening' | 'herhaling'
  title: 'Vechten kost energie',
  minutes: 5,                 // indicatie, toont als chip "± 5 min"
  tags: ['Acceptatie'],       // max 2 korte labels (warme chips)
  intro: [                    // 2–4 alinea's, elk 1–3 zinnen
    'Eerste alinea …',
    'Tweede alinea …'
  ],
  metaphorCard: {             // optioneel — het "beeld om te onthouden"
    title: 'Touwtrekken met een monster',
    text: '1–3 zinnen.',
    art: 'mist'               // 'mist' | 'golf' | 'stroom'
  },
  exercise: {                 // optioneel — bij kind 'oefening' verplicht
    title: 'Naam van de oefening',
    steps: [
      { n: 1, title: 'Korte stapnaam', text: '1–3 zinnen.', seconds: 60 } // seconds optioneel
    ]
  },
  reflection: 'Nabespreking, 1–3 zinnen.',   // optioneel
  assignment: 'Huiswerk, 1–2 zinnen.',       // optioneel
  relatedSkillIds: ['ademanker'],            // ids uit skills.ts
  flashcardIds: ['fc-w03-l02-a']             // ids uit flashcards.ts
}
```

Verplicht voor een "afgeronde" les: `intro` (gevuld), `minutes`, en bij
`kind: 'oefening'` ook `exercise`. Laat optionele velden weg als ze niets
toevoegen — de renderer slaat ze netjes over.

## Schrijfstijl (B1, warm, dyslexievriendelijk)

- **Taalniveau B1**: woorden van elke dag. Vermijd jargon; leg ACT/VERS-termen
  altijd in gewone taal uit (bijv. "defusie" → "afstand nemen van gedachten").
- **Je/jij**, nooit u. Direct en warm: "Je adem is altijd bij je."
- **Korte zinnen** (richtlijn ≤ 15 woorden). Max ~3 zinnen per alinea.
- **Bevestigend, zonder oordeel.** Normaliseer mislukken: "Afdwalen is oké.
  Dat hoort erbij."
- **Nooit schuld- of prestatietaal**: geen "mislukt", "verloren", "te laat",
  "moet" als dwang. Gebruik "mag", "kan", "als het lukt".
- **Geen cursief**, geen uitroeptekens als styling. Rustige toon.
- Metaforen: concreet en alledaags (pannen op het fornuis, weer, stromend
  water, passagiers op een bus). Eén beeld per les, niet door elkaar.
- Tijdsindicaties realistisch: les of oefening meestal 3–12 min.

## Pannetjesmodel-woorden (vaste woordenschat)

Pan 1 **Rustig** · Pan 2 **Rimpelt** · Pan 3 **Borrelt** · Pan 4 **Pruttelt** ·
Pan 5 **Kookt over**. Gebruik altijd deze labels; pan 5 is warm (abrikoos),
nooit eng of rood.

## Flashcards

- `front`: één vraag of prompt ("Wat doe je als …?").
- `back`: antwoord in 1–3 zinnen, mag vriendelijk herhalen wat de les zei.
- id-conventie: `fc-w{week:00}-l{les:00}-{a|b|c…}`.
- 2–3 kaarten per les is genoeg; ze voeden spaced repetition (stage 3).

## Skills

`panMin`/`panMax` geven aan bij welke pan-intensiteit de vaardigheid werkt.
Zware grondingsvaardigheden (bv. 5-4-3-2-1) lopen tot pan 5; reflectieve
oefeningen blijven laag (1–3). Stappen: 3–6 stuks, elk één actie.

## Checklist per les

- [ ] intro gevuld (2–4 alinea's, B1, je-vorm)
- [ ] kind klopt met de inhoud (uitleg = lesson, doe-oefening = oefening)
- [ ] oefening heeft stappen met korte koppen
- [ ] reflection normaliseert ("allebei is goed")
- [ ] assignment is klein en haalbaar ("2 minuten per dag")
- [ ] minutes/tags ingevuld
- [ ] skill- en flashcard-ids bestaan echt in skills.ts/flashcards.ts
