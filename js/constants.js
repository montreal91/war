/*
  :copyright: Alexander Nefedov
  :license:   BSD, see LICENSE for more details
*/

// This file contains all constants required for both gameplay and representation

// Gameplay constants
const ARMY_CONTACT_RADIUS = 12;
const BUILDING_MODULE_COST = 500;
const CITY_HALL_PRICE = 1000;
const CITY_HALL_INCOME_FACTOR = 0.1;

const CITY_NAMES = [
  "Adelaide",
  "Lancaster",
  "Albuquerque",
  "London",
  "Arminium",
  "Rome",
  "City 17",
  "Chelyabinsk",
  "Prague",
  "Paris",
  "Yekaterinburg",
  "St. Louis",
];

const RCGF = 9; // Research Complexity Growth Factor 

const INCUBATOR_UPGRADE_STEP = 0.005;
const MAX_MOVE_POINTS = 10;
const STARTING_CITY_POPULATION = 500;
const STARTING_MONEY = 50000;

class FACTIONS {
  static get NEUTRAL() {
    return "neutral";
  }

  static get RED() {
    return "red";
  }

  static get GREEN() {
    return "green";
  }

  static get BLUE() {
    return "blue";
  }

  static get YELLOW() {
    return "yellow";
  }
};


class STATES {
  static get ARMY_DETAILS() {
    return "army_details";
  }

  static get BATTLE() {
    return "battle";
  }

  static get BATTLE_RESULTS() {
    return "battle_results";
  }

  static get CITY_DETAILS() {
    return "city_details";
  }

  static get CONSTRUCTION_YARD() {
    return "construction_yard";
  }

  static get MAP() {
    return "map";
  }

  static get TROOPS_EXCHANGE() {
    return "troops_exchange";
  }
};

class _BuildingPropertiesBundle {
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
    return new _BuildingPropertiesBundle(
      "Armor Factory",
      5000,
      20,
      "armor_factory"
    );
  }

  static get CITY_HALL1() {
    return new _BuildingPropertiesBundle(
      "City Hall",
      1000,
      10,
      "city_hall1"
    );
  }

  static get RESEARCH_INSTITUTE() {
    return new _BuildingPropertiesBundle(
      "Research Institute",
      7500,
      20,
      "research_institute"
    );
  }
};

// Representation constants
const CITY_SIZE = 20;
const EPSILON = 0.1;
const SCALE = 10;
