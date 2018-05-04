/*
  :copyright: Alexander Nefedov
  :license:   BSD, see LICENSE for more details
*/

class ResearchProject {
  constructor(title) {
    this._level = 0;
    this._progress = 0; // Takes values [0, 1]
    this._title = title;

    this._working_scientists = 0;
  }

  get is_science() {
    return this._title === RESEARCH_PROJECTS_TITLES.SCIENCE;
  }

  get level() {
    return this._level;
  }

  get progress() {
    return this._progress;
  }

  get title() {
    return this._title;
  }

  get working_scientists() {
    return this._working_scientists;
  }

  AddScientists(val) {
    this._working_scientists += val;
  }


  DoResearch(complexity) {
    if (this._working_scientists === 0) {
      return;
    }
    let new_progress = this._working_scientists / complexity;
    this._progress += new_progress;
    if (this._progress >= 1) {
      this._level++;
      this._progress = 0;
      this._working_scientists = 0;
    }
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
  static _GetLevelComplexity(level) {
    return RCGF * level * (level + 1) / 2;
  }

  constructor(id, title) {
    super(
      id,
      BUILDING_PROPERTIES.RESEARCH_INSTITUTE.COMPLEXITY,
      BUILDING_PROPERTIES.RESEARCH_INSTITUTE.COST,
      title,
      BUILDING_PROPERTIES.RESEARCH_INSTITUTE.TYPE
    );
    this._economy = new ResearchProject(RESEARCH_PROJECTS_TITLES.ECONOMY);
    this._industry = new ResearchProject(RESEARCH_PROJECTS_TITLES.INDUSTRY);
    this._science = new ResearchProject(RESEARCH_PROJECTS_TITLES.SCIENCE);

    this._total_scientists = 0;
  }

  get available_scientists() {
    return this.total_scientists - this.working_scientists;
  }

  get cost() {
    let cost = this._total_scientists * (this._science.level + 1);
    return cost * SCIENTIST_SALARY_FACTOR;
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

  get total_scientists() {
    return this._total_scientists;
  }

  get working_scientists() {
    let res = 0;
    res += this._economy.working_scientists;
    res += this._industry.working_scientists;
    res += this._science.working_scientists;
    return res;
  }

  AddScientistsToInstitute(val) {
    this._total_scientists += val;
  }

  AddScientistsToResearchProject(project, val) {
    if (val <= this.available_scientists) {
      project.AddScientists(val);
    } else {
      project.AddScientists(this.available_scientists);
    }
  }

  DoResearch() {
    this._economy.DoResearch(
      this.GetNextLevelComplexity(this._economy)
    );
    this._industry.DoResearch(
      this.GetNextLevelComplexity(this._industry)
    );
    this._science.DoResearch(
      this.GetNextLevelComplexity(this._science)
    );
  }

  GetNextLevelComplexity(project) {
    let basic_complexity = ResearchInstitute._GetLevelComplexity(project.level + 1);


    let level_of_ease;
    if (project.is_science) {
      level_of_ease = Math.max(project.level, 1);
    } 
    else {
      level_of_ease = Math.max(project.level - this._science.level, 1);
    }

    let eased_complexity = ResearchInstitute._GetLevelComplexity(level_of_ease);
    let res_complexity = (basic_complexity + eased_complexity) / 2;

    return Math.round(res_complexity);
  }

  WithdrawScientistsFromInstitute(val) {
    this._WithdrawScientistsFromAllProjects();
    if (val <= this._total_scientists) {
      this._total_scientists -= val;
      return val;
    } else {
      let res = this._total_scientists;
      this._total_scientists = 0;
      return res;
    }
  }

  WithdrawScientistsFromResearchProject(project, val) {
    let scientists = project.WithdrawSientists(val);
    this._total_scientists += val;
  }

  _WithdrawScientistsFromAllProjects() {
    this._economy.WithdrawSientists(this._economy.working_scientists);
    this._industry.WithdrawSientists(this._industry.working_scientists);
    this._science.WithdrawSientists(this._science.working_scientists);
  }
};
