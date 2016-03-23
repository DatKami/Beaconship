function Team(name, IDs)
{
  this.name = name;
  this.IDs = IDs;
}

var RWBYids = [0,1,2,3];
var JNPRids = [4,5,6,7];
var SSSNids = [21,35, 36,22];
var CFVYids = [28,33, 9, 34];
var CRMEids = [12, 13, 14, 15, 16];
var STRQids = [27,30];
var TEACids = [10,11,25,32];
var CLUBids = [17,18,19];
var ATLSids = [23,24,31];
var OTHRids = [8, 26, 20, 29];

var teams = [];

teams.push(new Team("Team RWBY",              RWBYids));
teams.push(new Team("Team JNPR",              JNPRids));
teams.push(new Team("Team SSSN",              SSSNids));
teams.push(new Team("Team CFVY",              CFVYids));
teams.push(new Team("Team STRQ",              STRQids));
teams.push(new Team("Cinder's Faction",       CRMEids));
teams.push(new Team("The Teachers",           TEACids));
teams.push(new Team("The Atlesian Military",  ATLSids));
teams.push(new Team("The Club",               CLUBids));
teams.push(new Team("Other Characters",       OTHRids));

function presetTeams()
{
  return teams;
}