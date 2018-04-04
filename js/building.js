/*
  :copyright: Alexander Nefedov
  :license:   BSD, see LICENSE for more details
*/

class PropertiesBundle {
  constructor(default_title, cost, complexity, type) {
    this._default_title = default_title;
    this._cost = cost;
    this._complexity = complexity;
    this._type = type;
  }

  get DEFAULT_TITLE() {
    return this._default_title;
  }

  get COST() {
    return this._cost;
  }

  get COMPLEXITY() {
    return this._complexity;
  }

  get TYPE() {
    return this._type;
  }
}

class BUILDING_PROPERTIES {
  static get ARMOR_FACTORY() {
    return new PropertiesBundle("Armor Factory", 5000, 20, "armor_factory");
  }

  static get CITY_HALL1() {
    return new PropertiesBundle("City Hall", 1000, 10, "city_hall1");
  }
};

class AbstractBuilding {
  static CreateBuilding(building_type, id) {
    if (building_type === BUILDING_PROPERTIES.CITY_HALL1.TYPE) {
      return new CityHall1(id, BUILDING_PROPERTIES.CITY_HALL1.DEFAULT_TITLE);
    } else if (building_type === BUILDING_PROPERTIES.ARMOR_FACTORY.TYPE) {
      return new ArmorFactory(id, BUILDING_PROPERTIES.ARMOR_FACTORY.DEFAULT_TITLE);
    }
  }

  constructor(id, complexity, cost, title, type) {
    this._id = id;

    this._complexity = complexity;
    this._cost = cost;
    this._progress = 0; // Takes values from 0 to 1
    this._title = title;
    this._type = type;
  }

  get id() {
    return this._id;
  }

  get complexity() {
    return this._complexity;
  }

  get cost() {
    return this._cost;
  }

  get progress() {
    return this._progress;
  }

  get title() {
    return this._title;
  }

  get type() {
    return this._type;
  }

  Build(building_modules) {
    this._progress += building_modules / this._complexity;
    this._progress = Math.min(this._progress, 1);
  }

  CalculateConstructionTime(building_modules) {
    time = (this._complexity * (1 - this._progress)) / building_modules;
    fract = 1 % time;
    if (fract > 0) {
      return Math.floor(time) + 1;
    } else {
      return Math.floor(time);
    }
  }
};

class BasicFactory extends AbstractBuilding {
  constructor(id, complexity, cost, title, type) {
    super(id, complexity, cost, title,type);
  }
};

class ArmorFactory extends BasicFactory {
  constructor(id, title) {
    super(
      id,
      BUILDING_PROPERTIES.ARMOR_FACTORY.COMPLEXITY,
      BUILDING_PROPERTIES.ARMOR_FACTORY.COST,
      title,
      BUILDING_PROPERTIES.ARMOR_FACTORY.TYPE
    );
  }
};

class CityHall1 extends AbstractBuilding {
  constructor(id, title) {
    super(
      id,
      BUILDING_PROPERTIES.CITY_HALL1.COMPLEXITY,
      BUILDING_PROPERTIES.CITY_HALL1.COST,
      title,
      BUILDING_PROPERTIES.CITY_HALL1.TYPE
    );
  }
};