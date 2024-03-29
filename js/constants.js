/*
  :copyright: Alexander Nefedov
  :license:   BSD, see LICENSE for more details
*/

// This file contains all constants required for both gameplay and representation

// Gameplay constants
const ARMY_CONTACT_RADIUS = 12;
const CITY_HALL_PRICE = 1000;
const CITY_HALL_INCOME_FACTOR = 0.1;
const INCUBATOR_UPGRADE_STEP = 0.005;
const MAX_MOVE_POINTS = 10;
const STARTING_MONEY = 2000;

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

  static get MAP() {
    return "map";
  }

  static get TROOPS_EXCHANGE() {
    return "troops_exchange";
  }
};

// Representation constants
const CITY_SIZE = 20;
const EPSILON = 0.1;
const SCALE = 10;
