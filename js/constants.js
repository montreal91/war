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
const SCIENTIST_HIRE_COST = 100;
const SCIENTIST_SALARY_FACTOR = 20;
const STARTING_CITY_POPULATION = 1000;
const STARTING_MONEY = 50000;

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

class PERSONNEL_TYPES {
  static get SCIENTISTS() {
    return "scientists";
  }

  static get SOLDIERS() {
    return "soldiers"
  }
};

class RESEARCH_PROJECTS_TITLES {
  static get ECONOMY() {
    return "Economy";
  }

  static get INDUSTRY() {
    return "Industry";
  }

  static get SCIENCE() {
    return "Science";
  }
}

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

  static get PERSONNEL_MANAGEMENT() {
    return "personnel_management";
  }

  static get MAP() {
    return "map";
  }

  static get RESEARCH_INSTITUTE() {
    return "research_institute";
  }

  static get TROOPS_EXCHANGE() {
    return "troops_exchange";
  }
};


// Representation constants
const CITY_SIZE = 20;
const EPSILON = 0.1;
const SCALE = 10;
