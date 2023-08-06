import { AhwaAdeventure } from "./index.js";

class Weapon {
  _types = [
    { name: "Sword", max: 2500, min: 30 },
    { name: "Mace", max: 2000, min: 20 },
    { name: "Dagger", max: 1500, min: 10 },
    { name: "None", max: 0, min: 0 }
  ];

  _type = "";
  get type() {
    return this._type;
  }
  set type(value) {
    this._type = value;
  }
  constructor({ type = "None" }) {
    this._type = type;
  }
}
export { Weapon };
