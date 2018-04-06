/*
  :copyright: Alexander Nefedov
  :license:   BSD, see LICENSE for more details
*/

class Counter {
  constructor() {
    this._counter = 0;
  }

  get value() {
    return this._counter;
  }

  DropValue() {
    this._counter = 0;
  }

  IncValue() {
    this._counter++;
  }
};

function CreateBuilding(building_type, id) {
  if (building_type === BUILDING_PROPERTIES.CITY_HALL1.TYPE) {
    return new CityHall1(id, BUILDING_PROPERTIES.CITY_HALL1.DEFAULT_TITLE);
  }
  else if (building_type === BUILDING_PROPERTIES.ARMOR_FACTORY.TYPE) {
    return new ArmorFactory(id, BUILDING_PROPERTIES.ARMOR_FACTORY.DEFAULT_TITLE);
  }
  else if (building_type === BUILDING_PROPERTIES.RESEARCH_INSTITUTE.TYPE) {
    return new ResearchInstitute(id, BUILDING_PROPERTIES.RESEARCH_INSTITUTE.DEFAULT_TITLE);
  }
}

function CreateTestCities() {
  res = [];
  res.push(new City(CITY_NAMES[0], FACTIONS.RED, {x: 400, y: 100}));
  for (let i=1; i<=5; i++) {
    let pos = {
      x: i * 100,
      y: 500,
    };
    res.push(new City(CITY_NAMES[i], FACTIONS.NEUTRAL, pos));
  }
  return res;
}

function GetDistanceBetweenTwoPoints(point1, point2) {
  let dv = SubtractVectors(point1, point2);
  return GetVectorNorm(dv);
}

