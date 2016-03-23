  /////////////
  // CLASSES //
  /////////////

  function Contender(ID, ELO, name, shorthand, color) {
    //var this = {ID: iden, above: [], below: [], e: ELO, eSum: 0, eChg: 0, status: true};
    this.ID = ID;
    this.name = name;
    this.shorthand = shorthand;
    this.color = color;
    this.above = [];
    this.below = [];
    this.ELO = ELO;
    this.ELOSum = 0;
    this.ELOChg = 0;
    this.status = true;
    
    this.getID = function() { return this.ID; };
    this.getAbove = function() { return this.above; };
    this.pushAbove = function(item) { if( this.above.indexOf(item) == -1 && 
                                          this.below.indexOf(item) == -1 && 
                                          item != this.ID) { this.above.push(item); } };
    this.getBelow = function() { return this.below; };
    this.pushBelow = function(item) { if( this.below.indexOf(item) == -1 && 
                                          this.above.indexOf(item) == -1 && 
                                          item != this.ID) { this.below.push(item); } };
    this.getELO = function() { return this.ELO; };
    this.setSum = function(value) { this.ELOSum = value; };
    this.getSum = function() { return this.ELOSum; };
    this.setChange = function(value) { this.ELOChg = value; };
    this.getChange = function() { return this.ELOChg; };
  }