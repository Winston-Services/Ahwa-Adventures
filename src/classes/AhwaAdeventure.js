import {
  Armor,
  Character,
  Curse,
  GameMap,
  Monster,
  Potion,
  Treasure,
  Weapon
} from "./index.js";
class AhwaAdeventure {
  static RoomValueObjs = [
    { B: { name: "Book", text: "A Book, it will help you to grow." } },
    { C: { name: "Chest", text: "A magical chest containing a treasure." } },
    { D: { name: "Stairs Down", text: "You have found stairs going down." } },
    { E: { name: "Entrance", text: "Entrance" } },
    { F: { name: "Flare", text: "Flare" } },
    { G: { name: "Gold", text: "You have found Gold Coins" } },
    { M: { name: "Monster", text: "A mysterious Monster appears." } },
    {
      O: { name: "Cryptal Orb", text: "You have found a magical crystal Orb." }
    },
    { P: { name: "Pool", text: "You have found a pool." } },
    {
      S: {
        name: "Sink Hole",
        text: "You have fallin into a sink hole to the level below."
      }
    },
    { U: { name: "Stairs Up", text: "You have found stairs going up." } },
    { V: { name: "Vendor", text: "You see a Vendor, ready to trade." } },
    {
      W: {
        name: "Warp",
        text: "You have found a mysterious warp. I wonder where it will take you."
      }
    },
    { x: { name: "Exit", text: "Exit" } },
    { X: { name: "Empty Room", text: "You are in an empty room." } },
    { Z: { name: "Zot", text: "Zot" } }
  ];
  static RoomValues = [
    "B",
    "C",
    "D",
    "F",
    "G",
    "O",
    "P",
    "S",
    "V",
    "W",
    "X",
    "M"
  ];
  static getRandomRoomValue() {
    let values = AhwaAdeventure.RoomValues;
    let randomize = AhwaAdeventure.randomize(values);
    return randomize[0];
  }
  GameMessage(messAttribute) {
    let randMess = [
      "You smell a " + messAttribute + " frying.",
      "You feel like you are being watched.",
      "You stepped on a frog.",
      "You stepped in " + messAttribute + " shit.",
      "You hear a " + messAttribute + " snoring.",
      "You get the strange feeling that you're playing The Wizard's Castle.",
      "You see messages written in " + messAttribute + " on the wall.",
      "You think you hear Zot laughing at you.",
      "You suddenly have the feeling of deja vu.",
      "You start to wonder if you will ever make it out of here.",
      "You hear your stomach growling and feel hungry.",
      "You have a bad feeling about this.",
      "You hear a " + messAttribute + " talking.",
      "You " + "belched" + " loudly.",
      "You " + "farted" + "loudly",
      "You " + "sneezed" + " loudly.",
      "You " + "yawned" + " loudly.",
      "You " + "coughed" + " loudly."
    ];
    this.randomize(randMess);
    return randMess[0];
  }
  static random(max, min = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  static randomize(array = []) {
    var count = array.length,
      randomnumber,
      temp;
    while (count) {
      randomnumber = (Math.random() * count--) | 0;
      temp = array[count];
      array[count] = array[randomnumber];
      array[randomnumber] = temp;
    }
    return array;
  }
  _runestaffLocation = [0, 0, 0];
  _tempLocation = [0, 0, 0];
  _monsterIgnore = false;
  get monsterIgnore() {
    return this._monsterIgnore;
  }
  set monsterIgnore(value) {
    this._monsterIgnore = value;
  }
  _allVendorMad = false;
  get allVendorMad() {
    return this._allVendorMad;
  }
  set allVendorMad(value) {
    this._allVendorMad = value;
  }
  _emptyRoomContent = [];
  get emptyRoomContent() {
    return this._emptyRoomContent;
  }
  set emptyRoomContent(value) {
    this._emptyRoomContent = value;
  }
  _availableActions = {
    "&M": "Show map",
    "&O": "Open book or chest",
    "&P": "Drink from pool",
    "&T": "Use the Runestaff to teleport",
    "&U": "Up stairs",
    "&D": "Down stairs",
    "&N": "North",
    "&S": "South",
    "&E": "East",
    "&W": "West",
    "&G": "Gaze into crystal orb",
    "&F": "Light a flare",
    "&L": "Shine lamp into adjacent room",
    "&Q": "Quit the game",
    "&A": "Attack monster or vendor",
    "&R": "Retreat from battle",
    "&B": "Bribe monster or vendor"
  };
  _map;
  enterGame(player) {
    return (
      `Ok, ${player.race}, you are now entering Zot's castle!\n` +
      `Levels = ${this.map.adventure[0]}, Rows = ${this.map.adventure[1]}, Columns = ${this.map.adventure[2]}`
    );
  }
  _players = [];
  get players() {
    return this._players;
  }
  set players(value) {
    this._players = value;
  }
  addPlayer(player) {
    this._players.push(player);
  }
  removePlayer(player) {
    this._players = this._players.filter(
      (existingPlayer) => existingPlayer.id === player.id
    );
  }

  Find = {
    Gold: (player) => {
      for (
        let row = 0;
        this._map._levels[player.location[0]].rows.length;
        row++
      ) {
        for (
          let column = 0;
          this._map._levels[player.location[0]].rows[row].columns.length();
          column++
        ) {
          if (
            this._map._levels[player.location[0]].rows[row].columns[column]
              .value === "G"
          ) {
            return [player.locationp[0], row, column];
          }
        }
      }
    },
    Flares: () => {
      for (
        let row = 0;
        this._map._levels[player.location[0]].rows.length;
        row++
      ) {
        for (
          let column = 0;
          this._map._levels[player.location[0]].rows[row].columns.length();
          column++
        ) {
          if (
            this._map._levels[player.location[0]].rows[row].columns[column]
              .value === "F"
          ) {
            return [player.locationp[0], row, column];
          }
        }
      }
    },
    Treasure: () => {},
    Stairs: () => {},
    Chest: () => {},
    SinkHole: () => {},
    Monster: () => {},
    Zot: () => {
      let level;
      let row;
      let column;
      if (AhwaAdeventure.random(100) > 50) {
        for (let _level = 0; _level < this._map._levels.length; _level++) {
          for (
            let _row = 0;
            _row < this._map._levels[_level].rows.length;
            _row++
          ) {
            for (
              let _column = 0;
              _column < this._map._levels[_level].rows[_row].columns.length;
              _column++
            ) {
              if (
                this._map._levels[_level].rows[_row].columns[_column].value ===
                "Z"
              )
                return [_level, _row, _column];
            }
          }
        }
      } else {
        level = AhwaAdeventure.random(this._map._levels.length);
        row = AhwaAdeventure.random(this._map._levels[level].rows.length);
        column = AhwaAdeventure.random(
          this._map._levels[level].rows[row].columns.length
        );
        return [level, row, column];
      }
    }
  };
  Start = {
    MonsterAttack: () => {},
    PlayerAttack: () => {},
    VendorTrade: () => {}
  };

  PlayerExit(player) {
    this.removePlayer(player);
  }
  PlayerDeath(player) {
    this.removePlayer(player);
  }

  _action = "S"; //(S)tart the game.
  get action() {
    return this._action;
  }
  set action(value) {
    this._action = value;
  }
  play() {
    do {
      this.action = "Q";
    } while (this._action !== "Q");
  }
  constructor(type = "Standard") {
    const GetRace = (player) => {
      const raceSelection = () => {
        let msg = `Choose your race.\n`;
        for (let i = 0; i < player._races.length; i++) {
          if (i === player._races.length - 2) {
            msg += ` ${player._races[i]} or`;
          } else if (i === player._races.length - 1) {
            msg += ` ${player._races[i]}?`;
          } else msg += ` ${player._races[i]},`;
        }
        return msg;
      };
      const choices = [
        {
          name: "Human",
          value: "Human"
        },
        { name: "Macronies", value: "Macronies" },
        { name: "Gnome", value: "Gnome" },
        { name: "Fairy", value: "Fairy" },
        { name: "Pixie", value: "Pixie" },
        { name: "Sprite", value: "Sprite" },
        { name: "Elf", value: "Elf" },
        { name: "Dwarf", value: "Dwarf" }
      ];
      return [raceSelection(), choices];
    };

    const GetSex = (player) => {
      const choices = [
        {
          name: "Male",
          value: "Male"
        },
        {
          name: "Female",
          value: "Female"
        },
        {
          name: "Other",
          value: "Other"
        }
      ];

      const genderSelection = (race) => {
        return `Choose a gender ${race}, you can choose Male, Female or Other.`;
      };
      return [genderSelection, choices];
    };

    const GetExtraPoints = (player) => {
      const pointsToDistribute = (race, extraPoints) => {
        return `Ok, ${race}, you have ${extraPoints} points left to distribute.`;
      };
      const choices = [
        {
          name: "Increase Dexterity",
          value: "Dexterity"
        },
        { name: "Increase Intelligence", value: "Intelligence" },
        { name: "Increase Strength", value: "Strength" }
      ];
      return [pointsToDistribute, choices];
    };

    const GetArmor = async (player, prompt) => {
      let action = null;
      do {
        let answers = prompt();
      } while (action === null);
    };

    const GetWeapon = async (player, prompt) => {
      let action = null;
      do {
        let answers = prompt();
      } while (action === null);
    };

    const GetLamp = async (player, prompt) => {
      let action = null;
      do {
        let answers = prompt();
      } while (action === null);
    };

    const GetFlares = async (player, prompt) => {
      let action = null;
      do {
        let answers = prompt();
      } while (action === null);
    };
    this.GetRace = GetRace;
    this.GetSex = GetSex;
    this.GetExtraPoints = GetExtraPoints;
    this.GetArmor = GetArmor;
    this.GetWeapon = GetWeapon;
    this.GetLamp = GetLamp;
    this.GetFlares = GetFlares;
    this.Character = Character;
    this.Monster = Monster;
    this.Curse = Curse;
    this.Potion = Potion;
    this.Treasure = Treasure;
    this.GameMap = GameMap;
    this.Armor = Armor;
    this.Weapon = Weapon;

    const CreateCharacter = (
      race = "Human",
      strength = 0,
      dexterity = 0,
      intelligence = 0,
      type = "player",
      maxPoints = 16
    ) => {
      const character = new Character({
        type,
        race,
        strength,
        dexterity,
        intelligence,
        maxPoints
      });
      return character;
    };
    this.CreateCharacter = CreateCharacter;
    this._map = new this.GameMap({ type });
  }
}
export { AhwaAdeventure };
