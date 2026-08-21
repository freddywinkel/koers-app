import type { LocalizedText, TheoryBlock, TheoryLesson } from './types';

const t = (nl: string, en: string): LocalizedText => ({ nl, en });

const block = (
  id: string,
  headingNl: string,
  headingEn: string,
  paragraphs: Array<[string, string]>,
  bullets?: Array<[string, string]>
): TheoryBlock => ({
  id,
  heading: t(headingNl, headingEn),
  paragraphs: paragraphs.map(([nl, en]) => t(nl, en)),
  bullets: bullets?.map(([nl, en]) => t(nl, en))
});

/**
 * Vierentwintig korte theorielessen die naast de bestaande kernlessen staan.
 * De teksten zijn origineel, niet-diagnostisch en handmatig in beide talen geschreven.
 */
export const theoryLessons: TheoryLesson[] = [
  {
    id: 'w01-t01',
    weekId: 'w01',
    order: 1,
    afterLessonOrder: 1,
    title: t('ACT en VERS: twee routes, één koers', 'ACT and VERS: two routes, one direction'),
    minutes: 5,
    summary: t(
      'ACT en VERS leggen andere accenten, maar helpen je allebei om bewuster te reageren op moeilijke binnenwerelden.',
      'ACT and VERS place different emphases, but both help you respond more deliberately to difficult inner experiences.'
    ),
    intro: [
      t(
        'Koers combineert ideeën uit ACT met vaardigheden uit VERS. Het zijn geen diagnoses en ook geen beloften dat nare gevoelens verdwijnen.',
        'Koers combines ideas from ACT with skills from VERS. They are not diagnoses, nor promises that difficult feelings will disappear.'
      ),
      t(
        'Zie ze als twee kaarten van hetzelfde landschap. De ene helpt je ruimte en richting vinden; de andere helpt je patronen begrijpen en concrete vaardigheden kiezen.',
        'Think of them as two maps of the same landscape. One helps you find room and direction; the other helps you understand patterns and choose concrete skills.'
      )
    ],
    blocks: [
      block(
        'act-route',
        'De ACT-route',
        'The ACT route',
        [
          [
            'ACT richt zich op psychologische flexibiliteit: aanwezig zijn bij wat je merkt en handelen in de richting van wat belangrijk is. Dat kan ook wanneer een gedachte of gevoel nog niet weg is.',
            'ACT focuses on psychological flexibility: being present with what you notice and acting towards what matters. You can do that even when a thought or feeling has not gone away.'
          ],
          [
            'Voorbeeld: je bent zenuwachtig voor een gesprek. Je maakt ruimte voor de spanning en voert het gesprek toch, omdat eerlijk contact belangrijk voor je is.',
            'Example: you feel nervous about a conversation. You make room for the tension and have the conversation anyway because honest contact matters to you.'
          ]
        ]
      ),
      block(
        'vers-route',
        'De VERS-route',
        'The VERS route',
        [
          [
            'VERS gebruikt psycho-educatie en herhaald oefenen. Je leert een emotionele episode stap voor stap bekijken en kiest een vaardigheid die bij het moment past.',
            'VERS uses psychoeducation and repeated practice. You learn to examine an emotional episode step by step and choose a skill that fits the moment.'
          ],
          [
            'Voorbeeld: na een scherpe opmerking merk je spanning, een snelle gedachte en de neiging om weg te lopen. Door die onderdelen te zien ontstaat een extra keuzemoment.',
            'Example: after a sharp remark, you notice tension, a rapid thought and an urge to leave. Seeing those parts creates an extra moment of choice.'
          ]
        ]
      ),
      block(
        'difference',
        'Verschil zonder wedstrijd',
        'Different, not competing',
        [
          [
            'ACT vraagt vaak: kan dit gevoel mee terwijl je een betekenisvolle stap zet? VERS vraagt vaak: wat gebeurt er precies en welke vaardigheid kan nu helpen? In Koers mogen beide vragen naast elkaar bestaan.',
            'ACT often asks: can this feeling come along while you take a meaningful step? VERS often asks: what exactly is happening and which skill may help now? In Koers, both questions can sit side by side.'
          ],
          [
            'Reguleren betekent niet dat je een gevoel moet onderdrukken. Ruimte maken betekent ook niet dat je niets mag veranderen. Je kunt de intensiteit eerst veilig beïnvloeden en tegelijk erkennen dat het gevoel er nu is. Het doel is meer keuze, niet perfecte controle.',
            'Regulation does not mean suppressing a feeling. Making room does not mean you may never change anything. You can first influence the intensity safely while also acknowledging that the feeling is present now. The aim is more choice, not perfect control.'
          ]
        ]
      )
    ],
    conceptIds: ['act', 'vers', 'stepps', 'psychological-flexibility', 'emotion-regulation', 'psychoeducation', 'private-experience'],
    takeaway: t(
      'ACT helpt je ruimte en richting vinden. VERS helpt je patronen en vaardigheden ordenen. Je gebruikt wat op dit moment werkbaar is.',
      'ACT helps you find room and direction. VERS helps you organise patterns and skills. You use what is workable in this moment.'
    ),
    reflectionPrompt: t(
      'Wat heb je nu eerder nodig: ruimte maken, een patroon begrijpen of een concrete vaardigheid kiezen?',
      'What do you need first right now: making room, understanding a pattern or choosing a concrete skill?'
    ),
    relatedLessonIds: ['w01-l01', 'w01-l04'],
    relatedSkillIds: ['acceptatie-toestaan', 'afstand-observeren'],
    sourceIds: ['acbs-six-core', 'acbs-act-model', 'trimbos-vers-training', 'trimbos-vers-intro', 'uiowa-stepps']
  },
  {
    id: 'w05-t01',
    weekId: 'w05',
    order: 1,
    afterLessonOrder: 1,
    title: t('Zelf-als-inhoud, zelf-als-proces en zelf-als-context', 'Self-as-content, self-as-process and self-as-context'),
    minutes: 7,
    summary: t(
      'ACT beschrijft drie manieren waarop je “ik” kunt ervaren: als verhaal, als voortdurend proces en als perspectief vanwaaruit je opmerkt.',
      'ACT describes three ways of experiencing “self”: as a story, as an ongoing process and as the perspective from which you notice.'
    ),
    intro: [
      t(
        'Deze termen klinken abstract. Ze wijzen niet op drie verschillende personen, maar op drie kanten van dezelfde menselijke ervaring.',
        'These terms sound abstract. They do not point to three different people, but to three aspects of the same human experience.'
      )
    ],
    blocks: [
      block(
        'content',
        'Zelf-als-inhoud: het verhaal over mij',
        'Self-as-content: the story about me',
        [
          [
            'Zelf-als-inhoud bestaat uit beschrijvingen, herinneringen, rollen en conclusies: “Ik ben de sterke”, “Ik ben onzeker” of “Ik ben iemand die altijd faalt.” Verhalen helpen je oriënteren, maar kunnen nauw worden wanneer ze vaststaan.',
            'Self-as-content consists of descriptions, memories, roles and conclusions: “I am the strong one”, “I am insecure” or “I am someone who always fails.” Stories help you orient yourself, but can become narrow when they harden.'
          ],
          [
            'Een helpend verhaal kan ook knellen. “Ik ben altijd degene die zorgt” kan het moeilijk maken om zelf steun te vragen.',
            'Even a helpful story can become restrictive. “I am always the one who cares for others” may make it difficult to ask for support yourself.'
          ]
        ]
      ),
      block(
        'process',
        'Zelf-als-proces: wat ik nu opmerk',
        'Self-as-process: what I notice now',
        [
          [
            'Zelf-als-proces is het moment-tot-moment opmerken: nu is er spanning, nu een gedachte, nu opluchting. Je beschrijft ervaring als veranderend proces in plaats van als vaste identiteit.',
            'Self-as-process is moment-to-moment noticing: tension is here now, now a thought, now relief. You describe experience as a changing process rather than a fixed identity.'
          ],
          [
            '“Ik ben angstig” wordt bijvoorbeeld “Ik merk nu angst en een snelle adem.” Dat is geen woordtruc; het is een nauwkeuriger tijdsbeeld.',
            '“I am anxious” may become “I notice fear and rapid breathing right now.” This is not wordplay; it is a more accurate picture in time.'
          ]
        ]
      ),
      block(
        'context',
        'Zelf-als-context: het perspectief dat opmerkt',
        'Self-as-context: the perspective that notices',
        [
          [
            'Zelf-als-context verwijst naar het perspectief van waaruit gedachten, gevoelens en rollen worden opgemerkt. De inhoud verandert, terwijl het vermogen om op te merken beschikbaar blijft.',
            'Self-as-context refers to the perspective from which thoughts, feelings and roles are noticed. The content changes while the capacity to notice remains available.'
          ],
          [
            'Dit is geen opdracht om buiten jezelf te treden of je lichaam te verlaten. Voelt een oefening onwerkelijk of onveilig, open je ogen, oriënteer je in de kamer en kies gronding.',
            'This is not an instruction to leave yourself or your body. If an exercise feels unreal or unsafe, open your eyes, orient to the room and choose grounding.'
          ]
        ]
      )
    ],
    conceptIds: ['self-as-content', 'self-as-process', 'self-as-context'],
    takeaway: t(
      'Je hebt verhalen over jezelf en veranderende ervaringen, maar geen van beide hoeft je volledige identiteit te zijn.',
      'You have stories about yourself and changing experiences, but neither has to be your complete identity.'
    ),
    reflectionPrompt: t(
      'Welke zin over jezelf klinkt soms vast, terwijl je ervaring in werkelijkheid verandert?',
      'Which sentence about yourself sometimes sounds fixed even though your experience actually changes?'
    ),
    relatedLessonIds: ['w05-l01', 'w05-l02', 'w05-l03'],
    relatedSkillIds: ['waarnemend-zelf', 'afstand-observeren', 'gronden-54321'],
    sourceIds: ['acbs-six-core', 'acbs-act-model', 'acbs-philosophical-roots']
  },
  {
    id: 'w05-t02',
    weekId: 'w05',
    order: 2,
    afterLessonOrder: 2,
    title: t('Perspectief, identiteit en labels', 'Perspective, identity and labels'),
    minutes: 5,
    summary: t(
      'Een label kan iets benoemen zonder het geheel van jouw persoon te worden.',
      'A label can name something without becoming the whole of who you are.'
    ),
    intro: [
      t(
        'Mensen gebruiken labels om snel betekenis te geven. Dat kan erkenning of praktische hulp bieden, maar een label kan ook alle andere kanten van je uit beeld drukken.',
        'People use labels to make meaning quickly. A label can offer recognition or practical help, but it can also push every other part of you out of view.'
      )
    ],
    blocks: [
      block(
        'label-function',
        'Vraag wat een label doet',
        'Ask what a label does',
        [
          [
            'Een beschrijving als “gevoelig” kan helpen om eerder rust te plannen. Dezelfde beschrijving kan belemmeren als zij betekent: “Dus ik kan dit nooit leren.” Kijk niet alleen naar het woord, maar naar de functie die het krijgt.',
            'A description such as “sensitive” can help you plan rest earlier. The same description can restrict you if it means: “So I can never learn this.” Look not only at the word, but at the function it takes on.'
          ],
          [
            'Een professionele diagnose, als je die hebt, kan informatie geven en toegang tot zorg ondersteunen. Zij is nog steeds niet je volledige identiteit.',
            'A professional diagnosis, if you have one, can provide information and support access to care. It is still not your complete identity.'
          ]
        ]
      ),
      block(
        'perspective',
        'Meerdere ware perspectieven',
        'Several valid perspectives',
        [
          [
            'Je kunt tegelijk ouder, vriend, collega, leerling en iemand met moeilijke dagen zijn. Geen enkele rol hoeft alle andere rollen te wissen.',
            'You can be a parent, friend, colleague, learner and someone who has difficult days at the same time. No single role has to erase the others.'
          ],
          [
            'Voorbeeld: “Ik maakte een fout” beschrijft een gebeurtenis. “Ik bén een fout” maakt van die gebeurtenis een totale identiteit. Het eerste laat leren toe; het tweede sluit de deur.',
            'Example: “I made a mistake” describes an event. “I am a mistake” turns that event into a total identity. The first allows learning; the second closes the door.'
          ]
        ]
      ),
      block(
        'vulnerability',
        'Kwetsbaarheid is niet je naam',
        'Vulnerability is not your name',
        [
          [
            'Een kwetsbaarheid of terugkerend patroon is iets waarmee je rekening kunt houden. Het zegt niet wat je waard bent en voorspelt niet precies wat je toekomst wordt.',
            'A vulnerability or recurring pattern is something you can take into account. It does not say what you are worth or predict exactly what your future will be.'
          ]
        ]
      )
    ],
    conceptIds: ['self-as-content', 'self-as-context', 'vulnerability-not-identity', 'function-versus-content'],
    takeaway: t(
      'Gebruik labels als hulpmiddel, niet als kooi. Jij bent altijd groter dan één beschrijving, rol of moeilijke periode.',
      'Use labels as tools, not cages. You are always larger than one description, role or difficult period.'
    ),
    reflectionPrompt: t(
      'Welk label helpt je soms, en wanneer begint hetzelfde label je mogelijkheden te verkleinen?',
      'Which label sometimes helps you, and when does that same label begin to narrow your possibilities?'
    ),
    relatedLessonIds: ['w05-l01', 'w05-l03'],
    relatedSkillIds: ['waarnemend-zelf', 'beschrijven-benoemen'],
    sourceIds: ['acbs-act-model', 'trimbos-vers-intro', 'uiowa-stepps']
  },
  {
    id: 'w06-t01',
    weekId: 'w06',
    order: 1,
    afterLessonOrder: 1,
    title: t('Aandacht verplaatsen of vermijden?', 'Shifting attention or avoiding?'),
    minutes: 6,
    summary: t(
      'Dezelfde activiteit kan tijdelijk reguleren of een vast vermijdingspatroon worden. Doel, timing en gevolg maken het verschil.',
      'The same activity can regulate temporarily or become a fixed avoidance pattern. Purpose, timing and consequence make the difference.'
    ),
    intro: [
      t(
        'Aandacht verplaatsen is een bewuste VERS-vaardigheid. Ervaringsvermijding is een patroon waarbij je leven steeds meer wordt ingericht rond het niet voelen.',
        'Shifting attention is a deliberate VERS skill. Experiential avoidance is a pattern in which life becomes increasingly organised around not feeling.'
      )
    ],
    blocks: [
      block(
        'purpose',
        'Vraag naar doel en tijd',
        'Ask about purpose and time',
        [
          [
            'Aandacht verplaatsen kan helpen wanneer je pan te hoog is voor reflectie. Je kiest iets concreets, spreekt een tijd af en kijkt daarna opnieuw wat nodig is.',
            'Shifting attention can help when your pressure-cooker level is too high for reflection. You choose something concrete, set a time and then reassess what is needed.'
          ],
          [
            'Voorbeeld: twintig minuten wandelen om van pan 4 naar pan 3 te zakken en daarna een gesprek voorbereiden is iets anders dan wekenlang elk gesprek vermijden.',
            'Example: walking for twenty minutes to move from level 4 to level 3 and then preparing a conversation differs from avoiding every conversation for weeks.'
          ]
        ]
      ),
      block(
        'check',
        'Drie werkbaarheidsvragen',
        'Three workability questions',
        [[
          'Met deze vragen onderzoek je de functie en het langere gevolg van je keuze.',
          'These questions help you examine the function and longer-term effect of your choice.'
        ]],
        [
          ['Kies ik dit bewust, of voelt het alsof ik niet anders kan?', 'Am I choosing this deliberately, or does it feel as though I have no alternative?'],
          ['Kom ik na de pauze terug bij wat aandacht vraagt?', 'After the pause, do I return to what needs attention?'],
          ['Maakt dit mijn leven op termijn ruimer of kleiner?', 'Over time, does this make my life wider or smaller?']
        ]
      ),
      block(
        'no-moral',
        'Geen moreel oordeel',
        'Not a moral judgement',
        [
          [
            'Vermijding ontstaat vaak omdat iets werkelijk zwaar voelt. Het patroon hard veroordelen voegt alleen strijd toe. Merk het op, bescherm wat nodig is en oefen met een haalbare terugkeer.',
            'Avoidance often develops because something genuinely feels difficult. Harshly judging the pattern only adds struggle. Notice it, protect what needs protecting and practise a manageable return.'
          ]
        ]
      )
    ],
    conceptIds: ['attention-shifting', 'experiential-avoidance', 'workability', 'coping-strategy'],
    takeaway: t(
      'Een tijdelijke pauze kan helpen. Maak haar bewust, begrensd en verbonden met wat je daarna wilt doen.',
      'A temporary pause can help. Make it deliberate, time-limited and connected to what you want to do next.'
    ),
    reflectionPrompt: t(
      'Welke activiteit helpt jou terugkeren, en welke activiteit houdt je soms langer weg?',
      'Which activity helps you return, and which one sometimes keeps you away for longer?'
    ),
    relatedLessonIds: ['w06-l01', 'w06-l03'],
    relatedSkillIds: ['aandacht-verplaatsen', 'dagstructuur'],
    sourceIds: ['trimbos-vers-training', 'trimbos-vers-intro', 'acbs-act-model']
  },
  {
    id: 'w06-t02',
    weekId: 'w06',
    order: 2,
    afterLessonOrder: 2,
    title: t('De ACT-hexaflex en vijf VERS-vaardigheden', 'The ACT hexaflex and five VERS skills'),
    minutes: 7,
    summary: t(
      'De zes ACT-processen en vijf VERS-vaardigheden zijn geen losse trucjes, maar verschillende ingangen naar flexibeler handelen.',
      'The six ACT processes and five VERS skills are not isolated tricks, but different routes into more flexible action.'
    ),
    intro: [
      t(
        'Een model is een kaart, niet de werkelijkheid zelf. Je hoeft de onderdelen niet in een vaste volgorde of perfect toe te passen.',
        'A model is a map, not reality itself. You do not have to apply its parts perfectly or in a fixed order.'
      )
    ],
    blocks: [
      block(
        'hexaflex',
        'Zes samenwerkende ACT-processen',
        'Six interacting ACT processes',
        [[
          'De hexaflex zet zes processen naast elkaar die samen psychologische flexibiliteit ondersteunen.',
          'The hexaflex places six processes alongside one another that together support psychological flexibility.'
        ]],
        [
          ['Contact met het huidige moment: terugkeren naar wat er nu is.', 'Present-moment contact: returning to what is here now.'],
          ['Acceptatie: ruimte maken voor innerlijke ervaring.', 'Acceptance: making room for inner experience.'],
          ['Defusie: gedachten als gedachten leren zien.', 'Defusion: learning to see thoughts as thoughts.'],
          ['Zelf-als-context: het perspectief van waaruit je opmerkt.', 'Self-as-context: the perspective from which you notice.'],
          ['Waarden: gekozen kwaliteiten die richting geven.', 'Values: chosen qualities that provide direction.'],
          ['Toegewijd handelen: haalbare stappen in die richting zetten.', 'Committed action: taking manageable steps in that direction.']
        ]
      ),
      block(
        'vers-five',
        'Vijf VERS-vaardigheden',
        'Five VERS skills',
        [[
          'De vaardighedenchecklist biedt vijf routes om een emotioneel moment te bekijken of beïnvloeden.',
          'The skills checklist offers five routes for examining or influencing an emotional moment.'
        ]],
        [
          ['Observeren: situatie, lichaam, gedachten, gevoelens, neigingen en gedrag zo feitelijk mogelijk opmerken.', 'Observing: noticing the situation, body, thoughts, feelings, urges and behaviour as factually as possible.'],
          ['Beschrijven: wat je opmerkt nauwkeurig en zonder vast oordeel onder woorden brengen.', 'Describing: putting what you notice into accurate words without a fixed judgement.'],
          ['Gedachten uitdagen: controleerbare gedachten aan alle feiten toetsen.', 'Challenging thoughts: testing checkable thoughts against all available facts.'],
          ['Aandacht verplaatsen: bewust tijdelijk op iets anders richten.', 'Shifting attention: deliberately focusing elsewhere for a time.'],
          ['Problemen aanpakken: een werkelijk veranderbaar probleem stap voor stap benaderen.', 'Problem solving: approaching a genuinely changeable problem step by step.']
        ]
      ),
      block(
        'combine',
        'Combineren zonder alles tegelijk te doen',
        'Combining without doing everything at once',
        [
          [
            'Bij pan 2 kun je bijvoorbeeld een gedachte benoemen, ruimte maken voor spanning en één waardevolle stap kiezen. Bij pan 5 is die hele analyse te veel; dan kies je eerst veiligheid, gronden of steun.',
            'At level 2, you might name a thought, make room for tension and choose one valued step. At level 5, that much analysis is too much; choose safety, grounding or support first.'
          ],
          [
            'De beste kaart is de kaart die je op dit moment kunt gebruiken. Eén passende stap is genoeg.',
            'The best map is the one you can use in this moment. One fitting step is enough.'
          ]
        ]
      )
    ],
    conceptIds: ['psychological-flexibility', 'present-moment', 'acceptance', 'cognitive-defusion', 'self-as-context', 'values', 'committed-action', 'triflex', 'observe', 'describe', 'thought-challenging', 'attention-shifting', 'problem-solving', 'skill-checklist'],
    takeaway: t(
      'ACT geeft zes richtingen; VERS biedt concrete kijk- en doevaardigheden. Kies niet alles, maar wat nu past.',
      'ACT offers six directions; VERS provides concrete noticing and action skills. Choose not everything, but what fits now.'
    ),
    reflectionPrompt: t(
      'Welk ACT-proces en welke VERS-vaardigheid gebruik je al, misschien zonder die naam te kennen?',
      'Which ACT process and which VERS skill do you already use, perhaps without knowing the name?'
    ),
    relatedLessonIds: ['w06-l02', 'w06-l03', 'w06-l04'],
    relatedSkillIds: ['afstand-observeren', 'gedachten-uitdagen', 'aandacht-verplaatsen', 'problemen-aanpakken'],
    sourceIds: ['acbs-six-core', 'acbs-act-model', 'trimbos-vers-training', 'trimbos-vers-intro', 'uiowa-stepps']
  },
  {
    id: 'w07-t01',
    weekId: 'w07',
    order: 1,
    afterLessonOrder: 1,
    title: t('Waarden geven richting', 'Values provide direction'),
    minutes: 5,
    summary: t(
      'Waarden beschrijven hoe je wilt handelen en aanwezig wilt zijn, juist wanneer de uitkomst niet volledig te controleren is.',
      'Values describe how you want to act and show up, especially when the outcome is not fully under your control.'
    ),
    intro: [
      t(
        'Een waarde is geen gevoel dat je eerst moet vinden. Het is een gekozen kwaliteit van handelen, zoals eerlijk, zorgzaam, nieuwsgierig of moedig.',
        'A value is not a feeling you must first discover. It is a chosen quality of action, such as honest, caring, curious or courageous.'
      )
    ],
    blocks: [
      block(
        'direction',
        'Een richting zonder eindpunt',
        'A direction without an endpoint',
        [
          [
            'Je kunt een doel afronden, maar een waarde niet afvinken. “Mijn zus bellen” kan een doel zijn; “betrokken zijn” is een richting die je telkens opnieuw kunt kiezen.',
            'You can complete a goal, but you cannot tick off a value. “Call my sister” can be a goal; “being involved” is a direction you can choose repeatedly.'
          ],
          [
            'Waarden garanderen geen prettige uitkomst. Je kunt eerlijk spreken en toch teleurgesteld raken. De waarde helpt bepalen hoe jij wilt handelen, niet hoe een ander moet reageren.',
            'Values do not guarantee a pleasant outcome. You can speak honestly and still feel disappointed. The value guides how you want to act, not how someone else must respond.'
          ]
        ]
      ),
      block(
        'chosen',
        'Gekozen, niet opgelegd',
        'Chosen, not imposed',
        [
          [
            'Waarden klinken levend en vrijwillig: “Ik wil met aandacht zorgen.” Een opgelegde regel klinkt vaak als: “Ik moet iedereen altijd tevreden houden.”',
            'Values sound alive and voluntary: “I want to care with attention.” An imposed rule often sounds like: “I must always keep everyone happy.”'
          ],
          [
            'Invloed van familie, cultuur en gemeenschap is normaal. De vraag is niet of een waarde helemaal uit jezelf komt, maar of je haar nu bewust wilt onderschrijven.',
            'Influence from family, culture and community is normal. The question is not whether a value came entirely from within, but whether you now want to endorse it deliberately.'
          ]
        ]
      ),
      block(
        'pain',
        'Pijn kan naar betekenis wijzen',
        'Pain can point towards meaning',
        [
          [
            'Verdriet om afstand kan laten zien dat verbinding belangrijk is. Dat betekent niet dat pijn altijd nuttig is of dat je haar moet opzoeken. Zij kan wel informatie geven over wat je koestert.',
            'Sadness about distance may show that connection matters. This does not mean pain is always useful or that you should seek it out. It can still provide information about what you care about.'
          ]
        ]
      )
    ],
    conceptIds: ['values', 'value-goal-action', 'unclear-imposed-values'],
    takeaway: t(
      'Waarden zijn gekozen richtingen voor je handelen. Ze helpen ook wanneer zekerheid, succes of een goed gevoel ontbreken.',
      'Values are chosen directions for action. They help even when certainty, success or a good feeling are absent.'
    ),
    reflectionPrompt: t(
      'Welke kwaliteit wil je laten zien in een deel van je leven dat nu aandacht vraagt?',
      'Which quality do you want to express in an area of life that needs attention now?'
    ),
    relatedLessonIds: ['w07-l01', 'w07-l03'],
    relatedSkillIds: ['waarden-verhelderen'],
    sourceIds: ['acbs-six-core', 'acbs-act-model']
  },
  {
    id: 'w07-t02',
    weekId: 'w07',
    order: 2,
    afterLessonOrder: 2,
    title: t('Waarden, doelen, regels en verwachtingen', 'Values, goals, rules and expectations'),
    minutes: 6,
    summary: t(
      'Waarden geven richting, doelen maken stappen concreet en regels of verwachtingen kunnen helpen zolang ze niet de bestuurder worden.',
      'Values provide direction, goals make steps concrete and rules or expectations can help as long as they do not take over the driver’s seat.'
    ),
    intro: [
      t(
        'Deze woorden worden gemakkelijk door elkaar gebruikt. Het verschil helpt je plannen zonder van je koers een nieuwe meetlat te maken.',
        'These words are easily mixed up. The distinction helps you plan without turning your direction into another measuring stick.'
      )
    ],
    blocks: [
      block(
        'four',
        'Vier verschillende functies',
        'Four different functions',
        [[
          'Het helpt om te vragen welke functie elk woord in je plan heeft.',
          'It helps to ask what function each word serves in your plan.'
        ]],
        [
          ['Waarde: een kwaliteit van handelen, zoals open of betrouwbaar.', 'Value: a quality of action, such as openness or reliability.'],
          ['Doel: een bereikbare uitkomst, zoals vrijdag een bericht sturen.', 'Goal: an achievable outcome, such as sending a message on Friday.'],
          ['Regel: een verbale afspraak, zoals eerst luisteren en dan antwoorden.', 'Rule: a verbal agreement, such as listen first and then respond.'],
          ['Verwachting: een voorspelling over wat jij of een ander waarschijnlijk zal doen.', 'Expectation: a prediction about what you or someone else will probably do.']
        ]
      ),
      block(
        'rigidity',
        'Wanneer regels verstarren',
        'When rules become rigid',
        [
          [
            'Regels besparen denkwerk, maar kunnen losraken van de situatie. “Een goede vriend antwoordt altijd meteen” maakt weinig ruimte voor ziekte, werk of verschillende communicatiegewoonten.',
            'Rules save mental effort, but they can lose contact with the situation. “A good friend always replies immediately” leaves little room for illness, work or different communication habits.'
          ],
          [
            'Vraag of de regel je waarde ondersteunt. Zo niet, maak haar zachter, specifieker of vervang haar door een bewuste keuze.',
            'Ask whether the rule supports your value. If not, soften it, make it more specific or replace it with a deliberate choice.'
          ]
        ]
      ),
      block(
        'failure',
        'Een gemist doel is geen mislukte waarde',
        'A missed goal is not a failed value',
        [
          [
            'Als een gepland bezoek niet lukt, kun je betrokkenheid op een andere manier vormgeven. Een doel kan veranderen terwijl de richting blijft.',
            'If a planned visit does not happen, you can express involvement in another way. A goal can change while the direction remains.'
          ],
          [
            'Dit voorkomt dat waarden een nieuwe bron van zelfkritiek worden. Je mag opnieuw kiezen, ook na een week waarin weinig lukte.',
            'This prevents values becoming another source of self-criticism. You may choose again, even after a week in which little worked out.'
          ]
        ]
      )
    ],
    conceptIds: ['values', 'value-goal-action', 'cognitive-fusion', 'unclear-imposed-values'],
    takeaway: t(
      'Gebruik doelen en regels om je waarden te dienen. Pas ze aan wanneer ze hun functie verliezen.',
      'Use goals and rules to serve your values. Adjust them when they lose their function.'
    ),
    reflectionPrompt: t(
      'Welke “moet”-regel kun je vertalen naar een waarde en een kleine, gekozen stap?',
      'Which “must” rule can you translate into a value and a small, chosen step?'
    ),
    relatedLessonIds: ['w07-l02', 'w07-l03'],
    relatedSkillIds: ['waarden-verhelderen', 'gedachten-uitdagen'],
    sourceIds: ['acbs-act-model', 'acbs-philosophical-roots']
  },
  {
    id: 'w08-t01',
    weekId: 'w08',
    order: 1,
    afterLessonOrder: 1,
    title: t('Toegewijd handelen', 'Committed action'),
    minutes: 5,
    summary: t(
      'Toegewijd handelen is flexibel blijven oefenen met concrete stappen in een gekozen richting.',
      'Committed action means flexibly practising concrete steps in a chosen direction.'
    ),
    intro: [
      t(
        'Toewijding betekent niet dat je één plan koppig moet volhouden. Je blijft trouw aan de richting en past de stap aan wanneer de werkelijkheid daarom vraagt.',
        'Commitment does not mean stubbornly sticking to one plan. You stay connected to the direction and adjust the step when reality calls for it.'
      )
    ],
    blocks: [
      block(
        'action',
        'Gedrag maakt een richting zichtbaar',
        'Behaviour makes a direction visible',
        [
          [
            'Een waarde leeft pas in gedrag. “Gezondheid is belangrijk” wordt concreter als je een afspraak maakt, medicijnen volgens voorschrift gebruikt of tien minuten wandelt als dat lichamelijk passend is.',
            'A value comes alive in behaviour. “Health matters” becomes more concrete when you make an appointment, take prescribed medication or walk for ten minutes if that is physically suitable.'
          ],
          [
            'De stap hoeft het probleem niet op te lossen. Hij laat alleen zien welke richting je nu kiest.',
            'The step does not have to solve the problem. It only needs to show which direction you choose now.'
          ]
        ]
      ),
      block(
        'flexible',
        'Volhouden én bijsturen',
        'Persisting and adjusting',
        [
          [
            'Te weinig handelen kan je stilzetten. Impulsief handelen kan de richting vergeten. Star volhouden kan nieuwe informatie negeren. Flexibel toegewijd handelen zoekt het bruikbare midden.',
            'Too little action can leave you stuck. Impulsive action can lose sight of direction. Rigid persistence can ignore new information. Flexible committed action seeks a workable middle.'
          ],
          [
            'Voorbeeld: je wilde een uur sporten, maar je lichaam geeft pijn aan. Stoppen of aanpassen kan juist toegewijd zijn aan gezondheid.',
            'Example: you planned to exercise for an hour, but your body signals pain. Stopping or adapting can be an act of commitment to health.'
          ]
        ]
      ),
      block(
        'return',
        'Terugkeren hoort erbij',
        'Returning is part of it',
        [
          [
            'Toegewijd handelen wordt zichtbaar in het opnieuw beginnen. Een gemiste stap is informatie over de grootte, timing of steun die nodig was, geen bewijs dat je geen discipline hebt.',
            'Committed action becomes visible in beginning again. A missed step is information about size, timing or needed support, not proof that you lack discipline.'
          ]
        ]
      )
    ],
    conceptIds: ['committed-action', 'value-goal-action', 'inaction-impulsivity-rigid-persistence'],
    takeaway: t(
      'Toewijding zit niet in een perfect schema, maar in telkens terugkeren naar een haalbare stap die bij je richting past.',
      'Commitment is not a perfect schedule; it is repeatedly returning to a manageable step that fits your direction.'
    ),
    reflectionPrompt: t(
      'Welke stap kun je kleiner maken zonder de gekozen richting te verliezen?',
      'Which step can you make smaller without losing the chosen direction?'
    ),
    relatedLessonIds: ['w08-l01', 'w08-l02'],
    relatedSkillIds: ['toegewijd-handelen', 'waarden-verhelderen'],
    sourceIds: ['acbs-six-core', 'acbs-act-model']
  },
  {
    id: 'w08-t02',
    weekId: 'w08',
    order: 2,
    afterLessonOrder: 2,
    title: t('Barrières, keuzevrijheid en een werkbaar actieplan', 'Barriers, freedom of choice and a workable action plan'),
    minutes: 7,
    summary: t(
      'Een bruikbaar plan houdt rekening met innerlijke barrières, echte omstandigheden en de ruimte die je wél hebt.',
      'A useful plan accounts for inner barriers, real circumstances and the room you do have.'
    ),
    intro: [
      t(
        'Keuzevrijheid betekent niet dat alles mogelijk is of dat omstandigheden jouw schuld zijn. Het betekent zoeken naar het deel waarop je nu invloed kunt uitoefenen.',
        'Freedom of choice does not mean everything is possible or that circumstances are your fault. It means looking for the part you can influence now.'
      )
    ],
    blocks: [
      block(
        'barriers',
        'Twee soorten barrières',
        'Two kinds of barriers',
        [
          [
            'Innerlijke barrières zijn bijvoorbeeld angst, schaamte, pijnlijke herinneringen of de gedachte “dit heeft toch geen zin”. Praktische barrières zijn bijvoorbeeld geld, toegankelijkheid, zorgtaken, gezondheid of onveiligheid.',
            'Inner barriers include fear, shame, painful memories or the thought “there is no point anyway”. Practical barriers include money, accessibility, caring duties, health or lack of safety.'
          ],
          [
            'Innerlijke ruimte maken lost een praktische barrière niet op. Een actieplan moet beide serieus nemen.',
            'Making inner room does not solve a practical barrier. An action plan must take both seriously.'
          ]
        ]
      ),
      block(
        'choice-point',
        'Het keuzepunt',
        'The choice point',
        [
          [
            'Bij een keuzepunt merk je op wat je van je richting wegtrekt en wat je ernaartoe kan bewegen. Dit is geen indeling in goed en slecht gedrag; dezelfde actie kan in een andere context een andere functie hebben.',
            'At a choice point, you notice what pulls you away from your direction and what may move you towards it. This is not a division into good and bad behaviour; the same action can serve a different function in another context.'
          ],
          [
            'Voorbeeld: een afspraak afzeggen kan wegbewegen zijn uit angst, of juist naar gezondheid bewegen wanneer je ziek bent. Context bepaalt de functie.',
            'Example: cancelling an appointment can be moving away because of fear, or moving towards health when you are ill. Context determines the function.'
          ]
        ]
      ),
      block(
        'plan',
        'Vijf onderdelen van een actieplan',
        'Five parts of an action plan',
        [[
          'Een concreet plan verbindt je richting aan gedrag, timing, barrières en steun.',
          'A concrete plan connects your direction to behaviour, timing, barriers and support.'
        ]],
        [
          ['Richting: welke waarde wil je hier laten zien?', 'Direction: which value do you want to express here?'],
          ['Gedrag: wat ga je precies doen?', 'Behaviour: what exactly will you do?'],
          ['Moment: wanneer en waar doe je het?', 'Moment: when and where will you do it?'],
          ['Barrière: wat kan je van koers trekken?', 'Barrier: what may pull you off course?'],
          ['Steunplan: hoe verklein je de stap of wie kan helpen?', 'Support plan: how can you reduce the step or who can help?']
        ]
      )
    ],
    conceptIds: ['choice-freedom', 'act-matrix-choice-point', 'committed-action', 'workability', 'inaction-impulsivity-rigid-persistence'],
    takeaway: t(
      'Een goed plan is concreet én vriendelijk voor de werkelijkheid. Het benoemt barrières en bevat alvast een kleinere route.',
      'A good plan is concrete and kind to reality. It names barriers and includes a smaller route in advance.'
    ),
    reflectionPrompt: t(
      'Welke echte of innerlijke barrière verdient een plek in jouw volgende plan?',
      'Which real or inner barrier deserves a place in your next plan?'
    ),
    relatedLessonIds: ['w08-l02', 'w08-l03'],
    relatedSkillIds: ['toegewijd-handelen', 'om-hulp-vragen', 'dagstructuur'],
    sourceIds: ['acbs-act-model', 'acbs-philosophical-roots']
  },
  {
    id: 'w03-t01',
    weekId: 'w03',
    order: 1,
    afterLessonOrder: 1,
    title: t('Ervaringsvermijding en de controleagenda', 'Experiential avoidance and the control agenda'),
    minutes: 6,
    summary: t(
      'Pogingen om innerlijke ervaringen koste wat kost te beheersen kunnen je leven kleiner maken, ook als ze op korte termijn opluchten.',
      'Attempts to control inner experiences at any cost can make life smaller, even when they bring short-term relief.'
    ),
    intro: [
      t(
        'Iedereen vermijdt weleens ongemak. Dat is niet automatisch een probleem. ACT kijkt vooral naar het patroon en naar wat het je op langere termijn kost.',
        'Everyone avoids discomfort at times. That is not automatically a problem. ACT mainly looks at the pattern and what it costs you over time.'
      )
    ],
    blocks: [
      block(
        'avoidance',
        'Wanneer vermijden je wereld verkleint',
        'When avoidance shrinks your world',
        [
          [
            'Ervaringsvermijding betekent dat je vooral handelt om gedachten, gevoelens, herinneringen of lichamelijke sensaties niet te hoeven hebben. De vorm kan logisch lijken: afzeggen, verdoven, controleren, geruststelling zoeken of eindeloos analyseren.',
            'Experiential avoidance means acting mainly so you do not have to experience thoughts, feelings, memories or body sensations. The form can seem logical: cancelling, numbing, checking, seeking reassurance or analysing endlessly.'
          ],
          [
            'Voorbeeld: één feestje overslaan omdat je uitgeput bent kan goede zelfzorg zijn. Elk contact afzeggen om nooit sociale spanning te voelen kan je eenzaamheid vergroten. De functie en het patroon maken het verschil.',
            'Example: skipping one party because you are exhausted can be good self-care. Cancelling every contact so you never feel social tension may increase loneliness. The function and pattern make the difference.'
          ]
        ]
      ),
      block(
        'control-agenda',
        'De controleagenda onderzoeken',
        'Examining the control agenda',
        [
          [
            'De controleagenda is de verzameling regels en strategieën waarmee je probeert je binnenwereld eerst op orde te krijgen: “Pas als de angst weg is, kan ik beginnen.”',
            'The control agenda is the set of rules and strategies used to get your inner world in order first: “I can only begin once the anxiety is gone.”'
          ],
          [
            'Onderzoeken is geen verbod op reguleren. Rust nemen, een probleem oplossen of gronden kan heel behulpzaam zijn. De vraag is of een strategie jou ondersteunt of dat je leven er steeds meer omheen moet draaien.',
            'Examining this is not a ban on regulation. Resting, solving a problem or grounding can be very helpful. The question is whether a strategy supports you or whether your life must increasingly revolve around it.'
          ]
        ]
      ),
      block(
        'short-long',
        'Korte winst, lange rekening',
        'Short-term gain, long-term bill',
        [
          [
            'Vermijden kan direct spanning verlagen. Daardoor leert je brein het snel opnieuw te doen. Kijk daarom naar twee tijden: wat levert het over tien minuten op, en wat kost het over tien dagen of tien maanden?',
            'Avoidance can lower tension immediately, so your brain quickly learns to repeat it. Look at two time frames: what does it bring in ten minutes, and what does it cost in ten days or ten months?'
          ]
        ]
      )
    ],
    conceptIds: ['experiential-avoidance', 'control-agenda', 'private-experience', 'function-versus-content', 'coping-strategy'],
    takeaway: t(
      'Niet alle vermijding is verkeerd. Let op de functie, het patroon en de prijs die je op langere termijn betaalt.',
      'Not all avoidance is wrong. Notice its function, the pattern and the price you pay over time.'
    ),
    reflectionPrompt: t(
      'Welke strategie geeft jou snel opluchting, maar kan je wereld op langere termijn kleiner maken?',
      'Which strategy gives you quick relief but may make your world smaller over time?'
    ),
    relatedLessonIds: ['w03-l01', 'w03-l02'],
    relatedSkillIds: ['afstand-observeren', 'acceptatie-toestaan'],
    sourceIds: ['acbs-act-model', 'acbs-philosophical-roots']
  },
  {
    id: 'w03-t02',
    weekId: 'w03',
    order: 2,
    afterLessonOrder: 2,
    title: t('Acceptatie, bereidheid en werkbaarheid', 'Acceptance, willingness and workability'),
    minutes: 6,
    summary: t(
      'Acceptatie is actief ruimte maken voor wat er nu is, zodat je niet al je energie aan innerlijk vechten hoeft te besteden.',
      'Acceptance is actively making room for what is here now, so you do not have to spend all your energy fighting internally.'
    ),
    intro: [
      t(
        'Acceptatie betekent niet dat je iets leuk, terecht of veilig vindt. Je kunt een gevoel erkennen en tegelijk een grens stellen of een probleem aanpakken.',
        'Acceptance does not mean liking something or deciding it is fair or safe. You can acknowledge a feeling while setting a boundary or addressing a problem.'
      )
    ],
    blocks: [
      block(
        'acceptance',
        'Ruimte maken is iets anders dan opgeven',
        'Making room is different from giving up',
        [
          [
            'Bij acceptatie stop je tijdelijk met de strijd tegen het feit dat een innerlijke ervaring er al is. Je laat je schouders zakken rond de spanning, zonder te eisen dat de spanning zelf zakt.',
            'With acceptance, you temporarily stop fighting the fact that an inner experience is already here. You soften around the tension without demanding that the tension itself decrease.'
          ],
          [
            'Voorbeeld: “Ik merk verdriet én ik bel degene die me kan steunen.” Het woord én is belangrijk: voelen en handelen kunnen tegelijk bestaan.',
            'Example: “I notice sadness and I call the person who can support me.” The word and matters: feeling and acting can exist together.'
          ]
        ]
      ),
      block(
        'willingness',
        'Bereidheid heeft een reden',
        'Willingness has a reason',
        [
          [
            'Bereidheid betekent dat je vrijwillig plaats maakt voor het ongemak dat bij een waardevolle stap hoort. Het is geen opdracht om elke pijn te verdragen.',
            'Willingness means voluntarily making room for the discomfort that comes with a valued step. It is not an instruction to endure every pain.'
          ],
          [
            'Je hoeft niet bereid te zijn tot onveiligheid, vernedering of grensoverschrijding. Dan past bescherming of hulp zoeken beter.',
            'You do not have to be willing to accept danger, humiliation or boundary violations. Protection or seeking help fits better then.'
          ]
        ]
      ),
      block(
        'workability',
        'Werkbaarheid boven gelijk krijgen',
        'Workability over proving who is right',
        [
          [
            'De werkbaarheidsvraag is: als ik dit blijf doen, brengt het me dan dichter bij het leven dat ik wil leiden? Een strategie kan begrijpelijk zijn en toch niet goed genoeg werken.',
            'The workability question is: if I keep doing this, does it move me towards the life I want to lead? A strategy can be understandable and still not work well enough.'
          ],
          [
            'Werkbaarheid hangt af van de situatie. Afleiding kan in een piek verstandig zijn; voortdurend afleiden kan voorkomen dat je een belangrijk gesprek voert.',
            'Workability depends on the situation. Distraction may be wise during a peak; constant distraction may stop you having an important conversation.'
          ]
        ]
      )
    ],
    conceptIds: ['acceptance', 'willingness', 'workability'],
    takeaway: t(
      'Acceptatie maakt ruimte, bereidheid verbindt die ruimte aan een gekozen stap en werkbaarheid helpt je bijsturen.',
      'Acceptance makes room, willingness connects that room to a chosen step and workability helps you adjust.'
    ),
    reflectionPrompt: t(
      'Waar zou minder innerlijk vechten vandaag ruimte voor kunnen maken?',
      'What could less inner struggle make room for today?'
    ),
    relatedLessonIds: ['w03-l03', 'w03-l04'],
    relatedSkillIds: ['acceptatie-toestaan', 'om-hulp-vragen', 'grens-aangeven'],
    sourceIds: ['acbs-six-core', 'acbs-act-model']
  },
  {
    id: 'w04-t01',
    weekId: 'w04',
    order: 1,
    afterLessonOrder: 1,
    title: t('Cognitieve fusie en defusie', 'Cognitive fusion and defusion'),
    minutes: 6,
    summary: t(
      'Bij fusie bepaalt een gedachte ongemerkt je blik en gedrag. Defusie helpt je de gedachte als gedachte te zien.',
      'In fusion, a thought quietly controls your perspective and behaviour. Defusion helps you see the thought as a thought.'
    ),
    intro: [
      t(
        'Gedachten kunnen nuttig, pijnlijk, juist, onjuist of gemengd zijn. ACT probeert niet elke gedachte te corrigeren, maar helpt je flexibeler met haar om te gaan.',
        'Thoughts can be useful, painful, accurate, inaccurate or mixed. ACT does not try to correct every thought; it helps you relate to it more flexibly.'
      )
    ],
    blocks: [
      block(
        'fusion',
        'Wanneer een zin de hele werkelijkheid wordt',
        'When a sentence becomes the whole reality',
        [
          [
            'Cognitieve fusie betekent dat je zo verstrengeld raakt met een gedachte dat zij als feit, bevel of identiteit voelt. “Ik ga falen” wordt dan niet iets wat je hoofd zegt, maar de reden om niet te beginnen.',
            'Cognitive fusion means becoming so entangled with a thought that it feels like a fact, command or identity. “I will fail” stops being something your mind says and becomes the reason not to begin.'
          ],
          [
            'Fusie is geen domheid. Taal werkt juist doordat woorden overtuigend kunnen voelen. Het wordt lastig wanneer één verhaal al je andere informatie wegdrukt.',
            'Fusion is not stupidity. Language works precisely because words can feel convincing. It becomes difficult when one story crowds out all other information.'
          ]
        ]
      ),
      block(
        'defusion',
        'Afstand zonder ontkenning',
        'Distance without denial',
        [
          [
            'Defusie verandert de relatie met de gedachte. Je zegt bijvoorbeeld: “Ik merk de gedachte dat ik ga falen.” De inhoud blijft hoorbaar, maar je krijgt meer ruimte om te kiezen.',
            'Defusion changes your relationship with the thought. For example: “I notice the thought that I will fail.” The content remains audible, but you gain more room to choose.'
          ],
          [
            'Afstand nemen betekent niet dat de gedachte onwaar is. Bij een echt risico kijk je nog steeds naar feiten en bescherming. Defusie voorkomt alleen dat de eerste zin automatisch het laatste woord krijgt.',
            'Stepping back does not mean the thought is false. With a real risk, you still consider facts and protection. Defusion simply stops the first sentence automatically having the final word.'
          ]
        ]
      ),
      block(
        'purpose',
        'Kies de techniek op functie',
        'Choose the technique by function',
        [
          [
            'Een speelse oefening is niet bedoeld om pijn belachelijk te maken. Ze is bruikbaar wanneer zij de greep van taal even losser maakt. Werkt zingen juist vernederend of onrustig, kies dan een rustige zin of schrijf de gedachte op.',
            'A playful exercise is not meant to mock pain. It is useful when it loosens the grip of language for a moment. If singing feels humiliating or unsettling, choose a calm phrase or write the thought down.'
          ]
        ]
      )
    ],
    conceptIds: ['cognitive-fusion', 'cognitive-defusion', 'function-versus-content'],
    takeaway: t(
      'Defusie vraagt niet “is deze gedachte weg?”, maar “kan ik haar horen en toch bewust kiezen?”',
      'Defusion does not ask “is this thought gone?”, but “can I hear it and still choose deliberately?”'
    ),
    reflectionPrompt: t(
      'Welke terugkerende gedachte voelt soms als een feit of bevel?',
      'Which recurring thought sometimes feels like a fact or command?'
    ),
    relatedLessonIds: ['w04-l01', 'w04-l03', 'w04-l04'],
    relatedSkillIds: ['defusie-afstand-van-gedachten', 'bladeren-op-de-stroom'],
    sourceIds: ['acbs-six-core', 'acbs-act-model']
  },
  {
    id: 'w04-t02',
    weekId: 'w04',
    order: 2,
    afterLessonOrder: 2,
    title: t('Automatische gedachten, schema’s en denkpatronen', 'Automatic thoughts, schemas and thinking patterns'),
    minutes: 7,
    summary: t(
      'Snelle gedachten worden gekleurd door eerdere ervaringen en herkenbare denkpatronen. Namen helpen onderzoeken, niet veroordelen.',
      'Rapid thoughts are shaped by past experience and recognisable thinking patterns. Names support exploration, not judgement.'
    ),
    intro: [
      t(
        'Een automatische gedachte verschijnt snel en vaak zonder bewuste keuze. Een schema is een breder, geleerd verwachtingenpatroon over jezelf, anderen of de wereld.',
        'An automatic thought appears quickly and often without a deliberate choice. A schema is a broader, learned pattern of expectations about yourself, other people or the world.'
      ),
      t(
        'Een denkpatroon herkennen bewijst niet dat een gedachte onwaar is. Het is een uitnodiging om feiten, andere verklaringen en een passende actie rustig te bekijken.',
        'Recognising a thinking pattern does not prove a thought is false. It is an invitation to calmly consider facts, other explanations and a suitable action.'
      )
    ],
    blocks: [
      block(
        'thought-schema',
        'Van schema naar snelle zin',
        'From schema to rapid sentence',
        [
          [
            'Een schema werkt als een gevoelige zoeklamp. Als je vaak afwijzing verwacht, valt een kort bericht extra op. De snelle gedachte kan dan zijn: “Ze wil niets meer met me te maken hebben.”',
            'A schema works like a sensitive searchlight. If you often expect rejection, a brief message stands out. The rapid thought may then be: “She wants nothing more to do with me.”'
          ],
          [
            'Schema’s zijn geen volledige beschrijving van wie je bent. Ze kunnen ooit begrijpelijk zijn ontstaan en toch in een nieuwe situatie te snel afgaan.',
            'Schemas are not a complete description of who you are. They may have developed for understandable reasons and still activate too quickly in a new situation.'
          ]
        ]
      ),
      block(
        'patterns-one',
        'Zes patronen van selecteren en voorspellen',
        'Six patterns of selecting and predicting',
        [[
          'Deze patronen kleuren welke informatie je opmerkt en welke uitkomst je verwacht.',
          'These patterns shape which information you notice and which outcome you expect.'
        ]],
        [
          ['Zwart-witdenken: alleen uitersten zien, zonder tussenruimte.', 'Black-and-white thinking: seeing only extremes, with no middle ground.'],
          ['Overgeneraliseren: van één ervaring een algemene regel maken.', 'Overgeneralising: turning one experience into a general rule.'],
          ['Negatief filter: vooral het nare detail opmerken en de rest uit beeld laten.', 'Negative filter: noticing mainly the painful detail and leaving the rest out of view.'],
          ['Het positieve wegwuiven: iets goeds behandelen alsof het niet meetelt.', 'Dismissing the positive: treating something good as if it does not count.'],
          ['Gedachten lezen: zonder voldoende informatie invullen wat een ander denkt.', 'Mind reading: assuming what another person thinks without enough information.'],
          ['De toekomst invullen: één onzekere uitkomst behandelen alsof die vaststaat.', 'Predicting the future: treating one uncertain outcome as if it is fixed.']
        ]
      ),
      block(
        'patterns-two',
        'Zes patronen van betekenis en oordeel',
        'Six patterns of meaning and judgement',
        [[
          'Deze patronen voegen snel een zware betekenis, eis of totaal oordeel toe.',
          'These patterns quickly add a heavy meaning, demand or total judgement.'
        ]],
        [
          ['Rampdenken: vooral het ergste scenario zien en je draagkracht vergeten.', 'Catastrophising: focusing on the worst scenario and forgetting your capacity to cope.'],
          ['Redeneren vanuit gevoel: aannemen dat iets waar is omdat het zo voelt.', 'Emotional reasoning: assuming something is true because it feels true.'],
          ['Moeten-denken: starre eisen stellen aan jezelf, anderen of het leven.', 'Should and must thinking: placing rigid demands on yourself, others or life.'],
          ['Etiketten plakken: een hele persoon samenvatten met één hard woord.', 'Labelling: reducing a whole person to one harsh word.'],
          ['Personaliseren: te veel verantwoordelijkheid bij jezelf leggen zonder alle oorzaken te bekijken.', 'Personalising: taking too much responsibility without considering all causes.'],
          ['Vergroten en verkleinen: fouten uitvergroten en krachten of succes kleiner maken.', 'Magnifying and minimising: enlarging mistakes while shrinking strengths or success.']
        ]
      ),
      block(
        'challenge',
        'Onderzoeken zonder jezelf te ondervragen',
        'Examining without interrogating yourself',
        [
          [
            'Schrijf de gedachte precies op. Scheid waarneembare feiten van uitleg en voorspelling. Zoek informatie vóór en tegen, en formuleer daarna een gedachte die recht doet aan alle bekende feiten.',
            'Write the thought down precisely. Separate observable facts from interpretation and prediction. Look for information for and against it, then form a thought that reflects all known facts.'
          ],
          [
            'Bij hoge spanning, echt gevaar of grensoverschrijding komt eerst regulatie, bescherming of steun. Een G-schema is geen opdracht om je eigen waarneming weg te redeneren.',
            'At high intensity, with real danger or boundary violations, regulation, protection or support comes first. A thought record is not an instruction to reason away your own observations.'
          ]
        ]
      )
    ],
    conceptIds: ['automatic-thought', 'thinking-error', 'schema', 'thought-challenging'],
    takeaway: t(
      'Een patroon is een zoekrichting, geen vonnis. Onderzoek de gedachte rustig en kies daarna wat veilig en helpend is.',
      'A pattern is a direction for inquiry, not a verdict. Examine the thought calmly and then choose what is safe and helpful.'
    ),
    reflectionPrompt: t(
      'Welk patroon herken je soms, en welke informatie verdwijnt dan uit beeld?',
      'Which pattern do you sometimes recognise, and what information disappears from view then?'
    ),
    relatedLessonIds: ['w04-l01', 'w04-l02', 'w04-l03'],
    relatedSkillIds: ['gedachten-uitdagen', 'defusie-afstand-van-gedachten'],
    sourceIds: ['trimbos-vers-training', 'trimbos-vers-intro', 'uiowa-stepps', 'acbs-act-model']
  },
  {
    id: 'w01-t02',
    weekId: 'w01',
    order: 2,
    afterLessonOrder: 2,
    title: t('Emoties, kwetsbaarheid en het pannetjesmodel', 'Emotions, vulnerability and the pressure-cooker model'),
    minutes: 6,
    summary: t(
      'Emoties zijn complete reacties. Je gevoeligheid en omstandigheden beïnvloeden hoe snel en sterk je pannetje opwarmt.',
      'Emotions are whole responses. Your sensitivity and circumstances influence how quickly and strongly your pressure cooker heats up.'
    ),
    intro: [
      t(
        'Een emotie bestaat niet alleen uit een gevoelswoord. Je lichaam, gedachten, aandacht, neigingen en gedrag kunnen allemaal meedoen.',
        'An emotion is not just a feeling word. Your body, thoughts, attention, urges and behaviour can all be involved.'
      ),
      t(
        'Mensen verschillen in gevoeligheid, reactiesnelheid en hersteltijd. Dat is informatie over je systeem, geen oordeel over je karakter.',
        'People differ in sensitivity, speed of reaction and recovery time. That is information about your system, not a judgement about your character.'
      )
    ],
    blocks: [
      block(
        'vulnerability',
        'Kwetsbaarheid heeft meerdere lagen',
        'Vulnerability has several layers',
        [
          [
            'Biologische aanleg, eerdere ervaringen, slaap, stress, lichamelijke gezondheid en je omgeving kunnen samen invloed hebben. Geen enkele laag vertelt het hele verhaal.',
            'Biological predispositions, past experiences, sleep, stress, physical health and your environment can all have an influence. No single layer tells the whole story.'
          ],
          [
            'Voorbeeld: na weinig slaap kan een drukke trein harder binnenkomen dan op een uitgeruste dag. Dat maakt je niet zwak; je draagruimte is die dag kleiner.',
            'Example: after little sleep, a busy train may hit harder than it would on a rested day. That does not make you weak; your capacity is smaller that day.'
          ]
        ]
      ),
      block(
        'three-parts',
        'Snel merken, sterk reageren, langzaam zakken',
        'Notice quickly, react strongly, settle slowly',
        [
          [
            'Emotionele kwetsbaarheid kan betekenen dat je een prikkel snel opmerkt, er sterk op reageert of langer nodig hebt om terug te zakken. Die drie kenmerken hoeven niet allemaal even sterk te zijn.',
            'Emotional vulnerability can mean noticing a cue quickly, reacting strongly or needing longer to settle. Those three features do not have to be equally strong.'
          ],
          [
            'Dit onderscheid helpt je gerichter kiezen: eerder signaleren, eerst de piek veilig doorstaan of extra tijd voor herstel plannen.',
            'This distinction helps you choose more precisely: notice earlier, safely ride out the peak first or plan extra recovery time.'
          ]
        ]
      ),
      block(
        'pan',
        'Het pannetje is een meettaal',
        'The pressure cooker is a language for noticing',
        [
          [
            'Het pannetjesmodel ordent oplopende spanning van Rustig tot Kookt over. Het is geen test en geen diagnose. De juiste pan is de pan die het best beschrijft wat jij nu merkt.',
            'The pressure-cooker model orders rising intensity from Calm to Boiling over. It is not a test or diagnosis. The right level is the one that best describes what you notice now.'
          ]
        ],
        [
          ['Lage pan: er is vaak ruimte om na te denken en te plannen.', 'Lower level: there is often room to think and plan.'],
          ['Middenpan: maak het eenvoudig en kies één bekende vaardigheid.', 'Middle level: keep it simple and choose one familiar skill.'],
          ['Hoge pan: veiligheid, gronden en menselijke steun gaan voor analyse.', 'High level: safety, grounding and human support come before analysis.']
        ]
      )
    ],
    conceptIds: ['emotion-regulation', 'biopsychosocial-vulnerability', 'emotional-sensitivity-reactivity-recovery', 'responsibility-without-blame', 'pan-model'],
    takeaway: t(
      'Je reactie ontstaat uit meerdere invloeden. Vroeg herkennen geeft meer keuze; bij hoge spanning komt veiligheid eerst.',
      'Your response grows from several influences. Early recognition creates more choice; at high intensity, safety comes first.'
    ),
    reflectionPrompt: t(
      'Wat valt bij jou meestal als eerste op: de prikkel, de sterkte van de reactie of de tijd die herstel kost?',
      'What do you usually notice first: the cue, the strength of the reaction or the time recovery takes?'
    ),
    relatedLessonIds: ['w01-l02', 'w01-l03'],
    relatedSkillIds: ['afstand-observeren', 'adem-vertragen', 'gronden-54321'],
    sourceIds: ['trimbos-vers-training', 'trimbos-vers-intro', 'uiowa-stepps']
  },
  {
    id: 'w02-t01',
    weekId: 'w02',
    order: 1,
    afterLessonOrder: 1,
    title: t('De onderdelen van een emotionele episode', 'The parts of an emotional episode'),
    minutes: 6,
    summary: t(
      'Door een emotioneel moment als foto en film te bekijken, zie je meer dan alleen het eindgevoel.',
      'By examining an emotional moment as both a photograph and a film, you can see more than the final feeling.'
    ),
    intro: [
      t(
        'Een emotionele episode is het hele verloop van aanleiding tot gevolg. De onderdelen beïnvloeden elkaar en vallen niet altijd in dezelfde volgorde op.',
        'An emotional episode is the whole sequence from trigger to consequence. Its parts influence one another and are not always noticed in the same order.'
      )
    ],
    blocks: [
      block(
        'parts',
        'Meer dan één gevoel',
        'More than one feeling',
        [
          [
            'Je kunt kijken naar de aanleiding, de betekenis die je hoofd eraan geeft, lichamelijke signalen, het gevoelswoord, de actieneiging, het gedrag en wat daarna gebeurt.',
            'You can look at the trigger, the meaning your mind gives it, body signals, the feeling word, the action urge, the behaviour and what happens afterwards.'
          ],
          [
            'Voorbeeld: iemand antwoordt niet. Je borst spant, je denkt “ik word genegeerd”, je voelt angst, wilt veel berichten sturen en schaamt je later. Elk onderdeel biedt andere informatie.',
            'Example: someone does not reply. Your chest tightens, you think “I am being ignored”, you feel afraid, want to send many messages and feel ashamed later. Each part offers different information.'
          ]
        ]
      ),
      block(
        'photo-film',
        'EIS: eerst een foto, daarna de film',
        'EIS: first a photograph, then the film',
        [
          [
            'Een foto beschrijft één concreet moment: wie, wat, waar en wanneer. De film vertraagt vervolgens het verloop, zodat eerdere signalen en keuzemomenten zichtbaar worden.',
            'A photograph describes one concrete moment: who, what, where and when. The film then slows down the sequence so earlier signals and choice points become visible.'
          ],
          [
            'Foto en film zijn geen verhoor. Je probeert niet te bewijzen wie schuld heeft; je maakt het patroon duidelijk genoeg om er later iets mee te kunnen.',
            'Photograph and film are not an interrogation. You are not trying to prove who is to blame; you make the pattern clear enough to work with later.'
          ]
        ]
      ),
      block(
        'intensity',
        'Intensiteit is ook informatie',
        'Intensity is information too',
        [
          [
            'Met een EIS-cijfer kun je de sterkte van een emotie op verschillende momenten vergelijken. Het cijfer is persoonlijk: jouw 70 hoeft niet hetzelfde te voelen als de 70 van iemand anders.',
            'An EIS rating lets you compare the strength of an emotion at different moments. The rating is personal: your 70 does not have to feel like someone else’s 70.'
          ],
          [
            'Het nuttige verschil is niet “goed of fout”, maar bijvoorbeeld 80 vóór het gronden en 65 erna. Een kleine daling kan al extra keuze geven.',
            'The useful difference is not “right or wrong”, but perhaps 80 before grounding and 65 afterwards. Even a small drop may create extra choice.'
          ]
        ]
      )
    ],
    conceptIds: ['emotion-regulation', 'emotion-regulation-difficulties', 'emotional-episode', 'trigger', 'body-signal', 'action-urge', 'eis', 'eis-photo-film'],
    takeaway: t(
      'De foto maakt het moment concreet; de film laat het patroon zien. Samen tonen ze waar een andere reactie mogelijk wordt.',
      'The photograph makes the moment concrete; the film reveals the pattern. Together they show where another response becomes possible.'
    ),
    reflectionPrompt: t(
      'Welk onderdeel merk jij meestal het eerst: lichaam, gedachte, gevoel of actieneiging?',
      'Which part do you usually notice first: body, thought, feeling or action urge?'
    ),
    relatedLessonIds: ['w02-l02', 'w02-l05'],
    relatedSkillIds: ['afstand-observeren', 'beschrijven-benoemen'],
    sourceIds: ['trimbos-vers-training', 'trimbos-vers-intro', 'uiowa-stepps']
  },
  {
    id: 'w02-t02',
    weekId: 'w02',
    order: 2,
    afterLessonOrder: 2,
    title: t('Aanwezig zijn, observeren en beschrijven', 'Being present, observing and describing'),
    minutes: 5,
    summary: t(
      'Aandacht voor het huidige moment helpt je waarnemen wat er is voordat je automatisch reageert.',
      'Attention to the present moment helps you notice what is here before you react automatically.'
    ),
    intro: [
      t(
        'Observeren is opmerken. Beschrijven is woorden geven aan wat je opmerkt. Beide zijn iets anders dan verklaren, beoordelen of meteen oplossen.',
        'Observing is noticing. Describing is putting words to what you notice. Both differ from explaining, judging or immediately solving.'
      )
    ],
    blocks: [
      block(
        'present',
        'Het huidige moment is je vertrekpunt',
        'The present moment is your starting point',
        [
          [
            'Je hoofd kan terugreizen naar gisteren of vooruitlopen op morgen. Je zintuigen geven informatie over wat er nu werkelijk gebeurt: contact met de stoel, geluiden in de kamer, één ademhaling.',
            'Your mind can travel back to yesterday or rush ahead to tomorrow. Your senses provide information about what is actually happening now: contact with the chair, sounds in the room, one breath.'
          ],
          [
            'Aanwezig zijn is niet hetzelfde als ontspannen. Je kunt volledig aanwezig zijn en nog steeds spanning merken.',
            'Being present is not the same as relaxing. You can be fully present and still notice tension.'
          ]
        ]
      ),
      block(
        'observe',
        'Observeren zonder oordeel',
        'Observing without judgement',
        [
          [
            '“Mijn handen trillen” is een waarneming. “Ik stel me aan” is een oordeel. Een oordeel mag er zijn, maar je kunt het nauwkeuriger benoemen als: “Ik merk de gedachte dat ik me aanstel.”',
            '“My hands are shaking” is an observation. “I am being ridiculous” is a judgement. The judgement may be present, but you can describe it more accurately as: “I notice the thought that I am being ridiculous.”'
          ]
        ]
      ),
      block(
        'describe',
        'Beschrijven maakt het hanteerbaar',
        'Describing makes it more workable',
        [
          [
            'Kies concrete woorden: warm gezicht, druk op de borst, verdriet, de neiging om af te zeggen. Precieze taal maakt van één grote golf meerdere herkenbare onderdelen.',
            'Choose concrete words: warm face, pressure in the chest, sadness, an urge to cancel. Precise language turns one large wave into several recognisable parts.'
          ],
          [
            'Je hoeft niet het perfecte woord te vinden. “Iets tussen boos en bang” kan eerlijker zijn dan een label dat niet past.',
            'You do not need to find the perfect word. “Something between angry and afraid” may be more honest than a label that does not fit.'
          ]
        ]
      )
    ],
    conceptIds: ['present-moment', 'past-future-dominance', 'mindfulness', 'observe', 'describe', 'eis', 'eis-photo-film'],
    takeaway: t(
      'Eerst opmerken, dan beschrijven. Dat kleine tussenstuk kan ruimte maken voor een bewuste keuze.',
      'Notice first, then describe. That small middle step can make room for a deliberate choice.'
    ),
    reflectionPrompt: t(
      'Kun je één lichamelijk signaal, één gevoel en één gedachte van dit moment beschrijven zonder oordeel?',
      'Can you describe one body signal, one feeling and one thought from this moment without judgement?'
    ),
    relatedLessonIds: ['w02-l01', 'w02-l02', 'w02-l03', 'w02-l04'],
    relatedSkillIds: ['hier-en-nu', 'afstand-observeren', 'beschrijven-benoemen'],
    sourceIds: ['acbs-six-core', 'acbs-act-model', 'trimbos-vers-training', 'uiowa-stepps']
  },
  {
    id: 'w09-t01',
    weekId: 'w09',
    order: 1,
    afterLessonOrder: 1,
    title: t('Emotie, probleem of piekeren?', 'Emotion, problem or worry?'),
    minutes: 6,
    summary: t(
      'Een emotie vraagt erkenning en regulatie; een oplosbaar probleem vraagt een stap; piekeren vraagt vaak een andere relatie met onzekerheid.',
      'An emotion calls for acknowledgement and regulation; a solvable problem calls for a step; worry often calls for a different relationship with uncertainty.'
    ),
    intro: [
      t(
        'Deze drie kunnen tegelijk aanwezig zijn. Het onderscheid is geen test, maar helpt voorkomen dat je een gevoel probeert op te lossen of een praktisch probleem alleen probeert weg te ademen.',
        'All three can be present at once. The distinction is not a test; it helps prevent trying to solve a feeling or merely breathing through a practical problem.'
      )
    ],
    blocks: [
      block(
        'three-routes',
        'Drie verschillende eerste routes',
        'Three different first routes',
        [[
          'Het dominante deel van het moment geeft een aanwijzing voor je eerste stap.',
          'The dominant part of the moment offers a clue for your first step.'
        ]],
        [
          ['Emotie: benoem wat je voelt, regel de intensiteit en geef ruimte aan de ervaring.', 'Emotion: name what you feel, regulate intensity and make room for the experience.'],
          ['Probleem: beschrijf het veranderbare verschil tussen nu en wat nodig is.', 'Problem: describe the changeable gap between the current situation and what is needed.'],
          ['Piekeren: merk het herhalende denkproces op en vraag of er nu nieuwe informatie of actie ontstaat.', 'Worry: notice the repetitive thinking process and ask whether it produces new information or action now.']
        ]
      ),
      block(
        'example',
        'Eén situatie, drie lagen',
        'One situation, three layers',
        [
          [
            'Je ontvangt een onverwachte rekening. Angst is de emotie. Een betaaltermijn missen is een praktisch probleem. Urenlang alle mogelijke financiële rampen herhalen is piekeren.',
            'You receive an unexpected bill. Fear is the emotion. Missing a payment deadline is a practical problem. Repeating every possible financial disaster for hours is worry.'
          ],
          [
            'Een passende volgorde kan zijn: eerst je pan iets laten zakken, daarna de rekening en deadline bekijken, en vervolgens één telefoontje of betaalafspraak plannen.',
            'A fitting order may be: first lower your pressure-cooker level slightly, then examine the bill and deadline, and finally plan one phone call or payment arrangement.'
          ]
        ]
      ),
      block(
        'not-solvable-now',
        'Niet alles is nu oplosbaar',
        'Not everything is solvable now',
        [
          [
            'Sommige situaties zijn echt maar niet direct veranderbaar, zoals wachten op een uitslag. Dan kun je praktische voorbereiding combineren met acceptatie van onzekerheid en steun.',
            'Some situations are real but not immediately changeable, such as waiting for a result. You can then combine practical preparation with acceptance of uncertainty and support.'
          ]
        ]
      )
    ],
    conceptIds: ['emotional-episode', 'problem-solving', 'automatic-thought', 'coping-strategy', 'workability'],
    takeaway: t(
      'Bepaal niet wat jij bent, maar wat dit moment vooral nodig heeft: reguleren, oplossen of loskomen uit herhaling.',
      'Decide not what you are, but what this moment mainly needs: regulation, problem solving or stepping out of repetition.'
    ),
    reflectionPrompt: t(
      'Denk aan één zorg: welk deel is gevoel, welk deel is veranderbaar en welk deel herhaalt vooral onzekerheid?',
      'Think of one concern: which part is feeling, which part is changeable and which part mainly repeats uncertainty?'
    ),
    relatedLessonIds: ['w09-l01', 'w09-l02'],
    relatedSkillIds: ['beschrijven-benoemen', 'aandacht-verplaatsen', 'problemen-aanpakken'],
    sourceIds: ['trimbos-vers-training', 'trimbos-vers-intro', 'uiowa-stepps', 'acbs-act-model']
  },
  {
    id: 'w09-t02',
    weekId: 'w09',
    order: 2,
    afterLessonOrder: 2,
    title: t('Gestructureerd problemen aanpakken', 'Structured problem solving'),
    minutes: 7,
    summary: t(
      'Probleemoplossen wordt overzichtelijker wanneer je feiten, doelen, opties, keuze en evaluatie uit elkaar houdt.',
      'Problem solving becomes more manageable when you separate facts, aims, options, choice and review.'
    ),
    intro: [
      t(
        'Begin pas met uitgebreid oplossen wanneer je voldoende kunt nadenken. Bij hoge spanning komt eerst veiligheid of een eenvoudige regulatievaardigheid.',
        'Begin detailed problem solving only when you can think clearly enough. At high intensity, safety or a simple regulation skill comes first.'
      )
    ],
    blocks: [
      block(
        'define',
        'Maak het probleem klein en feitelijk',
        'Make the problem small and factual',
        [
          [
            '“Mijn hele leven is chaos” is te groot om in één keer aan te pakken. “Drie ongeopende brieven hebben deze week een deadline” is concreet en controleerbaar.',
            '“My whole life is chaos” is too large to address at once. “Three unopened letters have deadlines this week” is concrete and checkable.'
          ],
          [
            'Scheid feiten, gevolgen en aannames. Als informatie ontbreekt, kan informatie verzamelen de eerste stap zijn.',
            'Separate facts, consequences and assumptions. If information is missing, gathering it may be the first step.'
          ]
        ]
      ),
      block(
        'steps',
        'Een bruikbare volgorde',
        'A useful sequence',
        [[
          'Door de stappen te scheiden hoef je niet tegelijk te begrijpen, kiezen en uitvoeren.',
          'Separating the steps means you do not have to understand, choose and act all at once.'
        ]],
        [
          ['Omschrijf één probleem in één of twee feitelijke zinnen.', 'Describe one problem in one or two factual sentences.'],
          ['Bepaal een haalbaar doel: wat moet er concreet anders zijn?', 'Set a manageable aim: what specifically needs to be different?'],
          ['Bedenk meerdere opties zonder ze meteen af te keuren.', 'Generate several options without rejecting them immediately.'],
          ['Vergelijk opbrengst, moeite, risico en benodigde steun.', 'Compare benefit, effort, risk and needed support.'],
          ['Kies de kleinste werkbare eerste stap en plan wanneer je die zet.', 'Choose the smallest workable first step and plan when to take it.'],
          ['Kijk terug: wat veranderde, en wat moet worden aangepast?', 'Review: what changed, and what needs adjustment?']
        ]
      ),
      block(
        'help',
        'Hulp is ook een oplossing',
        'Help is also a solution',
        [
          [
            'Een probleem samen bekijken is geen mislukking van zelfstandig handelen. Juridische, medische, financiële of veiligheidsproblemen kunnen deskundige kennis nodig hebben die een zelfhulp-app niet biedt.',
            'Looking at a problem with someone else is not a failure of independence. Legal, medical, financial or safety problems may require expert knowledge that a self-help app does not provide.'
          ]
        ]
      )
    ],
    conceptIds: ['problem-solving', 'workability', 'choice-freedom', 'support-network'],
    takeaway: t(
      'Een goed probleem is klein genoeg om een volgende stap te zien. Evalueren en bijsturen horen bij de methode.',
      'A well-defined problem is small enough for a next step to become visible. Reviewing and adjusting are part of the method.'
    ),
    reflectionPrompt: t(
      'Welk groot probleem kun je vertalen naar één feitelijke zin en één haalbaar doel?',
      'Which large problem can you translate into one factual sentence and one manageable aim?'
    ),
    relatedLessonIds: ['w09-l02', 'w09-l03'],
    relatedSkillIds: ['problemen-aanpakken', 'gedachten-uitdagen', 'om-hulp-vragen'],
    sourceIds: ['trimbos-vers-training', 'trimbos-vers-intro', 'uiowa-stepps']
  },
  {
    id: 'w10-t01',
    weekId: 'w10',
    order: 1,
    afterLessonOrder: 1,
    title: t('De negen levensgebieden', 'The nine life domains'),
    minutes: 7,
    summary: t(
      'Negen levensgebieden helpen je breed kijken naar draagkracht, dagelijkse spanning en veiligheid.',
      'Nine life domains help you take a broad view of capacity, daily strain and safety.'
    ),
    intro: [
      t(
        'Emotieregulatie gebeurt niet alleen in je hoofd. Slaap, eten, gezondheid, geld, relaties en veiligheid kunnen je beschikbare draagruimte beïnvloeden.',
        'Emotion regulation does not happen only in your mind. Sleep, food, health, money, relationships and safety can affect your available capacity.'
      )
    ],
    blocks: [
      block(
        'nine',
        'De volledige brede blik',
        'The complete broad view',
        [[
          'De negen gebieden brengen dagelijkse basis, maatschappelijke omstandigheden, relaties en veiligheid samen.',
          'The nine domains bring together daily foundations, social circumstances, relationships and safety.'
        ]],
        [
          ['1. Eten en regelmaat.', '1. Food and regular meals.'],
          ['2. Slapen en rust.', '2. Sleep and rest.'],
          ['3. Bewegen op een lichamelijk passende manier.', '3. Movement that suits your body.'],
          ['4. Lichamelijke gezondheid en passende zorg.', '4. Physical health and suitable care.'],
          ['5. Vrije tijd, herstel en plezier.', '5. Leisure, recovery and enjoyment.'],
          ['6. Veiligheid en het voorkomen van zelfbeschadiging.', '6. Safety and prevention of self-harm.'],
          ['7. Werk, opleiding of een zinvolle daginvulling.', '7. Work, education or meaningful daily activity.'],
          ['8. Financiën en administratie.', '8. Finances and administration.'],
          ['9. Relaties en sociaal contact.', '9. Relationships and social contact.']
        ]
      ),
      block(
        'not-score',
        'Geen morele scorekaart',
        'Not a moral scorecard',
        [
          [
            'De gebieden zijn geen bewijs van goed leven of hard genoeg proberen. Ziekte, beperking, inkomen, werk en relaties zijn niet volledig individueel maakbaar.',
            'The domains are not proof of living well or trying hard enough. Illness, disability, income, work and relationships are not fully under individual control.'
          ],
          [
            'Gebruik de kaart om één klein aangrijpingspunt te vinden. Misschien is dat een vast eetmoment; misschien samen één brief openen; misschien medische hulp vragen.',
            'Use the map to find one small point of influence. It might be a regular meal, opening one letter with someone, or asking for medical help.'
          ]
        ]
      ),
      block(
        'safety-domain',
        'Veiligheid is geen leefstijltaak',
        'Safety is not a lifestyle task',
        [
          [
            'Het zesde gebied vraagt een andere benadering. Zelfbeschadigingspreventie gaat over vroeg signaleren, tijd winnen, toegang tot gevaar verkleinen en menselijke hulp inschakelen. Bij direct gevaar komt noodhulp vóór de rest van de domeinenkaart.',
            'The sixth domain requires a different approach. Preventing self-harm involves noticing early, creating time, reducing access to danger and involving human help. In immediate danger, emergency help comes before the rest of the domain map.'
          ]
        ]
      )
    ],
    conceptIds: ['life-domains', 'biopsychosocial-vulnerability', 'self-harm-prevention'],
    takeaway: t(
      'Kijk breed en kies klein. Eén stabiele stap in één gebied kan al extra draagruimte geven.',
      'Look broadly and choose small. One stable step in one domain can already add capacity.'
    ),
    reflectionPrompt: t(
      'Welk levensgebied vraagt nu geen perfecte oplossing, maar één kleine vorm van steun?',
      'Which life domain needs not a perfect solution, but one small form of support now?'
    ),
    relatedLessonIds: ['w10-l01', 'w10-l03'],
    relatedSkillIds: ['eten-regelmaat', 'slaap-rust', 'dagstructuur', 'om-hulp-vragen'],
    sourceIds: ['trimbos-vers-training', 'trimbos-vers-intro', 'uiowa-stepps']
  },
  {
    id: 'w10-t02',
    weekId: 'w10',
    order: 2,
    afterLessonOrder: 2,
    title: t('Relaties, grenzen, validatie en steun', 'Relationships, boundaries, validation and support'),
    minutes: 7,
    summary: t(
      'Gezond contact kan tegelijk warm en begrensd zijn. Validatie erkent ervaring; grenzen beschermen wat nodig is.',
      'Healthy contact can be both warm and bounded. Validation acknowledges experience; boundaries protect what is needed.'
    ),
    intro: [
      t(
        'Relaties beïnvloeden emoties, en emoties beïnvloeden relaties. Vaardig contact betekent niet dat je elk conflict kunt voorkomen of de reactie van een ander kunt besturen.',
        'Relationships affect emotions, and emotions affect relationships. Skilled contact does not mean preventing every conflict or controlling another person’s response.'
      )
    ],
    blocks: [
      block(
        'validation',
        'Validatie: erkennen zonder alles goed te keuren',
        'Validation: acknowledging without approving everything',
        [
          [
            'Validatie benoemt wat begrijpelijk is vanuit de situatie: “Na zo’n dag snap ik dat je gespannen bent.” Je kunt tegelijk onzeker zijn over een aanname of schadelijk gedrag begrenzen.',
            'Validation names what makes sense in the situation: “After a day like that, I understand why you feel tense.” You can remain uncertain about an assumption or set a limit on harmful behaviour at the same time.'
          ],
          [
            'Zelfvalidatie werkt hetzelfde: “Mijn angst is begrijpelijk na dat bericht, en ik weet nog niet wat de afzender bedoelde.”',
            'Self-validation works the same way: “My fear makes sense after that message, and I do not yet know what the sender meant.”'
          ]
        ]
      ),
      block(
        'boundaries',
        'Een grens gaat over jouw handelen',
        'A boundary concerns your actions',
        [
          [
            'Een bruikbare grens is concreet en uitvoerbaar: “Als er wordt geschreeuwd, onderbreek ik het gesprek.” Een eis probeert de ander te besturen; een grens vertelt wat jij zult doen.',
            'A useful boundary is concrete and actionable: “If shouting starts, I will pause the conversation.” A demand tries to control the other person; a boundary states what you will do.'
          ],
          [
            'Bij dreiging, dwang of geweld kan weggaan en deskundige hulp zoeken belangrijker zijn dan de grens rustig uitleggen.',
            'With threats, coercion or violence, leaving and seeking expert help may matter more than calmly explaining the boundary.'
          ]
        ]
      ),
      block(
        'support',
        'Een steunnetwerk maak je concreet',
        'Make a support network concrete',
        [
          [
            'Verschillende mensen kunnen verschillende rollen hebben: luisteren, praktisch helpen, afleiding bieden of professionele zorg geven. Eén persoon hoeft niet alles te dragen.',
            'Different people can have different roles: listening, practical help, distraction or professional care. One person does not have to carry everything.'
          ],
          [
            'Spreek liefst vooraf af hoe je hulp vraagt en wat iemand wel of niet kan bieden. Grenzen beschermen ook de duurzaamheid van steun.',
            'Where possible, agree in advance how you will ask for help and what someone can or cannot offer. Boundaries also protect the sustainability of support.'
          ]
        ]
      )
    ],
    conceptIds: ['validation', 'boundaries', 'support-network', 'responsibility-without-blame'],
    takeaway: t(
      'Erkennen en begrenzen kunnen tegelijk. Goede steun is duidelijk over behoefte, rol en bereikbaarheid.',
      'Acknowledgement and boundaries can coexist. Good support is clear about need, role and availability.'
    ),
    reflectionPrompt: t(
      'Wie kan jou op welke manier steunen, en welke grens helpt dat contact gezond te houden?',
      'Who can support you in what way, and which boundary helps keep that contact healthy?'
    ),
    relatedLessonIds: ['w10-l02', 'w10-l03'],
    relatedSkillIds: ['beschrijven-benoemen', 'om-hulp-vragen', 'nee-zeggen', 'grens-aangeven'],
    sourceIds: ['trimbos-vers-training', 'trimbos-vers-intro', 'uiowa-stepps']
  },
  {
    id: 'w11-t01',
    weekId: 'w11',
    order: 1,
    afterLessonOrder: 1,
    title: t('Triggers, signalen en vaardigheden per pan', 'Triggers, signals and skills for each level'),
    minutes: 7,
    summary: t(
      'Vroege signalen helpen je eerder schakelen; passende vaardigheden worden eenvoudiger naarmate je pan hoger staat.',
      'Early signals help you respond sooner; fitting skills become simpler as your pressure-cooker level rises.'
    ),
    intro: [
      t(
        'Een trigger is een aanleiding, geen volledige oorzaak en geen bewijs dat je reactie fout is. Je reactie ontstaat uit de aanleiding, betekenis, lichaam, geschiedenis en huidige draagkracht samen.',
        'A trigger is a prompting event, not a complete cause or proof that your response is wrong. Your response grows from the event, meaning, body, history and current capacity together.'
      )
    ],
    blocks: [
      block(
        'signals',
        'Maak signalen persoonlijk en waarneembaar',
        'Make signals personal and observable',
        [
          [
            'Vroege signalen kunnen lichamelijk zijn, zoals een strakke kaak; mentaal, zoals sneller zwart-witdenken; of gedragsmatig, zoals berichten opnieuw lezen of je terugtrekken.',
            'Early signals can be physical, such as a tight jaw; mental, such as faster black-and-white thinking; or behavioural, such as rereading messages or withdrawing.'
          ],
          [
            '“Ik voel me slecht” is moeilijk te gebruiken in een plan. “Ik slaap korter, klem mijn kaak en stuur sneller scherpe berichten” geeft aanknopingspunten.',
            '“I feel bad” is difficult to use in a plan. “I sleep less, clench my jaw and send sharp messages sooner” provides points for action.'
          ]
        ]
      ),
      block(
        'by-pan',
        'Een vaardigheid per intensiteit',
        'A skill for each intensity',
        [[
          'De onderstaande indeling is een rustige richtlijn; jouw persoonlijke plan kan daarvan afwijken.',
          'The outline below is a calm guide; your personal plan may differ.'
        ]],
        [
          ['Pan 1–2: observeren, plannen, gedachten onderzoeken en basiszorg onderhouden.', 'Levels 1–2: observe, plan, examine thoughts and maintain basic care.'],
          ['Pan 3: vereenvoudigen, aandacht verplaatsen, vertragen en vroeg steun vragen.', 'Level 3: simplify, shift attention, slow down and ask for support early.'],
          ['Pan 4: gronden, prikkels verminderen, risicovolle besluiten uitstellen en iemand inschakelen.', 'Level 4: ground, reduce stimulation, postpone risky decisions and involve someone.'],
          ['Pan 5: veiligheid volgen, niet alleen blijven als dat onveilig is en directe menselijke hulp gebruiken.', 'Level 5: follow the safety plan, do not stay alone if unsafe and use direct human help.']
        ]
      ),
      block(
        'practice',
        'Oefen vóór de piek',
        'Practise before the peak',
        [
          [
            'Een nieuwe vaardigheid oproepen is moeilijk wanneer je overspoeld bent. Oefen daarom korte versies op rustige en matig gespannen momenten, en bewaar de stappen op een vindbare plek.',
            'Recalling a new skill is difficult when you are overwhelmed. Practise short versions during calm and moderately tense moments, and keep the steps somewhere easy to find.'
          ]
        ]
      )
    ],
    conceptIds: ['trigger', 'body-signal', 'action-urge', 'pan-model', 'skill-checklist', 'coping-strategy', 'emotion-management-plan'],
    takeaway: t(
      'Hoe eerder je jouw concrete signalen herkent, hoe meer opties je hebt. Hogere spanning vraagt eenvoudiger stappen en meer steun.',
      'The earlier you recognise your concrete signals, the more options you have. Higher intensity calls for simpler steps and more support.'
    ),
    reflectionPrompt: t(
      'Welk signaal hoort bij jouw pan 2, en welke kleine stap wil je daaraan koppelen?',
      'Which signal belongs to your level 2, and which small step do you want to connect to it?'
    ),
    relatedLessonIds: ['w11-l01', 'w11-l02'],
    relatedSkillIds: ['afstand-observeren', 'aandacht-verplaatsen', 'gronden-54321', 'om-hulp-vragen'],
    sourceIds: ['trimbos-vers-training', 'trimbos-vers-intro', 'uiowa-stepps']
  },
  {
    id: 'w11-t02',
    weekId: 'w11',
    order: 2,
    afterLessonOrder: 2,
    title: t('EHP, veiligheid en je steunnetwerk', 'Emotion plan, safety and your support network'),
    minutes: 7,
    summary: t(
      'Een vooraf gemaakt EHP verbindt persoonlijke signalen met vaardigheden, steun en duidelijke veiligheidsstappen.',
      'An emotion management plan made in advance connects personal signals with skills, support and clear safety steps.'
    ),
    intro: [
      t(
        'Een plan is het bruikbaarst wanneer het concreet, kort en samen met betrokken mensen afgestemd is. Een app kan het bewaren, maar kan geen risico beoordelen of jou veilig houden.',
        'A plan is most useful when it is concrete, brief and agreed with involved people. An app can store it, but cannot assess risk or keep you safe.'
      )
    ],
    blocks: [
      block(
        'ehp',
        'Van algemene kennis naar jouw EHP',
        'From general knowledge to your own plan',
        [
          [
            'Een emotiehanteringsplan bevat jouw signalen per pan, vaardigheden die je al kent, dingen die je beter uitstelt en de mensen of diensten die je kunt inschakelen.',
            'An emotion management plan contains your signals at each level, skills you already know, things best postponed and the people or services you can involve.'
          ],
          [
            'Maak als-dan-zinnen: “Als ik mijn kaak klem en pan 3 bereik, leg ik mijn telefoon weg, grond ik mezelf en stuur ik mijn afgesproken bericht.”',
            'Use if-then sentences: “If I clench my jaw and reach level 3, I put my phone down, ground myself and send my agreed message.”'
          ]
        ]
      ),
      block(
        'safety',
        'Een veiligheidsplan is specifieker',
        'A safety plan is more specific',
        [
          [
            'Bij risico op zelfbeschadiging of ander direct gevaar bevat het plan ook manieren om tijd te winnen, afstand tot gevaarlijke middelen te maken, naar een veiliger plek te gaan en menselijke hulp te bereiken.',
            'When there is a risk of self-harm or other immediate danger, the plan also includes ways to create time, increase distance from dangerous means, move to a safer place and reach human help.'
          ],
          [
            'Bij direct gevaar, een concrete intentie of niet veilig kunnen blijven: stop de theorie, gebruik lokale noodhulp of je professionele crisiscontact en betrek nu een vertrouwd persoon.',
            'In immediate danger, with concrete intent or if you cannot stay safe: stop the theory, contact local emergency help or your professional crisis contact and involve a trusted person now.'
          ]
        ]
      ),
      block(
        'network',
        'Maak steun bereikbaar',
        'Make support reachable',
        [
          [
            'Noteer namen, rollen en actuele contactmogelijkheden ook buiten de app. Spreek af welke korte boodschap betekent dat je iemand nodig hebt en wat die persoon vervolgens kan doen.',
            'Record names, roles and current contact options outside the app too. Agree on a short message that means you need someone and what that person can then do.'
          ],
          [
            'Werk het plan bij na gebruik: wat was op tijd, wat was te ingewikkeld en welke hulp ontbrak?',
            'Update the plan after using it: what was timely, what was too complicated and which help was missing?'
          ]
        ]
      )
    ],
    conceptIds: ['emotion-management-plan', 'safety-plan', 'support-network', 'self-harm-prevention'],
    takeaway: t(
      'Een plan is een brug naar handelen en mensen. Houd het eenvoudig, vindbaar en afgestemd; bij direct gevaar komt menselijke hulp eerst.',
      'A plan is a bridge to action and people. Keep it simple, accessible and agreed; in immediate danger, human help comes first.'
    ),
    reflectionPrompt: t(
      'Welke stap of contactmogelijkheid moet in jouw plan korter, duidelijker of beter bereikbaar worden?',
      'Which step or contact option in your plan needs to become shorter, clearer or easier to reach?'
    ),
    relatedLessonIds: ['w11-l02', 'w11-l03'],
    relatedSkillIds: ['om-hulp-vragen', 'gronden-54321', 'veilige-plek'],
    sourceIds: ['trimbos-vers-training', 'trimbos-vers-intro', 'uiowa-stepps']
  },
  {
    id: 'w12-t01',
    weekId: 'w12',
    order: 1,
    afterLessonOrder: 1,
    title: t('Onderhoud, terugval en blijven oefenen', 'Maintenance, setbacks and continued practice'),
    minutes: 6,
    summary: t(
      'Vaardigheden worden betrouwbaarder door ze in meerdere situaties te herhalen, te evalueren en opnieuw op te pakken na onderbreking.',
      'Skills become more reliable by repeating them across situations, reviewing them and returning after interruptions.'
    ),
    intro: [
      t(
        'Een moeilijke week wist je leerervaring niet uit. Terugval betekent hier dat een oud patroon tijdelijk weer sterker wordt, niet dat jij terug bij nul bent.',
        'A difficult week does not erase what you have learned. A setback means an old pattern temporarily becomes stronger, not that you are back at zero.'
      )
    ],
    blocks: [
      block(
        'generalisation',
        'Van les naar dagelijks leven',
        'From lesson to daily life',
        [
          [
            'Generalisatie betekent dat je een vaardigheid op verschillende plaatsen, bij verschillende emoties en op meerdere intensiteiten leert gebruiken. Kennen en kunnen zijn niet hetzelfde.',
            'Generalisation means learning to use a skill in different places, with different emotions and at several intensities. Knowing and being able to do are not the same.'
          ],
          [
            'Oefen beschrijven bijvoorbeeld eerst thuis bij lichte irritatie, daarna op werk bij spanning en later in een moeilijk gesprek.',
            'For example, practise describing first at home with mild irritation, then at work under stress and later in a difficult conversation.'
          ]
        ]
      ),
      block(
        'setback',
        'Een terugval is informatie',
        'A setback is information',
        [
          [
            'Kijk na een lastig moment naar omstandigheden, vroege signalen, gekozen vaardigheden en beschikbare steun. Vraag niet alleen “wat ging fout?”, maar ook “wat merkte ik al op en wat voorkwam erger?”',
            'After a difficult moment, review circumstances, early signals, chosen skills and available support. Ask not only “what went wrong?”, but also “what did I already notice and what prevented things getting worse?”'
          ],
          [
            'Schaamte kan evaluatie blokkeren. Verantwoordelijkheid zonder schuld betekent eerlijk kijken naar jouw invloed zonder te doen alsof jij alle oorzaken bepaalde.',
            'Shame can block review. Responsibility without blame means honestly examining your influence without pretending you caused every factor.'
          ]
        ]
      ),
      block(
        'maintenance',
        'Een klein onderhoudsritme',
        'A small maintenance rhythm',
        [[
          'Onderhoud werkt beter wanneer het kort, voorspelbaar en ook op gewone dagen haalbaar is.',
          'Maintenance works better when it is brief, predictable and manageable on ordinary days too.'
        ]],
        [
          ['Kies één korte dagelijkse check-in.', 'Choose one brief daily check-in.'],
          ['Bekijk wekelijks één patroon, waarde of levensgebied.', 'Review one pattern, value or life domain each week.'],
          ['Oefen af en toe een veiligheids- of steunactie wanneer je rustig bent.', 'Occasionally practise a safety or support action when calm.'],
          ['Werk je plannen bij na verandering of nieuwe ervaring.', 'Update your plans after change or new experience.']
        ]
      )
    ],
    conceptIds: ['generalisation', 'coping-strategy', 'emotion-regulation', 'responsibility-without-blame', 'committed-action'],
    takeaway: t(
      'Onderhoud is klein en herhaalbaar. Terugkeren na een onderbreking is zelf een belangrijke vaardigheid.',
      'Maintenance is small and repeatable. Returning after an interruption is itself an important skill.'
    ),
    reflectionPrompt: t(
      'Welk klein oefenritme past ook in een drukke of moeilijke week?',
      'Which small practice rhythm would still fit during a busy or difficult week?'
    ),
    relatedLessonIds: ['w12-l01', 'w12-l03'],
    relatedSkillIds: ['dagstructuur', 'toegewijd-handelen', 'afstand-observeren'],
    sourceIds: ['trimbos-vers-training', 'trimbos-vers-intro', 'uiowa-stepps', 'acbs-act-model']
  },
  {
    id: 'w12-t02',
    weekId: 'w12',
    order: 2,
    afterLessonOrder: 2,
    title: t('De volledige ACT-VERS-landkaart en menselijke hulp', 'The complete ACT-VERS map and human help'),
    minutes: 7,
    summary: t(
      'De koers komt samen in openstaan, aanwezig zijn, richting kiezen, emoties begrijpen, vaardigheden toepassen en tijdig mensen betrekken.',
      'The route comes together in opening up, being present, choosing direction, understanding emotions, applying skills and involving people in time.'
    ),
    intro: [
      t(
        'Modellen helpen je oriënteren, maar jij hoeft geen model te worden. Gebruik namen om sneller te herkennen wat nodig is en laat deskundige of menselijke hulp het overnemen waar zelfhulp niet genoeg is.',
        'Models help you find your way, but you do not have to become a model. Use names to recognise what is needed sooner, and let expert or human help take over where self-help is not enough.'
      )
    ],
    blocks: [
      block(
        'act-map',
        'ACT in drie bewegingen',
        'ACT in three movements',
        [
          [
            'Triflex vat de zes ACT-processen samen: openstaan voor ervaring met acceptatie en defusie; aanwezig zijn met huidig moment en zelf-als-context; betrokken handelen met waarden en toegewijde actie.',
            'Triflex summarises the six ACT processes: opening to experience through acceptance and defusion; being aware through present-moment contact and self-as-context; and engaged action through values and committed action.'
          ],
          [
            'Psychologische flexibiliteit betekent kunnen schakelen tussen die bewegingen op basis van de situatie, niet altijd kalm of positief blijven.',
            'Psychological flexibility means being able to shift between those movements according to the situation, not remaining calm or positive all the time.'
          ]
        ]
      ),
      block(
        'vers-map',
        'VERS als leer- en oefenroute',
        'VERS as a learning and practice route',
        [
          [
            'VERS ordent kwetsbaarheid, triggers, emotionele episodes, intensiteit, denkpatronen, vaardigheden, levensgebieden en een persoonlijk EHP. Herhaald oefenen helpt de kennis naar dagelijkse situaties te brengen.',
            'VERS organises vulnerability, triggers, emotional episodes, intensity, thinking patterns, skills, life domains and a personal emotion plan. Repeated practice helps transfer knowledge into daily situations.'
          ],
          [
            'VERS II is een naam voor verdiepende vervolgtraining binnen het actuele VERS-aanbod. Deze app geeft alleen begripsmatige uitleg en is geen officiële VERS- of VERS-II-training.',
            'VERS II is a name for more advanced follow-on training within the current VERS programme. This app provides conceptual explanation only and is not an official VERS or VERS II course.'
          ]
        ]
      ),
      block(
        'roots',
        'De verdiepende wortels van ACT',
        'The deeper roots of ACT',
        [
          [
            'Functioneel contextualisme kijkt naar gedrag in zijn situatie en vraagt vooral welke functie het daar heeft. Dezelfde actie kan in een andere context iets anders doen; daarom zijn context en gevolg belangrijker dan een los label.',
            'Functional contextualism examines behaviour in its situation and asks what function it serves there. The same action can do something different in another context, so context and consequence matter more than an isolated label.'
          ],
          [
            'Relational Frame Theory, vaak RFT genoemd, onderzoekt hoe mensen via taal verbanden leren leggen. Dat helpt verklaren waarom woorden echte invloed krijgen en waarom defusie de relatie met taal oefent. Je hoeft RFT niet te beheersen om ACT-vaardigheden te gebruiken.',
            'Relational Frame Theory, often called RFT, examines how people learn relations through language. It helps explain why words gain real influence and why defusion trains our relationship with language. You do not need to master RFT to use ACT skills.'
          ]
        ]
      ),
      block(
        'human-help',
        'Waar de kaart ophoudt',
        'Where the map ends',
        [
          [
            'Zelfhulp kan oefenen en voorbereiding ondersteunen. Zij kan geen diagnose stellen, behandeling vervangen, relaties veilig maken, huisvesting of geldproblemen oplossen of crisishulp bieden.',
            'Self-help can support practice and preparation. It cannot diagnose, replace treatment, make relationships safe, solve housing or financial problems or provide crisis care.'
          ],
          [
            'Vraag gewone steun vroeg en professionele hulp wanneer problemen ernstig, aanhoudend, onveilig of te ingewikkeld worden. Bij direct gevaar gebruik je nu lokale noodhulp of je afgesproken crisiscontact.',
            'Ask for ordinary support early and professional help when problems become severe, persistent, unsafe or too complex. In immediate danger, use local emergency help or your agreed crisis contact now.'
          ]
        ]
      )
    ],
    conceptIds: ['act', 'vers', 'psychological-flexibility', 'triflex', 'functional-contextualism', 'rft', 'emotion-regulation', 'vers-two', 'support-network'],
    takeaway: t(
      'Je hoeft niet alles te onthouden. Herken je pannetje, kies één werkbare richting of vaardigheid en betrek op tijd een mens.',
      'You do not have to remember everything. Notice your level, choose one workable direction or skill and involve another person in time.'
    ),
    reflectionPrompt: t(
      'Welke drie dingen wil je meenemen: één manier van kijken, één vaardigheid en één persoon of professionele route?',
      'Which three things do you want to carry forward: one way of seeing, one skill and one person or professional route?'
    ),
    relatedLessonIds: ['w12-l02', 'w12-l03', 'w12-l04'],
    relatedSkillIds: ['afstand-observeren', 'acceptatie-toestaan', 'waarden-verhelderen', 'toegewijd-handelen', 'om-hulp-vragen'],
    sourceIds: ['acbs-six-core', 'acbs-act-model', 'acbs-philosophical-roots', 'trimbos-vers-training', 'trimbos-vers-intro', 'uiowa-stepps']
  }
].sort((a, b) => a.weekId.localeCompare(b.weekId) || a.order - b.order);
