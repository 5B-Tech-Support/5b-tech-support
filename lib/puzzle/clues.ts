// Server-only. Never import from client components.

export interface Clue {
  number: number;
  text: string;
  answers: string[]; // all lowercase — comparison is normalized
  hint: string;
}

export const TOTAL_CLUES = 40;

export const CLUES: Clue[] = [
  {
    number: 1,
    text: "Every Skyblock journey starts here — a small floating platform in the void that belongs entirely to you. Customize it, build on it, call it home. What is this personal space called?",
    answers: ["private island"],
    hint: "It's literally your own little world.",
  },
  {
    number: 2,
    text: "Exactly 227 of these tiny glowing collectibles are scattered across every Skyblock island. Track them all down and trade them with Tia for permanent stat boosts. What are they?",
    answers: ["fairy soul", "fairy souls"],
    hint: "They glow purple and hover in the air.",
  },
  {
    number: 3,
    text: "This global marketplace lets you instantly buy or sell bulk resources at the current best market price — ideal for flipping enchanted items in huge quantities. Name it.",
    answers: ["bazaar"],
    hint: "Find it by speaking to the chest NPC in the Hub.",
  },
  {
    number: 4,
    text: "Players list rare gear here with a price tag and others bid or buy outright. It's the free-market auction for the entire Skyblock economy. What is it?",
    answers: ["auction house"],
    hint: "Located in the Hub. Check it often for deals.",
  },
  {
    number: 5,
    text: "Beneath the Hub's surface lies this mining area filled with veins of Coal, Iron, Gold, Diamond, and Emerald. Early-game miners spend countless hours here. Where is it?",
    answers: ["deep caverns"],
    hint: "Go underground in the main Hub.",
  },
  {
    number: 6,
    text: "Place one of these tiny automated workers on your Private Island and they'll harvest or craft resources for you — even while you sleep. What is this passive worker called?",
    answers: ["minion"],
    hint: "They look like tiny villagers.",
  },
  {
    number: 7,
    text: "These small equippable items go in your Accessory Bag and grant passive stat bonuses. Veterans still call them by their old name — a word that also means 'lucky charm'. What is that name?",
    answers: ["talisman", "talismans"],
    hint: "You might own over a hundred of them.",
  },
  {
    number: 8,
    text: "The final boss of Floor 7 in the Catacombs, this skeletal warlord commands necromantic power. His armor set is among the most sought-after in all of Skyblock. Name him.",
    answers: ["necron"],
    hint: "Master of the undead. Everyone grinds him.",
  },
  {
    number: 9,
    text: "Floor 1's boss wears a red jester hat and attacks with explosive fireballs in multiple phases. He was the very first Dungeon boss ever added to Skyblock. Who is he?",
    answers: ["bonzo"],
    hint: "Clowning around since the very beginning.",
  },
  {
    number: 10,
    text: "Floor 5's boss creates exact perfect clones of himself to overwhelm and confuse the party. Only striking the real one matters. Who is this trickster?",
    answers: ["livid"],
    hint: "Which one is real? Choose carefully.",
  },
  {
    number: 11,
    text: "Floor 6's boss summons enormous stone golem constructs to crush players. He was added alongside the Master Mode version of his floor. Name him.",
    answers: ["sadan"],
    hint: "Giant fists of rock incoming.",
  },
  {
    number: 12,
    text: "Floor 4's boss is a monstrous vine creature lurking in a pitch-dark jungle room. Its attacks can root and immobilize the entire party. Name this botanical horror.",
    answers: ["thorn"],
    hint: "Nature gone terribly wrong.",
  },
  {
    number: 13,
    text: "Floor 2's boss is a ghostly entity that splits into fading shadow copies throughout the encounter. Who is this elusive phantom?",
    answers: ["scarf"],
    hint: "He leaves shadowy trails behind.",
  },
  {
    number: 14,
    text: "Floor 3's boss is a powerful mage who throws up arcane forcefields that must be interrupted fast or the party is destroyed. Who is this academic villain?",
    answers: ["professor"],
    hint: "He really should teach better manners.",
  },
  {
    number: 15,
    text: "This NPC is a beloved Skyblock meme — he appears in the Hub and does virtually nothing useful. His name is also shared with the winter island holiday event. Who is he?",
    answers: ["jerry"],
    hint: "Useless, but endlessly charming.",
  },
  {
    number: 16,
    text: "A five-player dungeon beneath the Hub with seven increasingly brutal floors and Master Modes. Its name is also used for the broader dungeon skill and gear system. What is it called?",
    answers: ["the catacombs", "catacombs"],
    hint: "Floors 1 through 7. Then Master Mode awaits.",
  },
  {
    number: 17,
    text: "This progression system sends you to hunt boss-tier variants of Zombies, Spiders, Wolves, Endermen, and Blazes. Complete quests to unlock powerful exclusive rewards. What is this system called?",
    answers: ["slayer"],
    hint: "Level all five types for the best perks.",
  },
  {
    number: 18,
    text: "This special Enderman variant in The End has a small chance to summon the powerful Endstone Protector mini-boss. Drop-farming this mob is also the key way to get Eyes of Ender. What is it?",
    answers: ["zealot"],
    hint: "Farm thousands of them.",
  },
  {
    number: 19,
    text: "Forged from Necron's Blade and a handful of other boss materials, this sword is widely considered the pinnacle Dungeon weapon thanks to its devastating active ability. What is it called?",
    answers: ["hyperion"],
    hint: "WITHER SHIELD!",
  },
  {
    number: 20,
    text: "This legendary bow is the top-tier weapon for Enderman Slayer grinding. It fires an absurd number of arrows per second and costs a fortune to acquire. Name it.",
    answers: ["terminator"],
    hint: "It'll be back... to kill more Zealots.",
  },
  {
    number: 21,
    text: "Right-clicking with this enchanted sword teleports you 8 blocks in the direction you're looking. It's an early-game staple for movement and combat. What is its full name?",
    answers: ["aspect of the end", "aote"],
    hint: "TELEPORT!",
  },
  {
    number: 22,
    text: "This legendary sword scales in power based on how many coins you sink into it. The wealthier you are, the more damage it deals. What is its name?",
    answers: ["midas sword", "midas' sword"],
    hint: "Everything he touched turned to gold.",
  },
  {
    number: 23,
    text: "This Dungeon consumable lets you teleport instantly to any party member's position during a run. Essential for reviving teammates and repositioning on boss fights. What is it?",
    answers: ["spirit leap"],
    hint: "Your teammates are counting on you.",
  },
  {
    number: 24,
    text: "This skill is leveled by casting a line into any body of water to catch fish, sea creatures, and rare loot. What is it called?",
    answers: ["fishing"],
    hint: "Cast your line.",
  },
  {
    number: 25,
    text: "This skill is leveled by planting and harvesting crops. Combined with the Garden island, it has become one of the highest-earning activities in modern Skyblock. Name it.",
    answers: ["farming"],
    hint: "Pumpkins, melons, and sugarcane, oh my.",
  },
  {
    number: 26,
    text: "Every hour or so, this enormous lava creature erupts from the sea near the Crimson Isle. Players flood to the area for its valuable loot drops. What is this event boss called?",
    answers: ["magma boss", "magma cube boss"],
    hint: "Watch the event timer carefully.",
  },
  {
    number: 27,
    text: "This popular monthly Skyblock event — named after a classic board game — tasks players with completing a card full of objectives for unique cosmetic and stat rewards. Name it.",
    answers: ["bingo"],
    hint: "B-I-N-G-O!",
  },
  {
    number: 28,
    text: "This challenging game mode disables trading with other players entirely. No Auction House. No Bazaar. You earn everything yourself or you go without. What is it called?",
    answers: ["ironman"],
    hint: "True Skyblock self-sufficiency.",
  },
  {
    number: 29,
    text: "Visit the Blacksmith NPC in the Hub to apply one of these to your weapons or armor, granting a named bonus like Fierce, Sharp, or Ancient. What is this system called?",
    answers: ["reforge", "reforging"],
    hint: "Collect those Reforge Stones.",
  },
  {
    number: 30,
    text: "This feature, accessible from your SkyBlock menu, tracks how many of each mob you've killed and unlocks permanent milestone stat bonuses as you reach thresholds. Name it.",
    answers: ["bestiary"],
    hint: "Kill a million of something and see what happens.",
  },
  {
    number: 31,
    text: "This floating island is the lobby and staging area directly before entering the Catacombs. Players stock up on supplies and inspect their gear here. Name it.",
    answers: ["dungeon hub"],
    hint: "The calm before the storm.",
  },
  {
    number: 32,
    text: "This underground biome is filled with glittering gemstone veins — Jade, Amethyst, Sapphire, Topaz, and more. Its discovery was a landmark update. Name it.",
    answers: ["crystal hollows"],
    hint: "Dig very, very deep.",
  },
  {
    number: 33,
    text: "This volcanic island is home to Blazes, Pigmen, the Kuudra boss, and the Dojo. Its red sky and rivers of lava make it unmistakable. Name this island.",
    answers: ["crimson isle"],
    hint: "Red skies and fire as far as you can see.",
  },
  {
    number: 34,
    text: "This separate island, added in a major farming update, gives players a dedicated plot for growing crops with unique mechanics that supercharge farming XP and coin income. Name it.",
    answers: ["garden", "the garden"],
    hint: "A dedicated farmer's paradise.",
  },
  {
    number: 35,
    text: "Hidden inside the Dungeons area, this musical puzzle minigame asks you to play a sequence of notes on a physical in-game instrument for loot rewards. Name the minigame.",
    answers: ["harp"],
    hint: "Music soothes even the undead.",
  },
  {
    number: 36,
    text: "This special currency is dropped exclusively by Wither-type bosses in Dungeons. It's used to upgrade and star-up endgame Dungeon equipment. Name this essence type.",
    answers: ["wither essence"],
    hint: "The rarest of all the essence colors.",
  },
  {
    number: 37,
    text: "When a Dungeon item has this single word as a prefix in its name, it means it dropped as an enhanced special-quality version from a floor boss. What is the prefix?",
    answers: ["starred"],
    hint: "Look for the ✦ symbol before the item name.",
  },
  {
    number: 38,
    text: "This in-game event, triggered by using a Coin of Gold, sends players hunting rare mythological creatures across all Skyblock islands. It is also the name of the NPC goddess who runs it. Name her.",
    answers: ["diana"],
    hint: "Goddess of the hunt.",
  },
  {
    number: 39,
    text: "This skill is leveled by chopping down trees. Many players build dense forests on their Private Island just to grind it efficiently. Name it.",
    answers: ["foraging"],
    hint: "Swing that axe.",
  },
  {
    number: 40,
    text: "You made it. Forty clues deep, you've proven yourself a true Skyblock scholar. The prize that awaits the winner is 500 million of what — the primary currency of Hypixel Skyblock?",
    answers: ["coins"],
    hint: "You've earned it. Say it out loud.",
  },
];

export function getClue(number: number): Clue | undefined {
  return CLUES.find((c) => c.number === number);
}

export function checkAnswer(clueNumber: number, input: string): boolean {
  const clue = getClue(clueNumber);
  if (!clue) return false;
  const normalized = input.trim().toLowerCase();
  return clue.answers.includes(normalized);
}
