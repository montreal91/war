/*
  :copyright: Alexander Nefedov
  :license:   BSD, see LICENSE for more details
*/

class ConstructionYardError extends Error {
  constructor(message) {
    super(message);
  }
}

class AddBuildingError extends Error {
  constructor(message) {
    super(message);
  }
}

class ConstructionYard {
  constructor() {
    this._building_modules = 0;
    this._yard = {};
  }

  get slots() {
    res = [];
    for (let slot_id in this._yard) {
      // let slot = this._yard[slot_id];
      res.push(this._yard[slot_id]);
    }
    return res;
  }

  get available_building_modules() {
    let res = 0;
    for (let slot in this._yard) {
      res += this._yard[slot].building_modules;
    }
    return this._building_modules - res;
  }

  get total_building_modules() {
    return this._building_modules;
  }

  AddBuilding(building) {
    if (!this._yard.hasOwnProperty(building.id)) {
      let new_slot = {};
      new_slot.building = building;
      new_slot.building_modules = 0;
      this._yard[building.id] = new_slot;
    } else {
      throw new AddBuildingError("Building with such id is already exists in this Construction Yard.");
    }
  }

  AddBuildingModules(val) {
    this._building_modules += val;
  }

  AddBuildingModulesToBuilding(building_id, building_modules) {
    // This method does hope thad building_modules is integer
    if (this._CheckIfCanAddModulesToSlot(building_id, building_modules)) {
      this._yard[building_id].building_modules += building_modules;
    } else {
      throw new ConstructionYardError("Cannot add building modules to unexisting building.")
    }
  }

  Construct() {
    for (let id in this._yard) {
      let slot = this._yard[id];
      slot.building.Build(slot.building_modules);
    }
  }

  RemoveBuildingModules(val) {
    if (val <= this.available_building_modules) {
      this._building_modules -= val;
      return val;
    } else {
      return 0;
    }
  }

  TakeBuildingModulesFromBuilding(building_id, building_modules) {
    if (!this._yard.hasOwnProperty(building_id) || building_modules < 0) {
      return 0;
    } else {
      let slot = this._yard[building_id];
      if (building_modules > slot.building_modules) {
        let res = slot.building_modules;
        slot.building_modules = 0;
        return res;
      } else {
        slot.building_modules -= building_modules;
        return building_modules;
      }
    }
  }

  WithdrawReadyBuildings() {
    let res = [];
    for (let slot_id in this._yard) {
      let slot = this._yard[slot_id];
      if (slot.building.progress === 1) {
        res.push(slot.building);
        delete this._yard[slot_id];
      } else {
        continue;
      }
    }
    return res;
  }

  _CheckIfCanAddModulesToSlot(slot_id, val) {
    let c1 = this._yard.hasOwnProperty(slot_id);
    let c2 = val > 0;
    let c3 = val <= this.available_building_modules;
    return c1 && c2 && c3;
  }
}
