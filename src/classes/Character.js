class Character {
  constructor({
    type = "player",
    race = "Human",
    strength = 0,
    dexterity = 0,
    intelligence = 0,
    maxPoints = 16
  }) {
    if (type !== undefined) {
      this._type = type;
    }
    if (type === "player") {
      if (race !== undefined) {
        if (this._races.indexOf(race) !== -1) {
          if (race === "Macronies") {
            this._handycap = 4;
          }
          this._extraPoints = this._basePoints - this._handycap;
          this._race = race;
        } else {
          this._race = "Human";
        }
      }
    }
    if (maxPoints !== undefined) {
      this._maxPoints = maxPoints;
    }
    if (strength !== undefined) {
      this._strength = strength;
    }
    if (dexterity !== undefined) {
      this._dexterity = dexterity;
    }
    if (intelligence !== undefined) {
      this._intelligence = intelligence;
    }

    const IncStength = (amount) => {
      this._strength += Number(amount);
      if (this._strength > this._maxPoints) {
        this._strength = this._maxPoints;
      }
    };
    const IncDexterity = (amount) => {
      this._dexterity += Number(amount);
      if (this._dexterity > this._maxPoints) {
        this._dexterity = this._maxPoints;
      }
    };
    const IncIntelligence = (amount) => {
      this._intelligence += Number(amount);
      if (this._intelligence > this._maxPoints) {
        this._intelligence = this._maxPoints;
      }
    };
    const DecStength = (amount) => {
      this._strength -= Number(amount);
      if (this._strength < 0) {
        this._strength = 0;
      }
    };
    const DecDexterity = (amount) => {
      this._dexterity -= Number(amount);
      if (this._dexterity < 0) {
        this._dexterity = 0;
      }
    };
    const DecIntelligence = (amount) => {
      this._intelligence -= Number(amount);
      if (this._intelligence < 0) {
        this._intelligence = 0;
      }
    };
    this._extraPoints = this._basePoints - this._handycap;

    this.inc = {
      strength: (amount) => IncStength(amount),
      intelligence: (amount) => IncDexterity(amount),
      dexterity: (amount) => IncIntelligence(amount)
    };
    this.dec = {
      strength: (amount) => DecStength(amount),
      intelligence: (amount) => DecDexterity(amount),
      dexterity: (amount) => DecIntelligence(amount)
    };
  }

  _id;
  get id() {
    return this._id;
  }
  set id(value) {
    this._id = value;
  }
  _type;
  get type() {
    return this._type;
  }
  set type(value) {
    this._type = value;
  }
  _races = [
    "Human",
    "Macronies",
    "Gnome",
    "Fairy",
    "Pixie",
    "Sprite",
    "Elf",
    "Dwarf"
  ];
  _race = "Human";
  get race() {
    return this._race;
  }
  set race(value) {
    this._race = value;
  }
  _sex = "Male";
  get sex() {
    return this._sex;
  }
  set sex(value) {
    if (value.toLowerCase().startsWith("m")) {
      this._sex = "Male";
    } else if (value.toLowerCase().startsWith("f")) {
      this._sex = "Female";
    } else this._sex = "Other";
  }

  _strength;
  get strength() {
    return this._strength;
  }
  set strength(value) {
    this._strength = value;
  }
  _intelligence;
  get intelligence() {
    return this._intelligence;
  }
  set intelligence(value) {
    this._intelligence = value;
  }
  _dexterity;
  get dexterity() {
    return this._dexterity;
  }
  set dexterity(value) {
    this._dexterity = value;
  }
  _maxPoints = 16;

  _basePoints = 8;
  get basePoints() {
    return this._basePoints;
  }
  set basePoints(value) {
    this._basePoints = value;
  }
  _handycap = 0;
  get handycap() {
    return this._handycap;
  }
  set handycap(value) {
    this._handycap = value;
  }
  _extraPoints = 0;
  get extraPoints() {
    return this._extraPoints;
  }
  set extraPoints(value) {
    this._extraPoints = value;
  }
  _known = [];
  get known() {
    return this._known;
  }
  set known(value) {
    this._known = value;
  }

  _armor = "None";
  get armor() {
    return this._armor;
  }
  set armor(value) {
    this._armor = value;
  }

  _weapon = "None";
  get weapon() {
    return this._weapon;
  }

  set weapon(value) {
    this._weapon = value;
  }

  _flares = 0;
  get flares() {
    return this._flares;
  }
  set flares(value) {
    this._flares = value;
  }

  _gold = 60;
  get gold() {
    return this._gold;
  }
  set gold(value) {
    this._gold = value;
  }

  _turns = 0;
  get turns() {
    return this._turns;
  }
  set turns(value) {
    this._turns = value;
  }

  _blind = false;
  get blind() {
    return this._blind;
  }
  set blind(value) {
    this._blind = value;
  }

  _bookStuck = false;
  get bookStuck() {
    return this._bookStuck;
  }
  set bookStuck(value) {
    this._bookStuck = value;
  }

  _forgetfulness = false;
  get forgetfulness() {
    return this._forgetfulness;
  }
  set forgetfulness(value) {
    this._forgetfulness = value;
  }

  _lamp = false;
  get lamp() {
    return this._lamp;
  }
  set lamp(value) {
    this._lamp = value;
  }

  _lampBurn = 0;
  get lampBurn() {
    return this._lampBurn;
  }
  set lampBurn(value) {
    this._lampBurn = value;
  }

  _leech = false;
  get leech() {
    return this._leech;
  }
  set leech(value) {
    this._leech = value;
  }

  _lethargy = false;
  get lethargy() {
    return this._lethargy;
  }
  set lethargy(value) {
    this._lethargy = value;
  }

  _mad = true;
  get mad() {
    return this._mad;
  }
  set mad(value) {
    this._mad = value;
  }

  _OrbOfZot = false;
  get OrbOfZot() {
    return this._OrbOfZot;
  }
  set OrbOfZot(value) {
    this._OrbOfZot = value;
  }

  _Runestaff = false;
  get Runestaff() {
    return this._Runestaff;
  }
  set Runestaff(value) {
    this._Runestaff = value;
  }

  _Webbed = false;
  get Webbed() {
    return this._Webbed;
  }
  set Webbed(value) {
    this._Webbed = value;
  }

  _treasures = null;
  get treasures() {
    return this._treasures;
  }
  set treasures(value) {
    this._treasures = value;
  }

  _location = [0, 0, 3];
  get location() {
    return this._location;
  }
  set location(value) {
    this._location = value;
  }

  Up() {
    this._location = [
      this._location[0] + 1,
      this._location[1],
      this._location[1]
    ];
  }
  Down() {
    this._location = [
      this._location[0] - 1,
      this._location[1],
      this._location[1]
    ];
  }
  North() {}
  South() {}
  East() {}
  West() {}
}
export { Character };
