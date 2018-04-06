/*
  :copyright: Alexander Nefedov
  :license:   BSD, see LICENSE for more details
*/

class ResearchProject {
  static _GetLevelComplexity(level) {
    return RCGF * level * (level + 1) / 2;
  }
  
  constructor(name) {
    this._level = 0;
    // this._name = name;
    this._progress = 0; // Takes values [0, 1]

    this._working_scientists = 0;
  }

  get level() {
    return this._level;
  }

  // get name() {
  //   return this._name;
  // }

  get progress() {
    return this._progress;
  }

  get working_scientists() {
    return this._working_scientists;
  }

  AddScientists(val) {
    this._working_scientists += val;
  }


  DoResearch() {
    let new_progress = GetNextLevelComlexity() / this._working_scientists;
    this._progress += new_progress;
    if (this._progress >= 1) {
      this._level++;
      this._progress = 0;
      this._working_scientists = 0;
    }
  }

  GetNextLevelComlexity(scientific_level) {
    let basic_complexity = ResearchProject._GetLevelComplexity(this._level + 1);

    let level_of_ease = Math.max(this._level - scientific_level, 1);
    let eased_complexity = ResearchProject._GetLevelComplexity(level_of_ease);

    return (basic_complexity + eased_complexity) / 2;
  }

  WithdrawSientists(val) {
    if (val <= this._working_scientists) {
      this._working_scientists -= val;
      return val;
    } else {
      let res = this._working_scientists;
      this._working_scientists = 0;
      return res;
    }
  }
};

class ResearchInstitute extends AbstractBuilding {
  constructor(id, title) {
    super(
      id,
      BUILDING_PROPERTIES.RESEARCH_INSTITUTE.COMPLEXITY,
      BUILDING_PROPERTIES.RESEARCH_INSTITUTE.COST,
      title,
      BUILDING_PROPERTIES.RESEARCH_INSTITUTE.TYPE
    );
    this._economy = new ResearchProject();
    this._industry = new ResearchProject();
    this._science = new ResearchProject();

    this._total_scientists = 0;
  }

  get economy() {
    return this._economy;
  }

  get industry() {
    return this._industry;
  }

  get science() {
    return this._science;
  }

  AddScientists(val) {
    this._total_scientists += val;
  }

  DoResearch() {
    this._economy.DoResearch();
    this._industry.DoResearch();
    this._science.DoResearch();
  }

  WithdrawSientists(val) {
    if (val <= this._total_scientists) {
      this._total_scientists -= val;
      return val;
    } else {
      let res = this._total_scientists;
      this._total_scientists = 0;
      return res;
    }
  }
};
