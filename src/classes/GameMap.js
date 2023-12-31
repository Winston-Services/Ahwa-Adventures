import { AhwaAdeventure, Treasure, Monster } from "./index.js";
import { Monsters } from "../components/index.js";

class GameMap {
  _type = "Standard";
  _types = ["Standard", "Random"];
  _adventure = [8, 8, 8];

  get adventure() {
    return this._adventure;
  }

  set adventure(value) {
    this._adventure = value;
  }

  _map;
  get map() {
    return this._map;
  }

  set map(value) {
    this._map = value;
  }

  _levels = [];
  get levels() {
    return this._levels;
  }

  set levels(value) {
    this._levels = value;
  }

  Columns(randColumns) {
    let tempVal = [];
    for (let k = 0; k <= randColumns - 1; k++) {
      tempVal.push({
        column: k + 1,
        value: "x"
      });
    }
    return tempVal;
  }

  Rows(randRows, randColumns) {
    let tempVal = [];
    for (let j = 0; j <= randRows - 1; j++) {
      tempVal.push({
        row: j + 1,
        columns: this.Columns(randColumns)
      });
    }
    return tempVal;
  }

  Levels(randLevels, randRows, randColumns) {
    let tempVal = [];
    for (let i = 0; i <= randLevels - 1; i++) {
      tempVal.push({
        level: i + 1,
        rows: this.Rows(randRows, randColumns)
      });
    }
    return tempVal;
  }
  KnownMap(map) {
    for (let level = 0; level < map._levels.length; level++) {
      for (let row = 0; row < map._levels[level].rows.length; row++) {
        for (
          let column = 0;
          column < map._levels[level].rows[row].columns.length;
          column++
        ) {
          if (map._levels[level].rows[row].columns[column].value !== "E") {
            map._levels[level].rows[row].columns[column].value = "X";
          }
        }
      }
    }
    return map;
  }
  Show(player) {
    player.known._levels[player.location[0]].rows[player.location[1]].columns[
      player.location[2]
    ].value = "<*>";
    let str = "";
    for (
      let row = 0;
      row < player.known._levels[player.location[0]].rows.length;
      row++
    ) {
      player.known._levels[player.location[0]].rows[row].columns.forEach(
        (column) => {
          if (column.value instanceof Treasure) {
            str += " T ";
          } else if (column.value instanceof Monster) {
            str += " M ";
          } else if (column.value === "Z") {
            str += " W ";
          } else if (column.value === "<*>") {
            str += "<*>";
          } else {
            str += ` ${column.value} `;
            // console.log("Column in Show", column.value);
          }
        }
      );
      str += "\n";
    }
    return str;
  }
  Map(randLevels, randRows, randColumns, mapName = "MainMap") {
    const treasures = new Treasure({ name: "Treasure Chest" });
    this._map = mapName;
    this._levels = this.Levels(randLevels, randRows, randColumns);
    this._levels[0].rows[0].columns[3].value = "E";
    for (let i = 0; i < treasures.length - 1; i++) {
      let level;
      let row;
      let column;
      do {
        level = AhwaAdeventure.random(this._levels.length - 1);
        row = AhwaAdeventure.random(this._levels[level].rows.length - 1);
        column = AhwaAdeventure.random(
          this._levels[level].rows[row].columns.length - 1
        );
      } while (this._levels[level].rows[row].columns[column].value !== "x");
      if (i === 0) {
        this._levels[level].rows[row].columns[column].value = "Z";
      } else {
        this._levels[level].rows[row].columns[column].value =
          treasures.getRandom();
        treasures.removeTreasure(
          this._levels[level].rows[row].columns[column].value
        );
      }
    }
    for (let level = 0; level < this._levels.length - 1; level++) {
      for (let row = 0; row < this._levels[level].rows.length - 1; row++) {
        for (
          let column = 0;
          column < this._levels[level].rows[row].columns.length - 1;
          column++
        ) {
          if (this._levels[level].rows[row].columns[column].value === "x") {
            do {
              let roomObject = AhwaAdeventure.getRandomRoomValue(); //get Random Room Value + "M"
              if (AhwaAdeventure.random(100) > 60) {
                roomObject = "X";
              } else if (AhwaAdeventure.random(100) > 70) {
                roomObject = "M";
              }
              if (
                roomObject === "D" &&
                level !== this._levels.length - 1 &&
                this._levels[level + 1].rows[row].columns[column].value === "x"
              ) {
                this._levels[level].rows[row].columns[column].value =
                  roomObject;
                this._levels[level + 1].rows[row].columns[column].value = "U";
              } else if (
                roomObject === "S" &&
                level !== this._levels.length - 1
              ) {
                this._levels[level].rows[row].columns[column].value =
                  roomObject;
              } else if (roomObject !== "D" && roomObject !== "S") {
                if (roomObject === "M") {
                  roomObject = Monster.getRandom();
                  // console.log("Monster Room Object", roomObject);
                  this._levels[level].rows[row].columns[column].value =
                    roomObject;
                }
              }
            } while (
              this._levels[level].rows[row].columns[column].value === "x"
            );
          }
        }
      }
    }
  }

  constructor({ type = "Standard" }) {
    this._type = type;
    if (this._type === "Standard") {
      this._adventure = [8, 8, 8];
    } else {
      this._adventure = [
        AhwaAdeventure.random(15, 8),
        AhwaAdeventure.random(30, 8),
        AhwaAdeventure.random(50, 8)
      ];
    }
    this.Map(...this._adventure);
  }

  toJSON() {
    return JSON.parse(
      JSON.stringify(
        {
          map: this._map,
          levels: this._levels
        },
        false,
        2
      )
    );
  }
}
export { GameMap };
