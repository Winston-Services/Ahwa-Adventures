import { AhwaAdeventure, Character } from "./index.js";
class Monster extends Character {
  static getRandom() {
    let randoMonster = AhwaAdeventure.randomize([
      "Balrog",
      "Bear",
      "Chimera",
      "Dragon",
      "Gargoyle",
      "Goblin",
      "Kobold",
      "Minotaur",
      "Ogre",
      "Orc",
      "Troll",
      "Wolf",
      "Vendor"
    ]);
    randoMonster = new Monster({
      race: randoMonster[0],
      strength: AhwaAdeventure.random(16),
      dexterity: AhwaAdeventure.random(16),
      intelligence: AhwaAdeventure.random(16)
    });
    randoMonster.sex = "Other";
    return randoMonster;
  }
  constructor({
    race = "Wolf",
    strength = 0,
    dexterity = 0,
    intelligence = 0,
    maxPoints = 16
  }) {
    super({
      type: "monster",
      race,
      strength,
      dexterity,
      intelligence,
      maxPoints
    });
    this._races = [
      "Balrog",
      "Bear",
      "Chimera",
      "Dragon",
      "Gargoyle",
      "Goblin",
      "Kobold",
      "Minotaur",
      "Ogre",
      "Orc",
      "Troll",
      "Wolf",
      "Vendor"
    ];
    // console.log("this races?", this._races);
    if (race !== undefined) {
      // console.log("im a race", race);
      if (this._races.indexOf(race) !== -1) {
        this._race = race;
      } else {
        this._race = "Wolf";
      }
    }
  }
}
export { Monster };
