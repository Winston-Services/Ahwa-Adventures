import { Armor, Character } from "../classes/index.js";
import { Monster } from "../classes/Monster.js";
import { Potion } from "../classes/Potion.js";
import { Curse } from "../classes/Curse.js";
import { Treasure } from "../classes/Treasure.js";
import { Weapon } from "../classes/Weapon.js";

export const Human = new Character({
  type: "player",
  race: "Human",
  strength: 1,
  intelligence: 2,
  dexterity: 2
});

export const Macronies = new Character({
  type: "player",
  race: "Macronies",
  strength: 1,
  intelligence: 2,
  dexterity: 2
});

export const Gnome = new Character({
  type: "player",
  race: "Gnome",
  strength: 1,
  intelligence: 2,
  dexterity: 2
});

export const Fairy = new Character({
  type: "player",
  race: "Fairy",
  strength: 1,
  intelligence: 2,
  dexterity: 2
});

export const Pixie = new Character({
  type: "player",
  race: "Pixie",
  strength: 1,
  intelligence: 2,
  dexterity: 2
});

export const Sprite = new Character({
  type: "player",
  race: "Sprite",
  strength: 1,
  intelligence: 2,
  dexterity: 2
});

export const Elf = new Character({
  type: "player",
  race: "Elf",
  strength: 1,
  intelligence: 2,
  dexterity: 2
});

export const Dwarf = new Character({
  type: "player",
  race: "Dwarf",
  strength: 1,
  intelligence: 2,
  dexterity: 2
});

const Balrog = new Monster({
  race: "Balrog",
  strength: 1,
  dexterity: 1,
  intelligence: 1
});
export { Balrog };

const Bear = new Monster({
  race: "Bear",
  strength: 1,
  dexterity: 1,
  intelligence: 1
});

export { Bear };

export const Chimera = new Monster({
  race: "Chimera",
  strength: 1,
  dexterity: 1,
  intelligence: 1
});

export const Dragon = new Monster({
  race: "Dragon",
  strength: 1,
  dexterity: 1,
  intelligence: 1
});

export const Gargoyle = new Monster({
  race: "Gargoyle",
  strength: 1,
  dexterity: 1,
  intelligence: 1
});

export const Goblin = new Monster({
  race: "Goblin",
  strength: 1,
  dexterity: 1,
  intelligence: 1
});

export const Kobold = new Monster({
  race: "Kobold",
  strength: 1,
  dexterity: 1,
  intelligence: 1
});

export const Minotaur = new Monster({
  race: "Minotaur",
  strength: 1,
  dexterity: 1,
  intelligence: 1
});

export const Ogre = new Monster({
  race: "Ogre",
  strength: 1,
  dexterity: 1,
  intelligence: 1
});

export const Orc = new Monster({
  race: "Orc",
  strength: 1,
  dexterity: 1,
  intelligence: 1
});

export const Troll = new Monster({
  race: "Troll",
  strength: 1,
  dexterity: 1,
  intelligence: 1
});

export const Wolf = new Monster({
  race: "Wolf",
  strength: 1,
  dexterity: 1,
  intelligence: 1
});

export const Vendor = new Monster({
  race: "Vendor",
  strength: 1,
  dexterity: 1,
  intelligence: 1
});

export const PlateArmor = new Armor({
  type: "Plate",
  strength: 1,
  dexterity: 1,
  intelligence: 1
});

export const ChainMailArmor = new Armor({
  type: "Chain Mail",
  strength: 1,
  dexterity: 1,
  intelligence: 1
});

export const LeatherArmor = new Armor({
  type: "Leather",
  strength: 1,
  dexterity: 1,
  intelligence: 1
});

export const NoArmor = new Armor({
  type: "None"
});

export const Forgetfulness = new Curse();
export const Leech = new Curse();
export const Lethargy = new Curse();
export const Curses = {
  Forgetfulness,
  Leech,
  Lethargy
};

export const Dexterity = new Potion();
export const Intelligence = new Potion();
export const Strength = new Potion();

export const Potions = {
  Dexterity,
  Intelligence,
  Strength
};

export const TheBlueFlame = new Treasure({ name: "The Blue Flame" });
export const TheGreenGem = new Treasure({ name: "The Green Gem" });
export const TheNornStone = new Treasure({ name: "The Norn Stone" });
export const TheOpalEye = new Treasure({ name: "The Opal Eye" });
export const ThePalantir = new Treasure({ name: "The Palantir" });
export const ThePalePearl = new Treasure({ name: "The Pale Pearl" });
export const TheRubyRed = new Treasure({ name: "The Ruby Red" });
export const TheSilmaril = new Treasure({ name: "The Silmaril" });
export const TreasureChest = new Treasure({ name: "Treasure Chest" });

export const Treasures = {
  TheBlueFlame,
  TheGreenGem,
  TheNornStone,
  TheOpalEye,
  ThePalantir,
  ThePalePearl,
  TheRubyRed,
  TheSilmaril,
  TreasureChest
};

export const Sword = new Weapon({ type: "Sword" });
export const Mace = new Weapon({ type: "Mace" });
export const Dagger = new Weapon({ type: "Dagger" });
export const NoWeapon = new Weapon({ type: "None" });

export const Weapons = {
  Sword,
  Mace,
  Dagger,
  NoWeapon
};

