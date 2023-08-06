class Armor {
  _types = [
    { name: "Plate", max: 2500, min: 30 },
    { name: "Chain Mail", max: 2000, min: 20 },
    { name: "Leather", max: 1500, min: 10 },
    { name: "None", max: 0, min: 0 }
  ];
  _type = "None";
  get type() {
    return this._type;
  }
  set type(value) {
    this._type = value;
  }
  _name = "None";
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }

  _strength = 1;
  get strength() {
    return this._strength;
  }
  set strength(value) {
    this._strength = value;
  }
  _dexterity = 1;
  get dexterity() {
    return this._dexterity;
  }
  set dexterity(value) {
    this._dexterity = value;
  }
  _intelligence = 1;
  get intelligence() {
    return this._intelligence;
  }
  set intelligence(value) {
    this._intelligence = value;
  }
  constructor({
    type = "None",
    strength = 0,
    dexterity = 0,
    intelligence = 0
  }) {
    this._type = type;
    this._strength = strength;
    this._dexterity = dexterity;
    this._intelligence = intelligence;
  }
}
export { Armor };
