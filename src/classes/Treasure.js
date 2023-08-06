import { AhwaAdeventure } from "./index.js";

class Treasure {
  _name;
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
  _types = [
    "The Blue Flame",
    "The Green Gem",
    "The Norn Stone",
    "The Opal Eye",
    "The Palantir",
    "The Pale Pearl",
    "The Ruby Red",
    "The Silmaril",
    "Treasure Chest"
  ];
  _removed = [];
  removeTreasure(treasure) {
    this._removed.push(treasure);
  }
  getRandom() {
    let filtered = this._types.filter(
      (type) => this._removed.indexOf(type) === -1
    );
    let types = AhwaAdeventure.randomize(filtered);
    return new Treasure({ name: types[0] });
  }
  get length() {
    return this._types.length;
  }
  constructor({ name = "Treasure Chest" }) {
    this._name = name;
  }
}
export { Treasure };
