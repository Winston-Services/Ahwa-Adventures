import { AhwaAdeventure } from "./index.js";
class Potion {
  _types = ["Dexterity", "Intelligence", "Strength"];
  _type;
  get type() {
    return this._type;
  }
  set type(value) {
    this._type = value;
  }
  _value;
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value;
  }
  getRandom() {
    let types = AhwaAdeventure.randomize(this._types);
    return types[0];
  }
}
export { Potion };
