/*
  :copyright: Alexander Nefedov
  :license:   BSD, see LICENSE for more details
*/

class Army extends MapObject {
  constructor(army_name, faction, position) {
    super(army_name, faction, position);
    this._general = Math.round(Math.random() * 10);
    this._move_points = MAX_MOVE_POINTS;
    this._units = 1000;
  }

  static ProcessBattle(army1, army2) {
    console.log(`Battle ${army1.name} from ${army1.faction} faction versus ${army2.name} from ${army2.faction} faction`);
    let tactical_relation = army1.general / army2.general;

    let res = {
      attacker_loss: 0,
      defender_loss: 0,
      attacker_won: false,
    };
    for (let i=1; i<=army1.units * 0.5; i++) {
      res.attacker_loss++;
      res.defender_loss += tactical_relation;
      if (res.defender_loss >= army2.units * 0.5) {
        res.attacker_won = true;
        break;
      }
    }
    res.defender_loss = Math.round(res.defender_loss);
    army1.SubtractUnits(res.attacker_loss);
    army2.SubtractUnits(res.defender_loss);

    if (army1.units <= res.attacker_loss) {
      res.attacker_destroyed = true;
      army1._units = 0;
    }
    if (army2.units <= res.defender_loss) {
      res.defender_destroyed = true;
      army2._units = 0;
    }

    return res;
  }

  get general() {
    return this._general;
  }

  get move_points() {
    return this._move_points;
  }

  get units() {
    return this._units;
  }

  AddUnits(some_units) {
    this._units += some_units;
  }

  CheckIfArmyCanReachSomePoint(this_point) {
    let distance = GetDistanceBetweenTwoPoints(this_point, this.position);
    return distance < this._move_points * SCALE;
  }

  GetContactPoint(some_point) {
    let direction = GetNormalizedVector(SubtractVectors(some_point, this._position));
    return {
      x: this._position.x + direction.x * ARMY_CONTACT_RADIUS,
      y: this._position.y + direction.y * ARMY_CONTACT_RADIUS,
    };
  }

  MoveTo(new_position) {
    if (this.CheckIfArmyCanReachSomePoint(new_position)) {
      this._GoTo(new_position);
    } else if (this._move_points > 0 && GetDistanceBetweenTwoPoints(new_position, this._position) > EPSILON) {
      let reach_radius = this._move_points * SCALE;
      let direction = GetNormalizedVector(SubtractVectors(new_position, this._position));

      let new_reachable_position = {
        x: this._position.x + direction.x * reach_radius,
        y: this._position.y + direction.y * reach_radius,
      };

      this._GoTo(new_reachable_position);
    }
  }

  RefreshMovePoints() {
    this._move_points = MAX_MOVE_POINTS;
  }

  SubtractUnits(some_units) {
    if (some_units < this._units) {
      this._units -= some_units;
    }
  }

  _GoTo(new_position) {
    let distance = GetDistanceBetweenTwoPoints(this.position, new_position);
    this._move_points -= distance / SCALE;
    this._move_points = Math.max(this._move_points, 0);
    this._position = new_position;
  }
};
