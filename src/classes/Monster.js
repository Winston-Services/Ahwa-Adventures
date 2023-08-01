import { AhwaAdeventure, Character } from "./index.js";
class Monster extends Character {
  static _races = [
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

  static get races() {
    return Monster._races;
  }

  static set races(value) {
    Monster._races = value;
  }

  static getRandom() {
    let randoMonster = AhwaAdeventure.randomize(Monster.races);
    randoMonster = new Monster({
      race: randoMonster,
      strength: AhwaAdeventure.random(this._maxPoints),
      dexterity: AhwaAdeventure.random(this._maxPoints),
      intelligence: AhwaAdeventure.random(this._maxPoints)
    });
    randoMonster.sex = "Other";
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
  }
}
export { Monster };
