/**
 * Koers — audiosessies
 * -----------------------------
 * Volledig uitgeschreven gesproken teksten voor geleide oefeningen.
 * Toon: warm, je-vorm, rustig tempo, B1. Alle teksten zijn origineel.
 * `pauze` = stilte NA het segment, in seconden. Segmenten zonder pauze
 * lopen direct door (handig voor de allerlaatste zin).
 */

export interface AudioSession {
  id: string;
  title: string;
  minutes: number;
  doel: string;
  /** Relatief pad naar de vooraf gegenereerde, doorlopende opname. */
  audioSrc: string;
  segments: { text: string; pauze?: number }[];
}

export const audioSessions: AudioSession[] = [
  {
    id: 'adem-anker',
    title: 'Adem als anker',
    minutes: 5,
    doel: 'Een korte oefening om je aandacht bij je adem te houden. Handig als start van de dag, of als je hoofd vol zit.',
    audioSrc: 'audio/adem-anker.mp3',
    segments: [
      { text: 'Welkom bij deze korte oefening. Zoek een plek waar je even rustig kunt zitten.', pauze: 8 },
      { text: 'Zet je voeten plat op de grond. Leg je handen losjes in je schoot.', pauze: 8 },
      { text: 'Je ogen mogen dicht. Of je kijkt zacht naar een punt voor je.', pauze: 6 },
      { text: 'Adem nu iets dieper in door je neus … en laat de adem langzaam weer gaan.', pauze: 10 },
      { text: 'Merk op hoe je adem vanzelf stroomt. In … en weer uit. Je hoeft niets te veranderen.', pauze: 12 },
      { text: 'Voel waar je je adem het duidelijkst voelt. Misschien bij je neus. Of bij je borst. Of bij je buik.', pauze: 12 },
      { text: 'Kies één plek. Laat je aandacht daar zachtjes rusten, als een vogel op een tak.', pauze: 12 },
      { text: 'Je adem is als een anker. Bij elke uitademing zak je een beetje verder in de stoel.', pauze: 12 },
      { text: 'Je gedachten komen en gaan. Dat is normaal. Je hoeft ze niet weg te duwen.', pauze: 10 },
      { text: 'Merk het op als je afdwaalt. Zeg zachtjes in je hoofd: denken. En kom terug naar je adem.', pauze: 12 },
      { text: 'Vind je het fijn om te tellen? Tel dan zacht mee. In één, uit één. In twee, uit twee. Tot tien, en dan weer opnieuw.', pauze: 15 },
      { text: 'Wees niet streng als het niet meteen lukt. Juist terugkomen is de oefening.', pauze: 12 },
      { text: 'Laat elke adem komen zoals hij komt. Kort of lang, diep of ondiep. Alles mag.', pauze: 12 },
      { text: 'Misschien merk je wat rust. Misschien niet. Allebei is goed.', pauze: 12 },
      { text: 'Haal één keer rustig adem. Helemaal in … en helemaal uit.', pauze: 8 },
      { text: 'Beweeg zachtjes je vingers en tenen. Kijk rustig om je heen.', pauze: 6 },
      { text: 'De oefening is klaar. Je adem blijft bij je, de hele dag.' }
    ]
  },
  {
    id: 'bodyscan',
    title: 'Bodyscan',
    minutes: 11,
    doel: 'Met je aandacht rustig door je hele lijf gaan, van je voeten tot je hoofd. Zo leer je spanning opmerken en loslaten.',
    audioSrc: 'audio/bodyscan.mp3',
    segments: [
      { text: 'Welkom bij deze bodyscan. Zoek een plek waar je lekker kunt liggen of zitten.', pauze: 8 },
      { text: 'Leg je armen losjes naast je lijf. Laat je ogen zacht dichtvallen.', pauze: 10 },
      { text: 'Je hoeft niets te bereiken. Er is geen goed of fout. Je mag gewoon voelen wat er is.', pauze: 10 },
      { text: 'Voel eerst hoe je lijf wordt gedragen. Door de vloer, het bed of de stoel.', pauze: 12 },
      { text: 'Adem een paar keer rustig in en uit. Bij elke uitademing mag je lijf iets zwaarder worden.', pauze: 15 },
      { text: 'Breng je aandacht nu naar je voeten. Naar je tenen, je zolen, je hielen.', pauze: 15 },
      { text: 'Misschien voel je warmte of kou. Misschien tintelingen. Misschien bijna niets. Alles mag.', pauze: 15 },
      { text: 'Adem alsof je adem zachtjes naar je voeten stroomt. Geef ze even al je aandacht.', pauze: 15 },
      { text: 'Laat je voeten nu los en ga naar je enkels en je kuiten.', pauze: 12 },
      { text: 'Voel de huid, en de spieren eronder. Zijn ze warm of koel? Strak of zacht?', pauze: 15 },
      { text: 'Verder naar je knieën. De voorkant, en ook de achterkant.', pauze: 12 },
      { text: 'En je bovenbenen. Grote spieren die vaak hard voor je werken. Geef ze even rust.', pauze: 15 },
      { text: 'Breng je aandacht naar je heupen en je zitvlak. Voel het contact met de ondergrond.', pauze: 15 },
      { text: 'Naar je buik. Voel hoe je buik beweegt met je adem. Omhoog … en weer omlaag.', pauze: 15 },
      { text: 'Je buik mag helemaal zacht zijn. Je hoeft hem niet in te houden.', pauze: 15 },
      { text: 'Naar je rug. De onderkant van je rug, het midden, de bovenkant.', pauze: 12 },
      { text: 'Veel spanning zit hier. Merk het op, zonder er iets aan te veranderen.', pauze: 15 },
      { text: 'Voel nu je borstkas. Hoe hij ruimer wordt als je inademt. En weer smaller als je uitademt.', pauze: 15 },
      { text: 'Nu naar je handen. Je vingers, je handpalmen, de bovenkant van je handen.', pauze: 15 },
      { text: 'Misschien voel je je vingers tintelen. Of je voelt de lucht eromheen.', pauze: 15 },
      { text: 'Verder via je polsen naar je onderarmen en je bovenarmen.', pauze: 15 },
      { text: 'Naar je schouders. Hier houden we vaak spanning vast.', pauze: 12 },
      { text: 'Laat je schouders bij de uitademing een beetje zakken. Een klein beetje is genoeg.', pauze: 15 },
      { text: 'Naar je nek en je keel. Laat ze zacht worden.', pauze: 12 },
      { text: 'En je gezicht. Ontspan je kaak. Laat ruimte tussen je tanden.', pauze: 12 },
      { text: 'Laat je ogen zacht rusten in hun holtes. Maak je voorhoofd glad.', pauze: 12 },
      { text: 'Voel je hele hoofd. De huid, je haar, je schedel.', pauze: 12 },
      { text: 'Voel nu je hele lijf tegelijk. Van je tenen tot je hoofd. Eén geheel, hier en nu.', pauze: 20 },
      { text: 'Adem in door je hele lijf … en adem weer uit. Rustig, op je eigen manier.', pauze: 20 },
      { text: 'Neem even de tijd om te voelen hoe het nu met je gaat. Zonder oordeel.', pauze: 15 },
      { text: 'Beweeg zachtjes je vingers en tenen. Rek je uit als je dat fijn vindt.', pauze: 10 },
      { text: 'Doe je ogen langzaam open. Kijk rustig om je heen.', pauze: 8 },
      { text: 'De bodyscan is klaar. Neem deze rust mee de rest van je dag.' }
    ]
  },
  {
    id: 'bladeren-op-de-stroom',
    title: 'Bladeren op de stroom',
    minutes: 7,
    doel: 'Leren kijken naar je gedachten in plaats van erin mee te gaan. Je legt elke gedachte op een blad en kijkt hoe hij wegdrijft.',
    audioSrc: 'audio/bladeren-op-de-stroom.mp3',
    segments: [
      { text: 'Welkom. Ga lekker zitten of liggen. Doe je ogen zacht dicht.', pauze: 10 },
      { text: 'Adem drie keer rustig in … en weer uit. Laat je lijf zwaarder worden.', pauze: 15 },
      { text: 'Stel je voor: je zit aan de kant van een rustig riviertje. Het is een zachte dag. De zon schijnt.', pauze: 15 },
      { text: 'Het water stroomt langzaam voor je langs. Je kijkt ernaar. Verder hoef je niets.', pauze: 15 },
      { text: 'Er drijven bladeren op het water. Grote en kleine. Ze komen dichterbij en drijven weer weg.', pauze: 15 },
      { text: 'Nu komt er een gedachte bij je op. Wat je ook denkt, dat is oké. Leg die gedachte op een blad.', pauze: 12 },
      { text: 'Kijk hoe het blad met je gedachte langzaam wegdrijft. Verder en verder, tot het uit beeld is.', pauze: 18 },
      { text: 'Dan komt het volgende blad. Leg daar je volgende gedachte op. En kijk weer toe.', pauze: 18 },
      { text: 'Je gedachten mogen alles zijn. Zorgen, plannen, herinneringen. Elke gedachte mag op een blad.', pauze: 18 },
      { text: 'Is er even geen blad? Dan kijk je gewoon naar het water. Dat is ook goed.', pauze: 15 },
      { text: 'Soms blijft een blad hangen. Dat is niet erg. Merk het op en laat het water zijn werk doen.', pauze: 15 },
      { text: 'Merk je dat je met een gedachte meedrijft? Ga dan zachtjes weer aan de kant zitten.', pauze: 15 },
      { text: 'Je hoeft niets weg te duwen. Je hoeft ook niets vast te houden. De stroom doet het werk.', pauze: 18 },
      { text: 'Jij zit aan de kant. Je kijkt. Je gedachten drijven voorbij, en jij blijft hier.', pauze: 25 },
      { text: 'Blijf zo nog even kijken. Blad voor blad, in je eigen tempo.', pauze: 35 },
      { text: 'Merk op hoe het nu met je gaat. Misschien rustiger, misschien niet. Allebei is goed.', pauze: 15 },
      { text: 'Haal één keer rustig adem. Laat het beeld van de stroom langzaam wegglippen.', pauze: 10 },
      { text: 'Beweeg zachtjes je handen en voeten. Doe je ogen open als je er klaar voor bent.', pauze: 8 },
      { text: 'Onthoud dit beeld: je gedachten zijn bladeren op het water. Jij blijft rustig aan de kant.' }
    ]
  },
  {
    id: 'toestaan-van-emoties',
    title: 'Toestaan van emoties',
    minutes: 6,
    doel: 'Ruimte maken voor een moeilijk gevoel, in plaats van ertegen te vechten. Je leert het gevoel zachtjes toelaten.',
    audioSrc: 'audio/toestaan-van-emoties.mp3',
    segments: [
      { text: 'Welkom. Deze oefening helpt je ruimte te maken voor een moeilijk gevoel. Ga rustig zitten.', pauze: 10 },
      { text: 'Doe je ogen dicht als dat kan. Adem een paar keer rustig in en uit.', pauze: 12 },
      { text: 'Denk aan iets dat deze week lastig was. Kies iets kleins, niet het zwaarste wat je kent.', pauze: 15 },
      { text: 'Wordt het toch te veel? Open je ogen, voel je voeten op de grond en stop de oefening. Je kunt dan kiezen voor 5-4-3-2-1 of iemand om steun vragen.', pauze: 12 },
      { text: 'Merk op wat je nu voelt. Boosheid, verdriet, angst, schaamte … alles mag er zijn.', pauze: 15 },
      { text: 'Waar voel je dit in je lijf? In je borst, je keel, je buik, je schouders?', pauze: 15 },
      { text: 'Kijk er even naar als een nieuwsgierige onderzoeker. Hoe groot voelt het? Warm of koud? Stil of bewegend?', pauze: 15 },
      { text: 'Je hoeft dit gevoel niet leuk te vinden. Je hoeft er ook niets mee te doen.', pauze: 12 },
      { text: 'Adem nu zachtjes naar die plek in je lijf. Alsof je adem er ruimte omheen maakt.', pauze: 15 },
      { text: 'Bij elke uitademing maak je een beetje meer ruimte. Het gevoel mag er gewoon zijn.', pauze: 18 },
      { text: 'Adem in … ruimte. Adem uit … zachtheid. In je eigen tempo.', pauze: 20 },
      { text: 'Zeg in je hoofd: ik hoef niet te vechten. Ik mag dit toelaten.', pauze: 15 },
      { text: 'Misschien wordt het gevoel zachter. Misschien blijft het even sterk. Allebei is goed.', pauze: 15 },
      { text: 'Jij bent groter dan dit gevoel. Het is een golf, en jij bent het hele strand.', pauze: 15 },
      { text: 'Blijf nog even rustig ademen om het gevoel heen. Ruimte om de pijn, ruimte om de spanning.', pauze: 25 },
      { text: 'Bedank jezelf dat je dit durfde te voelen. Dat is dapper.', pauze: 12 },
      { text: 'Laat het beeld nu los. Voel je zitvlak, je voeten, de grond onder je.', pauze: 12 },
      { text: 'Doe je ogen langzaam open. De oefening is klaar. Wees zacht voor jezelf vandaag.' }
    ]
  },
  {
    id: 'veilige-plek',
    title: 'Je veilige plek',
    minutes: 7,
    doel: 'Een rustige of neutrale plek voorstellen met je zintuigen. Jij kiest het beeld en je mag altijd stoppen.',
    audioSrc: 'audio/veilige-plek.mp3',
    segments: [
      { text: 'Welkom. In deze oefening maak je in je hoofd een plek waar jij je veilig voelt. Ga lekker zitten of liggen.', pauze: 10 },
      { text: 'Houd je ogen open of doe ze dicht, wat voor jou het prettigst voelt. Adem drie keer rustig in … en weer uit.', pauze: 15 },
      { text: 'Denk aan een plek waar je je veilig voelt. Dat mag een echte plek zijn, of een plek die je verzint.', pauze: 15 },
      { text: 'Komt er geen veilige plek op? Kies dan een rustige of neutrale verzonnen plek, zoals een lege tuin of een kamer. Je mag de oefening ook stoppen en je voeten op de grond voelen.', pauze: 15 },
      { text: 'Het kan een strand zijn. Een bos. Een stoel bij de kachel. Kies alleen een beeld dat nu goed genoeg voelt.', pauze: 15 },
      { text: 'Ga daar in je hoofd naartoe. Kijk om je heen. Wat zie je? Kleuren, licht, vormen?', pauze: 18 },
      { text: 'Kijk naar de details. Hoe ziet de grond eruit? Wat is er nog meer om je heen?', pauze: 15 },
      { text: 'Misschien is er iemand die je vertrouwt. Die mag er zijn. Of je bent lekker alleen. Kies wat fijn voelt.', pauze: 15 },
      { text: 'Wat hoor je op je plek? Misschien golven, vogels, wind. Of juist fijne stilte.', pauze: 18 },
      { text: 'Ruik de lucht van je plek. Misschien zee, bos, vers brood, koffie.', pauze: 15 },
      { text: 'Voel je plek. Is de temperatuur lekker? Voel je zon, een bries, een warme deken?', pauze: 18 },
      { text: 'Verandert er iets in je beeld? Dat is oké. Jouw plek mag met je meebewegen.', pauze: 12 },
      { text: 'Hoe voelt je lijf bij dit beeld? Misschien rustiger, misschien neutraal of nog gespannen. Alles is goed. Je hoeft niets te bereiken.', pauze: 15 },
      { text: 'Dit beeld is van jou. Je bepaalt zelf wanneer je ernaartoe gaat en wanneer je het weer loslaat.', pauze: 15 },
      { text: 'Blijf hier nog even. Geniet van je plek, in je eigen tempo.', pauze: 30 },
      { text: 'Voordat je weggaat: bewaar één detail goed in je hoofd. Een kleur, een geluid, een gevoel.', pauze: 15 },
      { text: 'Dat detail is je sleutel. Daarmee kom je later snel terug naar deze plek.', pauze: 12 },
      { text: 'Haal één keer rustig adem. Zeg gedag tegen je plek. Je komt gauw terug.', pauze: 10 },
      { text: 'Beweeg zachtjes je handen en voeten. Doe je ogen open als ze dicht waren. Kijk rustig om je heen en voel de grond.' }
    ]
  },
  {
    id: 'compassievolle-pauze',
    title: 'Compassievolle pauze',
    minutes: 3,
    doel: 'Een korte, lieve pauze voor een zwaar moment. Drie stappen: eerlijk zeggen dat het moeilijk is, weten dat je niet alleen bent, en vriendelijk zijn voor jezelf.',
    audioSrc: 'audio/compassievolle-pauze.mp3',
    segments: [
      { text: 'Welkom bij deze korte pauze. Deze oefening is voor een moment dat het even zwaar is.', pauze: 8 },
      { text: 'Ga rustig zitten. Leg één hand op je hart, of op een plek die fijn voelt.', pauze: 10 },
      { text: 'Voel de warmte van je hand. Adem rustig in … en weer uit.', pauze: 12 },
      { text: 'Zeg eerlijk tegen jezelf: dit is een moeilijk moment. Het doet pijn, of het is eng.', pauze: 12 },
      { text: 'Dat mag je gewoon zeggen. Je hoeft niet stoer te doen tegen jezelf.', pauze: 12 },
      { text: 'Denk dan: ik ben niet de enige. Zoveel mensen voelen dit, ergens op de wereld, juist nu.', pauze: 15 },
      { text: 'Moeilijke momenten horen bij het leven. Bij jou, bij mij, bij iedereen.', pauze: 12 },
      { text: 'Zeg nu iets liefs tegen jezelf. Bijvoorbeeld: ik mag hier zijn. Ik doe mijn best.', pauze: 15 },
      { text: 'Of kies je eigen woorden. Woorden die je ook tegen een goede vriend zou zeggen.', pauze: 15 },
      { text: 'Voel je hand op je lijf. De warmte blijft. Jij bent er voor jezelf.', pauze: 15 },
      { text: 'Haal één keer rustig adem. De pauze is klaar. Je mag zacht verder met je dag.' }
    ]
  }
];
