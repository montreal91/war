/*
  :copyright: Alexander Nefedov
  :license:   BSD, see LICENSE for more details
*/

class MapObject {
  constructor(name, faction, position) {
    this._name = name;
    this._faction = faction;
    this._position = position;

    this._on_map = true;
  }

  get faction() {
    return this._faction;
  }

  get name() {
    return this._name;
  }

  get on_map() {
    return this._on_map;
  }

  get position() {
    return this._position;
  }

  get transform() {
    return `translate(${this.position.x}, ${this.position.y})`;
  }

  HideFromMap() {
    this._on_map = false;
  }

  ShowOnMap() {
    this._on_map = true;
  }
};
