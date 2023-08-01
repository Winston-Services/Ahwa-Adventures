import { AhwaAdeventure } from "./index.js";

class Curse {
  _name = "";
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
  _types = ["Forgetfulness", "Leech", "Lethargy"];
  getRandom() {
    let types = AhwaAdeventure.randomize(this._types);
    return types[0];
  }
}
export { Curse };
