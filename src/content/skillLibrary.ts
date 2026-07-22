import type { SkillCard } from './types';

/**
 * Toolbox-vaardigheden voor het Oefenen-scherm (stage 2, uitgebreid).
 * ---------------------------------------------------------------
 * 24 vaardigheden in vier groepen:
 *  1. de vijf VERS-emotieregulatievaardigheden
 *  2. de zes ACT-processen als bruikbare vaardigheid
 *  3. crisis- en ontlaadvaardigheden voor pan 4–5
 *  4. basisvaardigheden voor het dagelijks leven en contact met anderen
 *
 * panMin/panMax geven aan bij welke pan (1–5) de vaardigheid het meest werkt.
 * Zware gronding loopt tot pan 5; reflectieve oefeningen blijven laag (1–3).
 * Alle teksten zijn origineel, B1, je-vorm, warm en zonder oordeel.
 *
 * Let op: 'afstand-observeren' en 'gronden-54321' komen ook voor in skills.ts
 * (stage-1-voorbeelden). De ids zijn bewust gelijk gehouden; de integrator
 * kan bij een samenvoeging één van beide varianten kiezen.
 */
export const skillLibrary: SkillCard[] = [
  // ---------------------------------------------------------------
  // 1. De vijf VERS-emotieregulatievaardigheden
  // ---------------------------------------------------------------
  {
    id: 'afstand-observeren',
    name: 'Afstand nemen en observeren',
    panMin: 1,
    panMax: 3,
    summary:
      'Kijk naar je gedachten en gevoelens alsof je verslaggever bent. Je benoemt wat er is, zonder er meteen in mee te gaan.',
    steps: [
      'Stop even. Je hoeft nu niets op te lossen.',
      'Benoem wat je voelt: "Ik merk dat ik spanning voel."',
      'Benoem wat je denkt: "Ik merk de gedachte dat …"',
      'Benoem wat je in je lijf voelt: een knoop, warmte, druk.',
      'Kijk ernaar als wolken die voorbijtrekken.'
    ]
  },
  {
    id: 'beschrijven-benoemen',
    name: 'Beschrijven en benoemen',
    panMin: 1,
    panMax: 3,
    summary:
      'Geef je gevoel een nauwkeurig woord. Hoe preciezer je benoemt wat er is, hoe beter je weet wat je nodig hebt.',
    steps: [
      'Vraag jezelf af: wat voel ik nu precies?',
      'Kies een woord: boos, bang, verdrietig, blij, beschaamd, teleurgesteld.',
      'Zeg het hardop of schrijf het op: "Ik voel me …"',
      'Klopt het woord niet helemaal? Zoek verder tot het past.',
      'Vertel het eventueel aan iemand die je vertrouwt.'
    ]
  },
  {
    id: 'gedachten-uitdagen',
    name: 'Gedachten uitdagen',
    panMin: 1,
    panMax: 3,
    summary:
      'Onderzoek een gedachte die je pijn doet. Je kijkt rustig of hij klopt en of hij je verder helpt.',
    steps: [
      'Schrijf de gedachte op, precies zoals hij in je hoofd klinkt.',
      'Vraag: is dit een feit of mijn uitleg van de feiten?',
      'Vraag: wat zou ik zeggen tegen een vriend die dit denkt?',
      'Bedenk een gedachte die ook kan kloppen en meer helpt.',
      'Kies welke gedachte je meeneemt in je dag.'
    ]
  },
  {
    id: 'aandacht-verplaatsen',
    name: 'Aandacht verplaatsen',
    panMin: 2,
    panMax: 4,
    summary:
      'Stuur je aandacht bewust naar iets dat rustig of prettig voelt. Zo krijgt de pan kans om van het vuur af te komen.',
    steps: [
      'Merk op: mijn aandacht zit vast aan het nare gevoel.',
      'Kies iets actiefs: opruimen, wandelen, muziek, puzzelen, bellen.',
      'Doe het met volle aandacht, minstens tien minuten.',
      'Keert je aandacht terug naar het gevoel? Dat is normaal. Stuur je aandacht opnieuw.',
      'Kijk daarna: in welke pan zit je nu?'
    ]
  },
  {
    id: 'problemen-aanpakken',
    name: 'Problemen aanpakken',
    panMin: 1,
    panMax: 2,
    summary:
      'Pak een probleem stap voor stap aan, op een moment dat je rustig bent. Klein beginnen is genoeg.',
    steps: [
      'Schrijf het probleem in één zin op.',
      'Vraag: kijk ik hier door een oude bril van vroeger? Wat zijn de kale feiten?',
      'Bedenk minstens drie mogelijke oplossingen. Alles mag.',
      'Kies de oplossing die het beste past en haalbaar is.',
      'Bedenk de eerste kleine stap. Wanneer doe je die?'
    ]
  },

  // ---------------------------------------------------------------
  // 2. De zes ACT-processen als bruikbare vaardigheid
  // ---------------------------------------------------------------
  {
    id: 'acceptatie-toestaan',
    name: 'Acceptatie: ruimte maken',
    panMin: 1,
    panMax: 4,
    summary:
      'Maak ruimte voor een lastig gevoel in plaats van ertegen te vechten. Vechten kost energie; toestaan geeft lucht.',
    steps: [
      'Merk op waar je het gevoel in je lijf voelt.',
      'Adem zacht naar die plek toe, alsof je er ruimte omheen maakt.',
      'Zeg in jezelf: "Dit is er nu. Ik hoef het niet weg te duwen."',
      'Geef het gevoel een vorm: grootte, kleur, temperatuur.',
      'Kijk er met nieuwsgierigheid naar, alsof je het voor het eerst ziet.'
    ]
  },
  {
    id: 'defusie-afstand-van-gedachten',
    name: 'Afstand van je gedachten (defusie)',
    panMin: 1,
    panMax: 3,
    summary:
      'Een gedachte is een verhaaltje in je hoofd, geen feit en geen bevel. Je kunt ernaar kijken zonder erin mee te gaan.',
    steps: [
      'Merk de gedachte op, bijvoorbeeld: "Niemand vindt mij aardig."',
      'Zet ervoor: "Ik merk de gedachte dat niemand mij aardig vindt."',
      'Bedank je hoofd: "Dank je wel, hoofd, voor dit verhaal."',
      'Geef het verhaal een naam: "O, het niet-goed-genoeg-verhaal."',
      'Zing de gedachte in je hoofd op een gek deuntje.'
    ]
  },
  {
    id: 'hier-en-nu',
    name: 'Aandacht in het hier en nu',
    panMin: 1,
    panMax: 4,
    summary:
      'Je hoofd reist graag naar gisteren of straks. Met je zintuigen kom je terug naar nu, waar je leven gebeurt.',
    steps: [
      'Voel je voeten op de grond.',
      'Kijk om je heen en noem drie dingen die je ziet.',
      'Luister: welk geluid is vlakbij, welk geluid is verder weg?',
      'Volg één ademhaling van begin tot eind.',
      'Ga verder met wat je deed, nu met aandacht.'
    ]
  },
  {
    id: 'waarnemend-zelf',
    name: 'Het waarnemende zelf',
    panMin: 1,
    panMax: 3,
    summary:
      'Gedachten en gevoelens komen en gaan als het weer. Jij bent de lucht waar het weer in gebeurt: er is een deel van je dat rustig meekijkt.',
    steps: [
      'Ga rustig zitten en haal een paar keer adem.',
      'Merk een gedachte op. Vraag: wie merkt deze gedachte op?',
      'Merk een gevoel op. Vraag: wie voelt dit gevoel?',
      'Denk aan jezelf van vroeger. Wie was daar toen ook bij?',
      'Rust even in het besef: ik ben degene die kijkt, niet de storm.'
    ]
  },
  {
    id: 'waarden-verhelderen',
    name: 'Waarden helder maken',
    panMin: 1,
    panMax: 2,
    summary:
      'Waarden zijn je kompas: hoe wil jij zijn in je leven en voor anderen? Ze geven richting, ook op moeilijke dagen.',
    steps: [
      'Kies een deel van je leven: vriendschap, gezondheid, werk, vrije tijd.',
      'Vraag: wat vind ik hier echt belangrijk?',
      'Vraag: hoe wil ik zijn voor de mensen om me heen?',
      'Schrijf het op in gewone woorden: "Ik wil een vriendin zijn die …"',
      'Bedenk één klein ding dat je vandaag in die richting kunt doen.'
    ]
  },
  {
    id: 'toegewijd-handelen',
    name: 'Toegewijd handelen: een stap zetten',
    panMin: 1,
    panMax: 3,
    summary:
      'Kies een kleine stap in de richting van wat belangrijk voor je is. Doen, ook als het spannend is, bouwt je leven op.',
    steps: [
      'Kies één waarde die je nu aandacht wilt geven.',
      'Bedenk een stap die vandaag of morgen kan. Klein is prima.',
      'Maak hem concreet: wat doe je, wanneer, waar?',
      'Voorspel de weerstand: wat zal je hoofd tegen je zeggen?',
      'Zet de stap en neem die gedachten mee, als passagiers op je bus.'
    ]
  },

  // ---------------------------------------------------------------
  // 3. Crisis- en ontlaadvaardigheden voor pan 4–5
  // ---------------------------------------------------------------
  {
    id: 'gronden-54321',
    name: 'Gronden met je zintuigen (5-4-3-2-1)',
    panMin: 3,
    panMax: 5,
    summary:
      'Als het te veel wordt, brengen je zintuigen je terug naar nu. Benoem rustig wat je ziet, hoort en voelt.',
    steps: [
      'Noem 5 dingen die je ziet.',
      'Noem 4 dingen die je voelt (de stoel, je kleding, de vloer, de lucht).',
      'Noem 3 dingen die je hoort.',
      'Noem 2 dingen die je ruikt.',
      'Noem 1 ding dat je proeft.'
    ]
  },
  {
    id: 'koude-prikkel',
    name: 'Koude prikkel',
    panMin: 4,
    panMax: 5,
    summary:
      'Een korte koele prikkel kan je aandacht naar je lijf brengen. Doe dit alleen als kou lichamelijk veilig voelt; kies bij twijfel een andere grondoefening.',
    steps: [
      'Kies deze oefening alleen als kou lichamelijk veilig voelt. Twijfel je? Gebruik dan 5-4-3-2-1.',
      'Pak een koele doek of een koel pakje, gewikkeld in stof. Gebruik niets dat pijnlijk koud is.',
      'Houd het kort tegen je wangen. Blijf gewoon ademen.',
      'Stop meteen bij pijn, duizeligheid, benauwdheid of een naar gevoel.',
      'Merk op: zakt de intensiteit een klein beetje?'
    ]
  },
  {
    id: 'intens-bewegen',
    name: 'Intens bewegen',
    panMin: 3,
    panMax: 5,
    summary:
      'Kort bewegen kan helpen om spanning kwijt te raken. Kies alleen beweging die lichamelijk veilig en passend voor je is.',
    steps: [
      'Kies dit alleen als stevig bewegen lichamelijk veilig voor je is. Kies anders rustig wandelen of gronden.',
      'Kies iets dat past: snelwandelen, rustig traplopen of op de plaats bewegen.',
      'Doe het één tot drie minuten, tot je voelt dat je lijf werkt.',
      'Stop meteen bij pijn, duizeligheid, benauwdheid of als het niet goed voelt.',
      'Laat je adem daarna langzaam zakken.',
      'Kijk: in welke pan zit je nu?'
    ]
  },
  {
    id: 'adem-vertragen',
    name: 'Adem vertragen',
    panMin: 2,
    panMax: 5,
    summary:
      'Een rustige, iets langere uitademing kan spanning helpen verlagen. Forceer je adem niet en stop als het niet prettig voelt.',
    steps: [
      'Adem rustig in op een manier die vanzelf gaat. Tel eventueel tot vier.',
      'Adem zacht uit en maak de uitademing alleen iets langer als dat prettig voelt.',
      'Maak de uitademing zacht en lang, alsof je door een rietje blaast.',
      'Word je duizelig, benauwd of onrustiger? Stop en adem weer normaal.',
      'Voel je handen en voeten: is daar iets meer rust?'
    ]
  },
  {
    id: 'veilige-plek',
    name: 'Je veilige plek',
    panMin: 2,
    panMax: 4,
    summary:
      'Roep een rustige of neutrale plek op, echt of verzonnen. Jij kiest het beeld, houdt je ogen open als je wilt en mag altijd stoppen.',
    steps: [
      'Houd je ogen open of kijk zacht naar beneden, wat voor jou prettig voelt.',
      'Kies een rustige of neutrale plek: een strand, een bos of een verzonnen kamer.',
      'Kijk rond in je hoofd: welke kleuren, hoe valt het licht?',
      'Wat hoor je daar? Wat ruik je? Hoe voelt de lucht?',
      'Voelt het beeld niet goed? Stop, kijk om je heen en voel je voeten op de grond.'
    ]
  },

  // ---------------------------------------------------------------
  // 4. Basisvaardigheden: dagelijks leven en contact met anderen
  // ---------------------------------------------------------------
  {
    id: 'slaap-rust',
    name: 'Goed slapen',
    panMin: 1,
    panMax: 2,
    summary:
      'Wie beter slaapt, is overdag steviger. Een vaste avondroutine helpt je lijf en hoofd om te schakelen.',
    steps: [
      'Ga elke dag ongeveer op dezelfde tijd naar bed en eruit.',
      'Doe het laatste uur iets rustigs: lezen, luisteren, een warme douche.',
      'Leg je telefoon weg van je bed, scherm uit.',
      'Is je hoofd druk? Schrijf je gedachten op een briefje voor morgen.',
      'Word je niet slaperig? Sta even op, doe iets rustigs en probeer het opnieuw.'
    ]
  },
  {
    id: 'eten-regelmaat',
    name: 'Regelmatig eten',
    panMin: 1,
    panMax: 2,
    summary:
      'Honger maakt je gevoeliger voor emoties. Eten op vaste momenten houdt je energie en je humeur stabieler.',
    steps: [
      'Plan drie eetmomenten per dag, ongeveer op vaste tijden.',
      'Zet een herinnering op je telefoon als je het vaak vergeet.',
      'Eet zittend en rustig, ook als het klein is.',
      'Zorg dat er water en iets lekkers klaarstaat.',
      'Viel een maaltijd uit? Geen probleem. Pak de draad gewoon weer op.'
    ]
  },
  {
    id: 'dagstructuur',
    name: 'Dagstructuur maken',
    panMin: 1,
    panMax: 2,
    summary:
      'Een dag met een paar vaste punten geeft houvast. Je hoeft niet te piekeren over wat er komt; het staat er al.',
    steps: [
      'Pak pen en papier of je agenda, op een rustig moment.',
      'Zet drie vaste punten in je dag: opstaan, eten, naar bed.',
      'Voeg één nuttige taak toe en één leuke of rustige activiteit.',
      'Houd ruimte tussen de punten. Een dag hoeft niet vol te zitten.',
      'Vink af wat je deed. Wat niet lukte, schuift naar morgen.'
    ]
  },
  {
    id: 'om-hulp-vragen',
    name: 'Om hulp vragen',
    panMin: 2,
    panMax: 5,
    summary:
      'Je hoeft het niet alleen te dragen. Vroeg om hulp vragen is een vaardigheid, geen zwakte.',
    steps: [
      'Merk op: dit wordt te groot om alleen te dragen.',
      'Kies iemand die je vertrouwt: vriend, familie, behandelaar.',
      'Zeg het simpel: "Het gaat niet goed. Kun je even bij me zijn?"',
      'Zeg wat je nodig hebt: luisteren, meedenken of afleiding.',
      'Lukt het niet bij de eerste persoon? Probeer de volgende.'
    ]
  },
  {
    id: 'nee-zeggen',
    name: 'Nee zeggen',
    panMin: 1,
    panMax: 3,
    summary:
      'Nee zeggen beschermt je energie en je grenzen. Een vriendelijk, kort "nee" is een volledig antwoord.',
    steps: [
      'Adem even uit voordat je antwoordt. Je mag bedenktijd nemen.',
      'Zeg nee in één zin: "Nee, dat past nu niet voor mij."',
      'Je hoeft geen lang verhaal of smoes te geven.',
      'Blijf vriendelijk bij je antwoord, ook als de ander dringt.',
      'Complimenteer jezelf daarna: dit was goed voor jou.'
    ]
  },
  {
    id: 'grens-aangeven',
    name: 'Een grens aangeven',
    panMin: 1,
    panMax: 3,
    summary:
      'Aangeven wat wel en niet oké is voor jou maakt contact eerlijker en veiliger, voor jou en voor de ander.',
    steps: [
      'Merk het signaal op: spanning, irritatie, terugtrekken.',
      'Benoem voor jezelf: waar zit mijn grens precies?',
      'Gebruik een ik-zin: "Ik merk dat dit me te veel wordt."',
      'Zeg wat je wel wilt: "Ik wil graag even pauze."',
      'Herhaal rustig als het nodig is. Jouw grens mag er zijn.'
    ]
  },
  {
    id: 'spierontspanning',
    name: 'Spierontspanning',
    panMin: 2,
    panMax: 4,
    summary:
      'Spanning in je lijf houdt de emotie hoog. Door spieren kort aan te spannen en weer los te laten, leert je lijf ontspannen.',
    steps: [
      'Ga zitten of liggen, ergens waar het kan.',
      'Span je handen tot vuisten, vijf seconden. Laat los en voel het verschil.',
      'Doe hetzelfde met je schouders: omhoog, vasthouden, loslaten.',
      'Werk zo door je lijf: armen, gezicht, buik, benen.',
      'Eindig met drie rustige ademhalingen.'
    ]
  },
  {
    id: 'troost-verzorging',
    name: 'Troost en verzorging',
    panMin: 2,
    panMax: 5,
    summary:
      'Iets liefs voor jezelf doen laat je pannetje niet meteen zakken, maar het zegt tegen je lijf: ik zorg voor je.',
    steps: [
      'Vraag jezelf af: wat doet mij normaal gesproken goed?',
      'Kies iets kleins: warme thee, een dekentje, muziek, een lekkere geur.',
      'Doe het met aandacht, alsof je het voor een goede vriend doet.',
      'Blijf er even bij. Je hoeft er niets voor terug te doen.',
      'Bewaar wat werkt in je lijstje met troostmomenten.'
    ]
  }
];