function GetVectorNorm(vec) {
  return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

function GetNormalizedVector(vec) {
  let length = GetVectorNorm(vec);
  return {
    x: vec.x / length,
    y: vec.y / length,
  };
}

function ProcessFightOfArmies(army1, army2) {
  let tactical_superiority = army1.general / (army1.general + army2.general);
  
  let loss1 = Math.round(army1.units * (1 - tactical_superiority));
  if (loss1 >= army1.units * 0.9) {
    army1.devastated = true;
  }
  army1.units -= loss1;

  let loss2 = Math.round(army2.units * tactical_superiority);
  if (loss2 >= army2.units * 0.9) {
    army2.devastated = true;
  }
  army2.units -= loss2;
}

// Retruns new vector which equals vec_a - vec_b
function SubtractVectors(vec_a, vec_b) {
  return {
    x: vec_a.x - vec_b.x,
    y: vec_a.y - vec_b.y,
  };
}

let app = new Vue({
  el: "#war-app",
  created: function() {
    this.cities = CreateTestCities();
    
    for (let i=1; i<6; i++) {
      let army = new Army(
        "Army "+i,
        FACTIONS.RED,
        {x: i*100, y: 400}
      );
      this.armies.push(army);
    }
    
    let neutral_army = new Army("Neutral Army", FACTIONS.NEUTRAL, {x: 450, y: 450});
    this.armies.push(neutral_army);
    
    this._PushState(STATES.MAP);
    this.current_city = this.cities[0];
    this._PushState(STATES.CITY_DETAILS);
    this._PushState(STATES.CONSTRUCTION_YARD);

    this._building_id_counter = new Counter();

    // this.ClickBuildCityHall(1);
  },
  data: {
    armies: [],
    current_army: null,
    current_city: null,
    current_turn: 0,
    cities: [],
    money: STARTING_MONEY,
    player_faction: FACTIONS.RED,

    // This field is actually const
    representation: {
      scale: SCALE,
      city_size: CITY_SIZE,
      army_size: 6,
      show_labels: true,
    },
    screen_state: {
      map: true,
      city: false,
    },
    state_stack: [],
    tmp: {
      army: null,
    },
    _building_id_counter: null,
  },
  methods: {
    CheckAvailableBuildingModules: function(city) {
      return city.construction_yard.available_building_modules > 0;
    },
    ClickAddBuildingModuleToBuilding: function(building_id) {
      if (this.CheckAvailableBuildingModules(this.current_city)) {
        this.current_city.construction_yard.AddBuildingModulesToBuilding(building_id, 1);
        this._ForceInterfaceUpdate()
      }
    },
    ClickArmy: function(army) {
      if (this.current_army === null || army === this.current_army) {
        this._SelectArmy(army);
        return;
      }
      let contact_point = army.GetContactPoint(this.current_army.position);
      if (!this.current_army.CheckIfArmyCanReachSomePoint(contact_point)) {
        this._SelectArmy(army);
      } else {
        this.current_army.MoveTo(contact_point);
        
        if (army.faction === this.player_faction) {
          this.tmp.army = army;
          this._PushState(STATES.TROOPS_EXCHANGE);
        } else {
          // Fight
          this.tmp.army = army;
          this._PushState(STATES.BATTLE);
        }
      }
    },
    ClickBack: function() {
      if (this.GetCurrentState() === STATES.BATTLE_RESULTS) {
        this.tmp.battle_res = null;
      }
      this._PopState();
      if (this.GetCurrentState() === STATES.TROOPS_EXCHANGE || this.GetCurrentState() === STATES.BATTLE) {
        return;
      }
      this.tmp.army = null;
      this.tmp.city = null;
      this._RemoveDevastatedArmies();
    },
    ClickBuildBuilding: function(building_type) {
      this._building_id_counter.IncValue();
      let building = CreateBuilding(
        building_type,
        this._building_id_counter.value
      );
      if (this.money >= building.cost) {
        this.money -= building.cost;
        this.current_city.construction_yard.AddBuilding(building);
        this._ForceInterfaceUpdate();
      }
    },
    ClickBuyBuildingModule: function() {
      if (this.money >= BUILDING_MODULE_COST) {
        this.money -= BUILDING_MODULE_COST;
        this.current_city.construction_yard.AddBuildingModules(1);
      }
    },
    ClickCity: function(city) {
      if (this.current_army) {
        let contact_point = city.GetContactPoint(this.current_army.position);
        if (this.current_army.CheckIfArmyCanReachSomePoint(contact_point)) {
          if (city.faction === this.current_army.faction) {
            this._ProcessClickOnAllyCity(city);
          } else {
            this._ProcessClickOnEnemyCity(city);
          }
        } else {
          this._SelectCity(city);
        }
      } else {
        this._SelectCity(city);
      }
    },
    ClickConstructionYard: function() {
      this._PushState(STATES.CONSTRUCTION_YARD);
    },
    ClickFight: function() {
      this.tmp.battle_res = Army.ProcessBattle(this.current_army, this.tmp.army);
      this._PopState();
      this._PushState(STATES.BATTLE_RESULTS);
    },
    ClickMap: function(event) {
      if (this.current_army) {
        this._MoveSelectedArmy(event);
      }
    },
    ClickMoveUnitsToLeft: function() {
      let units_to_move = parseInt(this.tmp.right_units);
      this._MoveUnitsFromArmyToArmy(this.tmp.army, this.current_army, units_to_move);
      this.tmp.right_units = 0;
    },
    ClickMoveUnitsToRight: function() {
      let units_to_move = parseInt(this.tmp.left_units);
      this._MoveUnitsFromArmyToArmy(this.current_army, this.tmp.army, units_to_move);
      this.tmp.left_units = 0;
    },
    ClickOpenArmyDetails: function() {
      if (this.current_army !== null) {
        this._PushState(STATES.ARMY_DETAILS);
      }
    },
    ClickOpenCityDetails: function() {
      if (this.current_city !== null) {
        this._PushState(STATES.CITY_DETAILS);
      }
    },
    ClickSellBuildingModule: function() {
      let res = this.current_city.construction_yard.RemoveBuildingModules(1);
      this.money += res * BUILDING_MODULE_COST / 2;
    },
    ClickSwapGarrisons: function(city) {
      let tmp = city.garrison_in;
      city.SetInnerGarrison(city.garrison_out);
      city.SetOuterGarrison(tmp);

      if (city.garrison_in !== null) {
        city.garrison_in.HideFromMap();
      }
      if (city.garrison_out !== null) {
        city.garrison_out.ShowOnMap();
      }
    },
    ClickTakeBuildingModuleFromBuilding: function(building_id) {
      let res = this.current_city.construction_yard.TakeBuildingModulesFromBuilding(building_id, 1);
      if (res === 1) {
        this._ForceInterfaceUpdate();
      }
    },
    GetCityLabel: function(city) {
      if (city.faction === this.player_faction) {
        return `${city.name} (${city.population})`;
      } else {
        return city.name;
      }
    },
    GetCurrentConstructionYardSlots: function() {
      return this.current_city.construction_yard.slots;
    },
    GetCurrentState: function() {
      return this.state_stack[this.state_stack.length - 1];
    },
    NextTurn: function() {
      this.current_turn++;
      this._CollectIncome();
      this._UpdateAllArmies();
      this._UpdateAllCities();
      this.current_city = null;
      this.current_army = null;
    },
    ToggleLabels: function() {
      this.representation.show_labels = !this.representation.show_labels;
    },
    _CollectIncome: function() {
      for (let i=0; i<this.cities.length; i++) {
        if (this.cities[i].faction === this.player_faction) {
          this.money += this.cities[i].CollectIncome();
        }
      }
      this.money = Math.round(this.money);
    },
    _ForceInterfaceUpdate: function() {
      this.$forceUpdate();
    },
    _GetCityGarrisonPosition: function(city) {
      let margin = {
        x: -this.representation.city_size / 2,
        y: -(this.representation.city_size + this.representation.army_size + SCALE),
      };
      return SubtractVectors(city.position, margin);
    },
    _MoveSelectedArmy: function(event) {
      if (this.current_army === null) return;
      let svg = event.target.ownerSVGElement;
      let pt = svg.createSVGPoint();
      pt.x = event.clientX;
      pt.y = event.clientY;
      let svg_p = pt.matrixTransform(svg.getScreenCTM().inverse());
      this.current_army.MoveTo(svg_p);
      this._RemoveArmyFromGarrisons(this.current_army);
    },
    _MoveUnitsFromArmyToArmy: function(from_army, to_army, units) {
      if (units < from_army.units) {
        from_army.SubtractUnits(units);
        to_army.AddUnits(units);
      } else {
        console.log("Move units error: number of units to move exceeds number of units in army");
      }
    },
    _PopState: function() {
      this.state_stack.pop();
    },
    _ProcessClickOnAllyCity(city) {
      // current army can reach this ally city
      if (city.garrison_out === null) {
        this.current_army.MoveTo(city.GetContactPoint(this.current_army.position));
        city.SetOuterGarrison(this.current_army);
        this._SelectCity(city);
        this._PushState(STATES.CITY_DETAILS);
      } else if (city.garrison_out.faction === this.current_army.faction) {
        this.current_army.MoveTo(city.garrison_out.GetContactPoint(this.current_army.position));
        if (this.current_army.name === city.garrison_out.name) {
          return;
        }
        this.tmp.army = city.garrison_out;
        this._PushState(STATES.TROOPS_EXCHANGE);
      } else {
        console.log("Enemy force is in an ally city garrison.")
        console.log("This cannot be.")
      }
    },
    _ProcessClickOnEnemyCity: function(city) {
      if (city.garrison_out === null && city.garrison_in === null) {
        this.current_army.MoveTo(city.GetContactPoint(this.current_army.position));
        city.CaptureBy(this.current_army.faction);
        this._SelectCity(city);
        this._PushState(STATES.CITY_DETAILS);
        return;
      }
      if (city.garrison_out) {
        console.log("Current army ought to fight city's outer garrison.")
      }
      if (city.garrison_in) {
        console.log("Current army ought to fight city's inner garrison.")
      }
    },
    _PushState: function(state) {
      this.state_stack.push(state);
    },
    _RemoveArmyFromGarrisons: function(army) {
      // If it was in any.
      for (let i=0; i<this.cities.length; i++) {
        if (this.cities[i].CheckIfArmyInInnerGarrison(army)) {
          this.cities[i].UnsetInnerGarrison();
        }
        if (this.cities[i].CheckIfArmyInOuterGarrison(army)) {
          this.cities[i].UnsetOuterGarrison();
        }
      }
    },
    _RemoveDevastatedArmies: function() {
      this.armies = this.armies.filter((army) => {
        return army.units > 0;
      });
    }, 
    _SelectArmy: function(army) {
      if (army.faction === this.player_faction) {
        this.current_army = army;
        this.current_city = null;
      }
    },
    _SelectCity: function(city) {
      if (city.faction === this.player_faction) {
        this.current_city = city;
        this.current_army = null;
      }
    },
    _UpdateAllArmies: function() {
      for (let i=0; i<this.armies.length; i++) {
        this.armies[i].RefreshMovePoints();
      }
    },
    _UpdateAllCities: function() {
      for (let i=0; i<this.cities.length; i++) {
        this._UpdateOneCity(this.cities[i]);
      }
    },
    _UpdateOneCity: function(city) {
      city.MakeNewHumans();
      city.construction_yard.Construct();
      city.EstablishReadyBuildings();
    },
  },
});




