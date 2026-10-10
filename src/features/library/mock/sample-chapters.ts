export type SampleChapter = { title: string; body: string };
const chapter = (title: string, body: string): SampleChapter => ({
  title,
  body,
});

// Original reading samples added for the prototype. Source catalog metadata stays unchanged.
export const samples: Record<string, SampleChapter[]> = {
  "the-quiet-machine-at-dawn": [
    chapter(
      "An Object Without a Name",
      `The salvage beacon blinked once every eleven seconds. Lena counted between flashes while the ship cooled around her. Beyond the glass, an object larger than the mapped moon turned slowly in the dark. It had no docking lights. It had no windows. It had the exact shape of something she had drawn when she was six.\n\nShe found the drawing in her mother's last message. A child had pressed hard enough with a green pencil to tear the paper. Beneath it, in a careful adult hand, someone had written: Do not let her remember the door.\n\nLena switched off the beacon. Something on the object switched off with it.`,
    ),
    chapter(
      "The Welcome Sequence",
      `The airlock smelled of oranges. That was impossible, but Lena stopped checking the atmospheric readout and breathed it again. Her childhood kitchen had smelled the same way on the morning her father left.\n\nA panel woke beneath her glove. WELCOME HOME, it said. The words vanished before she could photograph them. In their place appeared a schematic of the machine, with one compartment shaded green.\n\nThe compartment was labeled with her mother's name. She asked the empty corridor who had entered it. For the first time, the machine made a sound: a chair scraping back across a kitchen floor.`,
    ),
    chapter(
      "A Memory of Rain",
      `Inside the green compartment there was a wooden chair and a recording of rain. Lena touched its seat. Still warm. She decided not to record that observation.\n\nThe machine spoke through a vent. It could remember everything except the name it had been given. It asked whether Lena knew what it meant to be kept alive by someone else's recollection.\n\nShe thought of her mother's unread messages. Then she sat down. Outside, the recording stopped. Real water began to collect beneath the door.`,
    ),
    chapter(
      "The Empty Index",
      `The archive held eleven thousand memories, each catalogued by a sensation: wool against the wrist, salt in a cut, light through closed eyelids. Every entry associated with a name had been removed.\n\nLena found an empty space that fit the machine's missing identity. Someone had not deleted it in haste. They had polished the absence until no trace of an edge remained.\n\nShe began an index of her own. The first entry was the smell of oranges. The second was fear. The machine asked her to explain the difference.`,
    ),
    chapter(
      "What We Carry Home",
      `Dawn reached the moon below them as a narrow strip of copper. Lena had enough fuel to return alone, and enough oxygen to wait another day. She spent an hour pretending these were different decisions.\n\nThe machine opened a small compartment beside the chair. Inside was a green pencil worn almost to nothing. It offered her the pencil as if it were a key.\n\nShe took it. On the white wall, slowly, she began drawing a door.`,
    ),
  ],
  "a-map-for-moonlight": [
    chapter(
      "The Country of Sleep",
      `Mira could draw any place she had dreamed of, but she could never choose the dream. That morning she woke with a mountain pass caught behind her eyes. By noon it had become a map. By evening a prince had offered her enough gold to forget it.\n\nHe wore travel clothes without a crease. His eyes had the patient shine of someone who had watched a great many sunrises.\n\n"I do not want you to burn it," he said. "I want you to take me there."`,
    ),
    chapter(
      "A Prince Without Dreams",
      `He said he had never slept. Mira thought it a courtly exaggeration until they crossed the second night. He sat beside the campfire, turning a pebble between his fingers, while the stars moved and she woke and slept again.\n\nAt dawn he asked what the mountain had looked like in her dream. She described the snow. He asked about its silence. No one had ever asked about that before.`,
    ),
    chapter(
      "The Unfinished Bridge",
      `The bridge ended halfway across the valley. On Mira's map it reached the other side. She held the paper up to the wind and saw that she had forgotten to draw the shadow.\n\nThe prince took her hand while she corrected it. Stone appeared below their feet with the soft assurance of a remembered word.\n\n"Does it frighten you?" she asked.\n\n"Only that you might wake."`,
    ),
    chapter(
      "Where the Moon Rests",
      `Above the pass, the moon lay in a shallow lake. Not its reflection: the moon itself, pale and cracked and humming faintly. Mira knelt at the water's edge.\n\nShe had dreamed this place after her father died. She had not understood why it was empty. Now the prince sat beside her and closed his eyes, and she understood what the lake had been waiting to hold.`,
    ),
    chapter(
      "A Different Way Home",
      `For the first time in his life, the prince slept. Mira stayed awake to watch the map change. Roads she had never drawn crossed its margins. Villages appeared in the folds.\n\nHis dreams, she realized, had been gathering somewhere for years. They would need a bigger sheet of paper.\n\nWhen he woke, she asked what he had seen. He smiled before he answered. It was the first thing she could not put on a map.`,
    ),
  ],
  "the-house-beneath-the-stairs": [
    chapter(
      "Four Floors, Certainly",
      `The landlady said Marrow House had four floors. The postman said five. June counted six windows above the kitchen, then stepped outside to count again and found three.\n\nShe had signed the lease because the rent was low and the street was quiet. Now she noticed that the houses on either side faced slightly away.\n\nUnder the kitchen table, a small square of light appeared between the boards. Someone below her was washing dishes.`,
    ),
    chapter(
      "The Spare Kitchen",
      `The staircase had thirteen steps until June began descending. After the twentieth, she stopped counting. A kitchen waited below, identical to hers except for the open window. Outside it was daylight.\n\nOn the table lay her lease. Her signature was different. Beside it, in handwriting she almost recognized, someone had added a clause: You may leave whenever the house agrees.`,
    ),
    chapter(
      "A Useful Tenant",
      `Mrs. Pell from the second floor came down carrying an empty saucepan. She did not seem surprised to find June in the spare kitchen.\n\n"It gives you what you need," she said. "For a while."\n\nJune asked how long Mrs. Pell had lived there. The woman looked at the saucepan as though the answer might be written inside. Behind them, another staircase opened.`,
    ),
    chapter(
      "The Window Test",
      `June tied a string to the kitchen tap and carried it out of the window. She climbed into the garden, crossed the street, and looked back. The string emerged from a window on the fifth floor.\n\nShe pulled. Somewhere in the house a tap began running.\n\nBy the time she reached the front door, rain was coming down the stairs. The landlady stood beneath it, perfectly dry.`,
    ),
    chapter(
      "One More Floor",
      `The house was growing. Each night June heard the slow work of new rooms assembling above her ceiling. Each morning the rent receipt listed another tenant.\n\nShe began writing her name on the walls, then the date, then the number of steps to the door. The words stayed. The distances changed.\n\nAt last she wrote a question. In the morning, beneath it, a small careful hand had answered: I am trying to let you out.`,
    ),
  ],
  "snowfall-at-room-seven": [
    chapter(
      "Before the Lights Went Out",
      `By six o'clock the snow had erased the road. By seven the guests had stopped pretending not to worry. Iris watched the hotel manager count the emergency candles. He counted them twice, then put one in his pocket.\n\nAt eight the lights went out. In the sudden dark, someone laughed with relief. Iris remembered that sound later. She remembered it much more clearly than the scream.`,
    ),
    chapter(
      "Seven Confessions",
      `Every room contained an envelope. The handwriting on each was different; the first sentence was the same: I am the reason you are here.\n\nIris laid them side by side in the breakfast room. Six guests admitted finding one. The seventh room was empty, its window locked from inside.\n\nSnow had settled on the sill. In its center lay a warm, perfectly dry glove.`,
    ),
    chapter(
      "The Missing Hour",
      `The clocks disagreed by exactly one hour. Iris thought of daylight saving, then checked the kitchen timer. Someone had changed that too.\n\nThe cook said the soup had burned before the blackout. The manager said it had burned after. Both pointed to the same dark ring at the bottom of the pot.\n\nOutside, the plow driver knocked on the window. He had been there since seven. He wanted to know why no one had answered.`,
    ),
    chapter(
      "Tracks to the Door",
      `There were no footprints leaving room seven. There were, however, two sets arriving. Iris measured them with a folded menu while the other guests watched from the hall.\n\nOne pair belonged to the missing woman. The other was smaller, with a nick in the left heel.\n\nThe hotel manager stopped polishing his shoes. Iris did not look up. She had already heard enough silence for one morning.`,
    ),
    chapter(
      "A Room Kept Ready",
      `Behind the wardrobe was a bell pull. The cord had been cut recently; its bright threads caught against the old dust. Iris followed the line down through the service stairs to a room kept warm for someone who had not arrived.\n\nThe eighth confession lay on the pillow. This one began differently.\n\nIf she comes back, it said, please let her finish telling you what happened.`,
    ),
  ],
  "the-alchemists-second-life": [
    chapter(
      "The Beginner's Hands",
      `The hands were too small. That was the first thing Tomas noticed. The second was that they did not shake. For twenty years he had measured reagents around a tremor. Now a drop hung perfectly from the glass rod.\n\nOutside the shop a notice declared all unsanctioned miracles illegal. Tomas looked at his new hands and decided to start with soap. Surely the kingdom could survive better soap.`,
    ),
    chapter(
      "A Recipe for Nothing",
      `The inspector asked what the blue liquid did. Tomas said it removed stains. This was true, provided a stain could include regret, rust, or a minor hereditary curse.\n\nHe demonstrated on an old apron. The inspector watched it turn white, then watched the owner's name appear at the collar.\n\n"That apron belonged to my father," she said. Tomas put down the bottle.`,
    ),
    chapter(
      "The Price of Glass",
      `Glass cost more than ingredients. Tomas walked the market for an hour before trading a week's work for a crate of chipped bottles. The seller wanted a remedy for sleeplessness.\n\nAt midnight Tomas delivered it. The remedy was ordinary tea and a promise to open the shop in the morning.\n\nSome problems, he was learning, survived reincarnation. Not every solution needed to be a miracle.`,
    ),
    chapter(
      "The Unlicensed Bloom",
      `The plant grew from a crack in the floor. By noon it had opened six silver flowers. By evening every customer had forgotten why they had come.\n\nTomas closed the shop and called the inspector. She arrived without her uniform.\n\n"I was hoping you would make one mistake," she said, looking at the flowers. "Now I can ask you for help."`,
    ),
    chapter(
      "A Shop Worth Keeping",
      `They moved the plant into a clay pot and put it in the window. Its flowers closed at dusk. On the pavement below, an old woman remembered the route home for the first time in years.\n\nTomas rewrote the sign above his door. Remedies, repairs, reasonable expectations.\n\nThe inspector asked whether that last part was a disclaimer. He told her it was the most difficult thing he sold.`,
    ),
  ],
  "the-saltwind-atlas": [
    chapter(
      "The Map That Moved",
      `The atlas changed while Kemi was stealing it. A coastline folded itself under her thumb and a small island appeared where the librarian's signature had been. She dropped the book.\n\n"You could have asked," the librarian said.\n\nKemi said she was sorry. The island grew a harbor. She said she was not really sorry. The harbor disappeared.\n\nThey stood very still, both looking at the map.`,
    ),
    chapter(
      "Three Navigators",
      `A boat needed three navigators because no two ever agreed. Kemi had found a tide reader, a star keeper, and herself. None of them could afford a boat.\n\nThey borrowed one from a man who insisted he did not mind. The atlas promptly removed his dock.\n\n"We should leave a note," said the tide reader.\n\n"We should leave payment," said the star keeper. For once, they were both right.`,
    ),
    chapter(
      "The Island of Answers",
      `Every truthful answer drew another mile of coastline. Kemi asked the others small things at first: their favorite food, the name of their first boat. By evening they had a perfectly useless archipelago.\n\nThen the star keeper said she was afraid of deep water. A channel opened directly ahead.\n\nNo one laughed. They lowered the sail and let her choose the route.`,
    ),
    chapter(
      "The Blank Latitude",
      `The sea was missing from the page. They were sailing through an empty rectangle surrounded by detailed, careful ink. Kemi held the atlas to the sun.\n\nSomeone had scraped this place away. A scar in the paper followed the outline of a much larger island.\n\nThe tide reader stopped smiling. He had known they would come here. He had simply hoped the map would not ask him to explain.`,
    ),
    chapter(
      "A Harbor Made of Truth",
      `He told them about the wreck. As he spoke, the blank paper filled with rocks, then a narrow inlet, then the names of people who had not returned.\n\nThe atlas did not forgive him. It only showed them where to go.\n\nKemi put a hand on the tiller. Ahead, the water changed from blue to green, and the first lights of the hidden harbor appeared.`,
    ),
  ],
  "the-velvet-treaty": [
    chapter(
      "The Terms of Peace",
      `Sera read the marriage contract twice. The first time she looked for traps. The second time she looked for anything that was not a trap.\n\nAcross the table the prince waited without touching his tea. His father had burned her city. Her signature would give his family the river that had once supplied it.\n\nShe turned to the last page and crossed out the word obedience.`,
    ),
    chapter(
      "An Unusual Amendment",
      `The prince replaced obedience with cooperation. Sera replaced cooperation with consent. They passed the paper back and forth while six ministers pretended not to watch.\n\nAt last the prince laughed. It was a tired sound, but it was his own.\n\n"We may be here all winter," he said.\n\n"Then we will need better tea."`,
    ),
    chapter(
      "The Northern Witness",
      `The witness arrived carrying a piece of burned stone. He laid it beside the treaty and refused a chair. Sera recognized the carved edge of her schoolhouse window.\n\nThe prince asked who had given the order. No one answered quickly enough.\n\nFor the first time, Sera saw what peace might cost him. It did not make the bargain easier. It made it possible to negotiate.`,
    ),
    chapter(
      "Two Seals",
      `Their seals shared the same wax. Sera noticed it before the ministers did: one broken seal would now break the other.\n\nThe clerk apologized for the error. The prince told him to leave it.\n\nThat evening Sera found a second copy of the treaty in her room, with all the crossed-out words carefully preserved. Someone wanted her to remember what they had refused.`,
    ),
    chapter(
      "The First Crossing",
      `The first cart across the reopened bridge carried flour. No banners, no soldiers, no royal escort. Sera had insisted on that.\n\nThe prince stood beside her in the rain and watched the miller hesitate at the border. Then the wheels moved.\n\nIt was a small sound after a long war. Neither of them spoke until the cart had reached the other side.`,
    ),
  ],
  "the-lanterns-of-briar-row": [
    chapter(
      "A Key Among the Roots",
      `The key came wrapped in a root. Nell unwound it carefully while the solicitor read her aunt's last instructions. Water on Mondays. Open before nine. Never ask a customer what the flowers mean.\n\nThe shop smelled of wet earth and oranges. On the counter a rose opened as Nell entered. Its petals were the exact blue of a letter she had never sent.`,
    ),
    chapter(
      "The Man with Marigolds",
      `Mr. Vale came for carnations and left with marigolds. They had grown around his wrist while he waited for his change.\n\nNell remembered the rule and said nothing. He stood at the door a long time before asking whether she sold wrapping paper.\n\n"For an apology," he added.\n\nThe marigolds brightened. She chose the plainest paper she had.`,
    ),
    chapter(
      "Lantern Weather",
      `Every lantern on Briar Row lit at noon. Nell looked up from a bucket of irises and saw her aunt's handwriting spreading across the window in condensation.\n\nThe words were not a message. They were a shopping list.\n\nShe bought everything on it anyway. By evening she had made enough soup for the entire street, which was, she realized, probably the point.`,
    ),
    chapter(
      "What the Garden Knows",
      `In the back garden, nothing grew near the old bench. Nell planted lavender there twice. Both times it moved itself overnight.\n\nShe sat on the bench with the unsent letter. For an hour she did nothing but hold it.\n\nWhen she stood up, a small green shoot had appeared between the stones. The garden was willing to wait.`,
    ),
    chapter(
      "The Last Light on the Row",
      `Nell left the shop open late. People came in for flowers and stayed to talk. Sometimes they talked to her. Sometimes, very quietly, they talked to the plants.\n\nShe mailed the letter on a Thursday. Nothing extraordinary happened. That evening the blue rose lost its last petal, and a white one began to open.\n\nNell watered it and turned out the light.`,
    ),
  ],
  "black-signal": [
    chapter(
      "Tomorrow's News",
      `The voice on the recording belonged to a man who had been dead for eleven months. He sounded impatient. He told Cass a minister would resign at nine the next morning. He told her which tie the minister would wear.\n\nAt nine, the tie was blue. The resignation was word for word.\n\nCass played the recording again. This time, at the end, the dead man said her name.`,
    ),
    chapter(
      "A Borrowed Identity",
      `Her old passport still worked. That frightened Cass more than if it had been flagged. Somebody was keeping a door open for her.\n\nAt the station a stranger handed her a newspaper dated tomorrow. Its front page was blank except for a photograph of the platform on which she stood.\n\nIn the photograph, she was looking the other way.`,
    ),
    chapter(
      "The Negotiator's Rule",
      `Never promise what you cannot deliver. Cass had taught that rule for fifteen years. Now a voice from a disconnected phone asked her to promise she would not listen to the next broadcast.\n\nShe asked what would happen if she did.\n\n"You will believe me," the voice said. "And then you will have to decide whether that makes you safer."`,
    ),
    chapter(
      "Twenty-Four Hours",
      `Every prediction gave her exactly one day. Enough time to act. Not enough time to understand. Cass drew a line between the last six scandals and found they all benefited the same company.\n\nThe seventh prediction named that company's director.\n\nShe erased the line. Then she put it back, this time with an arrow pointing in both directions.`,
    ),
    chapter(
      "The Voice Behind the Voice",
      `Cass slowed the recording until the words separated into breath and static. Beneath the dead man's voice she heard someone counting.\n\nShe recognized the rhythm. It was how she had been trained to calm a hostage.\n\nSomeone was not sending her messages. Someone was being made to send them, and the counting was the only part still under their control.`,
    ),
  ],
  "the-last-level-before-dawn": [
    chapter(
      "Support Wanted",
      `The recruitment board had seventeen notices for damage dealers and none for healers. Dev put up his own. Support wanted. Failure welcome.\n\nThree people arrived before sunset. One had a broken shield. One had never entered a dungeon. The third said she had entered plenty and that was why she no longer owned a shield.\n\nDev bought them dinner. It seemed a better first investment than another sword.`,
    ),
    chapter(
      "The First Reset",
      `At dawn the dungeon returned everything except their exhaustion. The broken door was whole. The defeated guardian waited in its original place. The coins in Dev's pocket became dust.\n\nBut the new player remembered how to lift her shield. The guardian remembered her too.\n\nFor a moment it hesitated. Dev wrote that down before he forgot how much it mattered.`,
    ),
    chapter(
      "Shared Experience",
      `The system awarded no points for the rescue. Dev checked twice. They had pulled another party out of a collapsing passage, lost their supplies, and missed the reset gate.\n\nThen a new line appeared beneath their names. Trust: shared.\n\nNo one knew what it did. The next morning, for the first time, all four could see the same map.`,
    ),
    chapter(
      "A Door for Everyone",
      `The door opened only while everyone stood on a separate stone. There were five stones and four of them.\n\nThe experienced fighter suggested leaving a shield. The new player suggested asking the guardian. Dev went back through the corridor and did exactly that.\n\nThe guardian looked at the empty fifth stone for a long time. Then it put down its weapon.`,
    ),
    chapter(
      "Before the Sun",
      `They reached the last room with seven minutes until dawn. Nothing waited there except a table and five chairs.\n\nThe system asked them what they wanted to carry into the next day. Dev looked at the people around him, including the one made of stone.\n\n"All of us," he said.\n\nFor the first time, the countdown stopped.`,
    ),
  ],
  "the-fox-in-the-rain-court": [
    chapter(
      "A Familiar Stranger",
      `The spirit arrived in the rain wearing her sister's face. Yuna dropped the bow of her instrument. It struck the courtyard stones with a sound much louder than it should have made.\n\nThe spirit bowed. Her sister had never bowed that way.\n\n"I was told this would comfort you," it said.\n\nYuna picked up the bow. "Then you were told very little about grief."`,
    ),
    chapter(
      "The Rain Court",
      `Rain fell inside the audience chamber but never touched the floor. It hung around the courtiers in fine silver threads. Yuna played the first piece with her eyes closed.\n\nWhen she opened them, every thread had become a memory. She recognized none of them.\n\nBeside the throne, the spirit wearing her sister's face was crying someone else's tears.`,
    ),
    chapter(
      "The Price of a Face",
      `The spirit could borrow a face only from someone who had given it away. Yuna asked when her sister had done that. It answered with a date three years before the disappearance.\n\nShe had been alive. She had been making choices no one at home understood.\n\nYuna tuned her instrument again. This time she played the song her sister had always refused to finish.`,
    ),
    chapter(
      "A Song Unfinished",
      `The missing notes opened a small door behind the throne. Beyond it lay a room filled with ordinary things: a blue cup, a comb, one woolen glove.\n\nHer sister's things. Not a prison. A place to return to.\n\nYuna sat on the bed and let the spirit take back its own face. It looked younger without her grief upon it.`,
    ),
    chapter(
      "When the Rain Stops",
      `At morning the court was quiet. Yuna left her instrument beside the door and walked into the garden. A woman was waiting by the pond.\n\nHer sister had changed. Of course she had changed. Yuna had spent so long wanting her back that she had forgotten to imagine her living.\n\nThis time, she asked where she had been. Then she listened.`,
    ),
  ],
  "the-unreliable-moon": [
    chapter(
      "A Small Untruth",
      `The moon became square while Iris was telling her landlord she had already paid. Across Aster Vale, windows opened. Everyone looked up.\n\nShe corrected herself. The corners softened, but not completely.\n\nBy morning the astronomers had issued a warning. The moon was keeping the shape of old lies. There was only so much sky left.`,
    ),
    chapter(
      "The City's Weight",
      `Aster Vale floated because its founders had agreed it could. Iris discovered this in a maintenance manual shelved between plumbing and festival permits.\n\nThe manual advised against public doubt. It also advised regular inspection of the eastern chains.\n\nThere were no eastern chains. She went to the edge to make sure. Below the city, far down in the clouds, something enormous shifted.`,
    ),
    chapter(
      "An Honest Instrument",
      `The observatory's oldest telescope showed the moon as it had been before anyone spoke. Through it, Iris saw a smooth white stone. With her other eye she saw a cracked blue crescent.\n\nThe astronomer said both were correct.\n\nShe asked which one would fall. He closed the telescope very gently.`,
    ),
    chapter(
      "The Shape of an Apology",
      `The mayor apologized in the central square. The moon shivered, divided, and became a ring. It was the least reassuring result anyone had expected.\n\nIris asked him what he had left out. He looked at the gathered crowd and began again.\n\nThis time the ring held steady. Perhaps, she thought, wholeness was not the only useful shape.`,
    ),
    chapter(
      "A Place to Land",
      `The city descended one foot during the night. No one felt it. Iris noticed because the clouds touched the lowest garden.\n\nShe drew a map of the ground for the first time. Rivers, plains, a possible harbor. The astronomer helped.\n\nAbove them the moon became a narrow silver line. It looked less like a warning now, and more like a road.`,
    ),
  ],
  "a-knife-for-every-name": [
    chapter(
      "The Name on the Blade",
      `The first name belonged to a woman Tessa had spared. The second belonged to a child she had never met. Both were cut into the blade when she woke.\n\nShe took it to a smith who refused to touch it.\n\n"It isn't recording the dead," he said. "That would be much simpler."\n\nOutside, a stranger called her by a name she had stopped using years ago.`,
    ),
    chapter(
      "An Unpaid Contract",
      `The contract specified no witnesses. Tessa folded it and put it under the cup the target had offered her.\n\nHe was old, frightened, and making terrible tea. He also knew exactly why she had come.\n\n"Someone will follow you," he said.\n\n"Someone always does." She left the contract untouched. By morning the blade carried another name.`,
    ),
    chapter(
      "The People Left Alive",
      `Tessa found three of the names in a border town. A baker, a schoolteacher, a woman who repaired roofs. None recognized her. All had survived something they could not explain.\n\nShe began to suspect that refusing an order did not end it. It merely sent the consequences somewhere she could not see.\n\nThe blade grew warm in her coat.`,
    ),
    chapter(
      "The Smith's Other Work",
      `The smith had made a second blade. He admitted it after Tessa placed hers on the table and asked who was carrying the matching names.\n\nOne knife recorded mercy. The other collected what mercy left unfinished.\n\n"You should have told me," she said.\n\nHe looked at the door. "I hoped you would stop before it noticed."`,
    ),
    chapter(
      "A Name Refused",
      `At the bottom of the blade, a new name appeared: her own. Tessa watched the letters deepen until they caught the morning light.\n\nAcross the street, another woman stood with her hand inside her coat. She looked exhausted.\n\nTessa set down the knife and ordered two cups of tea. It was, at least, a different way to begin.`,
    ),
  ],
  "the-detective-of-small-miracles": [
    chapter(
      "An Unseen Applicant",
      `The chair moved before anyone sat in it. Arthur put down his newspaper. He had advertised for an assistant, but had hoped to interview someone visible.\n\nA pencil rose from the desk and wrote a name. Then it crossed it out.\n\n"That's a lie," Arthur said.\n\nThe pencil paused. At last it wrote: Excellent. We can work with that.`,
    ),
    chapter(
      "The Missing Teaspoon",
      `Their first case concerned a teaspoon. Arthur accepted because the client paid in advance. His assistant accepted because the spoon was screaming.\n\nHe could not hear it, but he could tell when the assistant lied about its direction. They spent an hour walking in circles before she admitted she was avoiding the river.\n\nThe spoon, it seemed, was not the only thing missing.`,
    ),
    chapter(
      "Evidence in Motion",
      `Every morning the case files arranged themselves differently. Arthur began photographing the desk at night. The ghost began posing the files to spell unhelpful remarks.\n\nOn Thursday they formed a street map. One folder lay over the bridge.\n\nArthur put on his coat. His assistant moved the hat toward him without a joke. That worried him more than the map.`,
    ),
    chapter(
      "The River's Witness",
      `The ferryman could see her. Arthur knew because the old man looked at the empty space beside him and removed his cap.\n\nShe had worked the river once. She had gone under trying to retrieve something for a passenger.\n\n"A silver box," the ferryman said.\n\nThe ghost wrote one word in the mist on the window: No.`,
    ),
    chapter(
      "A Small Honest Miracle",
      `The box held letters, not silver. They belonged to a woman who had waited forty years for an answer. Arthur delivered them himself.\n\nHis assistant remained outside. When he returned, the air beside him felt lighter.\n\nBack at the office, the pencil wrote her real name. Arthur put it on the door beneath his own.`,
    ),
  ],
  "the-crownless-tournament": [
    chapter(
      "The Empty Throne",
      `Every banner in the arena displayed a crown. The throne itself had none. Finn noticed that while the other competitors measured one another's swords.\n\nHe had entered with a borrowed name and a blunt spear. Neither would survive much examination.\n\nThe herald announced that the winner would belong to the kingdom. Everyone cheered. Finn listened carefully to the choice of words.`,
    ),
    chapter(
      "A Champion's Breakfast",
      `The champions ate separately. Finn was given a small room, a generous meal, and a servant who would not meet his eyes.\n\nHe asked how last year's winner was doing. The servant dropped a spoon.\n\nLater, under the bowl, Finn found a folded scrap of paper. Lose before the final. It was the first useful advice anyone had given him.`,
    ),
    chapter(
      "The Price of Victory",
      `He tried to lose. His opponent tried harder. They spent ten absurd minutes declining obvious openings while the crowd grew impatient.\n\nAt last the other competitor leaned close enough to whisper.\n\n"You know too?"\n\nFinn nodded. They looked up at the royal box together. The king was no longer smiling.`,
    ),
    chapter(
      "A Different Contest",
      `The remaining competitors met in the kitchens. Six people, five weapons, and a plan that depended on none of them wanting the throne.\n\nThat was the difficult part. One still believed he could change the rules after winning.\n\nFinn asked him to name a previous winner. The kitchen went quiet. Outside, the bells began calling them to the final.`,
    ),
    chapter(
      "No One Kneels",
      `They entered together. When the herald called the first name, no one stepped forward. When he called the second, they laid down their weapons.\n\nThe arena had been built to hold a battle, not a refusal. The silence moved through it unevenly.\n\nFinn looked at the crownless throne and waited for the kingdom to decide what a champion was for.`,
    ),
  ],
  "the-city-that-forgot-its-name": [
    chapter(
      "Blank Street Signs",
      `The station had no name. Neither did the street outside. Mara asked a porter where she had arrived, and he gave her three answers before breakfast.\n\nShe had come to paint a wall. The commission described the city as unforgettable. Someone had underlined the word.\n\nAt the hotel, the register contained a hundred careful signatures. Every line for place of birth was blank.`,
    ),
    chapter(
      "The First Coat of Paint",
      `Mara painted a blue door on the commissioned wall. In the morning, someone had left a key beneath it.\n\nAn old man insisted the door belonged to his childhood home. A young woman said it led to the school where she taught.\n\nMara listened to both stories. She added a small window. Behind the painted glass, a light came on.`,
    ),
    chapter(
      "Conflicting Histories",
      `The archive kept every version. In one the city had been built beside the sea. In another, the sea had left after a disagreement with the mayor.\n\nMara expected the archivist to choose. Instead, he brought another chair.\n\n"We have room," he said.\n\nOutside, a gull landed on a dry fountain and called to something beyond the hills.`,
    ),
    chapter(
      "A Wall with Room for Everyone",
      `People began bringing objects to the mural. A button. A broken tile. A photograph whose background had faded completely. Mara painted each one where its owner thought it belonged.\n\nThe wall grew longer. Not visibly, but she needed more time to walk from one end to the other.\n\nShe stopped trying to measure it. Some kinds of space could only be made by listening.`,
    ),
    chapter(
      "The Name We Choose",
      `The city did not recover its old name. By spring, most people agreed this was not a failure. They met beneath the mural and chose a new one.\n\nMara left a small patch unpainted near the ground. A child asked why.\n\n"For someone who hasn't arrived yet," she said.\n\nAt the station, the sign painter had already begun his work.`,
    ),
  ],
  "the-river-keeps-score": [
    chapter(
      "The Returned Man",
      `The river returned a soldier at dawn. He came ashore without a wound, carrying a helmet that had gone under twenty years before.\n\nThe captain recognized him and turned away. The scout, Ansel, recognized the helmet. It had belonged to his father.\n\nThey asked the soldier his name. He opened his mouth, and river water ran over his chin.`,
    ),
    chapter(
      "Against the Current",
      `Ansel walked upstream with three days of food and a list of the missing. At every bend the river placed something on the shore: a buckle, a boot, a letter sealed against the wet.\n\nHe collected none of them.\n\nOn the second morning, the river left a cup of clean water beside his fire. It was trying a different language.`,
    ),
    chapter(
      "A Debt of Names",
      `The list was wrong. Ansel found names crossed out by officers who had needed smaller losses in their reports. He found names added to conceal desertions.\n\nThe river did not care about the totals. It cared about each person.\n\nHe sat on a flat stone and read the corrected list aloud. The current slowed until he had finished.`,
    ),
    chapter(
      "The Fort Below the Water",
      `At low water, a second fortress appeared beneath the first. Its windows faced upward. Its gate stood open.\n\nAnsel saw people moving inside, not trapped, not quite alive. He understood why the returned soldier would not speak.\n\nThe river had not taken them all. Some had chosen it over the fortress. Someone above had made that choice necessary.`,
    ),
    chapter(
      "The Account Remains Open",
      `Ansel returned with no prisoner and no explanation the captain wanted to hear. He laid the corrected list on the table.\n\nOutside, the river rose one inch.\n\nThe captain reached for the paper, then stopped. Ansel waited. For once, the water could do its own threatening. He only had to keep the names in view.`,
    ),
  ],
  "a-season-of-borrowed-stars": [
    chapter(
      "A Convincing Performance",
      `Kit's trick depended on everyone looking at his left hand. Unfortunately, the astrologer was watching the sky.\n\n"You need to kiss me," she said.\n\nHe nearly dropped the cards. Above the theater, a star moved sharply toward the roof.\n\n"For the audience?"\n\n"For the constellation." She took his hand before he could decide whether that was a better answer.`,
    ),
    chapter(
      "Terms and Conditions",
      `They wrote the rules on a napkin. Public appearances twice a week. No improvised declarations. No discussing actual feelings while the northern constellation was visible.\n\nKit asked how long the arrangement would last. The astrologer drew a small circle around the end of autumn.\n\nOutside, the stars rearranged themselves into something that looked uncomfortably like a question mark.`,
    ),
    chapter(
      "An Inconvenient History",
      `They had met before. Kit remembered her at seventeen, reading star charts in the back row while he practiced vanishing coins. She remembered him leaving town without saying goodbye.\n\nThe constellation flickered when he said he had meant to write.\n\nHe tried again. "I was afraid you wouldn't answer."\n\nThe stars steadied. She looked at him for the first time that evening.`,
    ),
    chapter(
      "The Falling Season",
      `By October the lowest star hung above the river. People took photographs and called it an installation. Kit envied their confidence.\n\nHe asked whether the sky could tell the difference between a performance and a promise.\n\nThe astrologer folded her chart. "I think we've been asking the wrong audience."\n\nHe put away the ring he had planned to vanish.`,
    ),
    chapter(
      "Something That Stays",
      `On the last night of autumn, they went to the roof without witnesses. Kit brought no cards. She brought no chart.\n\nThey talked until the city lights went out. About leaving, about returning, about things neither could predict.\n\nAbove them, very slowly, the borrowed stars found their places. For once, neither of them looked up.`,
    ),
  ],
  "the-iron-orchard": [
    chapter(
      "Metal in the Roots",
      `The harvest rang like bells. Silver leaves shook against copper fruit while the workers laid wool beneath the trees. In the archive, Owen found a treaty older than the orchard itself.\n\nIt described the enemy kingdom in detail: its borders, its language, its intended crimes. At the bottom was an invoice.\n\nSomeone had paid to invent the war.`,
    ),
    chapter(
      "The Royal Invoice",
      `The payment had been divided across three departments. Defense bought the banners. Education bought the histories. The orchard ministry bought enough iron to arm both sides.\n\nOwen copied the numbers by hand. The archive permitted no originals to leave.\n\nWhen he returned the treaty to its shelf, he found a fresh fingerprint in the dust beside his own.`,
    ),
    chapter(
      "A Manufactured Enemy",
      `The ambassador knew. She said it before Owen could finish his first question. Her country had been made from the stories his country needed to believe.\n\nBut the people were real. The graves were real. The border now ran through real gardens.\n\n"You can't erase us to correct a document," she said.\n\nOwen closed his notebook. He would have to find a better question.`,
    ),
    chapter(
      "The Orchard's Other Fruit",
      `Beneath the oldest tree lay scraps of metal with words pressed into them. Every treaty, every order, every promise the kingdom had buried fed the roots.\n\nThe orchard did not forget. It simply returned history in a form no one thought to read.\n\nOwen carried a copper apple into the light. Along its stem, in tiny letters, was the first soldier's name.`,
    ),
    chapter(
      "The Public Record",
      `They read the treaty in the market, where anyone could interrupt. Many did. Owen answered what he could and marked what he did not know.\n\nThe ambassador stood beside him. By evening people were bringing their own records: letters, medals, photographs, a bent spoon.\n\nThe archive would need more shelves. For the first time, Owen was glad of it.`,
    ),
  ],
};
