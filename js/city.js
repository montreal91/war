/*
  :copyright: Alexander Nefedov
  :license:   BSD, see LICENSE for more details
*/

// Helper class to manage the city population
class Incubator {
  constructor() {
    this._coefficient = 0.05;
    this._population = STARTING_CITY_POPULATION;
  }

  get coefficient() {
    return this._coefficient;
  }

  get delta() {
    return Math.round(this._population * this._coefficient);
  }

  get population() {
    return this._population;
  }

  AddPopulation(val) {
    this._population += val;
  }

  Incubate() {
    this._population += this.delta;
    this._population = Math.round(this._population);
  }

  Upgrade() {
    this._coefficient += INCUBATOR_UPGRADE_STEP;
  }

  WithdrawPopulation(val) {
    if (val <= this._population) {
      this._population -= val;
      return val;
    }
  }
};

class City extends MapObject {
  constructor(city_name, faction, position) {
    super(city_name, faction, position);

    this._buildings = [];
    this._city_hall = 0;
    this._construction_yard = new ConstructionYard();
    this._garrison_in = null;
    this._garrison_out = null;
    this._incubator = new Incubator();
  }

  get buildings() {
    return this._buildings;
  }

  get city_hall() {
    return this._city_hall;
  }

  get construction_yard() {
    return this._construction_yard;
  }

  get garrison_in() {
    return this._garrison_in;
  }

  get garrison_out() {
    return this._garrison_out;
  }

  get population() {
    return this._incubator.population;
  }

  CaptureBy(faction) {
    this._faction = faction;
  }

  CheckIfArmyInInnerGarrison(army) {
    if (this._garrison_in === null) {
      return false;
    } else {
      return this._garrison_in.name === army.name;
    }
  }

  CheckIfArmyInOuterGarrison(army) {
    if (this._garrison_out === null) {
      return false;
    } else {
      return this._garrison_out.name === army.name;
    }
  }

  CollectIncome() {
    let city_halls = 0;
    for (let building in this._buildings) {
      if (this._buildings[building].type === BUILDING_PROPERTIES.CITY_HALL1.TYPE) {
        city_halls++;
      }
    }
    return this._incubator.population * city_halls * CITY_HALL_INCOME_FACTOR;
  }

  EstablishReadyBuildings() {
    let ready_buildings = this._construction_yard.WithdrawReadyBuildings();
    this._buildings.push(...ready_buildings);
  }

  GetContactPoint(some_point) {
    return {
      x: this._position.x + CITY_SIZE / 2,
      y: this._position.y + CITY_SIZE + SCALE,
    };
  }

  MakeNewHumans() {
    this._incubator.Incubate();
  }

  SetInnerGarrison(army) {
    this._garrison_in = army;
  }

  SetOuterGarrison(army) {
    this._garrison_out = army;
  }

  UnsetInnerGarrison() {
    this._garrison_in = null;
  }

  UnsetOuterGarrison() {
    this._garrison_out = null;
  }

  UpgradeCityHall() {
    this._city_hall++;
  }
};