export const Characters = {
  base: {
    Human,
    Macronies,
    Gnome,
    Fairy,
    Pixie,
    Sprite,
    Elf,
    Dwarf
  },
  male: {
    get Human() {
      Human.sex = "Male";
      return Human;
    },
    get Macronies() {
      Macronies.sex = "Male";
      return Macronies;
    },
    get Gnome() {
      Gnome.sex = "Male";
      return Gnome;
    },
    get Fairy() {
      Fairy.sex = "Male";
      return Fairy;
    },
    get Pixie() {
      Pixie.sex = "Male";
      return Pixie;
    },
    get Sprite() {
      Sprite.sex = "Male";
      return Sprite;
    },
    get Elf() {
      Elf.sex = "Male";
      return Elf;
    },
    get Dwarf() {
      Dwarf.sex = "Male";
      return Dwarf;
    }
  },
  female: {
    get Human() {
      Human.sex = "Female";
      return Human;
    },
    get Macronies() {
      Macronies.sex = "Female";
      return Macronies;
    },
    get Gnome() {
      Gnome.sex = "Female";
      return Gnome;
    },
    get Fairy() {
      Fairy.sex = "Female";
      return Fairy;
    },
    get Pixie() {
      Pixie.sex = "Female";
      return Pixie;
    },
    get Sprite() {
      Sprite.sex = "Female";
      return Sprite;
    },
    get Elf() {
      Elf.sex = "Female";
      return Elf;
    },
    get Dwarf() {
      Dwarf.sex = "Female";
      return Dwarf;
    }
  },
  other: {
    get Human() {
      Human.sex = "Other";
      return Human;
    },
    get Macronies() {
      Macronies.sex = "Other";
      return Macronies;
    },
    get Gnome() {
      Gnome.sex = "Other";
      return Gnome;
    },
    get Fairy() {
      Fairy.sex = "Other";
      return Fairy;
    },
    get Pixie() {
      Pixie.sex = "Other";
      return Pixie;
    },
    get Sprite() {
      Sprite.sex = "Other";
      return Sprite;
    },
    get Elf() {
      Elf.sex = "Other";
      return Elf;
    },
    get Dwarf() {
      Dwarf.sex = "Other";
      return Dwarf;
    }
  }
};

export const Monsters = {
  base: {
    Balrog,
    Bear,
    Chimera,
    Dragon,
    Gargoyle,
    Goblin,
    Kobold,
    Minotaur,
    Ogre,
    Orc,
    Troll,
    Wolf,
    Vendor
  },
  male: {
    get Balrog() {
      Balrog.sex = "Male";
      return Balrog;
    },
    get Bear() {
      Bear.sex = "Male";
      return Bear;
    },
    get Chimera() {
      Chimera.sex = "Male";
      return Chimera;
    },
    get Dragon() {
      Dragon.sex = "Male";
      return Dragon;
    },
    get Gargoyle() {
      Gargoyle.sex = "Male";
      return Gargoyle;
    },
    get Goblin() {
      Goblin.sex = "Male";
      return Goblin;
    },
    get Kobold() {
      Kobold.sex = "Male";
      return Kobold;
    },
    get Minotaur() {
      Minotaur.sex = "Male";
      return Minotaur;
    },
    get Ogre() {
      Ogre.sex = "Male";
      return Ogre;
    },
    get Orc() {
      Orc.sex = "Male";
      return Orc;
    },
    get Troll() {
      Troll.sex = "Male";
      return Troll;
    },
    get Wolf() {
      Wolf.sex = "Male";
      return Wolf;
    },
    get Vendor() {
      Vendor.sex = "Male";
      return Vendor;
    }
  },
  female: {
    get Balrog() {
      Balrog.sex = "Female";
      return Balrog;
    },
    get Bear() {
      Bear.sex = "Female";
      return Bear;
    },
    get Chimera() {
      Chimera.sex = "Female";
      return Chimera;
    },
    get Dragon() {
      Dragon.sex = "Female";
      return Dragon;
    },
    get Gargoyle() {
      Gargoyle.sex = "Female";
      return Gargoyle;
    },
    get Goblin() {
      Goblin.sex = "Female";
      return Goblin;
    },
    get Kobold() {
      Kobold.sex = "Female";
      return Kobold;
    },
    get Minotaur() {
      Minotaur.sex = "Female";
      return Minotaur;
    },
    get Ogre() {
      Ogre.sex = "Female";
      return Ogre;
    },
    get Orc() {
      Orc.sex = "Female";
      return Orc;
    },
    get Troll() {
      Troll.sex = "Female";
      return Troll;
    },
    get Wolf() {
      Wolf.sex = "Female";
      return Wolf;
    },
    get Vendor() {
      Vendor.sex = "Female";
      return Vendor;
    }
  },
  other: {
    get Balrog() {
      Balrog.sex = "Other";
      return Balrog;
    },
    get Bear() {
      Bear.sex = "Other";
      return Bear;
    },
    get Chimera() {
      Chimera.sex = "Other";
      return Chimera;
    },
    get Dragon() {
      Dragon.sex = "Other";
      return Dragon;
    },
    get Gargoyle() {
      Gargoyle.sex = "Other";
      return Gargoyle;
    },
    get Goblin() {
      Goblin.sex = "Other";
      return Goblin;
    },
    get Kobold() {
      Kobold.sex = "Other";
      return Kobold;
    },
    get Minotaur() {
      Minotaur.sex = "Other";
      return Minotaur;
    },
    get Ogre() {
      Ogre.sex = "Other";
      return Ogre;
    },
    get Orc() {
      Orc.sex = "Other";
      return Orc;
    },
    get Troll() {
      Troll.sex = "Other";
      return Troll;
    },
    get Wolf() {
      Wolf.sex = "Other";
      return Wolf;
    },
    get Vendor() {
      Vendor.sex = "Other";
      return Vendor;
    }
  }
};
