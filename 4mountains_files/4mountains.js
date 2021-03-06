// piirtofunktioita on kiva tehdä, ne ei oo niin mielenkiintosen näköisiä
// engine funktiot on vaikea tehdä ja niistä on ylpeä
// jotkut käyttöliittymän veemäisyydet ovat ihania tehdä kun tajuaa miten monimutkainen joku yksinkertainen asia on. esim. changeTurn
// newPersonin (sis. addGroups alifunktioineen) ja delPersonin tekemistä ei ole tapana muistella
// relValin tekeminen oli helppoa ja se on kaunis



// TO DO
// -----
//
// Metaphor-X ja Metaphor-Y ja Metaphor-diag
// Toimintalogiikka: pätee kaikkiin pelaajiin jotka ovat siirtävän pelaajan xp:llä
// Toimintaehto: siirtävän pelaajan xp:n tulee sisältää myös ruutu, johon siirretään (rohkaisee symmetriaan)
//
// AI implementation. Strategies can be intellectual patterns but mere identification algorithms can be those, too. Should we differentiate between them in some way? Not sure.
//
// Magic The Gathering analogy: xp should be like land, not like xp. This means you get 1 of each land at start. (???) Or draw stuff from deck?
// Tarot expansion: 13 number cards per deck. odd are bad, even decent, high excellent. hmm. 16 is better.
//
// No level decrease when a player voluntarily enters a nonrelativized slot that would lower his xp. Levels affected only when a player IS MOVED to a slot.
//
// Math aspect: relativized slot closest to origin should have a value of 2, and so on.
//
// MTG aspect as debate simulator
//
// Polysemylator for real-time observation of one player?
//
// to do: beliefs as personality, use same tech as for int?
// considerations, same tech as soc
// calculations, priorities
// revelations, insert new priority
//
// biological patterns may suggest new rules (intellectual patterns). in this case the rule bestows as much quality upon inventor as everyone who uses it
//
// calculative patterns personified as deities or spiritual beings?????? revolutionary philosophyical insight if true
//
// model personality as normative quality?
//
// model mysticality with symmetry and golden ration in power set of objects? other rules? need lots of pattern recognition for this...?

/*



SpatialMode is objective world
- persons have radius (culturally determined) of friendzone, intimatezone etc. and approaching someone is a vector, ie. if you go too near someone it is LUST and if he isn't in the mood you can't even be FRIEND
- any game actions should be defined in terms of these slots, perhaps allowing for polysemy

ESPgrid is subjective world
- oddly, there is ESPgrid and objective tables now but no subjective tables
- considerations, as a whole, are CONDUCT
- calculations involve ponderings about whether others will imitate my conduct or how others will react to my conduct
- euphoria involves a low value for all calculations...
- beliefs should probably include hard-wired reactions such as hugging feels good (of course autistic person would require hugbox(this is very important))

normative is personality and SUPEREGO
- syntactic level involves automated actions (ie. don't touch electric appliance when wet etc.)
- who am I? own xp system for WHO I OUGHT TO BE whereas objective is WHAT I REALLY AM
- metatheoretic level ponders components of identities regardless of who possesses said identity, ie. it might decide a certain kind of identity should be collectively established
- analogy level involves ...

mystical is esthetic
- search for golden ratio and symmetry in *all* data is probably the best we can do. this involves
 - player size/weight differences
 - distance between players
 - distance between groups
 - temporal distance



 ATTACH MODULE
 - insert button for attaching a Mode as module to current Mode
 benefit: allows to split overflowing UI into many windows, perhaps on several screens.
 modules can also be used in isolation
 when module is attached, all player and group and other data is copied to the current module



Do these modules, metaphysically, emerge from each other? 



*/



// distance does not affect vector summation stuff, is only a factor in value change?
// so, if a player moves another player to a bad slot but is distant then the negative effect of the slot is decreased by a factor



// BUG! restart clears added players and fails to update autoplay status??

// BUG delperson causes bug if used right after newperson

// BUG if create new person, amoq will think that was previous person when visualizing turn

// BUG INFO: delperson does not cause bug if delete last person in list so that person is in turn

// dec is miscalculated. shoud account for x y diff instead of just absval



// ==================
// ENGINE STUFF BEGIN
// ==================



var s = {
  initDone: false,
  mode: false };



function BasicMode() {
  if(!(s.mode.name === "BasicMode")) {
    initBasicModeDisplay();
    if(!s.Basic.initDone) {
      s.Basic = {
        // state:
        name: "BasicMode", // modes should have ids, too?
        playing: false,
        personInTurn: false,
        turn: 0,
        autoBotTurn: -1, //-1 for none
        autoBotTurnDefault: 50,
        autoPlayFirstTurn: true,
        disableAutoContinueOnHumanTurn: true,
        pause: false,
        moveAttempt: false,
        simultaneousTurns: false,
        fancyUI: true,
        randomizeIntl: 1,
        // environment:
        res: 9,
        metaphysics: false,
        nonrelScale: false, //absVal of nonrelativized slots
        relScale: "intersect",  //absVal of relativized slots (ie. both X and Y have non-zero value) //sum2, sum, intersect
        revertingXp: true,
        xpRegulation: 1, //-1 for none
        xpCap: true, //-1 for none, true for half res, number for other
        defaultFont: "tahoma",
        personsDIds: new DIds( "ALPH", false ),
        // data:
        persons: [],
        groups: [],
        intl: [],
        strategies: [],
        patterns: [],
        grid: [],
        slots: [],
        slotHover: false,
        latestPersonsDiff: false,
        latestGroupsDiff: false,
        latestX: 0,
        latestY: 0,
        val: relVal(0,0),
        // output:
        outputToConsole: 0,
        maxDebug: false,
        defaultInfoBox: "",
        logInfoBox: false,
        //
        initDone: false };
      newPerson(s.Basic,"Rotta",false,true);
      //s.Basic.persons[0].xp = makeXp(2, 2, 2, 2);
      s.Basic.personInTurn = s.Basic.persons[0];
      newPerson(s.Basic,"Siiseli",true,true);
      newPerson(s.Basic,"Kaniini",true,false);
      //newPerson(s.Basic,"Zippomiäs",true);
      newPerson(s.Basic,"Länsigootti",false,false);
      newPerson(s.Basic,"AdolPh.D", false,true);
      createMetaphysics(s.Basic, s.Basic.res);
      createGrid(s.Basic, s.Basic.res, s.Basic.persons);
      drawGrid(s.Basic.grid, s.Basic.persons, false); }
    s.mode = s.Basic;
    createStrategies(s.Basic); //priors not randomized or utilized, can't change strats reasonably before this is done
    if(s.mode.playing) {drawGrid(s.mode.grid, s.mode.persons, s.mode.personInTurn);}
    drawInfoBox(false);
    drawPersonList(false, false);
    drawStratList(false);
    drawButton("startGame");
    drawButton("autoPlay");
    drawButton("newPerson");
    drawButton("delPerson");
    drawButton("restart");
    drawButton("devFunc");
    drawPatternList(false);
    drawGroupList(false, false);
    s.mode.initDone = true; }}

function compStratMode() {
  s.mode = "compStratMode";
  drawModeSelector("compStratMode"); }

function SpatialMode() {
  if(!(s.mode.name === "SpatialMode")) {
    initSpatialModeDisplay();
    if(!s.Spatial.initDone) {
      s.Spatial = {
        name: "SpatialMode",
        persons: [],
        groups: [],
        res: 9,
        metaphysics: false,
        nonrelScale: "exp-2",
        grid: [],
        slots: [],
        playing: false,
        personInTurn: false,
        turn: 0,
        autoBotTurn: -1, //-1 for none
        autoBotTurnDefault: 3000,
        logInfoBox: false,
        disableAutoContinueOnHumanTurn: true,
        pause: false,
        moveAttempt: false,
        simultaneousTurns: false,
        maxDebug: false,
        strategies: [],
        revertingXp: true,
        defaultInfoBox: "",
        initDone: false };
      newPerson(s.Spatial,"Rotta",true);
      //s.Spatial.persons[0].xp = makeXp(2, 2, 2, 2);
      s.Spatial.personInTurn = s.Spatial.persons[0];
      newPerson(s.Spatial,"Siiseli",true);
      newPerson(s.Spatial,"Kaniini",true);
      newPerson(s.Spatial,"Zippomiäs",true);
      newPerson(s.Spatial,"Länsigootti",true);
      createMetaphysics(s.Spatial, s.Spatial.res); //yyy
      createGrid(s.Spatial, s.Spatial.res, s.Spatial.persons);
      createStrategies(s.Spatial); }
    s.mode = s.Spatial;
    drawInfoBox(false);
    drawButton("startGame");
    drawButton("autoPlay");
    drawButton("newPerson");
    drawButton("delPerson");
    drawButton("restart");
    drawButton("devFunc");
    s.mode.initDone = true; }}
    
    
    
function Val(dyn,abs,tan,rat,nor,obj,gno,mys,sub) {  if(s.Basic.maxDebug) {console.log("VAL"); }
  this.dyn = dyn;
  this.abs = abs;
  this.tan = tan;
  this.rat = rat;
  this.nor = nor;
  this.obj = obj;
  this.gno = gno;
  this.mys = mys;
  this.sub = sub;}

function PVal(dyn,abs,tan,rat,nor,obj,gno,mys,sub) {  if(s.Basic.maxDebug) {console.log("PVAL"); } //duplicated from Val in case it ever turns out useful to sumVal values with patterns. Probably not. Can't know.
  this.dyn = dyn;
  this.abs = abs;
  this.tan = tan;
  this.rat = rat;
  this.nor = nor;
  this.obj = obj;
  this.gno = gno;
  this.mys = mys;
  this.sub = sub;}

function makeXp(left, right, up, down) { if(s.Basic.maxDebug) {console.log("MAKEXP"); }
  var output;
  output = new Val(0, up, down, right, 0, 0, left, 0, 0);
  return output;}
    
function absVal(X,Y) { if(s.Basic.maxDebug) {console.log("ABSVAL"); } // change s.Basic to s.mode and it doesn't work. it should. probably caused by init problems. call this function in a different way during init, via another function, using a dummy mode?
  if(s.Basic.relScale === "sum2") {
    if (Math.abs(X) >= Math.abs(Y)) {
      var intrinsic = Math.abs(X) + Math.abs(Y);}
    else {
      var intrinsic = -((Math.abs(X) - Math.abs(Y)) * (Math.abs(X) - Math.abs(Y)));}
    if (Math.abs(X) === 0) {
      intrinsic = -intrinsic;}    
    if (Math.abs(Y) === 0) {
      intrinsic = Math.abs(X);}}
  else if(s.Basic.relScale === "sum") {
    if (Math.abs(X) >= Math.abs(Y)) {
      var intrinsic = Math.abs(X) + Math.abs(Y);}
    else {
      var intrinsic = Math.abs(X) - Math.abs(Y);}
    if (Math.abs(X) === 0) {
      intrinsic = -intrinsic;}    
    if (Math.abs(Y) === 0) {
      intrinsic = Math.abs(X);}}
  else if(s.Basic.relScale === "intersect") {
    if (Math.abs(X) >= Math.abs(Y)) {
      var intrinsic = Math.abs(X - (X - Y));}
    else {
      var intrinsic = Math.abs(X) - Math.abs(Y);}
    if (Math.abs(X) === 0) {
      intrinsic = -intrinsic;}    
    if (Math.abs(Y) === 0) {
      intrinsic = Math.abs(X);}}
  if (s.Basic.nonrelScale === "exp") { // nonrelativized slots can be evaluated in different ways. I am not yet sure which ones are useful, if any of them are. Maybe nonrel value shouldn't be used except for speed... it should just be calculated by ai according to situation
    if ((Math.abs(X) === 0) || (Math.abs(Y) === 0)) {
      intrinsic = Math.pow(2,intrinsic); }}
  if (s.Basic.nonrelScale === "exp1") {
    if ((Math.abs(X) === 0) || (Math.abs(Y) === 0)) {
      intrinsic = Math.floor(Math.pow(2,intrinsic - 1)); }}
  if (s.Basic.nonrelScale === "exp2") {
    if ((Math.abs(X) === 0) || (Math.abs(Y) === 0)) {
      intrinsic = Math.abs(Math.floor(Math.pow(2,intrinsic - 2))); }}
  return intrinsic;}
  
function relVal(X,Y) { if(s.Basic.maxDebug) {console.log("RELVAL"); } // "Relative value", not "relativized value"
  var a = absVal(X,Y);
  var relativized; // this is "relativized" in a different sense than the way how nonrelativized slots are nonrelativized. Ie. this variable contains a value that is relativized to Four Montains, not to AMOQ. But usually, when we speak of "relativization" we mean "relativization to AMOQ".
  if    (X === 0 && Y === 0) {  //dyn
    relativized = new Val(0,0,0,0,0,0,0,0,0);}
  else if (X === 0 && Y > 0) {  //abs
    relativized = new Val(0,a,0,0,0,0,0,0,0);}
  else if (X === 0 && Y < 0) {  //tan
    relativized = new Val(0,0,a,0,0,0,0,0,0);}
  else if (X > 0 && Y === 0) {  //rat
    relativized = new Val(0,0,0,a,0,0,0,0,0);}
  else if (X > 0 && Y > 0) {  //nor
    relativized = new Val(0,0,0,0,a,0,0,0,0);}
  else if (X > 0 && Y < 0) {  //obj
    relativized = new Val(0,0,0,0,0,a,0,0,0);}
  else if (X < 0 && Y === 0) {  //gno
    relativized = new Val(0,0,0,0,0,0,a,0,0);}
  else if (X < 0 && Y > 0) {  //mys
    relativized = new Val(0,0,0,0,0,0,0,a,0);}  
  else if (X < 0 && Y < 0) {  //sub
    relativized = new Val(0,0,0,0,0,0,0,0,a);}
  return relativized;}

function devVal(X,Y) { if(s.Basic.maxDebug) {console.log("RELVAL"); } // IDEA visval would be visibility... as val object
  var a = absVal(X,Y);
  var relativized;
  if    (X === 0 && Y === 0) {  //dyn
    relativized = new Val(a,0,0,0,0,0,0,0,0);}
  else if (X === 0 && Y > 0) {  //abs
    relativized = new Val(0,Y,0,0,0,0,0,0,0);}
  else if (X === 0 && Y < 0) {  //tan
    relativized = new Val(0,0,-Y,0,0,0,0,0,0);}
  else if (X > 0 && Y === 0) {  //rat
    relativized = new Val(0,0,0,X,0,0,0,0,0);}
  else if (X > 0 && Y > 0) {  //nor
    relativized = new Val(0,Y,0,X,a,0,0,0,0);}
  else if (X > 0 && Y < 0) {  //obj
    relativized = new Val(0,0,-Y,X,0,a,0,0,0);}
  else if (X < 0 && Y === 0) {  //gno
    relativized = new Val(0,0,0,0,0,0,-X,0,0);}
  else if (X < 0 && Y > 0) {  //mys
    relativized = new Val(0,Y,0,0,0,0,-X,a,0);} 
  else if (X < 0 && Y < 0) {  //sub
    relativized = new Val(0,0,-Y,0,0,0,-X,0,a);}
  return relativized;}

function nullVal(val) {
  if((val.dyn === 0) && (val.abs === 0) && (val.tan === 0) && (val.rat === 0) && (val.nor === 0) && (val.obj === 0) && (val.gno === 0) && (val.mys === 0) && (val.sub === 0)) { return true; }
  else { return false; }}

function patTotVal(p) {
  var ret = sumVal(sumVal(p.ino, p.bio), sumVal(p.soc, p.intl));
  return ret; }

function totVal(a) { if(s.Basic.maxDebug) {console.log("TOTVAL"); }
  var ret = a.dyn + a.abs + a.rat + a.tan + a.gno + a.obj + a.nor + a.sub + a.mys;
  return ret;}

function necStaVal(val) { if(s.Basic.maxDebug) {console.log("NECSTAVAL"); } // "Necessarily static value", I guess this could as well be called "relativized value" but the abbr relVal is already taken
  var ret = val.obj + val.nor + val.sub + val.mys;
  return ret;}

function nullPat() {
  var ret = new Pattern(true, false, relVal(0,0), relVal(0,0), relVal(0,0), relVal(0,0));
  return ret; }

function sumPatArr(a,b) {
  var ret = [];
  if(a.length === b.length) {
    for (var i = 0; i < a.length; i++) {
      ret.push(sumPat(a[i],b[i])); }}
  return ret; }


function sumPat(a,b) { if(s.Basic.maxDebug) {console.log("SUMVAL"); }
  var c = new Pattern( true, false, sumVal(a.ino, b.ino), sumVal(a.bio, b.bio), sumVal(a.soc, b.soc), sumVal(a.intl, b.intl));
  return c; }
  
function sumVal(a,b) { if(s.Basic.maxDebug) {console.log("SUMVAL"); }
  var c = new Val(
    a.dyn + b.dyn,
    a.abs + b.abs,
    a.tan + b.tan,
    a.rat + b.rat,
    a.nor + b.nor,
    a.obj + b.obj,
    a.gno + b.gno,
    a.mys + b.mys,
    a.sub + b.sub);   
  return c;}

function invVal(val) {
  var ret = new Val(-val.dyn, -val.abs, -val.tan, -val.rat, -val.nor, -val.obj, -val.gno, -val.mys, -val.sub);
  return ret; }

function compareVal(hostVal,guestVal) { if(s.Basic.maxDebug) {console.log("COMPAREVAL:"); } //unused
  var dynDiff = guestVal.dyn - hostVal.dyn;
  var absDiff = guestVal.abs - hostVal.abs;
  var tanDiff = guestVal.tan - hostVal.tan;
  var ratDiff = guestVal.rat - hostVal.rat;
  var norDiff = guestVal.nor - hostVal.nor;
  var objDiff = guestVal.obj - hostVal.obj;
  var gnoDiff = guestVal.gno - hostVal.gno;
  var mysDiff = guestVal.mys - hostVal.mys;
  var subDiff = guestVal.sub - hostVal.sub;
  var valDiff = new Val(DynDiff, absDiff, tanDiff, ratDiff, norDiff, objDiff, gnoDiff, mysDiff, subDiff);
  return valDiff; }

function maxVal(val) {
  var vals = [val.dyn, val.gno, val.rat, val.abs, val.tan, val.obj, val.sub, val.nor, val.mys];
  vals = vals.sort(function(a,b) { return parseFloat(a) - parseFloat(b) } );
  return vals[0]; }



function calcDec(object) {
  var ret;
  var val = totVal(object.val);
  var antiVal = -totVal(object.antiVal);
  if ((val === 0) && (antiVal === 0)) { return NaN; }
  var ratio = Math.min(val, antiVal) / Math.max(val, antiVal);
  if (val < antiVal) { return -ratio; }
  else { return ratio; }}

function dispDec(object) {
  ret = Math.round(calcDec(object) * 100) / 100;
  return ret; }



function valForEach(val, arr) {
  var ret = [];
  for (var i = 0; i < arr.length; i++) { ret.push(val); }
  return ret; }

function longestArrInArr(arr) {
  var len = 0;
  for (var i = 0; i < arr.length; i++) {
    if (len < arr[i].length) { len = arr[i].length; }}
  return len; }

function powerSetOf(arrFull) {  if(s.Basic.maxDebug) {console.log("POWERSETOF"); }
  var ret = [], fullLen = arrFull.length, last = fullLen - 1;
  function get(arrPrefix, start, lenToFind) {
    for(lenToFind--; start < fullLen; start++)
      if(!lenToFind)
        ret.push(arrPrefix.concat([arrFull[start]]));
      else if(start < last)
        get(arrPrefix.concat([arrFull[start]]), start + 1, lenToFind); }
  for(var lenToFind = fullLen; lenToFind > 0; lenToFind--)
    get([], 0, lenToFind);
  var buffer = [];
  for(var i = 0; i < ret.length; i++) {
    if(ret[i].length > 1) {
      buffer.push(ret[i]); }}
  return buffer;}//.concat([[]]);

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true; }}
    return false; }

  

/*
02:43 <?> Death -3
02:45 <kahvi> ai TOI numero
02:46 <kahvi> se numero indikoi sitä kuinka paljon plussaa tai miinusta tohon ruutuun menemisestä seuraa menijälle
02:47 <kahvi> plussat tai miinukset rekisteröidään s.Basic.persons[i].val -kohtaan
02:47 <kahvi> mutta tämän kohdan arvo ei ole luku vaan Val-objekti
02:47 <kahvi> on vielä kirjoittamatta funktio joka summaa kaksi Val-objektia
02:47 <kahvi> se on kyllä helppo kirjoittaa, voin kirjoittaa kohta
02:47 <kahvi> Val-objektin "itseisarvo" saadaan totVal-funktiolla
02:48 <kahvi> Val-objektit ovat siis vähän kuin lukuja, mutta kun luvun merkki on vain joko +, - tai 0 (3 eri vaihtoehtoa, jotka ovat toisensa poissulkevia) niin Val-objektissa on 9 eri vaihtoehtoa jotka eivät ole toisensa poissulkevia
02:58 <kahvi> joo tossa on: http://a.moq.fi/test8.htm
02:58 <kahvi> sumVal
03:01 <kahvi> Val-objektilla on toinenkin "itseisarvo" joka saadaan absVal-funktiolla niin että absVal-funktioon syötetään X- ja Y-koordinaatit
03:01 <kahvi> totVal eroaa absVal:sta sillä tavalla että totVal:iin syötetään Val-objekti kun taas absVal:iin syötetään koordinaatit
03:06 <kahvi> s.Basic.persons[i].val -kohdan lisäksi ruutuun menemisestä seuraavat plussat tai miinukset rekisteröidään s.Basic.persons[i].bens[j] -kohtaan niin että j on pelaajan numero, jonka siirron seurauksena pelaaja nro. i päätyi tähän ruutuun.
03:06 <kahvi> i === j jos kyseessä on pelaaja joka teki siirron vuorollaan
03:07 <kahvi> "ben" on lyhenne sanasta "benefactor", hyväntekijä
03:09 <kahvi> s.Basic.persons[i].bens on array Val-objekteja
03:10 <kahvi> jotka ovat siis samassa järjestyksessä kuin s.Basic.persons -arrayn elementit, vaikka tätä ei ole kirjoitettu mihinkään eksplisiittisesti
*nyt on kirjoitettu eksplisiittisesti koska id:t lisätty
*/



function Slot(name,X,Y,color,textColor,alt) { if(s.Basic.maxDebug) {console.log("SLOT"); }
  this.name = name;
  this.X = X;
  this.Y = Y;
  this.color = color;
  this.textColor = textColor;
  this.alt = alt;
  this.absVal = absVal(X,Y);
  this.necStaVal = necStaVal(relVal(X,Y));}

function findSlotPos(grid,x,y) { if(s.Basic.maxDebug) {console.log("FINDSLOTPOS:"); }
  var a = grid[y];
  var b = a[x]; // THIS LINE generates error message ostensibly because some strategies are buggy and try to move the player to invalid slot!
  return b;}

function findSlot(X,Y) { if(s.Basic.maxDebug) {console.log("FINDSLOT:"); }
  var res = Math.floor(s.Basic.grid.length / 2);
  return findSlotPos(s.Basic.grid, X + res, res - Y);}
  
function slotAvailable(X, Y, person) { if(s.Basic.maxDebug) {console.log("SLOTAVAILABLE:"); }
  var maxX = person.xp.rat;
  var minX = -person.xp.gno;
  var maxY = person.xp.abs;
  var minY = -person.xp.tan;
  if ((X === person.X) && (Y === person.Y)) { return false; }
  else if (!(X > maxX) && !(X < minX) && !(Y > maxY) && !(Y < minY)) { return true; }
  else { return false; }}

function makeSlotGrid(slots) { if(s.Basic.maxDebug) {console.log("MAKESLOTGRID:"); }
  var res = Math.sqrt(slots.length);
  var grid = [];
  var buffer;
  slots = slots.sort(function(a,b) { return parseFloat(b.Y) - parseFloat(a.Y) } );
  for (var i = 0; i < slots.length; i = i + res) {
    buffer = slots.slice(i, i + res);
    buffer = buffer.sort(function(a,b) { return parseFloat(a.X) - parseFloat(b.X) } );
    grid.push(buffer);}
  return grid;}



function attemptMove(X, Y) { if(s.Basic.maxDebug) {console.log("ATTEMPTMOVE"); }
  if (s.Basic.pause === false) {
    clearInterval(s.Basic.moveAttempt);
    move (X, Y); }}

function moveHover(X, Y) { if(s.Basic.maxDebug) {console.log("MOVEHOVER"); }
  var calcs = { persons : calcPersons(X, Y), groups : [], strategies : [] };
  calcs.groups = calcGroups(X, Y, calcs.persons);
  //calcs.strategies = calcStrategies(X, Y, calcs.persons, calcs.groups);
  drawGrid(s.Basic.grid, s.Basic.persons, s.Basic.personInTurn);
  updatePersonList(calcs.persons, true);
  updateGroupList(calcs.groups, true); }

function move(X, Y) { if(s.Basic.maxDebug) {console.log("MOVE"); }
  s.Basic.turn++;
  if ((X === false) && (Y === false)) { // these params are false if current player is bot
    var botMove = ai(s.Basic.personInTurn);
    X = botMove.X;
    Y = botMove.Y;}
  var calcs = { persons : calcPersons(X, Y), groups : [], strats : [] };
  calcs.groups = calcGroups(X, Y, calcs.persons);
  calcs.strats = calcStrategies(X, Y, calcs.persons, calcs.groups); //
  makeMove(X, Y, calcs.persons, calcs.groups, calcs.strats);
  changeTurn(calcs); }

function makeMove(X, Y, personsDiff, groupsDiff, stratsDiff) { if(s.Basic.maxDebug) {console.log("MAKEMOVE"); }
  s.mode.latestX = X;
  s.mode.latestY = Y;
  s.mode.latestPersonsDiff = personsDiff;
  s.mode.latestGroupsDiff = groupsDiff;
  var consoleOutput = [];
  var buffer;
  for (var i = 0; i < s.Basic.persons.length; i++) {
    s.Basic.persons[i].X = personsDiff[i].X;
    s.Basic.persons[i].Y = personsDiff[i].Y;
    s.Basic.persons[i].visX = personsDiff[i].visX;
    s.Basic.persons[i].visY = personsDiff[i].visY;
    s.Basic.persons[i].val = sumVal(s.Basic.persons[i].val, personsDiff[i].val);
    s.Basic.persons[i].antiVal = sumVal(s.Basic.persons[i].antiVal, personsDiff[i].antiVal);
    s.Basic.persons[i].xp = sumVal(s.Basic.persons[i].xp, personsDiff[i].xp);
    s.Basic.persons[i].preventXpChange = personsDiff[i].preventXpChange;
    buffer = [];
    for (var j = 0; j < s.Basic.persons.length; j++) {
      buffer.push(sumVal(s.Basic.persons[i].bens[j],personsDiff[i].bens[j])); }
    s.Basic.persons[i].bens = buffer; }
  
  for (var i = 0; i < s.Basic.groups.length; i++) {
    s.Basic.groups[i].val = sumVal(s.Basic.groups[i].val, groupsDiff[i].val);
    s.Basic.groups[i].antiVal = sumVal(s.Basic.groups[i].antiVal, groupsDiff[i].antiVal);
    s.Basic.groups[i].bens = sumBens(s.Basic.groups[i].bens, groupsDiff[i].bens); }

  //console.log("STRATSDIFF:");

  for (var i = 0; i < s.Basic.strategies.length; i++) {
    s.Basic.strategies[i].val = sumPat(s.Basic.strategies[i].val, stratsDiff.vals[i]);
    for (var j = 0; j < s.Basic.persons.length; j++) {
      s.Basic.strategies[i].perVals[j] = sumPatArr(s.Basic.strategies[i].perVals[j], stratsDiff.perVals[i]); }}
      //ööö
  if (s.Basic.outputToConsole === 1) {
    s.Basic.persons.map(function(person){console.log({ id : person.id, X : person.X, Y : person.Y })}); }}
    
    /*console.log(s.Basic.strategies[i].val);
    console.log(stratsDiff[i]);*/
    //console.log("MAKEMOVE:");
    //console.log("s.Basic.strategies[i].val:");
    //console.log(s.Basic.strategies[i].val);
    //console.log("stratsDiff[i]:");
    //console.log(stratsDiff[i]);
    
    //console.log("s.Basic.strategies[i].val (after):");
    /*console.log(s.Basic.strategies[i].val); */
  

  //console.log(stratsDiff);
  //for(var i = 0; i < stratsDiff.length; i++) {

  //  console.log(stratsDiff[i]); }
  //for (var i = 0; i < s.Basic.strategies.length; i++ ) {
    //s.Basic.strategies[i].vals = sumValArr(s.Basic.strategies[i].vals, stratsDiff[i].vals); }



function outputPersonToConsole(person) {
  return ("moi"); }
  //return { id : person.id, X : person.X, Y : person.Y }; }

function devStates() { if(s.Basic.maxDebug) {console.log("DEVSTATES:"); }
  console.log("Pause: " + s.Basic.pause);}

function changeTurn(calcs) { if(s.Basic.maxDebug) {console.log("CHANGETURN"); }
  s.Basic.personInTurn = nextPerson(s.Basic.personInTurn);
  drawGrid(s.Basic.grid, s.Basic.persons, s.Basic.personInTurn);
  updatePersonList(calcs.persons, false);
  updateGroupList(calcs.groups, false);
  $( "#stratTable" ).empty();
  drawStratList(false); //yzx
  var next = nextPerson(s.Basic.personInTurn);
  reportTurn();
  updateStartButton(); }

function updateStartButton() {
  if(s.Basic.autoBotTurn >= 0) {
    if(!s.Basic.pause) {
      if (s.Basic.personInTurn.bot) {
        updateButton("startGame", "Pause (Enter)");
        s.Basic.moveAttempt = setInterval(function() { attemptMove(false, false); }, s.Basic.autoBotTurn); }
      else if (s.Basic.personInTurn.hybrid) {
        updateButton("startGame", "Continue (Enter)");
        s.Basic.moveAttempt = setInterval(function() { attemptMove(false, false); }, s.Basic.autoBotTurn); }
      else {
        clearInterval(s.Basic.moveAttempt);
        updateButton("startGame", "<span style='color:#888'>Disabled</span>");}}
    else { //pause is on
      clearInterval(s.Basic.moveAttempt);
      if(s.Basic.personInTurn.bot || s.Basic.personInTurn.hybrid) {
        updateButton("startGame", "Continue (Enter)");}
      else { //no reason to pause on human turn
        s.Basic.pause = false;}}}
  else {
    if((!s.Basic.personInTurn.bot) && (!s.Basic.personInTurn.hybrid)) {
      updateButton("startGame", "<span style='color:#888'>Disabled</span>");}
    else {
      updateButton("startGame", "Continue (Enter)");}}}



function startButtonLabel() {  if(s.Basic.maxDebug) {console.log("STARTBUTTONLABEL"); }
  if((s.Basic.playing === true) && (s.Basic.autoBotTurn === -1) && (s.Basic.personInTurn.bot === true)) {
    return "Continue (Enter)";}
  else if((s.Basic.playing === true) && (s.Basic.autoBotTurn >= 0) && (s.Basic.personInTurn.bot === true)) {
    return "Pause (Enter)";}
  else if(s.Basic.playing === false) {
    return "Start (Enter)";}}

function updateButton(id, buttonText) { if(s.Basic.maxDebug) {console.log("UPDATEBUTTON"); }
  $( "#" + id ).empty();
  $( "#" + id).append("<div onmouseover='" + id + "Hover();' onmouseout='defaultHover();' onclick='" + id + "();' class='amoqButton'>" + buttonText + "</div>"); }



function newPerson(mode, name, isBot, isHybrid) { if(s.Basic.maxDebug) {console.log("NEWPERSON"); }
  // UI SNIPPET:
  if(!((typeof mode) === "object")) {
    var mode = s.mode; }
  var hidden = false;
  var fill = 0;
  if (!(((typeof name) === "string") && ((typeof isBot) === "boolean") && ((typeof isHybrid) === "boolean"))) {
    hidden = true;} // hidden should be "not hidden"? it means "hidden from the coder"
  var cancel = false;
  if (hidden) {
    var name = prompt("Name","");
    if (!name) { cancel = true; }}
  if (hidden && (!(cancel))) {
    var isBot = confirm("Click OK for bot, Cancel for human.");
    var isHybrid = confirm("Click OK for hybrid.\nHybrid bots can be moved by user and hybrid humans can be automoved."); }
  if (!cancel) {
  // ACTUAL FUNCTION:
    var oldGroups = copyGroups(mode.groups); // copy old group data
    mode.persons.push(new Person(name, isBot, isHybrid, mode.persons.length)); // push person to mode array
    for (var i = 0; i < mode.persons.length; i++) { // append 1 element to bens of each person
      fill = mode.persons.length - mode.persons[i].bens.length;
      for (var j = 0; j < fill; j++) {
        mode.persons[i].bens.push(relVal(0,0));}}
    addGroups(mode, oldGroups, mode.persons); // makes new groups
    personIntoPattern(mode.persons[mode.persons.length - 1]); // creates a body for the person
    if(hidden) { 
      //mode.latestPersonsDiff.push(mode.persons[mode.persons.length -1]);
      //mode.latestPersonsDiff.push(new Person(name, isBot, mode.persons.length - 1));
      if(mode.playing) {
        drawGrid(mode.grid, mode.persons, mode.personInTurn); }
      else {
        drawGrid(mode.grid, mode.persons, false); }}
    if(mode.randomizeIntl === 1) {
      console.log("moi"); }
    if(s.initDone) {
      var calcs = { persons : calcPersons(mode.latestX, mode.latestY), groups : [] };
      calcs.groups = calcGroups(mode.latestX, mode.latestY, calcs.persons);
      s.mode.latestPersonsDiff = calcs.persons;
      s.mode.latestGroupsDiff = calcs.groups;
      $( "#personTable" ).empty();
      drawPersonList(false);
      $( "#patternTable" ).empty();
      drawPatternList(false);
      $( "#groupTable" ).empty();
      drawGroupList(false);
      $( "#stratTable" ).empty();
      drawStratList(false); }}}

function delPerson() { if(s.Basic.maxDebug) {console.log("DELPERSON"); }
  var mode = s.mode;
  var id = parseInt(prompt("Delete person by id:",""));
  var delArr = [];
  var delArrCopy;
  if((id > -1) && (id < mode.persons.length)) {
    if(mode.personInTurn.id === id) { // if delete person in turn
      mode.personInTurn = nextPerson(mode.personInTurn);
      var turn = 1 + mode.turn;
      var message = (turn + ". " + mode.personInTurn.name + "'s turn"); 
      setDefaultInfoBox(mode, message);
      updateStartButton(); }
    mode.persons.splice(id, 1); // remove person from persons array
    for(var i = 0; i < mode.persons.length; i++) { // remove person ben value from each person bens array
      mode.persons[i].bens.splice(id, 1); }
    for(var i = 0; i < mode.groups.length; i++) {
      if(contains(mode.groups[i].ids, id)) {
        mode.groups.splice(i, 1);
        delArr.push(true);
        i--; }
      else{
        delArr.push(false); }}    
    for(var i = 0; i < mode.groups.length; i++) {
      for(var j = 0; j < mode.groups[i].bens.length; j++) {
        if(delArr[j]) {
          mode.groups[i].bens[j] = false; }}}         
    for(var i = 0; i < mode.groups.length; i++) {
      for(var j = 0; j < mode.groups[i].bens.length; j++) {
        if(!(mode.groups[i].bens[j])) {
          mode.groups[i].bens.splice(j, 1);
          j--; }}}          
    for(var i = id; i < mode.persons.length; i++) {
      mode.persons[i].id--; }     
    for(var i = 0; i < mode.groups.length; i++) {
      for(var j = 0; j < mode.groups[i].persons.length; j++) {
        if(mode.groups[i].persons[j].id > id) {
          mode.groups[i].persons[j].id--;
          mode.groups[i].ids[j]--; }}}
    //console.log(mode.personInTurn);
    if((!(mode.pause)) || ((mode.pause) && (mode.autoBotTurn >= 0))) {
      drawGrid(mode.grid, mode.persons, mode.personInTurn); }
    else {
      drawGrid(mode.grid, mode.persons, false); }
    if(s.initDone) {
      var calcs = { persons : calcPersons(mode.latestX, mode.latestY), groups : [] };
      calcs.groups = calcGroups(mode.latestX, mode.latestY, calcs.persons);
      s.mode.latestPersonsDiff = calcs.persons;
      s.mode.latestGroupsDiff = calcs.groups;
      $( "#personTable" ).empty();
      drawPersonList(false);
      $( "#groupTable" ).empty();
      drawGroupList(false);
      $( "#stratTable" ).empty();
      drawStratList(false); }}}

function startGame() {  if(s.Basic.maxDebug) {console.log("STARTGAME"); } // has unverified modifications
  var next = nextPerson(s.Basic.personInTurn);  
  if(s.Basic.playing && (s.Basic.autoBotTurn === -1) && (s.Basic.personInTurn.bot || s.Basic.personInTurn.hybrid)) {
    s.Basic.pause = false;
    move(false, false); }   
  else if(s.Basic.playing && (s.Basic.autoBotTurn >= 0) && (s.Basic.personInTurn.bot || s.Basic.personInTurn.hybrid) && s.Basic.pause) {
    s.Basic.pause = false;
    move(false, false); }   
  else if (s.Basic.playing && (s.Basic.autoBotTurn >= 0) && (s.Basic.personInTurn.bot) && s.Basic.pause) {
    s.Basic.pause = true;
    clearInterval(s.Basic.moveAttempt);
    updateButton("startGame", "Continue (Enter)"); }
  else if (s.Basic.playing && (s.Basic.autoBotTurn >= 0) && (s.Basic.personInTurn.hybrid) && (!s.Basic.pause)) {
    attemptMove(false, false); } //zyyy
  else if(s.Basic.playing && s.Basic.disableAutoContinueOnHumanTurn && ((!s.Basic.personInTurn.bot) && (!s.Basic.personInTurn.hybrid))) {
    drawInfoBox("This feature has been disabled in order to prevent a non-hybrid human from accidentally skipping his or her turn."); }
  else if(s.Basic.playing === false) { // has untested mods
    // var starter = prompt("Starting player id:",(getNumberOfPerson(s.Basic.personInTurn)));
    var starter = 0;
    if ((starter >= 0) && (starter < s.Basic.persons.length)) {
      s.Basic.playing = true;
      if (s.Basic.autoBotTurn === -1) {
        updateButton("startGame", "Play (Enter)"); }
      reportTurn();
      s.Basic.personInTurn = s.Basic.persons[starter];
      if (s.Basic.personInTurn.bot || (s.Basic.personInTurn.hybrid && (s.Basic.autoBotTurn === -1))) { move(false, false); }
      else {
        updateButton("startGame", "<span style='color:#888'>Disabled</span>");
        drawGrid(s.Basic.grid, s.Basic.persons, s.Basic.personInTurn);}}}}
    
function debugVal(val) {  if(s.Basic.maxDebug) {console.log("DEBUGVAL"); }
  var a = "obj: " + val.obj + ", sub: " + val.sub + ", nor: " + val.nor + ", mys: " + val.mys;
  return a;}
        
function devFunc() { if(s.Basic.maxDebug) {console.log("DEVFUNC"); }
  console.log("Not in use."); }

function autoPlay() {
  if (s.Basic.autoBotTurn >= 0) {
    if((s.Basic.personInTurn.bot || s.Basic.personInTurn.hybrid) && s.Basic.playing) {
      s.Basic.turn = s.Basic.turn--;
      clearInterval(s.Basic.moveAttempt); }
    s.Basic.autoBotTurn = -2;
    updateButton("autoPlay", "Autoplay: Off");
    if ((s.Basic.personInTurn.bot || s.Basic.personInTurn.hybrid) && s.Basic.playing) {
      updateButton("startGame", "Continue (Enter)"); }}
  if (s.Basic.autoBotTurn === -1) {
    var speed = parseInt(prompt("Delay between bot turns in milliseconds:",s.Basic.autoBotTurnDefault));
    if ( speed >= 0 ) {
      s.Basic.autoBotTurn = speed;
      s.Basic.autoBotTurnDefault = speed;
      updateButton("autoPlay", "Autoplay: On"); }
      if((!s.Basic.pause) && s.Basic.playing && (s.Basic.personInTurn.bot || s.Basic.personInTurn.hybrid)) {
        startGame();
        startGame();}}
  if (s.Basic.autoBotTurn === -2) { s.Basic.autoBotTurn = -1 }}
  
function restart() {
  s.initDone = false;
  s.mode.initDone = false;
  init(); }



// ================
// ENGINE STUFF END
// ================



// ==============
// UI STUFF BEGIN
// ==============



window.addEventListener("keydown", checkKeyPressed, false);
function checkKeyPressed(e) { if(s.Basic.maxDebug) {console.log("CHECKKEYPRESSED"); }
    if (e.keyCode == "13") {
        startGame();}}



function DIds (symbols, numeric, startFrom, font) {
  this.symbols = createSymbols(symbols);
  this.name = symbols;
  this.numeric = numeric;
  if (startFrom) { this.startFrom = startFrom; }
  else { this.startFrom = 0; }
  if (font) { this.font = font; }
  else { this.font = s.mode.defaultFont; }}

function dId ( id, arr, dIds ) {
  if (!(typeof dIds === "object")) { return id; } //yxy
  else {
    var ret = "";
    var loops = Math.floor((id + dIds.startFrom) / dIds.symbols.length );
    if (loops === 0) { ret = dIds.symbols[id + dIds.startFrom ]; }
    else if (dIds.numeric) {
      for (var i = 0; i <= loops; i++) {
        if (i === loops) { ret = dIds.symbols[ (id + dIds.startFrom) ]; }
        else {
          for (var j = 0; j < loops; j++) {
            ret = dIds.arr[(id + dIds.startFrom) % dIds.symbols.length] + ret; }}}}
    else if (!dIds.numeric) {
      loops = Math.floor( id / (loops * loops));
      for (var i = 0; i <= loops; i++ ) {
        if (i === loops) { ret = dIds.symbols[ (id + dIds.startFrom) ]; }
        else {
          for (var j = 0; j < loops; j++) {
            ret = dIds.arr[(id + dIds.startFrom) % dIds.symbols.length] + ret; }}}}
    //console.log(ret);
    return ret; }}

function arrToUpperCase(arr) {
  var ret = [];
  for (var i = 0; i < arr.length; i++) { ret.push(arr[i].toUpperCase()); }
  return ret; }

function createSymbols (dIds) {
  var ret = [];
  var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
  switch(dIds) {
    case ( "num" || "numAlph" || "numALPH" || "numAlphALPH" ) : ret = ["0","1","2","3","4","5","6","7","8","9"];
    case "numAlph" : ret = ret.concat(alphabet); break;
    case "numALPH" : ret = ret.concat(arrToUpperCase(alphabet)); break;
    case ( "alph" || "alphALPH" || "numAlphALPH" ) : ret = ret.concat( alphabet );
    case ( "alphALPH" || "numAlphALPH" ) : ret = ret.concat(arrToUpperCase(ret)); break;
    case "ALPH" : ret = arrToUpperCase(alphabet); break;
    case "hex" : ret = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"]; break; 
    case "tone" : ret = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]; break;
    case "sl" : ret = [ "Ces", "Ges", "Des", "As", "Es", "B", "F", "C", "G", "D", "A", "E", "H", "Fis", "Cis", "as", "es", "b", "f", "c", "g", "d", "a", "e", "h", "fis", "cis", "gis", "dis", "ais" ]; break; }
  //console.log(ret);
  return ret; }


    
function setDefaultInfoBox(mode, message) { mode.defaultInfoBox = message; }
function drawInfoBox(text) {  if(s.Basic.maxDebug) {console.log("DRAWINFOBOX"); }
  if (text === false) { // text === false upon init
    if (s.Basic.logInfoBox === true) {
      text = "Any message displayed here is also written in the console. You can access the console by F12.";}
    else {
      text = "Welcome";}}
  //$( "#infoBox" ).empty();
  //$( "#infoBox" ).append("<div id='infoBoxText'>" + text + "</div>");
  var box = document.getElementById("infoBox");
  box.innerHTML = "<div id='infoBoxText'>" + text + "</div>";
  if(s.Basic.logInfoBox === true) {
    console.log(text);}}

function reportTurn() { if(s.Basic.maxDebug) {console.log("REPORTTURN"); }
  var turn = 1 + s.Basic.turn;
  var message = (turn + ". " + s.Basic.personInTurn.name + "'s turn");
  setDefaultInfoBox(s.mode, message);
  drawInfoBox(message); }



function defaultHover() {
  s.mode.slotHover = false;
  drawInfoBox(s.mode.defaultInfoBox);
  updatePersonList(s.mode.latestPersonsDiff, false);
  updateGroupList(s.mode.latestGroupsDiff, false); }

function bensHover(id1, id2) {
  drawInfoBox(s.Basic.persons[id2].name + " (" + id2 + ") has treated " + s.Basic.persons[id1].name + " (" + id1 + ") with a decency of " + dispValDecency(s.Basic.persons[id1].bens[id2]) + " and value of " + necStaVal(s.Basic.persons[id1].bens[id2]) + " by giving " + s.Basic.persons[id1].bens[id2].obj + " &diams;, " + s.Basic.persons[id1].bens[id2].sub + " &hearts;, " + s.Basic.persons[id1].bens[id2].nor + " &spades;, " + s.Basic.persons[id1].bens[id2].mys + " &clubs; composed of " + s.Basic.persons[id1].bens[id2].gno + " gno, " + s.Basic.persons[id1].bens[id2].rat + " rat, " + s.Basic.persons[id1].bens[id2].abs + " abs, " + s.Basic.persons[id1].bens[id2].tan + " tan"); }
  
function groupBensHover(id1, id2) { //group.ids is person id array, but these id are number in list... so far
  //console.log(id1 + " " + id2); }
  dispIds1 = drawIds(s.Basic.groups[id1]);
  dispIds2 = drawIds(s.Basic.groups[id2]);
  drawInfoBox("The group of " + dispIds2 + " has treated the group of " + dispIds1 + " with a decency of " + dispValDecency(s.Basic.groups[id1].bens[id2]) + " and value of " + necStaVal(s.Basic.groups[id1].bens[id2]) + " by giving " + s.Basic.groups[id1].bens[id2].obj + " &diams;, " + s.Basic.groups[id1].bens[id2].sub + " &hearts;, " + s.Basic.groups[id1].bens[id2].nor + " &spades;, " + s.Basic.groups[id1].bens[id2].mys + " &clubs; composed of " + s.Basic.groups[id1].bens[id2].gno + " gno, " + s.Basic.groups[id1].bens[id2].rat + " rat, " + s.Basic.groups[id1].bens[id2].abs + " abs, " + s.Basic.groups[id1].bens[id2].tan + " tan"); }

function startGameHover() { drawInfoBox("(Hotkey: Enter) This button starts the game! It also works as Pause and Continue.");}
function newPersonHover() { drawInfoBox("Click here to create a new person, either bot or human.."); }
function delPersonHover() { drawInfoBox("Deletes a person."); }
function autoPlayHover() { drawInfoBox("When Autoplay is on bots play their turn automatically, otherwise you have to press enter each time. You can also adjust the interval between bot turns."); }
function restartHover() { drawInfoBox("Starts a new game and erases the old one."); }
function BasicModeHover() { drawInfoBox("Basic mode illustrates the workings of Four Mountains."); }
function compStratModeHover() { drawInfoBox("compStrat is a statistical comparison tool for strategic analysis."); }
function SpatialModeHover() { drawInfoBox("Spatial mode illustrates how Four Mountains can be applied in artificial intelligence."); }
function NonHybridBotHover() { drawInfoBox("Non-hybrid bots cannot be moved by user."); }
function HybridBotHover() { drawInfoBox("Hybrid bots can be moved by user."); }
function HybridHumanHover() { drawInfoBox("Hybrid humans can be moved automatically."); }
function NonHybridHumanHover() { drawInfoBox("Non-hybrid humans cannot be moved automatically."); }

function Level(name,X,Y,rank) { if(s.Basic.maxDebug) {console.log("LEVEL"); }
  this.name = name;
  this.X = X;
  this.Y = Y;
  this.rank = rank; }
  
function Cluster(name,Y,number) { if(s.Basic.maxDebug) {console.log("CLUSTER"); }
  this.name = name;
  this.Y = Y;
  this.number = number; }

function describeDecency(slot) {
  var ret = "";
  if (Math.abs(slot.X) === Math.abs(slot.Y)) { ret = "excellent" }
  else if (Math.abs(slot.X) < Math.abs(slot.Y)) { ret = "bad" }
  else if (Math.abs(slot.X) > Math.abs(slot.Y)) { ret = "decent" }
  return ret; }

function getClusterName(slot, metaphysics) {
  var halfRes = metaphysics.nor.length - 1;
  var ret;
  if (slot.X > 0) {
    if (slot.Y > 0) { ret = metaphysics.abs[slot.Y - 1] }
    else if (slot.Y < 0) { ret = metaphysics.tan[-(slot.Y + 1)] }}
  else if (slot.X < 0) {
    if (slot.Y > 0) { ret = metaphysics.abs[halfRes - (slot.Y - 1)] }
    else if (slot.Y < 0) { ret = metaphysics.tan[halfRes + (slot.Y + 1)] }}
  return ret.name; }
  
function getLevelName(slot, metaphysics) {
  var ret;
  var lev = Math.min(Math.abs(slot.X), Math.abs(slot.Y)) - 1;
  if (slot.X > 0) {
    if(slot.Y > 0) { ret = metaphysics.nor[lev] }
    else if(slot.Y < 0) { ret = metaphysics.obj[lev] }}
  else if (slot.X < 0) {
    if(slot.Y > 0) { ret = metaphysics.mys[lev] }
    else if(slot.Y < 0) { ret = metaphysics.sub[lev] }}
  return ret.name; }

function getPotentialSlot(slot) {
  var ret = false;
  if (!(Math.abs(slot.X) === Math.abs(slot.Y))) {
    if (slot.X > 0) { 
      if (slot.Y > 0) { ret = findSlot(slot.X, slot.X) }
      else if (slot.Y < 0) { ret = findSlot(slot.X, -(slot.X)) }}
    else if (slot.X < 0) {
      if (slot.Y > 0) { ret = findSlot(slot.X, -(slot.X)) }
      else if (slot.Y < 0) { ret = findSlot (slot.X, slot.X) }}}
  return ret; }

function getSlotSymbol(slot) {
  var ret;
  if (slot.X < 0) {
    if (slot.Y < 0) { ret = "&hearts;" }
    else if (slot.Y > 0) { ret = "&clubs;" }}
  else if (slot.X > 0) {
    if (slot.Y < 0) { ret = "&diams;" }
    else if (slot.Y > 0) { ret = "&spades;" }}
  return ret; }

function describeStrategy(id) {
  id = parseInt(id);
  drawInfoBox(s.mode.strategies[id].desc); }
  
function describeQuality(id) {
  switch (id) {
  case 0 :
    drawInfoBox("&diams; <em>Objective quality</em> is rational, tangible and external. It corresponds with Sensing, Pentacles, the element Earth and \"I'm Not OK, You're OK\"."); break;
  case 1 :
    drawInfoBox("&hearts; <em>Subjective quality</em> is gnostic (aka. associative), tangible and internal. It corresponds with Feeling, Cups, the element Water and \"I'm Not OK, You're Not OK\"."); break;
  case 2 :
    drawInfoBox("&spades; <em>Normative quality</em> is rational, abstract and internal. It corresponds with Thinking, Swords, the element Air and \"I'm OK, You're Not OK\"."); break;
  case 3 :
    drawInfoBox("&clubs; <em>Mystical quality</em> is gnostic (aka. associative), abstract and external. It corresponds with Intuition, Staves, the element Fire and \"I'm OK, You're OK\"."); break;
  case 4 :
    drawInfoBox("The total <em>static value</em> of each person."); break;
  case 5 :
    drawInfoBox("Personal <em>decency</em> refers to how much more relativized <em>classical</em> (aka. potential) than <em>romantic</em> (aka. actual) quality is inherent to someone. Decency of 0 is <em>excellence</em> but negative decency is <em>badness</em>."); break;
  case 6 :
    drawInfoBox("<em>Gnostic</em> (aka. associative) personal authority is a form of epistemological (aka. knowledge-related) authority."); break;
  case 7 :
    drawInfoBox("<em>Rational</em> personal authority is a form of epistemological (aka. knowledge-related) authority."); break;
  case 8 :
    drawInfoBox("<em>Abstract</em> personal authority is a form of ontological (aka. existential) authority."); break;
  case 9 :
    drawInfoBox("<em>Tangible</em> personal authority is a form of ontological (aka. existential) authority."); break;}}

function describeSlot(slot, metaphysics) {
  var slotName = slot.name;
  //console.log(slot.X + "," + slot.Y + "," + slotName);
  if ((slot.X < 0) && (slot.Y === 0)) { drawInfoBox("<em>" + slotName + "</em> is a nonrelativized gnostic slot."); }
  else if ((slot.X > 0) && (slot.Y === 0)) { drawInfoBox("<em>" + slotName + "</em> is a nonrelativized rational slot."); }
  else if (slot.X === 0) {
    if (slot.Y < 0) { drawInfoBox("<em>" + slotName + "</em> is a nonrelativized tangible slot."); }
    else if (slot.Y > 0) { drawInfoBox("<em>" + slotName + "</em> is a nonrelativized abstract slot."); }
    else if (slot.Y === 0) { drawInfoBox("<em>" + slotName + "</em> is the name of the origin of this Cartesian coordinate system."); }}
  else {
    var slotSymbol = getSlotSymbol(slot);
    var dec = describeDecency(slot);
    var cluster = getClusterName(slot, metaphysics);
    var level = getLevelName(slot, metaphysics);
    var potential = getPotentialSlot(slot);
    if (slot.alt) { slotName = slotName + "</em> (aka. \"" + slot.alt + "\")<em>"; }
    if (potential) {
      var potentialName = potential.name;
      if (potential.alt) { potentialName = potential.name + "</em> (aka. \"" + potential.alt + "\")<em>"; }
      drawInfoBox(slotSymbol + " <em>" + slotName + "</em> is a " + dec + " slot that is romantically/actually " + cluster + ", classically " + level + " and potentially <em>" + potentialName + "</em>."); }
    else {
      drawInfoBox(slotSymbol + " <em>" + slotName + "</em> is an " + dec + " slot that is romantically " + cluster + " and classically " + level + "."); }}}

function createMetaphysics(mode, res) {
  var metaphysics = { nor : [], obj : [], mys : [], sub : [], tan : [], abs : [] };
  switch(res) {
  case 9 :
    var r9l1nor = new Level("Syntactic", 1, 1, 1);
    var r9l2nor = new Level("Semantic", 1, 1, 2);
    var r9l3nor = new Level("Metatheoretic", 1, 1, 3);
    var r9l4nor = new Level("Analogic", 1, 1, 4);
    
    var r9l1obj = new Level("Inorganic", 1, -1, 1);
    var r9l2obj = new Level("Biological", 1, -1, 2);
    var r9l3obj = new Level("Social", 1, -1, 3);
    var r9l4obj = new Level("Intellectual", 1, -1, 4);
    
    var r9l1mys = new Level("Coincidental", -1, 1, 1);
    var r9l2mys = new Level("Cultural", -1, 1, 2);
    var r9l3mys = new Level("Freedom", -1, 1, 3);
    var r9l4mys = new Level("Aesthetic", -1, 1, 4);
    
    var r9l1sub = new Level("Believing", -1, -1, 1);
    var r9l2sub = new Level("Considering", -1, -1, 2);
    var r9l3sub = new Level("Visionary", -1, -1, 3);
    var r9l4sub = new Level("Euphoric", -1, -1, 4);
    
    var r9c1abs = new Cluster("Harmony", 1, 1);
    var r9c2abs = new Cluster("Significance", 1, 2);
    var r9c3abs = new Cluster("Awareness", 1, 3);
    var r9c4abs = new Cluster("Unity", 1, 4);
    
    var r9c1tan = new Cluster("Sense-data", -1, 1);
    var r9c2tan = new Cluster("Lower Needs", -1, 2);
    var r9c3tan = new Cluster("Higher Needs", -1, 3);
    var r9c4tan = new Cluster("Deliberation", -1, 4);
    
    metaphysics.nor = [r9l1nor, r9l2nor, r9l3nor, r9l4nor];
    metaphysics.obj = [r9l1obj, r9l2obj, r9l3obj, r9l4obj];
    metaphysics.mys = [r9l1mys, r9l2mys, r9l3mys, r9l4mys];
    metaphysics.sub = [r9l1sub, r9l2sub, r9l3sub, r9l4sub];
    metaphysics.abs = [r9c1abs, r9c2abs, r9c3abs, r9c4abs];
    metaphysics.tan = [r9c1tan, r9c2tan, r9c3tan, r9c4tan];
    break;
    
  default :
    console.log("createMetaphysics does not support this resolution."); }
    
  mode.metaphysics = metaphysics; }
  
  

function drawPersons(slot, persons) { if(s.Basic.maxDebug) {console.log("DRAWPERSONS"); }
  var population = [];
  for (var i = 0; i < persons.length; i++) {
    if(slot.X === persons[i].X && slot.Y === persons[i].Y) {
      population = population + "<div style='background-color: #" + slot.textColor + "; display: inline; color: #" + slot.color + "; padding: 1px 2px; font-size: 11px; margin-right: 2px; margin-top: -2px;'><strong>" + /*dId(*/ i /*, s.mode.persons, s.mode.personsDIds )*/ + "</strong></div>";}}
  if(population.length === 0) {
    population = "&nbsp;"; }
  return population;} //popxxxx

function fadeUnavailableSlot(slot) { if(s.Basic.maxDebug) {console.log("FADEUNAVAILABLESLOT"); }
  var hex = ("#" + slot.color);
  var r = hexToRgb(hex).r;
  var g = hexToRgb(hex).g;
  var b = hexToRgb(hex).b;
  var avg = Math.floor((r + b + g) / 3);
  hex = rgbToHex(avg, avg, avg);
  return hex;}

function slotHover(X, Y) {
  var slot = findSlot(X, Y);
  s.mode.slotHover = slot;
  describeSlot(slot, s.Basic.metaphysics);
  if ((s.mode.playing) && slotAvailable(X, Y, s.mode.personInTurn )) { moveHover(X, Y); }
  else {updatePersonList(s.mode.latestPersonsDiff,false); }}

function slotClick(X,Y) { if(s.Basic.maxDebug) {console.log("SLOTCLICK"); }
  var available = slotAvailable(X, Y, s.Basic.personInTurn);
  if(s.Basic.autoBotTurn === -1) {
    if((s.Basic.playing === true) && ((!s.Basic.personInTurn.bot) || s.Basic.personInTurn.hybrid) && (available === true)) {
      move(X,Y);}}
  else if((s.Basic.playing === true) && ((!s.Basic.personInTurn.bot) || s.Basic.personInTurn.hybrid) && (available === true)) {
      attemptMove(X,Y);}}

function hexToRgb(hex) {  if(s.Basic.maxDebug) {console.log("HEXTORGB"); }
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b; });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16) } : null; }

function rgbToHex(r, g, b) { if(s.Basic.maxDebug) {console.log("RGBTOHEX"); }
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); }

function melodySlotNameSeq(X, Y) {
  var seq = "";
  if (X === Y) {
    for (var i = 0; i < Math.abs(Y); i++ ) { seq = seq + (i + 1); }}
  else {
    var diff = Math.abs(X - Y);
    if (diff === 0) { seq = Math.abs(X); }
    if (diff > 1)   { seq = "[" + diff + "]"; }}
  return seq; }

// mark overflow in slot population by coloring bg of id with slot color in personslist
// outline etc departure slot and destination slot, outlining also moving player in destination slot

function melodySlotName(X, Y) {
  var name = "";
  if ((X === 0) && (Y === 0)) { name = "silence"; }
  else if (Y === 0)     { name = name + Y; }
  else            { name = "0"; }
  if (0 < X)          { name = name + noteSlotNameSeq(X, Y); }
  else if (0 > X)       { name = noteSlotNameSeq(X, Y) + name; }
  return name; }

function createMelodySlots() {
  var ret = [];
  for (X = 0; X < 7; X++ ) {
    for (Y = 0; Y < 7; Y++ ) {
      ret.push(new Slot(noteSlotName(X, Y), X, Y)); }}}

function createGrid(mode, res, persons) { if(s.Basic.maxDebug) {console.log("CREATEGRID"); }
  switch(res) {
  case 5 :
    var r5x0y0 = new Slot("Nothing",   0,  0);
    var r5x0y1 = new Slot("Vulgar",    0,  1);
    var r5x0y2 = new Slot("Holy",    0,  2);
    var r5x0yn1 = new Slot("Naive",    0, -1);
    var r5x0yn2 = new Slot("Extreme",  0, -2);

    var r5x1y0 = new Slot("Novice",    1,  0);
    var r5x1y1 = new Slot("It",      1,  1);
    var r5x1y2 = new Slot("Madness",   1,  2);
    var r5x1yn1 = new Slot("Ego",    1, -1);
    var r5x1yn2 = new Slot("Death",    1, -2);

    var r5x2y0 = new Slot("Ruler",     2,  0);
    var r5x2y1 = new Slot("Why?",    2,  1);
    var r5x2y2 = new Slot("Wisdom",    2,  2);
    var r5x2yn1 = new Slot("How?",     2, -1);
    var r5x2yn2 = new Slot("Success",  2, -2);

    var r5xn1y0 = new Slot("Plain",   -1,  0);
    var r5xn1y1 = new Slot("We",    -1,  1);
    var r5xn1y2 = new Slot("Ugly",    -1,  2);
    var r5xn1yn1 = new Slot("Us",   -1, -1);
    var r5xn1yn2 = new Slot("Pain",   -1, -2);

    var r5xn2y0 = new Slot("Champion",  -2,  0);
    var r5xn2y1 = new Slot("Who,when?", -2,  1);
    var r5xn2y2 = new Slot("Esthetic",  -2,  2);
    var r5xn2yn1 = new Slot("What?",  -2, -1);
    var r5xn2yn2 = new Slot("Pleasure", -2, -2);

    var slots = [
    r5x0y0, r5x0y1, r5x0y2, r5x0yn1, r5x0yn2,
    r5x1y0, r5x1y1, r5x1y2, r5x1yn1, r5x1yn2,
    r5x2y0, r5x2y1, r5x2y2, r5x2yn1, r5x2yn2,
    r5xn1y0, r5xn1y1, r5xn1y2, r5xn1yn1, r5xn1yn2,
    r5xn2y0, r5xn2y1, r5xn2y2, r5xn2yn1, r5xn2yn2];   
    break;
    
  case 9 :
    var r9x0y0 = new Slot("Nothing",     0,  0, "FFFFFF", "000", false);
    var r9x0y1 = new Slot("Simple",      0,  1, "AAAAAA", "000", "vulgar, obvious"); // BUG!!! nonrelativized alt names not shown
    var r9x0y2 = new Slot("Complex",     0,  2, "BBBBBB", "000", "refined");
    var r9x0y3 = new Slot("Pure",        0,  3, "CCCCCC", "000", false);
    var r9x0y4 = new Slot("Holy",        0,  4, "DDDDDD", "000", false);
    var r9x0yn1 = new Slot("Naive",      0, -1, "AAAAAA", "000", false);
    var r9x0yn2 = new Slot("Mature",     0, -2, "BBBBBB", "000", false);
    var r9x0yn3 = new Slot("Noble",      0, -3, "CCCCCC", "000", false);
    var r9x0yn4 = new Slot("Extreme",      0, -4, "DDDDDD", "000", false);

    var r9x1y0 = new Slot("Novice",      1,  0, "999999", "FFF", false);
    var r9x1y1 = new Slot("It",        1,  1, "FFDDBC", "000", "syntactic");
    var r9x1y2 = new Slot("Always",      1,  2, "B9CDFF", "000", "redundant");
    var r9x1y3 = new Slot("Never",       1,  3, "2555BE", "FFF", "erroneous");
    var r9x1y4 = new Slot("Mad",       1,  4, "00257F", "FFF", "delusional");
    var r9x1yn1 = new Slot("Ego",        1, -1, "FFBBBD", "000", "inorganic");
    var r9x1yn2 = new Slot("Pain",       1, -2, "BAFFFF", "000", "weak");
    var r9x1yn3 = new Slot("Shame",      1, -3, "5ABFBF", "FFF", "disruptive");
    var r9x1yn4 = new Slot("Death",      1, -4, "1C8080", "FFF", "disastrous");

    var r9x2y0 = new Slot("Adept",       2,  0, "666666", "FFF", false);
    var r9x2y1 = new Slot("Think",       2,  1, "C68C5E", "000", "parsing");
    var r9x2y2 = new Slot("Purpose",     2,  2, "FFBB7C", "000", "semantic");
    var r9x2y3 = new Slot("Risk",        2,  3, "769EFF", "000", "jumping to conclusions");
    var r9x2y4 = new Slot("Must",        2,  4, "0034BE", "FFF", "obsessing");
    var r9x2yn1 = new Slot("Need",       2, -1, "C68C8D", "000", "sustaining");
    var r9x2yn2 = new Slot("Life",       2, -2, "FF797D", "000", "biological");
    var r9x2yn3 = new Slot("Poverty",    2, -3, "75FFFF", "000", "feral");
    var r9x2yn4 = new Slot("Subvert",    2, -4, "24BFBF", "FFF", "failing");

    var r9x3y0 = new Slot("Master",      3,  0, "333333", "FFF", false);
    var r9x3y1 = new Slot("Choice",      3,  1, "874F23", "FFF", "recursive");
    var r9x3y2 = new Slot("Expect",      3,  2, "C97430", "000", "proving");
    var r9x3y3 = new Slot("Infer",       3,  3, "FF993D", "000", "metatheoretic");
    var r9x3y4 = new Slot("Lie",       3,  4, "0043FF", "000", "confusing");
    var r9x3yn1 = new Slot("Tool",       3, -1, "845F5F", "FFF", "infrastructural");
    var r9x3yn2 = new Slot("Belong",     3, -2, "CC5B5F", "000", "working");
    var r9x3yn3 = new Slot("Honor",      3, -3, "FF303F", "000", "social");
    var r9x3yn4 = new Slot("Slavery",    3, -4, "2EFFFF", "000", "oppressive");

    var r9x4y0 = new Slot("Ruler",       4,  0, "000000", "FFF", false);
    var r9x4y1 = new Slot("Why?",      4,  1, "462300", "FFF", "structural");
    var r9x4y2 = new Slot("Would",       4,  2, "883F00", "FFF", "functional");
    var r9x4y3 = new Slot("Truth",       4,  3, "CC5B00", "000", "generalizing");
    var r9x4y4 = new Slot("Wisdom",      4,  4, "FF7700", "000", "analogic");
    var r9x4yn1 = new Slot("How?",       4, -1, "443233", "FFF", "media");
    var r9x4yn2 = new Slot("Should",     4, -2, "883F41", "FFF", "cognition");
    var r9x4yn3 = new Slot("Right",      4, -3, "CF2731", "000", "research");
    var r9x4yn4 = new Slot("Success",    4, -4, "FF0000", "000", "intellectual");

    var r9xn1y0 = new Slot("Plain",     -1,  0, "999999", "FFF", false);
    var r9xn1y1 = new Slot("We",      -1,  1, "FFFEBC", "000", "coincidential");
    var r9xn1y2 = new Slot("Lust",      -1,  2, "C87CFF", "000", "harmful");
    var r9xn1y3 = new Slot("Hostile",   -1,  3, "7F30BF", "FFF", "damaging");
    var r9xn1y4 = new Slot("Violate",   -1,  4, "48007E", "FFF", "degrading");
    var r9xn1yn1 = new Slot("Us",       -1, -1, "FFBBEE", "000", "believing");
    var r9xn1yn2 = new Slot("Sad",      -1, -2, "BAFFCC", "000", "frivolous");
    var r9xn1yn3 = new Slot("Pretend",    -1, -3, "5ABF73", "FFF", "deceptive");
    var r9xn1yn4 = new Slot("Dysphoria",  -1, -4, "1C8035", "FFF", "dysphoric");

    var r9xn2y0 = new Slot("Fancy",     -2,  0, "666666", "FFF", false);
    var r9xn2y1 = new Slot("Want",      -2,  1, "BDBD5D", "000", "active");
    var r9xn2y2 = new Slot("Harmony",     -2,  2, "FFFE7A", "000", "cultural");
    var r9xn2y3 = new Slot("Boredom",   -2,  3, "AB3DFE", "000", "corruptive");
    var r9xn2y4 = new Slot("Regret",    -2,  4, "8900BD", "FFF", "ignoring");
    var r9xn2yn1 = new Slot("Hope",     -2, -1, "C68CB1", "000", false);
    var r9xn2yn2 = new Slot("Love",     -2, -2, "FF78DE", "000", "considerative");
    var r9xn2yn3 = new Slot("Burden",   -2, -3, "75FF98", "000", "arbitrary");
    var r9xn2yn4 = new Slot("Despair",    -2, -4, "24BF4B", "FFF", "desperation");

    var r9xn3y0 = new Slot("Charming",    -3,  0, "333333", "FFF", false);
    var r9xn3y1 = new Slot("Friend",    -3,  1, "7D7E21", "FFF", "passive");
    var r9xn3y2 = new Slot("Yay!",      -3,  2, "BDBD2D", "000", "celebrating");
    var r9xn3y3 = new Slot("Free",      -3,  3, "FFFE39", "000", "liberating");
    var r9xn3y4 = new Slot("Mess",      -3,  4, "8900FE", "000", "chaotic");
    var r9xn3yn1 = new Slot("Share",    -3, -1, "845F77", "FFF", "cooperating");
    var r9xn3yn2 = new Slot("Possess",    -3, -2, "CC5CA5", "000", "stylistic");
    var r9xn3yn3 = new Slot("Happy",    -3, -3, "FF30CF", "000", "calculative");
    var r9xn3yn4 = new Slot("Shock",    -3, -4, "2EFF62", "000", "hurrying");

    var r9xn4y0 = new Slot("Champion",    -4,  0, "000000", "FFF", false);
    var r9xn4y1 = new Slot("Who?",      -4,  1, "424100", "FFF", "innocent\", \"when?\", \"where?");
    var r9xn4y2 = new Slot("Can",       -4,  2, "7D7E00", "FFF", "ritualistic");
    var r9xn4y3 = new Slot("Magical",   -4,  3, "BDBD00", "000", false);
    var r9xn4y4 = new Slot("Esthetic",    -4,  4, "FFFE00", "000", false);
    var r9xn4yn1 = new Slot("What?",    -4, -1, "44323E", "FFF", "apparent");
    var r9xn4yn2 = new Slot("Be",       -4, -2, "883F6F", "FFF", "customary");
    var r9xn4yn3 = new Slot("Fun",      -4, -3, "CF2799", "000", "recreational");
    var r9xn4yn4 = new Slot("Euphoria",   -4, -4, "FF00BF", "000", "epiphanic");

    var slots = [
    r9x0y0, r9x0y1, r9x0y2, r9x0y3, r9x0y4, r9x0yn1, r9x0yn2, r9x0yn3, r9x0yn4,
    r9x1y0, r9x1y1, r9x1y2, r9x1y3, r9x1y4, r9x1yn1, r9x1yn2, r9x1yn3, r9x1yn4,
    r9x2y0, r9x2y1, r9x2y2, r9x2y3, r9x2y4, r9x2yn1, r9x2yn2, r9x2yn3, r9x2yn4,
    r9x3y0, r9x3y1, r9x3y2, r9x3y3, r9x3y4, r9x3yn1, r9x3yn2, r9x3yn3, r9x3yn4,
    r9x4y0, r9x4y1, r9x4y2, r9x4y3, r9x4y4, r9x4yn1, r9x4yn2, r9x4yn3, r9x4yn4,
    r9xn1y0, r9xn1y1, r9xn1y2, r9xn1y3, r9xn1y4, r9xn1yn1, r9xn1yn2, r9xn1yn3, r9xn1yn4,
    r9xn2y0, r9xn2y1, r9xn2y2, r9xn2y3, r9xn2y4, r9xn2yn1, r9xn2yn2, r9xn2yn3, r9xn2yn4,
    r9xn3y0, r9xn3y1, r9xn3y2, r9xn3y3, r9xn3y4, r9xn3yn1, r9xn3yn2, r9xn3yn3, r9xn3yn4,
    r9xn4y0, r9xn4y1, r9xn4y2, r9xn4y3, r9xn4y4, r9xn4yn1, r9xn4yn2, r9xn4yn3, r9xn4yn4];
    break;

  case 7 :
    var slots = createMelodySlots();
    
  default :
    console.log("createGrid does not support this resolution.");}

  mode.slots = slots;
  mode.grid = makeSlotGrid(slots); }



function initBasicModeDisplay() {
  $( "#container" ).empty();
  $( "#container").append("\
    <div style='float:left'>\
      <div id='gridContainer'></div>\
    </div>\
    <div style='float:left; display: inline;'>\
      <table id='stratTable'></table>\
    </div>\
    <div style='clear:both; height:0px;'>&nbsp;</div>\
    <div style='float:left'>\
      <table id='personTable'></table>\
    </div>\
    <div style='float:right'></div>\
    <div style='clear:both; height:0px;'>&nbsp;</div>\
    <button id='startGame' class='amoqButton'></button>\
    <button id='autoPlay' class='amoqButton'></button>\
    <button id='newPerson' class='amoqButton'></button>\
    <button id='delPerson' class='amoqButton'></button>\
    <button id='restart' class='amoqButton'></button>\
    <div style='clear:both; height:0px;'>&nbsp;</div>\
    <div style='float:left'>\
      <table id='patternTable'></table>\
    </div>\
    <div style='clear:both; height:0px;'>&nbsp;</div>\
    <div style='float:left; display:inline;'>\
      <table id='groupTable'></table>\
    </div>\
    <div id='options'></div>");
  drawModeSelector("BasicMode"); }
      
function initSpatialModeDisplay() {
  $ ( "#container" ).empty();
  $( "#container" ).append("<canvas id='plane' width='500' height='500'></canvas><canvas id='space' width='500' height='500'></canvas><div style='clear:both; height:0px;'>&nbsp;</div><table id='personTable'></table><button id='startGame' class='amoqButton'></button><button id='autoPlay' class='amoqButton'></button><button id='newPerson' class='amoqButton'></button><button id='delPerson' class='amoqButton'></button><button id='restart' class='amoqButton'></button><div style='clear:both; height:0px;'>&nbsp;</div><div id='groupList'></div><table id='groupTable'></table>");
  drawModeSelector("SpatialMode"); }



function remLast4(str) { return str.slice(0, str.length - 4); }
function drawModeSelector(mode) {
  $( "#modeSelector" ).empty();
  var ids = ["BasicMode", "compStratMode", "SpatialMode"];
  var modes = [];
  for(var i = 0; i < ids.length; i++) {
    $("#modeSelector").append("<input id='" + ids[i] + "' class='amoqSelector' onmouseout='defaultHover();' onmouseover='" + ids[i] + "Hover();' onmouseout='defaultHover();' onclick='" + ids[i] + "();'><span class='amoqSelectorText'>" + remLast4(ids[i]) + "</span></input>"); }
  for(var i = 0; i < ids.length; i++) {
    modes.push(document.getElementById(ids[i])); }
  for(var i = 0; i < modes.length; i++) {
    modes[i].setAttribute("type", "radio");
    if (mode === ids[i]) { document.getElementById(ids[i]).checked = true; }
    else { document.getElementById(ids[i]).checked = false; }}}
  
  
/*function drawOptions(mode) {
  $( "#options" ).empty();*/
  


// idea: instead of moving on the grid player can also move in player list (Affects play order)
  
/*  
<canvas id='plane' width=></div>
<div style='clear:both; height:0px;'>&nbsp;</div>
<table id='personTable'></table>
<button id='startGame' class='amoqButton'></button>
<button id='autoPlay' class='amoqButton'></button>
<button id='newPerson' class='amoqButton'></button>
<button id='delPerson' class='amoqButton'></button>
<button id='restart' class='amoqButton'></button>
<div style='clear:both; height:0px;'>&nbsp;</div>
<div id='groupList'></div>
<table id='groupTable'></table>*/



function drawGrid(grid, persons, person) { if(s.Basic.maxDebug) {console.log("DRAWGRID"); }
  var res = grid.length;
  $( "#gridContainer" ).empty();
  var currentSlot;
  var slotIsAvailable = false;
  var currentSlotColor;
  var currentSlotName;
  var slotGrade = 0;
  var id = "";
  for (var y = 0; y < res; y++) {
    //$("#gridContainer").append("<div onmouseout='defaultHover();'>");
    $("#gridContainer").append("<div>");
    for (var x = 0; x < res; x++) {
      currentSlot = findSlotPos(grid,x,y);
      if(!(person === false)) {
        if((person.X === currentSlot.X) && (person.Y === currentSlot.Y)) {
          currentSlotName = ""; }
        else { currentSlotName = currentSlot.name; }
        slotIsAvailable = slotAvailable(currentSlot.X, currentSlot.Y, person);
        if(slotIsAvailable === true) {
          currentSlotColor = currentSlot.color;}
        else {
          currentSlotColor = fadeUnavailableSlot(currentSlot);}}
      else {
        currentSlotColor = currentSlot.color;}
      slotGrade = currentSlot.absVal;
      id = "x" + currentSlot.X + "y" + currentSlot.Y;
      $("#gridContainer").append("<div id='" + id + "' onmousedown='slotClick(" + currentSlot.X + "," + currentSlot.Y + ")' onmouseout='defaultHover();' onmouseover='slotHover(" + currentSlot.X + "," + currentSlot.Y + ")' style='padding: 3px; float: left; width: 70px; background-color: #" + currentSlotColor + "; color: #" + currentSlot.textColor + ";'>" + currentSlotName + "<div style='text-align:right; float:right;'>" + slotGrade + "</div><br /><div class='playpen'>" + drawPersons(currentSlot, persons) + "</div></div>"); }
    $("#gridContainer").append("</div><div style='clear:both; height:0px;'>&nbsp;</div>"); }}

  
  
function drawIds(group) { if(s.Basic.maxDebug) {console.log("DRAWIDS"); }
  var output = "";
  for (var i = 0; i < group.persons.length; i++) {
    output = output + group.persons[i].id; }
  return output; }
  


function calcPersonMor(agent) {  //probably shouldn't be here
  var mor = 0;
  var X = Math.abs(agent.visX);
  var Y = Math.abs(agent.visY);
  if (X > Y) { mor = 1 / (X / Y); }
  if (Y > X) {mor = -(1 / (Y / X)); }
  return mor; }
  
  
  
function calcGroupMor(agent) { //this probably shouldn't be here, it should be calculated along with groups stuff
  var mor = 0;
  var cla = 0;
  var rom = 0;
  cla = agent.val.rat + agent.val.gno;
  rom = agent.val.abs + agent.val.tan;
  if (cla > rom) {mor = 1 / (cla / rom); }
  if (rom > cla) {mor = -(1 / (rom / cla)); }
  return mor; }
  
  
  
/*function calcGroupMor(group) {
  var ret = 0;
  for (var i = 0; i < group.persons.length; i++) {
    ret = ret
    
  }*/
  
  
  
function calcDecency(value) { //probably shouldn't be here
  var mor = 0;
  var cla = 0;
  var rom = 0;
  cla = value.rat + value.gno;
  rom = value.abs + value.tan;
  if (cla > rom) {mor = 1 / (cla / rom); }
  if (rom > cla) {mor = -(1 / (rom / cla)); }
  return mor; } // bad func
  
  
  
function dispValDecency(value) {
  return Math.round(calcDecency(value) * 100) / 100; }



function reportValDiff(oldVal, diff, hover) {
  var ret;
  var newVal = oldVal + diff;
  if(!hover) {
    if (oldVal === newVal) {ret = oldVal }
    else if (oldVal < newVal) {ret = oldVal + "<span class='outlineInc'; '>+" + diff + "</span>"}
    else if (oldVal > newVal) {ret = oldVal + "<span class='outlineDec'; '>" + diff + "</span>"}}
  else{
    if (oldVal === newVal) {ret = oldVal }
    else if (oldVal < newVal) {ret = newVal + "<span class='outlineInc'; '>+" + diff + "</span>"}
    else if (oldVal > newVal) {ret = newVal + "<span class='outlineDec'; '>" + diff + "</span>"}}
  return ret; }



// TABLES STUFF BEGIN
  

// STRAT



function drawStratList(hover) {
  var table = document.getElementById("stratTable");
  if (s.mode.fancyUI) { table.className = "fancyUIstratTable"; }
  var cell;
  var strategies = [];
  var buffer;
  var rowsToDo = 0;
  var tot = 0;
  var ino = 0;
  var bio = 0;
  var soc = 0;
  var intl = 0;

  var row = table.insertRow(0);
  for(var i = 0; i < s.mode.persons.length; i++) {
    strategies.push(getStrategiesOfPerson(i));
    rowsToDo = longestArrInArr(strategies);
    cell = row.insertCell(i);//xyz
    cell.style.backgroundColor = "#ccc";
    cell.style.fontSize = "10px"
    cell.style.fontFamily = "verdana"
    cell.innerHTML = i + " " + s.mode.persons[i].name; }

  var row = table.insertRow(1);
  for (var i = 0; i < s.mode.persons.length; i++) {
    for (var j = 0; j < strategies[i].length; j++) { tot = tot + totVal(patTotVal(strategies[i][j].val)); }
    for (var j = 0; j < strategies[i].length; j++) { ino = ino + totVal(strategies[i][j].val.ino); }
    console.log(strategies);
    for (var j = 0; j < strategies[i].length; j++) { bio = bio + totVal(strategies[i][j].val.bio); }
    for (var j = 0; j < strategies[i].length; j++) { soc = soc + totVal(strategies[i][j].val.soc); }
    for (var j = 0; j < strategies[i].length; j++) { intl = intl + totVal(strategies[i][j].val.intl); }
    cell = row.insertCell(i);//xyz
    if (s.mode.fancyUI) { cell.className = "fancyUIstratValsAll"}
    cell.innerHTML = "<table class='stratValTable'><tr><td>" + tot + "</td><td>" + ino + "</td><td>" + bio + "</td><td>" + soc + "</td><td>" + intl + "</td></tr></table>";
    tot = 0; ino = 0; bio = 0; soc = 0; intl = 0; }

  for(var i = 0; i < rowsToDo; i++) {
    row = table.insertRow((2 * i) + 2);
    for(var j = 0; j < s.mode.persons.length; j++) {
      cell = row.insertCell(j);
      if (s.mode.fancyUI) { cell.className = "fancyUIstratName"; }
      cell.innerHTML = "<div onmouseout='defaultHover();' onmouseover='describeStrategy(" + s.mode.strategies[i].id + ");'>" + s.mode.strategies[i].id + " " + s.mode.strategies[i].name + "</div>"; }
    row = table.insertRow((2 * i) + 3);
    for(var j = 0; j < s.mode.persons.length; j++) {
      if (i < strategies[j].length) {
        tot = totVal(patTotVal(strategies[j][i].val));
        ino = totVal(strategies[j][i].val.ino);
        bio = totVal(strategies[j][i].val.bio);
        soc = totVal(strategies[j][i].val.soc);
        intl = totVal(strategies[j][i].val.intl); }
      else { tot = 0; ino = 0; bio = 0; soc = 0; intl = 0; }
      cell = row.insertCell(j);
      if (s.mode.fancyUI) { cell.className = "fancyUIstratVals"}
      cell.innerHTML = "<table class='stratValTable'><tr><td>" + tot + "</td><td>" + ino + "</td><td>" + bio + "</td><td>" + soc + "</td><td>" + intl + "</td></tr></table>"; }}}



// PERSON



function updatePersonList(diffs, hover) {
  var table = document.getElementById("personTable");
  var row;
  var id = "";
  var bot;
  var X;
  var Y;
  var name;
  var dec;
  var tot;
  var diams;
  var hearts;
  var spades;
  var clubs;
  var left;
  var right;
  var up;
  var down;
  var bens;
  var spacer1;
  var spacer2;
  var spacer3;
  var buffer;
  var limit = getBenLimit(s.Basic.persons);
  
  for (var i = 1; i <= s.Basic.persons.length; i++) {
    id = table.rows[i].cells[0];
    bot = table.rows[i].cells[1];
    X = table.rows[i].cells[2];
    Y = table.rows[i].cells[3];
    name = table.rows[i].cells[4];
    spacer3 = table.rows[i].cells[5];
    dec = table.rows[i].cells[6];
    tot = table.rows[i].cells[7];
    diams = table.rows[i].cells[8];
    hearts = table.rows[i].cells[9];
    spades = table.rows[i].cells[10];
    clubs = table.rows[i].cells[11];
    spacer1 = table.rows[i].cells[12];
    left = table.rows[i].cells[13];
    right = table.rows[i].cells[14];
    up = table.rows[i].cells[15];
    down = table.rows[i].cells[16];
    spacer2 = table.rows[i].cells[17];
    
    id.innerHTML = "<div style='text-align:center;'>" + s.Basic.persons[i - 1].id + "</div>";

    if(!hover) {
      if (prevPerson(s.mode.personInTurn).id === (i - 1)) { name.innerHTML = "<strong>" + s.Basic.persons[i - 1].name + "</strong>"; }
      else if (s.mode.personInTurn.id === (i - 1)) { name.innerHTML = "<em>" + s.Basic.persons[i - 1].name + "</em>"; }
      else { name.innerHTML = s.Basic.persons[i - 1].name; }}
    else {
      if (s.mode.personInTurn.id === (i - 1)) { name.innerHTML = "<strong><em>" + s.Basic.persons[i - 1].name + "</em></strong>"; }
      else { name.innerHTML = s.Basic.persons[i - 1].name; }}

    if (!hover) { X.innerHTML = "<div style='text-align:center;'>" + s.Basic.persons[i - 1].X + "</div>"; }
    else { // BUG!! these don't work, should use absolute value of coordinate instead of diff ALREADY FIXED?
      if (Math.abs(s.Basic.persons[i - 1].X) === Math.abs(diffs[i - 1].X)) { X.innerHTML = diffs[i - 1].X; }
      else if ( Math.abs(s.Basic.persons[i - 1].X) < Math.abs(diffs[i - 1].X)) { X.innerHTML = "<span class='outlineInc'; '>" + diffs[i - 1].X + "</span>"; } /*00bb00*/
      else if ( Math.abs(s.Basic.persons[i - 1].X) > Math.abs(diffs[i - 1].X)) { X.innerHTML = "<span class='outlineDec'; '>" + diffs[i - 1].X + "</span>"; }}

    if (!hover) { Y.innerHTML = "<div style='text-align:center;'>" + s.Basic.persons[i - 1].Y + "</div>"; }
    else {
      if (Math.abs(s.Basic.persons[i - 1].Y) === Math.abs(diffs[i - 1].Y)) { X.innerHTML = diffs[i - 1].Y; }
      else if ( Math.abs(s.Basic.persons[i - 1].Y) < Math.abs(diffs[i - 1].Y)) { Y.innerHTML = "<span class='outlineInc'; '>" + diffs[i - 1].Y + "</span>"; } /*00bb00*/
      else if ( Math.abs(s.Basic.persons[i - 1].Y) > Math.abs(diffs[i - 1].Y)) { Y.innerHTML = "<span class='outlineDec'; '>" + diffs[i - 1].Y + "</span>"; }}

    buffer = dispDec(s.Basic.persons[i - 1]);
    dec.innerHTML = buffer; 
    if (buffer < 0) { 
      dec.style.backgroundColor = "#000";
      dec.style.color = "#fff"; }
    else {
      dec.style.backgroundColor = "#fff";
      dec.style.color = "#000"; }

    if (!(diffs)) {tot.innerHTML = totVal(s.Basic.persons[i - 1].val);}
    else { tot.innerHTML = reportValDiff(totVal(s.Basic.persons[i - 1].val), totVal(diffs[i - 1].val), hover); }
    if (totVal(s.Basic.persons[i - 1].val) < 0) { 
      tot.style.backgroundColor = "#000";
      tot.style.color = "#fff"; }
    else {
      tot.style.backgroundColor = "#fff";
      tot.style.color = "#000"; }

    if (!(diffs)) {diams.innerHTML = s.Basic.persons[i - 1].val.obj;}
    else { diams.innerHTML = reportValDiff(s.Basic.persons[i - 1].val.obj, diffs[i - 1].val.obj, hover); }
    if (s.Basic.persons[i - 1].val.obj < 0) { diams.style.backgroundColor = "#" + findSlot(1,-2).color; }
    else { diams.style.backgroundColor = "#" + findSlot(1,-1).color; }

    if (!(diffs)) {hearts.innerHTML = s.Basic.persons[i - 1].val.sub;}
    else { hearts.innerHTML = reportValDiff(s.Basic.persons[i - 1].val.sub, diffs[i - 1].val.sub, hover); }
    if (s.Basic.persons[i - 1].val.sub < 0) { hearts.style.backgroundColor = "#" + findSlot(-1,-2).color; }
    else { hearts.style.backgroundColor = "#" + findSlot(-1,-1).color; }

    if (!(diffs)) {spades.innerHTML = s.Basic.persons[i - 1].val.nor;}
    else { spades.innerHTML = reportValDiff(s.Basic.persons[i - 1].val.nor, diffs[i - 1].val.nor, hover); }
    if (s.Basic.persons[i - 1].val.nor < 0) { spades.style.backgroundColor = "#" + findSlot(1,2).color; }
    else { spades.style.backgroundColor = "#" + findSlot(1,1).color; }

    if (!(diffs)) {clubs.innerHTML = s.Basic.persons[i - 1].val.mys;}
    else { clubs.innerHTML = reportValDiff(s.Basic.persons[i - 1].val.mys, diffs[i - 1].val.mys, hover); }
    if (s.Basic.persons[i - 1].val.mys < 0) { clubs.style.backgroundColor = "#" + findSlot(-1,2).color; }
    else { clubs.style.backgroundColor = "#" + findSlot(-1,1).color; }
    
    if (!(diffs)) { left.innerHTML = s.Basic.persons[i - 1].xp.gno; }
    else { left.innerHTML = reportValDiff(s.Basic.persons[i - 1].xp.gno, diffs[i - 1].xp.gno, hover); }

    if (!(diffs)) { right.innerHTML = s.Basic.persons[i - 1].xp.rat; }
    else { right.innerHTML = reportValDiff(s.Basic.persons[i - 1].xp.rat, diffs[i - 1].xp.rat, hover); }

    if (!(diffs)) { up.innerHTML = s.Basic.persons[i - 1].xp.abs; }
    else { up.innerHTML = reportValDiff(s.Basic.persons[i - 1].xp.abs, diffs[i - 1].xp.abs, hover); }

    if (!(diffs)) { down.innerHTML = s.Basic.persons[i - 1].xp.tan; }
    else { down.innerHTML = reportValDiff(s.Basic.persons[i - 1].xp.tan, diffs[i - 1].xp.tan, hover); }

    for (var j = 18; j < s.Basic.persons[i - 1].bens.length + 18; j++) {
      bens = table.rows[i].cells[j];
      colors = colorBenTableCell(s.Basic.persons[i - 1].bens[j - 18], limit);
      bens.style.backgroundColor = "#" + colors.bg;
      bens.style.color = "#" + colors.text;
      if (!(diffs)) { bens.innerHTML = "<div style='width:100%; height:100%; padding: 2px; margin: -2px;' onmouseout='defaultHover();' onmouseover='bensHover(" + [i - 1] + ", " + [j - 18] + ");'>" + totVal(s.Basic.persons[i - 1].bens[j - 18]) + "</div>"; }
      else { bens.innerHTML = "<div style='width:100%; height:100%; padding: 2px; margin: -2px;' onmouseout='defaultHover();' onmouseover='bensHover(" + [i - 1] + ", " + [j - 18] + ");'>" + reportValDiff(totVal(s.Basic.persons[i - 1].bens[j - 18]), totVal(diffs[i - 1].bens[j - 18]), hover) + "</div>"; }}}}

function drawPersonList(diffs) { if(s.Basic.maxDebug) {console.log("DRAWPERSONLIST (2)"); }
  var table = document.getElementById("personTable");
  var row;
  var id = "";
  var bot;
  var X;
  var Y;
  var name;
  var dec;
  var tot;
  var diams;
  var hearts;
  var spades;
  var clubs;
  var left;
  var right;
  var up;
  var down;
  var bens;
  var spacer1;
  var spacer2;
  var spacer3;
  var buffer;
  var limit = getBenLimit(s.Basic.persons);
  
  row = table.insertRow(0);
  id = row.insertCell(0);
  bot = row.insertCell(1);
  X = row.insertCell(2);
  Y = row.insertCell(3);
  name = row.insertCell(4);
  spacer3 = row.insertCell(5);
  dec = row.insertCell(6);
  tot = row.insertCell(7);
  diams = row.insertCell(8);
  hearts = row.insertCell(9);
  spades = row.insertCell(10);
  clubs = row.insertCell(11);
  spacer1 = row.insertCell(12);
  left = row.insertCell(13);
  right = row.insertCell(14);
  up = row.insertCell(15);
  down = row.insertCell(16);
  spacer2 = row.insertCell(17);
  
  id.innerHTML = "id";
  id.style.backgroundColor = "#ccc";
  bot.innerHTML = "bot";
  bot.style.backgroundColor = "#ccc";
  X.innerHTML = "<div style='text-align:center;'>X</div>";
  X.style.backgroundColor = "#ccc";
  Y.innerHTML = "<div style='text-align:center;'>Y</div>";
  Y.style.backgroundColor = "#ccc";
  name.innerHTML = "<div style='text-align:center;'>name</div>";
  name.style.backgroundColor = "#ccc";
  spacer3.innerHTML = "&nbsp;";
  spacer3.style.backgroundColor = "#ccc";
  dec.innerHTML = "<div style='text-align:center;' onmouseout='defaultHover();' onmouseover='describeQuality(5)'>dec</div>";
  dec.style.backgroundColor = "#ccc";
  tot.innerHTML = "<div style='text-align:center;' onmouseout='defaultHover();' onmouseover='describeQuality(4)'>val</div>";
  tot.style.backgroundColor = "#ccc";
  diams.innerHTML = "<div style='text-align:center;' onmouseout='defaultHover();' onmouseover='describeQuality(0)'>&diams;</div>";
  diams.style.backgroundColor = "#FFBBBD";
  hearts.innerHTML = "<div style='text-align:center;' onmouseout='defaultHover();' onmouseover='describeQuality(1)'>&hearts;</div>";
  hearts.style.backgroundColor = "#FFBBEE";
  spades.innerHTML = "<div style='text-align:center;' onmouseout='defaultHover();' onmouseover='describeQuality(2)'>&spades;</div>";
  spades.style.backgroundColor = "#FFDDBC";
  clubs.innerHTML = "<div style='text-align:center;' onmouseout='defaultHover();' onmouseover='describeQuality(3)'>&clubs;</div>";
  clubs.style.backgroundColor = "#FFFEBC";
  spacer1.innerHTML = "&nbsp;";
  spacer1.style.backgroundColor = "#ccc";
  left.innerHTML = "<div style='text-align:center;' onmouseout='defaultHover();' onmouseover='describeQuality(6)'>&#9664;</div>";
  left.style.backgroundColor = "#ccc";
  right.innerHTML = "<div style='text-align:center;' onmouseout='defaultHover();' onmouseover='describeQuality(7)'>&#9654</div>";
  right.style.backgroundColor = "#ccc";
  up.innerHTML = "<div style='text-align:center;' onmouseout='defaultHover();' onmouseover='describeQuality(8)'>&#9650;</div>";
  up.style.backgroundColor = "#ccc";
  down.innerHTML ="<div style='text-align:center;' onmouseout='defaultHover();' onmouseover='describeQuality(9)'>&#9660;</div>"; 
  down.style.backgroundColor = "#ccc";
  spacer2.innerHTML = "&nbsp;";
  spacer2.style.backgroundColor = "#ccc";
  
  for (var i = 0; i < s.Basic.persons.length; i++) {
    bens = row.insertCell(i + 18);
    bens.innerHTML = "<div style='text-align:center !important;'>" + s.Basic.persons[i].id + "</div>";
    bens.style.backgroundColor = "#ccc"; }
  
  for (var i = 1; i <= s.Basic.persons.length; i++) {
    row = table.insertRow(i);
    id = row.insertCell(0);
    bot = row.insertCell(1);
    X = row.insertCell(2);
    Y = row.insertCell(3);
    name = row.insertCell(4);
    spacer3 = row.insertCell(5);
    spacer3.style.backgroundColor = "#ccc";
    dec = row.insertCell(6);
    tot = row.insertCell(7);
    diams = row.insertCell(8);
    diams.style.backgroundColor = "#FFBBBD";
    hearts = row.insertCell(9);
    hearts.style.backgroundColor = "#FFBBEE";
    spades = row.insertCell(10);
    spades.style.backgroundColor = "#FFDDBC";
    clubs = row.insertCell(11);
    clubs.style.backgroundColor = "#FFFEBC";
    spacer1 = row.insertCell(12);
    spacer1.style.backgroundColor = "#ccc";
    left = row.insertCell(13);
    right = row.insertCell(14);
    up = row.insertCell(15);
    down = row.insertCell(16);
    spacer2 = row.insertCell(17);
    spacer2.style.backgroundColor = "#ccc";
  
    //on dId ( id, arr, dIds ) 
    //id.innerHTML = "<div style='text-align:center;'>" + s.Basic.persons[i - 1].id + "</div>";
    id.innerHTML = "<div style='text-align:center;'>" + s.Basic.personsDIds[i - 1] + "</div>"; //qwe
    console.log(s.Basic.personsDIds);
    console.log("dId:");
    console.log((i - 1), s.Basic.persons, s.Basic.personsDIds);
    console.log("" + s.Basic.personsDIds[i - 1]);

    if (s.Basic.persons[i - 1].bot) {
      if(s.Basic.persons[i - 1].hybrid) { bot.innerHTML = "<div onmouseover='HybridBotHover();' style='text-align:center !important'>T*</div>" }
      else { bot.innerHTML = "<div onmouseover='NonHybridBotHover();' style='text-align:center !important'>T</div>" }}
    else if(s.Basic.persons[i - 1].hybrid) { bot.innerHTML = "<div onmouseover='HybridHumanHover();' style='text-align:center !important'>F*</div>" }
      else { bot.innerHTML = "<div onmouseover='NonHybridHumanHover();' style='text-align:center !important'>&nbsp;</div>" }

    if((s.mode.playing) && (s.mode.personInTurn.id === (i - 1))) { name.innerHTML = "<strong>" + s.Basic.persons[i - 1].name + "</strong>"; }
    else { name.innerHTML = s.Basic.persons[i - 1].name; }

    X.innerHTML = s.Basic.persons[i - 1].X;
    Y.innerHTML = s.Basic.persons[i - 1].Y;

    buffer = dispDec(s.Basic.persons[i - 1]);
    dec.innerHTML = buffer;
    if (buffer < 0) { 
      dec.style.backgroundColor = "#000";
      dec.style.color = "#fff"; }
    else {
      dec.style.backgroundColor = "#fff";
      dec.style.color = "#000"; }
    
    buffer = totVal(s.Basic.persons[i - 1].val);
    tot.innerHTML = buffer;
    if (buffer < 0) { 
      tot.style.backgroundColor = "#000";
      tot.style.color = "#fff"; }
    else {
      tot.style.backgroundColor = "#fff";
      tot.style.color = "#000"; }
  
    buffer = s.Basic.persons[i - 1].val.obj;
    diams.innerHTML = buffer;
    if (buffer < 0) { diams.style.backgroundColor = "#" + findSlot(1,-2).color; }
    else { diams.style.backgroundColor = "#" + findSlot(1,-1).color; }
    
    buffer = s.Basic.persons[i - 1].val.sub;
    hearts.innerHTML = buffer;
    if (buffer < 0) { hearts.style.backgroundColor = "#" + findSlot(-1,-2).color; }
    else { hearts.style.backgroundColor = "#" + findSlot(-1,-1).color; }
    
    buffer = s.Basic.persons[i - 1].val.nor;
    spades.innerHTML = buffer;
    if (buffer < 0) { spades.style.backgroundColor = "#" + findSlot(1,2).color; }
    else { spades.style.backgroundColor = "#" + findSlot(1,1).color; }
    
    buffer = s.Basic.persons[i - 1].val.mys;
    clubs.innerHTML = buffer;
    if (buffer < 0) { clubs.style.backgroundColor = "#" + findSlot(-1,2).color; }
    else { clubs.style.backgroundColor = "#" + findSlot(-1,1).color; }
    
    left.innerHTML = s.Basic.persons[i - 1].xp.gno;
    right.innerHTML = s.Basic.persons[i - 1].xp.rat;
    up.innerHTML = s.Basic.persons[i - 1].xp.abs;
    down.innerHTML = s.Basic.persons[i - 1].xp.tan;
      
    for (var j = 18; j < s.Basic.persons[i - 1].bens.length + 18; j++) {
      bens = row.insertCell(j);
      colors = colorBenTableCell(s.Basic.persons[i - 1].bens[j - 18], limit);
      bens.style.backgroundColor = "#" + colors.bg;
      bens.style.color = "#" + colors.text;
      bens.innerHTML = "<div style='width:100%; height:100%; padding: 2px; margin: -2px;' onmouseout='defaultHover();' onmouseover='bensHover(" + [i - 1] + ", " + [j - 18] + ");'>" + totVal(s.Basic.persons[i - 1].bens[j - 18]) + "</div>"; }}}



// PATTERN



function drawPatternList(diffs) { if(s.Basic.maxDebug) {console.log("DRAWPATTERNLIST"); }
  var table = document.getElementById("patternTable");
  var row;
  var id = "";
  var X;
  var Y;
  var name;
  var dec;
  var tot;
  var diams;
  var hearts;
  var spades;
  var clubs;
  var frm;
  var sbstc;
  var bens;
  var spacer1;
  var spacer2;
  var spacer3;
  var buffer;
  var limit = getBenLimit(s.Basic.patterns);
  
  row = table.insertRow(0);
  id = row.insertCell(0);
  X = row.insertCell(1);
  Y = row.insertCell(2);
  name = row.insertCell(3);
  spacer3 = row.insertCell(4);
  dec = row.insertCell(5);
  tot = row.insertCell(6);
  diams = row.insertCell(7);
  hearts = row.insertCell(8);
  spades = row.insertCell(9);
  clubs = row.insertCell(10);
  spacer1 = row.insertCell(11);
  frm = row.insertCell(12);
  sbstc = row.insertCell(13);
  spacer2 = row.insertCell(14);
  
  id.innerHTML = "sym";
  id.style.backgroundColor = "#ccc";
  X.innerHTML = "<div style='text-align:center;'>X</div>";
  X.style.backgroundColor = "#ccc";
  Y.innerHTML = "<div style='text-align:center;'>Y</div>";
  Y.style.backgroundColor = "#ccc";
  name.innerHTML = "<div style='text-align:center;'>name</div>";
  name.style.backgroundColor = "#ccc";
  spacer3.innerHTML = "&nbsp;";
  spacer3.style.backgroundColor = "#ccc";
  dec.innerHTML = "<div style='text-align:center;' onmouseout='defaultHover();' onmouseover='describeQuality(5)'>dec</div>";
  dec.style.backgroundColor = "#ccc";
  tot.innerHTML = "<div style='text-align:center;' onmouseout='defaultHover();' onmouseover='describeQuality(4)'>val</div>";
  tot.style.backgroundColor = "#ccc";
  diams.innerHTML = "<div style='text-align:center;' onmouseout='defaultHover();' onmouseover='describeQuality(0)'>&diams;</div>";
  diams.style.backgroundColor = "#FFBBBD";
  hearts.innerHTML = "<div style='text-align:center;' onmouseout='defaultHover();' onmouseover='describeQuality(1)'>&hearts;</div>";
  hearts.style.backgroundColor = "#FFBBEE";
  spades.innerHTML = "<div style='text-align:center;' onmouseout='defaultHover();' onmouseover='describeQuality(2)'>&spades;</div>";
  spades.style.backgroundColor = "#FFDDBC";
  clubs.innerHTML = "<div style='text-align:center;' onmouseout='defaultHover();' onmouseover='describeQuality(3)'>&clubs;</div>";
  clubs.style.backgroundColor = "#FFFEBC";
  spacer1.innerHTML = "&nbsp;";
  spacer1.style.backgroundColor = "#ccc";
  frm.innerHTML = "form";
  frm.style.backgroundColor = "#ccc";
  sbstc.innerHTML = "substance";
  sbstc.style.backgroundColor = "#ccc";
  spacer2.innerHTML = "&nbsp;";
  spacer2.style.backgroundColor = "#ccc";

  
  for (var i = 0; i < s.Basic.patterns.length; i++) {
    bens = row.insertCell(i + 14);
    bens.innerHTML = "<div style='text-align:center !important;'>" + s.Basic.patterns[i].id + "</div>";
    bens.style.backgroundColor = "#ccc"; }
  
  for (var i = 1; i <= s.Basic.patterns.length; i++) {
    row = table.insertRow(i);
    id = row.insertCell(0);
    X = row.insertCell(1);
    Y = row.insertCell(2);
    name = row.insertCell(3);
    spacer3 = row.insertCell(4);
    spacer3.style.backgroundColor = "#ccc";
    dec = row.insertCell(5);
    tot = row.insertCell(6);
    diams = row.insertCell(7);
    diams.style.backgroundColor = "#FFBBBD";
    hearts = row.insertCell(8);
    hearts.style.backgroundColor = "#FFBBEE";
    spades = row.insertCell(9);
    spades.style.backgroundColor = "#FFDDBC";
    clubs = row.insertCell(10);
    clubs.style.backgroundColor = "#FFFEBC";
    spacer1 = row.insertCell(11);
    spacer1.style.backgroundColor = "#ccc";
    frm = row.insertCell(12);
    sbstc = row.insertCell(13);
    spacer2 = row.insertCell(14);
    spacer2.style.backgroundColor = "#ccc";
  
    id.innerHTML = "<div style='text-align:center;'>" + s.Basic.patterns[i - 1].id + "</div>";

    X.innerHTML = s.Basic.patterns[i - 1].X;
    Y.innerHTML = s.Basic.patterns[i - 1].Y;

    buffer = dispDec(s.Basic.patterns[i - 1]);
    dec.innerHTML = buffer;
    if (buffer < 0) { 
      dec.style.backgroundColor = "#000";
      dec.style.color = "#fff"; }
    else {
      dec.style.backgroundColor = "#fff";
      dec.style.color = "#000"; }
    
    buffer = totVal(s.Basic.patterns[i - 1].val);
    tot.innerHTML = buffer;
    if (buffer < 0) { 
      tot.style.backgroundColor = "#000";
      tot.style.color = "#fff"; }
    else {
      tot.style.backgroundColor = "#fff";
      tot.style.color = "#000"; }
  
    buffer = s.Basic.patterns[i - 1].val.obj;
    diams.innerHTML = buffer;
    if (buffer < 0) { diams.style.backgroundColor = "#" + findSlot(1,-2).color; }
    else { diams.style.backgroundColor = "#" + findSlot(1,-1).color; }
    
    buffer = s.Basic.patterns[i - 1].val.sub;
    hearts.innerHTML = buffer;
    if (buffer < 0) { hearts.style.backgroundColor = "#" + findSlot(-1,-2).color; }
    else { hearts.style.backgroundColor = "#" + findSlot(-1,-1).color; }
    
    buffer = s.Basic.patterns[i - 1].val.nor;
    spades.innerHTML = buffer;
    if (buffer < 0) { spades.style.backgroundColor = "#" + findSlot(1,2).color; }
    else { spades.style.backgroundColor = "#" + findSlot(1,1).color; }
    
    buffer = s.Basic.patterns[i - 1].val.mys;
    clubs.innerHTML = buffer;
    if (buffer < 0) { clubs.style.backgroundColor = "#" + findSlot(-1,2).color; }
    else { clubs.style.backgroundColor = "#" + findSlot(-1,1).color; }

    frm.innerHTML = s.Basic.patterns[i - 1].frm;
    sbstc.innerHTML = s.Basic.patterns[i - 1].sbstc;
    
    for (var j = 14; j < s.Basic.patterns[i - 1].bens.length + 14; j++) {
      bens = row.insertCell(j);
      colors = colorBenTableCell(s.Basic.patterns[i - 1].bens[j - 14], limit);
      bens.style.backgroundColor = "#" + colors.bg;
      bens.style.color = "#" + colors.text;
      bens.innerHTML = "<div style='width:100%; height:100%; padding: 2px; margin: -2px;' onmouseout='defaultHover();' onmouseover='bensHover(" + [i - 1] + ", " + [j - 14] + ");'>" + totVal(s.Basic.patterns[i - 1].bens[j - 14]) + "</div>"; }}}



// GROUP



function updateGroupList(diffs, hover) { if(s.Basic.maxDebug) {console.log("UPDATEGROUPLIST"); }
  var table = document.getElementById("groupTable");
  var limit = getBenLimit(s.Basic.groups);

  for (var i = 1; i <= s.Basic.groups.length; i++) {  
    ids = table.rows[i].cells[0];
    dec = table.rows[i].cells[1];
    tot = table.rows[i].cells[2];
    diams = table.rows[i].cells[3];
    hearts = table.rows[i].cells[4];
    spades = table.rows[i].cells[5];
    clubs = table.rows[i].cells[6];
    
    ids.innerHTML = "<div style='text-align:right !important'>" + drawIds(s.Basic.groups[i - 1]) + "</div>";
    
    buffer = dispDec(s.Basic.groups[i - 1]);
    dec.innerHTML = buffer;
    if (buffer < 0) { 
      dec.style.backgroundColor = "#000";
      dec.style.color = "#fff"; }
    else {
      dec.style.backgroundColor = "#fff";
      dec.style.color = "#000"; }

    buffer = totVal(s.Basic.groups[i - 1].val);
    tot.innerHTML = buffer;
    if (buffer < 0) { 
      dec.style.backgroundColor = "#000";
      dec.style.color = "#fff"; }
    else {
      dec.style.backgroundColor = "#fff";
      dec.style.color = "#000"; }
    
    buffer = s.Basic.groups[i - 1].val.obj;
    diams.innerHTML = buffer;
    if (buffer < 0) { diams.style.backgroundColor = "#" + findSlot(1,-2).color; }
    else { diams.style.backgroundColor = "#" + findSlot(1,-1).color; }
    
    buffer = s.Basic.groups[i - 1].val.sub;
    hearts.innerHTML = buffer;
    if (buffer < 0) { hearts.style.backgroundColor = "#" + findSlot(-1,-2).color; }
    else { hearts.style.backgroundColor = "#" + findSlot(-1,-1).color; }
    
    buffer = s.Basic.groups[i - 1].val.nor;
    spades.innerHTML = buffer;
    if (buffer < 0) { spades.style.backgroundColor = "#" + findSlot(1,2).color; }
    else { spades.style.backgroundColor = "#" + findSlot(1,1).color; }
    
    buffer = s.Basic.groups[i - 1].val.mys;
    clubs.innerHTML = buffer;
    if (buffer < 0) { clubs.style.backgroundColor = "#" + findSlot(-1,2).color; }
    else { clubs.style.backgroundColor = "#" + findSlot(-1,1).color; }
    
    for (var j = 7; j < s.Basic.groups[i - 1].bens.length + 7; j++) {
      bens = table.rows[i].cells[j];
      colors = colorBenTableCell(s.Basic.groups[i - 1].bens[j - 7], limit);
      bens.style.backgroundColor = "#" + colors.bg;
      bens.style.color = "#" + colors.text;
      if(!diffs) { bens.innerHTML = "<div style='width:100%; height:100%; padding: 2px; margin: -2px;' onmouseout='defaultHover();' onmouseover='groupBensHover(" + [i - 1] + ", " + [j - 7] + ");'>" + totVal(s.Basic.groups[i - 1].bens[j - 7]) + "</div>"; }
      else { bens.innerHTML = "<div style='width:100%; height:100%; padding: 2px; margin: -2px;' onmouseout='defaultHover();' onmouseover='groupBensHover(" + [i - 1] + ", " + [j - 7] + ");'>" + reportValDiff(totVal(s.Basic.groups[i - 1].bens[j - 7]), totVal(diffs[i - 1].bens[j - 7]), hover) + "</div>"; }}}}

function drawGroupList(diffs) { if(s.Basic.maxDebug) {console.log("DRAWGROUPLIST"); }
  var table = document.getElementById("groupTable");
  var row;
  var ids = "";
  var dec;
  var tot;
  var diams;
  var hearts;
  var spades;
  var clubs;
  var bens;
  var colors;
  var limit = getBenLimit(s.Basic.groups);
  //var scale = makeScale(limit);
  
  row = table.insertRow(0);
  ids = row.insertCell(0);
  dec = row.insertCell(1);
  tot = row.insertCell(2);
  diams = row.insertCell(3);
  diams.style.backgroundColor = "#FFBBBD";
  hearts = row.insertCell(4);
  hearts.style.backgroundColor = "#FFBBEE";
  spades = row.insertCell(5);
  spades.style.backgroundColor = "#FFDDBC";
  clubs = row.insertCell(6);
  clubs.style.backgroundColor = "#FFFEBC";
  
  ids.innerHTML = "<div style='text-align:center;'>pop</div>";
  ids.style.backgroundColor = "#ccc";
  dec.innerHTML = "<div style='text-align:center;'>dec</div>";
  dec.style.backgroundColor = "#ccc";
  tot.innerHTML = "<div style='text-align:center;'>val</div>";
  tot.style.backgroundColor = "#ccc";
  diams.innerHTML = "<div style='text-align:center;'>&diams;</div>";
  hearts.innerHTML = "<div style='text-align:center;'>&hearts;</div>";
  spades.innerHTML = "<div style='text-align:center;'>&spades;</div>";
  clubs.innerHTML = "<div style='text-align:center;'>&clubs;</div>";
  
  for (var i = 0; i < s.Basic.groups.length; i++) {
    bens = row.insertCell(i + 7);
    bens.innerHTML = "<div style='text-align:center;'>" + drawIds(s.Basic.groups[i]) + "</div>";
    bens.style.backgroundColor = "#ccc"; }
  
  for (var i = 1; i <= s.Basic.groups.length; i++) {
    row = table.insertRow(i);
    ids = row.insertCell(0);
    dec = row.insertCell(1);
    tot = row.insertCell(2);
    diams = row.insertCell(3);
    diams.style.backgroundColor = "#FFBBBD";
    hearts = row.insertCell(4);
    hearts.style.backgroundColor = "#FFBBEE";
    spades = row.insertCell(5);
    spades.style.backgroundColor = "#FFDDBC";
    clubs = row.insertCell(6);
    clubs.style.backgroundColor = "#FFFEBC";
    
    ids.innerHTML = "<div style='text-align:right !important'>" + drawIds(s.Basic.groups[i - 1]) + "</div>";
    
    buffer = dispDec(s.Basic.groups[i - 1]);
    dec.innerHTML = buffer;   
    if (buffer < 0) { 
      dec.style.backgroundColor = "#000";
      dec.style.color = "#fff"; }
    else {
      dec.style.backgroundColor = "#fff";
      dec.style.color = "#000"; }
    
    buffer = totVal(s.Basic.groups[i - 1].val);
    tot.innerHTML = buffer;
    if (buffer < 0) { 
      tot.style.backgroundColor = "#000";
      tot.style.color = "#fff"; }
    else {
      tot.style.backgroundColor = "#fff";
      tot.style.color = "#000"; }
    
    buffer = s.Basic.groups[i - 1].val.obj;
    diams.innerHTML = buffer;
    if (buffer < 0) { diams.style.backgroundColor = "#" + findSlot(1,-2).color; }
    else { diams.style.backgroundColor = "#" + findSlot(1,-1).color; }
    
    buffer = s.Basic.groups[i - 1].val.sub;
    hearts.innerHTML = buffer;
    if (buffer < 0) { hearts.style.backgroundColor = "#" + findSlot(-1,-2).color; }
    else { hearts.style.backgroundColor = "#" + findSlot(-1,-1).color; }
    
    buffer = s.Basic.groups[i - 1].val.nor;
    spades.innerHTML = buffer;
    if (buffer < 0) { spades.style.backgroundColor = "#" + findSlot(1,2).color; }
    else { spades.style.backgroundColor = "#" + findSlot(1,1).color; }
    
    buffer = s.Basic.groups[i - 1].val.mys;
    clubs.innerHTML = buffer;
    if (buffer < 0) { clubs.style.backgroundColor = "#" + findSlot(-1,2).color; }
    else { clubs.style.backgroundColor = "#" + findSlot(-1,1).color; }
    
    for (var j = 7; j < s.Basic.groups[i - 1].bens.length + 7; j++) {
      bens = row.insertCell(j);
      colors = colorBenTableCell(s.Basic.groups[i - 1].bens[j - 7], limit);
      bens.style.backgroundColor = "#" + colors.bg;
      bens.style.color = "#" + colors.text;
      bens.innerHTML = "<div style='width:100%; height:100%; padding: 2px; margin: -2px;' onmouseout='defaultHover();' onmouseover='groupBensHover(" + [i - 1] + ", " + [j - 7] + ");'>" + necStaVal(s.Basic.groups[i - 1].bens[j - 7]) + "</div>"; }}}



// TABLES STUFF END
      
      

function getBenLimit(context) {
  var X = [];
  var Y = [];
  var curr;
  for(var i = 0; i < context.length; i++) {
    for(var j = 0; j < context.length; j++) {
      curr = context[i].bens[j];
      X.push(Math.max(curr.gno), (curr.rat));
      Y.push(Math.max(curr.abs), (curr.tan));}}
  X.sort(function(a,b) { return parseFloat(b) - parseFloat(a) } );
  Y.sort(function(a,b) { return parseFloat(b) - parseFloat(a) } );
  var limit = {X : X[0], Y : Y[0]};
  return limit; }
  
  

function findColorsByXY(X, Y) {
  var colors = {bg : "", text : ""};
  var slot = findSlot(X, Y);
  colors.bg = slot.color;
  colors.text = slot.textColor;
  return colors; }
  
  
  
function colorBenTableCell(val, limit) {
  var normalize = false;
  var colors = {bg : "fff", text : "000"};
  var X = val.rat - val.gno;
  var Y = val.abs - val.tan;
  var absX = Math.abs(X);
  var absY = Math.abs(Y);
  //var ratio = (Math.min(absX, absY) / Math.max(absX, absY));
  
  /*if (!normalize) {
    X = (X / limit.X) * (s.Basic.res / 2);
    Y = (Y / limit.Y) * (s.Basic.res / 2);
    if (X < 0) { X = Math.ceil(X) }
    if (X > 0) { X = Math.floor(X) }
    if (Y < 0) { Y = Math.ceil(Y) }
    if (Y > 0) { Y = Math.floor(Y) }}
  else {
    if(X < Y) {
      X = smaller;
      Y = limit; }
    else {
      Y = smaller;
      X = limit; }
    X = (X / limit) * (s.Basic.res / 2);
    Y = (Y / limit) * (s.Basic.res / 2);
    if (X < 0) { X = Math.ceil(X) }
    if (X > 0) { X = Math.floor(X) }
    if (Y < 0) { Y = Math.ceil(Y) }
    if (Y > 0) { Y = Math.floor(Y) }}*/
    
  
  
  /*
    X = val.rat - val.gno;
    Y = val.abs - val.tan;
    absX = Math.abs(X);
    absY = Math.abs(Y);
    if (!(absX === 0) && (absY === 0)) { prop = (Math.min(absX, absY) / Math.max(absX, absY)); }
    if (absX < absY) {
      absY = absY * (Math.floor(limit) / absY);
      absX = absY * prop;}
    else {
      absX = absX * (Math.floor(limit) / absX);
      absY = absX * prop; }
    if (X < 0) { X = Math.ceil(-absX) }
    if (X > 0) { X = Math.floor(absX) }
    if (Y < 0) { Y = Math.ceil(-absY) }
    if (Y > 0) { Y = Math.floor(absY) }}
  console.log("X " + X + " Y " + Y);*/
  /*
    X = val.rat - val.gno;
    Y = val.abs - val.tan;
    diffXY = X - Y;
    
    X = X / limit;
    Y = Y / limit;
    diffXY = diffXY / limit;
    
    X = X * (s.Basic.res / 2);
    Y = Y * (s.Basic.res / 2);
    diffXY = diffXY * (s.Basic.res / 2);
    
    console.log(diffXY);*/
    
    //X = X / (1 / limit);
    //Y = Y / (1 / limit);
    //X = X * (s.Basic.res / 2);
    //Y = Y * (s.Basic.res / 2);
    
    //X = ((val.rat - val.gno) / limit) * (s.Basic.res / 2);
    //Y = ((val.abs - val.tan) / limit) * (s.Basic.res / 2);

  
  /*if (normalize) {
    var magn = Math.abs(X) + Math.abs(Y);
    
    }*/
  //console.log("X: " + X + ", Y: " + Y);
  //if(s.Basic.initDone) { return findColorsByXY(X, Y); }
  //else {
  return colors; }
//}
  


function drawButton(id) { if(s.Basic.maxDebug) {console.log("DRAWBUTTON"); }
  var buttonText;
  switch(id) {
    case "newPerson" : { buttonText = "New Person"; break; }
    case "delPerson" : { buttonText = "Del Person"; break; }
    case "startGame" : { buttonText = "Play (Enter)"; break; }
    case "restart" : { buttonText = "Restart"; break; }
    case "autoPlay" : {
      if (s.Basic.autoBotTurn === -1) { buttonText = "Autoplay: Off"; }
      else { buttonText = "Autoplay: On"; }
      break;}
    case "devFunc" : { buttonText = "dev"; break; }}
  $("#" + id).append("<div onmouseout='defaultHover();' onmouseover='" + id + "Hover();' onclick='" + id + "();' class='amoqButton'>" + buttonText + "</div>");}



// ============
// UI STUFF END
// ============



// ==============
// AI STUFF BEGIN
// ==============



function Strategy(mode, id, name, desc, val, perVals, priors, rule) {
  this.mode = mode;
  if (!id) { this.id = mode.strategies.length; }
  else { this.id = id; }
  if (!name) { this.name = getStrategyNameById(id); }
  else { this.name = name; }
  if (!name) { this.desc = getStrategyDescById(id); }
  else { this.desc = desc; }
  if(val === false) { this.val = nullPat(); }
  else { this.val = val; }
  if(perVals === false) { this.perVals = valForEach(relVal(0,0), mode.persons); } //äöå
  else { this.perVals = perVals; }
  /*if (!vals) { this.vals = valForEach(relVal(0,0), mode.persons); }
  else { this.vals = vals; }*/
  if (!priors) { this.priors = valForEach(mode.strategies.length, mode.persons); } //change len to -1 when time to teach
  else { this.priors = priors; }
  if (!rule) { this.rule = getStrategyRuleById(id);}
  else { this.rule = rule; }}



function getStrategyNameById(id) {
  for (var i = 0; i < mode.strategies.length; i++) {
    if (mode.strategies[i].id === id) {
      return mode.strategies[i].name; }}}

function getStrategyDescById(id) {
  for (var i = 0; i < mode.strategies.length; i++) {
    if (mode.strategies[i].id === id) {
      return mode.strategies[i].desc; }}}

function getStrategyRuleById(id) {
  for (var i = 0; i < mode.strategies.length; i++) {
    if (mode.strategies[i].id === id) {
      return mode.strategies[i].rule; }}}

function getStrategiesOfPerson(person) {
  var strats = [];
  var ret = [];
  var buffer = { strats : null, prior : 0};
  for (var i = 0; i < s.mode.strategies.length; i++) {
    if (!(s.mode.strategies[i].priors[person.id] === -1))
      buffer.strat = s.mode.strategies[i];
      buffer.prior = s.mode.strategies[i].priors[person.id];
      strats.push({ strat : buffer.strat, prior : buffer.prior}); }
  for (var i = 0; i < strats.length; i++) {
    if (strats.prior === -1) {
      strats.splice(i, 1);
      i--; }}
  strats.sort(function(a,b) { return parseFloat(b.prior) - parseFloat(a.prior) });
  for (var i = 0; i < strats.length; i++) {
    ret.push( strats[i].strat ); }
  return ret; }



function ai(agent) { if(s.Basic.maxDebug) {console.log("AI"); }
  var moves = _.shuffle(availableSlots(agent));
  var strats = getStrategiesOfPerson(agent);
  for (var i = 0; i < strats.length; i++ ) {
    moves = strats[i].rule(moves); }
  for (var i = 1; i < moves.length; i++ ) {
    if (moves[i].totsPersonVal < moves[i - 1].totsPersonVal) {
      moves = moves.slice(0, i);
      break; }}
  if (moves.length > 1) { moves = _.shuffle(moves); }
  return { X: moves[0].X, Y: moves[0].Y }; }

function justifyMoveForPerson(agent, X, Y, rule) { // IRREregardless of whether agent is personInTurn, this function tells whether moving to (X, Y) is justified by rule for agent
  var moves = rule(availableSlots(agent));
  var strats = getStrategiesOfPerson(agent);
  for (var i = 1; i < moves.length; i++ ) {
    if (moves[i].totsPersonVal < moves[i - 1].totsPersonVal) {
      moves = moves.slice(0, i);
      break; }}
  if (contains(moves, findSlot(X, Y))) { return true; }
  else { return false; }}



/*
THIS FUNCTION IS TOO COMPLICATED:
it evaluates whether A thinks B is dumb or not. I was supposed to write strategry evaluation stuff, not this! FUU

function simAi(agent, target) { if(s.Basic.maxDebug) {console.log("SIMAI"); }
  var moves = availableSlots(target);
  var strats = getStrategiesOfPerson(agent);
  moves = _.shuffle(moves);
  movesMat = [];
  for (var i = 0; i < strats.length; i++) {
    movesMat.push(strats[i].rule(moves)); // NB! could optimize after this line by evaluating only the move(s) with the highest strategic val
    for (var j = 0; j < movesMat[i].length; j++) {
      movesMat[i][j].stratValsDiff = calcPersons(movesMat[i][j].X, movesMat[i][j].Y); // NB! could optimize here by calling specific person
      movesMat[i][j].stratValsDiff = movesMat[i][j].stratValsDiff[i].val; }}
  //console.log(movesMat);
  return movesMat; }*/

/*function movesMatCopy(function, mat) {
  var output = [];
  for (var i = 0; i < mat.length; i++) {
    output.push(mat[i].map(copy))*/

//BUG!!! bens report nonrelz value even for player who has experienced no levelup?


/*function getGroupIdByIds(ids) {
  for (var i = 0; i < s.mode.groups.length; i++) {
    if(ids === s.mode.groups[i].ids) { return s.mode.groups[i].id; }}}*/


function simAiGroups(personStrats, personInTurn) {
  var memberOfGroups;
  var groupStrats = [];
  var buffer;
  var buffer2;
  for (var i = 0; i < personStrats.length; i++) {
    for (var j = 0; j < personStrats[i].length; j++ ) {
      //buffer = [];
      for (var k = 0; k < s.mode.groups.length; k++ ) {
        /*if (contains(s.mode.groups[k].ids, personInTurn.id )) {
          buffer.push(personStrats[i][j]); }*/
        /*else {
          buffer2 = [];
          for (var l = 0; l < personStrats[i][j].length; l++ ) {
            buffer2.push(relVal(0,0)); }
            buffer.push(buffer2);}*/}
      groupStrats.push(buffer);}}
  console.log(groupStrats);}



    /*
    memberOfGroups = findAllGroupsOfPerson(s.mode.persons[i]);
    for (var j = 0; j < personStrats[i].length; j++) {
      buffer = calcGroups(personStrats[i][j].X, personStrats[i][j].Y);
      for (var k = 0; k < memberOfGroups.length; k++) {
        memberOfGroups[k].stratGValsDiff = sumVal(memberOfGroups[k].stratGValsDiff, personStrats[i][j].stratValsDiff[i].val); }}}}*/


  /*      if(contains(s.Basic.groups[i].ids, j)) {

  var memberOf;
  for (var i = 0; i < s.Basic.groups.length; i++ ) {
    for (var j = 0; j < personStrats.length; j++) {
      memberOf
      for (var k = 0; k < personStrats[j].length; k++) {
        if(contains(s.Basic.groups[i].ids, j)) {

}*/

//xyy



// separate ino, bio, soc and int val around here. define pattern as an object of four vals. this way the core learn to process classical quality (properly)
function calcStratVals(personInTurn, X, Y, personsDiffs, groupsDiffs) { //remove x and y?
  var thingsTotalVal = relVal(0,0);
  var personsTotalVal = relVal(0,0);
  var groupsTotalVal = relVal(0,0);
  var personGetsReward = [];
  var stratGetsReward = [];
  var personGetsReward = [];
  var stratsDiff = { vals: [], perVals: []}
  var buffer;
  // calculate the pot :
  for(var i = 0; i < s.mode.persons.length; i++) {
    personsTotalVal = sumVal(personsTotalVal, personsDiffs[i].val); }
  for(var i = 0; i < s.mode.groups.length; i++) {
    groupsTotalVal = sumVal(groupsTotalVal, groupsDiffs[i].val); }
  // select recipients of pot :
  for (var i = 0; i < s.mode.strategies.length; i++) {
    stratGetsReward.push(justifyMoveForPerson(personInTurn, X, Y, s.mode.strategies[i].rule ));
    buffer = [];
    for (var j = 0; j < s.mode.persons.length; j++) {
      buffer.push(justifyMoveForPerson(s.mode.persons[j], X, Y, s.mode.strategies[i].rule)); }
    personGetsReward.push(buffer); }
  console.log(personGetsReward);
  // send the pot :
  for (var i = 0; i < s.mode.strategies.length; i++ ) {
    if (stratGetsReward[i]) {
      stratsDiff.vals.push(new Pattern(true, false, thingsTotalVal, personsTotalVal, groupsTotalVal, relVal(0,0))); }
    else {
      stratsDiff.vals.push(new Pattern(true, false, relVal(0,0), relVal(0,0), relVal(0,0), relVal(0,0))); }}
  for (var i = 0; i < s.mode.strategies.length; i++) {
    buffer = [];
    for (var j = 0; j < s.mode.persons.length; j++) {
      if(personGetsReward[j] && stratGetsReward[i]) {
        buffer.push(new Pattern(true, false, thingsTotalVal, personsTotalVal, groupsTotalVal, relVal(0,0))); }
      else {
        buffer.push(new Pattern(true, false, relVal(0,0), relVal(0,0), relVal(0,0), relVal(0,0))); }
      stratsDiff.perVals.push(buffer); }}
  console.log(stratsDiff);
  return stratsDiff; }



    //console.log("stratsDiff[" + i + "].bio:");
    //console.log(stratsDiff[i].bio);
  

  //for (var i = 0; i < stratsDiff.length; i++ ) {
    //console.log("stratsdiff[" + i + "]:");
    //console.log(stratsDiff[i]); }

  /*for (var i = 0; i < personsDiffs.length; i++) {
    personStrats.push(stratVal)
  }*/

  //for (var i = 0; i < s.mode.persons.length; i++ ) {
    //personStrats.push(simAi(s.mode.persons[i], personInTurn)); }
  //simAiGroups(personStrats, personInTurn);
  /*for (var i = 0; i < s.mode.groups.length; i++ ) {
    groupStrats.push(simAiGroups(personStrats, personInTurn)); }*/
  /*for (var i = 0; i < s.mode.groups.length; i+0 ) {
    console.log (s.mode.groups[i].stratGValsDiff);
  }*/

  //return personStrats; }



function calcStrategies(X, Y, personsDiffs, groupsDiffs) {
  var calcs = calcStratVals(s.mode.personInTurn, X, Y, personsDiffs, groupsDiffs); 
  return calcs; }
  //var ret = [];
  //, gVals : [], priors : [] };
  //for (var i = 0; i < calcs.length; i++) {
  //  ret.push(calcs[i])
  /*var ret = [];
  for (var i = 0; i < s.mode.strategies.length; i++) {
    //yhyy en jaksa :D
  }*/
  //console.log(calcs);
  //stratsDiff.gVals =

  //calcStratGVals(groupsDiffs);
  //stratsDiff.vals = addGVals(stratsDiff.gVals);
  //calcStratPriors(stratsDiff.vals);
  //console.log(stratsDiff);
  //console.log(stratsDiff.vals);
  //return calcs; }



function totsVal(valList, type) {
  var output = relVal(0,0);
  if (typeof type === "string") {
    for (var i = 0; i < valList.length; i++) {
      switch(type) {
        case "obj" : output = sumVal(output, valList[i].obj); break;
        case "sub" : output = sumVal(output, valList[i].sub); break;
        case "nor" : output = sumVal(output, valList[i].nor); break;
        case "mys" : output = sumVal(output, valList[i].mys); break;
        case "abs" : output = sumVal(output, valList[i].abs); break;
        case "tan" : output = sumVal(output, valList[i].tan); break;
        case "gno" : output = sumVal(output, valList[i].gno); break;
        case "rat" : output = sumVal(output, valList[i].rat); break;
        case "dyn" : output = sumVal(output, valList[i].dyn); break;}}}
  else {
    for (var i = 0; i < valList.length; i++) {
      output = sumVal(output, valList[i]); }}
  return totVal(output); }

function sumsVal(valList) {
  var output = relVal(0,0);
  for (var i = 0; i < valList.length; i++) {
    output = sumVal(output, valList[i]); }
  return output; }

  /*function simPersons(personList, X, Y) {
  var output = relVal(0,0);
  for (var i = 0; i < personList.length; i++) {
    output = sumVal(output, personList[i].val); }
  return totVal(output); }*/

  /*var buffer;
  for(var i = 0; i < mode.strategies.length; i++) {
    buffer = [];
    for(var j = 0; j < mode.persons.length; j++) {
      buffer.push(mode.strategies[i].vals[j]); }
    stratDiff.push(buffer);}
  console.log(stratDiff); }*/



function createStrategies(mode) {

  /*if(mode.name === "BasicMode") {
    mode.strategies.push(new Strategy (mode, false, "personSelfless", "Prefers immediate value for anyone. Ignores groups.",
      false,
      function(moves) {
        for (var i = 0; i < moves.length; i++) {
          moves[i].simVal = calcPersons(moves[i].X, moves[i].Y);
          moves[i].simVal = simPersons(moves[i].simVal, moves[i].X, moves[i].Y); }
        moves.sort(function(a,b) { 
          return parseFloat(b.simVal) - parseFloat(a.simVal) });
        for (var i = 1; i < moves.length; i++) {
          if (moves[0].simVal > moves[i].simVal) {
            moves = moves.slice(0, i - 1);
            break; }}
        for (var i = 0; i < moves.length; i++) {
          for (var j = 0; j < mode.personInTurn.bens.length; j++) {
            moves[i].simVal = totVal(mode.personInTurn.bens[j])
          }
        }
        }
      })); }*///xxx

/*
  if(mode.name === "BasicMode") {
    mode.strategies.push(new Strategy (mode, false, "naiveSelfless", "Prefers immediate value for anyone. Ignores benefactors and groups.",
      false,
      function(moves) { //remove nonlevelups for all .. xxx doesnt work
        for (var i = 0; i < moves.length; i++) {
          moves[i].simVal = calcPersons(moves[i].X, moves[i].Y);
          moves[i].simVal = simPersons(moves[i].simVal, moves[i].X, moves[i].Y); }
        return moves.sort(function(a,b) {
          return parseFloat(b.simVal) - parseFloat(a.simVal) }); })); }

  if(mode.name === "BasicMode") {
    mode.strategies.push(new Strategy (mode, false, "naiveSelfish", "Prefers immediate value for self. Ignores others and groups.",
      false,
      function(moves) {
        removeNonLevelUps(mode.personInTurn, moves);
        return moves.sort(function(a,b) {
          return parseFloat(b.absVal) - parseFloat(a.absVal) }); })); }
    */

  if(mode.name === "BasicMode") {
    mode.strategies.push(new Strategy (mode, false, "naiveSelfless", "Prefers immediate value for anyone. Ignores benefactors and groups.",
      false, false, false,
      function(moves) {
        for (var i = 0; i < moves.length; i++) { //ååå
          moves[i].totsPersonVal = calcPersons(moves[i].X, moves[i].Y);
          moves[i].totsPersonVal = totsPersonVal(moves[i].totsPersonVal, moves[i].X, moves[i].Y); }
        return moves.sort(function(a,b) {
          return parseFloat(b.totsPersonVal) - parseFloat(a.totsPersonVal) }); })); }

  if(mode.name === "BasicMode") {
    mode.strategies.push(new Strategy (mode, false, "naiveSelfish", "Prefers immediate value for self. Ignores others and groups.",
      false, false, false,
      function(moves) {
        for (var i = 0; i < moves.length; i++) {
          moves[i].totsPersonVal = calcPersons(moves[i].X, moves[i].Y);
          //xxx
          moves[i].totsPersonVal = totsPersonVal(moves[i].totsPersonVal); }
        return moves.sort(function(a,b) {
          return parseFloat(b.totsPersonVal) - parseFloat(a.totsPersonVal) }); })); }

  if(mode.name === "BasicMode") {
    mode.strategies.push(new Strategy (mode, false, "naiveSelfishNS", "Prefers immediate necessarily static value for self. Ignores others and groups.",
      false, false, false,
      function(moves) {
        return moves.sort(function(a,b) {
          return parseFloat(b.necStaVal) - parseFloat(a.necStaVal) }); })); }

  mode.intl.push(mode.strategies[mode.strategies.length]);
/*console.log("CREATSTRATS:");
console.log(mode.strategies);
console.log("CREATESTRATS end");*/
}





/*function mapMat(func, matX, matY) {
  var XLen = 
  var output = [];
  for (var i = 0; i < matY; i++) {
    output.push()*/



  

/*function findAllGroupsOfPerson(person) {
  var memberships = [];
  for(var i = 0; i < s.Basic.groups.length; i++) {
    if(contains(s.Basic.groups.ids, person.id)) {
      memberships.push(i); }}
  return memberships; }*/

/*
  
function groupNecStaVal(val) {
  var groups = findAllGroupsOfPerson(s.Basic.personInTurn);
  var output = 0;
  for (var i = 0; i < groups.length; i++) {
    for (var j = 0; j < groups.persons.length; j++) {
      //yyy
      console.log("moi");
}}}*/
    
/*  s.Basic.strategies.push(new Strategy ("Nn", "naiveNR", mode.persons, relVal(0,0), function(a,b) {
    return parseFloat(b.totVal) - parseFloat(a.totVal) } ));
    
  s.Basic.strategies.push(new Strategy ("i", "individualistic", mode.persons, relVal(0,0), function(a,b) {
    var aCalcs = calcPersons(a.X, a.Y);
    var bCalcs = calcPersons(b.X, b.Y);
    aCalcs = aCalcs.sort(function(a,b) { return parseFloat(b.val.necStaVal) - parseFloat(a.val.necStaVal)});
    bCalcs = bCalcs.sort(function(a,b) { return parseFloat(b.val.necStaVal) - parseFloat(a.val.necStaVal)});
    return Math.max(parseFloat(aCalcs[0].val.necStaVal) - parseFloat(bCalcs[0].val.necStaVal)) } ));*/
    
    
  /*s.Basic.strategies.push(new Strategy ("c", "collectivist", 0, 0, function(a,b) {
    return parseFloat(b.necStaVal) - parseFloat(a.necStaVal) } ));*/
  //s.Basic.strategies.push(new Strategy ("c", "cooperative", 0, 0, 
//}



// ============
// AI STUFF END
// ============

  
  
// =================
// GROUP STUFF BEGIN
// =================



function Group(persons) {
  this.ids = personListToIds(persons);
  this.persons = persons;
  this.val = relVal(0,0);
  this.antiVal = relVal(0,0);
  this.bens = []; }
  
function GroupRole(ids, persons, val, antiVal, bens) { // i would have merged this function with Groups if I had known how at the time
  this.ids = ids;
  this.persons = persons;
  this.val = val;
  this.antiVal = antiVal;
  this.bens = bens; }



function sumValArr(persons) {
  var val = relVal(0,0);
  for(var i = 0; i < persons.length; i++) {
    val = sumVal(val,persons[i].val); }
  return val; }

function sumAntiValArr(persons) {
  var val = relVal(0,0);
  for(var i = 0; i < persons.length; i++) {
    val = sumVal(val,persons[i].antiVal); }
  return val; }

function sumBens(b1, b2) {
  var output = [];
  for (var i = 0; i < b1.length; i++) {
    output.push(sumVal(b1[i], b2[i])); }
  return output; }



function personListToIds(personList) {
  var ids = [];
  for(var i = 0; i < personList.length; i++) {
    ids.push(personList[i].id); }
  return ids; }
  
function copyGroups(groups) { if(s.Basic.maxDebug) {console.log("COPYGROUPS"); }  
  var copy = [];
  if(typeof groups === "array") {
    for (var i = 0; i < groups.length; i++) {
      copy.push(new GroupRole(groups[i].ids, groups[i].persons, groups[i].val, groups[i].antiVal, groups[i].bens)); }}
  return copy; }
  
function groupsMembersToIdLists (groups) {
  var output = [];
  var buffer;
  for (var i = 0; i < groups.length; i++) {
    buffer = [];
    for (var j = 0; j < groups[i].persons.length; j++) {
      buffer.push(groups[i].persons[j].id);}
    output.push(buffer); }
  return output; }

function personListsToGroupIdLists(personLists) {
  var groups = [];
  for (var i = 0; i < personLists.length; i++) {
    groups.push(new Group(personLists[i])); }
  groups = groupsMembersToIdLists(groups);
  return groups; }
  
function copyPersonById(id) {
  var copy;
  for (var i = 0; i < s.Basic.persons.length; i++) {
    if(id === s.Basic.persons[i].id) {
      copy = new Role(i, s.Basic.persons[i].name, s.Basic.persons[i].bot, s.Basic.persons[i].hybrid, s.Basic.persons[i].X, s.Basic.persons[i].Y, s.Basic.persons[i].visX, s.Basic.persons[i].visY, s.Basic.persons[i].val, s.Basic.persons[i].antiVal, s.Basic.persons[i].bens, s.Basic.persons[i].xp, s.Basic.persons[i].preventXpChange); }}
  return copy; }
  
function makeGroupFromIds(ids) {
  var persons = [];
  for (var i = 0; i < ids.length; i++) {
    persons.push(copyPersonById(ids[i])); }
  var group = new Group(persons);
  return group; }

function makeGroupsFromIdLists(idLists) {
  var groups = [];
  for (var i = 0; i < idLists.length; i++) {
    groups.push(makeGroupFromIds(idLists[i])); }
  return groups; }

function addGroupBens(groups) {
  for (var i = 0; i < groups.length; i++) {
    for (var j = 0; j < groups.length; j++) {
      groups[i].bens.push(relVal(0,0)); }}
  return groups; }

function calcBensByIds(ids1, ids2) {
  var output = relVal(0,0);
  for(var i = 0; i < ids1.length; i++) {
    for(var j = 0; j < ids2.length; j++) {
      output = sumVal(output, s.Basic.persons[ids1[i]].bens[ids2[j]]); }}
  return output; }
  
function personIsMemberOfGroup(person, group) {
  var ret = false;
  for(var i = 0; i < group.ids.length; i++) {
    if(person.id === group.ids[i]) { ret = true; }}
  return ret; }
      
function calcAllGroupVals(mode, groups) {
  for(var i = 0; i < mode.persons.length; i++) {
    for(var j = 0; j < groups.length; j++) {
      if (personIsMemberOfGroup(mode.persons[i], groups[j])) {
        groups[j].val = sumVal(groups[j].val, mode.persons[i].val); }}}}



function calcAllGroupBens(groups) {
  var idsList = [];
  var newBens = [];
  var buffer;
  for(var i = 0; i < groups.length; i++) {
    idsList.push(groups[i].ids); }
  for(var i = 0; i < idsList.length; i++) {
    buffer = [];
    for(var j = 0; j < idsList.length; j++) {
      buffer.push(calcBensByIds(idsList[i], idsList[j]));}
    newBens.push(buffer); }
  for(var i = 0; i < groups.length; i++) {
    for(var j = 0; j < groups[i].bens.length; j++) {
      groups[i].bens[j] = newBens[i][j]; }}
  return groups; }

function calcGroupBens(groups) {
  var activeGroups = [];
  for(var i = 0; i < groups.length; i++) {
    if(contains(s.Basic.groups[i].ids, s.Basic.personInTurn.id)) {
      activeGroups.push(groups[i]); }}
  for(var i = 0; i < groups.length; i++) {
    for(var j = 0; j < groups.length; j++) {
      if(contains(activeGroups, groups[j])) {
        groups[i].bens[j] = groups[i].val;}
      else {
        groups[i].bens[j] = relVal(0,0); }}}
  return groups; }

function calcGroups(X, Y, personsDiffs) {
  var pertinentDiffs;
  var groupsDiff = [];
  for(var i = 0; i < s.Basic.groups.length; i++) {
    pertinentDiffs = [];
    for(var j = 0; j < personsDiffs.length; j++) {
      if(contains(s.Basic.groups[i].ids, j)) {
        pertinentDiffs.push(personsDiffs[j]); }}
    groupsDiff.push(new Group(pertinentDiffs));
    groupsDiff[i].val = sumValArr(pertinentDiffs);
    groupsDiff[i].antiVal = sumAntiValArr(pertinentDiffs); }
  groupsDiff = calcGroupBens(groupsDiff);
  return groupsDiff; }
      


function addGroups(mode, oldGroups) { if(s.Basic.maxDebug) {console.log("ADDGROUPS"); } // this function is still inefficient because copygroups function called by newperson used to be written wrongly (still is?)
  var debug = 0;

  if (debug === 1) { console.log("oldGroupIds:"); }
  var oldGroupIds = groupsMembersToIdLists(oldGroups); 
  if (debug === 1) { console.log(oldGroupIds); }
  
  if (debug === 1) { console.log("newGroupIds:"); }
  var newGroupIds = personListsToGroupIdLists(powerSetOf(s.Basic.persons));
  if (debug === 1) { console.log(newGroupIds); }
  
  if (debug === 1) { console.log("idsDiff:"); }
  var idsDiff = _.difference(newGroupIds, oldGroupIds);
  if (debug === 1) { console.log(idsDiff); }
  
  if (debug === 1) { console.log("newGroups"); }
  var newGroups = makeGroupsFromIdLists(idsDiff);
  if (debug === 1) { console.log(newGroups); }
  
  if (debug === 1) { console.log("oldAndNewGroups:"); }
  var oldAndNewGroups = oldGroups.concat(newGroups);
  if (debug === 1) { console.log(oldAndNewGroups); }
  
  if (debug === 2) { console.log("addBens:"); } 
  oldAndNewGroups = addGroupBens(oldAndNewGroups);
  if (debug === 2) { console.log(oldAndNewGroups); }
  
  if (debug === 2) { console.log("calcAllBens:"); } 
  oldAndNewGroups = calcAllGroupBens(oldAndNewGroups);
  if (debug === 2) { console.log(oldAndNewGroups); }
  
  if (debug === 3) { console.log("calcAllGroupVals:"); }  
  calcAllGroupVals(mode, oldAndNewGroups);
  if (debug === 3) { console.log(oldAndNewGroups); }
  
  mode.groups = oldAndNewGroups; }
  


// ===============
// GROUP STUFF END
// ===============



// ==================
// PERSON STUFF BEGIN
// ==================



function Person(name, bot, hybrid) { if(s.Basic.maxDebug) {console.log("PERSON"); }
  this.id = s.Basic.persons.length;
  this.name = name;
  this.bot = bot;
  this.hybrid = hybrid;
  this.X = 0;
  this.Y = 0;
  this.visX = 0;
  this.visY = 0;
  this.body = relVal(0,0);
  this.val = relVal(0,0);
  this.antiVal = relVal(0,0);
  this.bens = [relVal(0,0)];
  this.xp = new Val(0,1,1,1,0,0,1,0,0);
  this.preventXpChange = false; }
  
function Role(id, name, bot, hybrid, X, Y, visX, visY, val, antiVal, bens, xp, preventXpChange) {  if(s.Basic.maxDebug) {console.log("ROLE"); } //i would have merged this entire function with Person if I had known how at the time
  this.id = id;
  this.name = name;
  this.bot = bot;
  this.hybrid = hybrid;
  this.X = X;
  this.Y = Y;
  this.visX = visX;  // should replace visualization with Markover-style solution
  this.visY = visY;  // should replace visualization with Markover-style solution
  this.val = val;
  this.antiVal = antiVal;
  this.bens = bens;
  this.xp = xp;
  this.preventXpChange = preventXpChange; }



function availableSlot(slot, person) { if(s.Basic.maxDebug) {console.log("AVAILABLESLOT"); }
  var X = slot.X;
  var Y = slot.Y;
  var available = (slotAvailable(X, Y, person))
  if (available === true) { return true; }
  else { return false; }}
  
function availableSlots(person) { if(s.Basic.maxDebug) {console.log("AVAILABLESLOTS"); }
  var available;
  var slots = [];
  for (var i = 0; i < s.Basic.slots.length; i++) {
    available = availableSlot(s.Basic.slots[i], person);
    if (available === true) {
      slots.push(s.Basic.slots[i]);}}
  return slots;}



function getNumberOfPerson(person) { if(s.Basic.maxDebug) {console.log("GETNUMBEROFPERSON"); }
  for (var i = 0; i < s.Basic.persons.length; i++) {
    if (person === s.Basic.persons[i]) {
      return i;}}}
      
function nextPerson(person) { if(s.Basic.maxDebug) {console.log("NEXTPERSON"); }
  var id = getNumberOfPerson(person);
  if(id === (s.Basic.persons.length - 1)) {
    return s.Basic.persons[0];}
  else if (id < (s.Basic.persons.length - 1)) {
    return s.Basic.persons[id + 1]; }}

function prevPerson(person) { if(s.Basic.maxDebug) {console.log("PREVPERSON"); }
  var id = getNumberOfPerson(person);
  if(id === 0) {
    return s.Basic.persons[s.Basic.persons.length - 1];}
  else if (id < (s.Basic.persons.length)) {
    return s.Basic.persons[id - 1]; }}



function totsPersonVal(personList, X, Y) {
  var output = relVal(0,0);
  for (var i = 0; i < personList.length; i++) {
    output = sumVal(output, personList[i].val); }
  return totVal(output); } //ååå



function removeNonLevelUps(person, moves) {
  for(var i = 0; i < moves.length; i++) {
    if ((moves[i].X === 0) || (moves[i].Y === 0)) {
      if (nullVal(levelUpCheck(person.xp, moves[i].X, moves[i].Y))) {
        moves.splice(i,1);
        i--;}}}
  return moves;}

function levelUpCheck(xp, X, Y) { if(s.Basic.maxDebug) {console.log("LEVELUPCHECK:"); }
  var xp2 = makeXp(0, 0, 0, 0);
  if(!s.Basic.revertingXp) {
    if ((X === 0) || (Y === 0)) {
      if    ((X > 0) && (X > xp.rat)) { xp2.rat = X - xp.rat; }
      else if ((X < 0) && (X < -xp.gno)) { xp2.gno = -(X + xp.gno); }
      else if ((Y > 0) && (Y > xp.abs)) { xp2.abs = Y - xp.abs; }
      else if ((Y < 0) && (Y < -xp.tan)) { xp2.tan = -(Y + xp.tan); }}}
  else if(s.Basic.revertingXp) {
    if (((X === 0) || (Y === 0)) && !((X === 0) && (Y === 0))) {
      if    (X > 0) { xp2.rat = X - xp.rat; }
      else if (X < 0) { xp2.gno = -(X + xp.gno); }
      else if (Y > 0) { xp2.abs = Y - xp.abs; }
      else if (Y < 0) { xp2.tan = -(Y + xp.tan); }}}
  if (!(s.mode.xpRegulation === -1)) {
    if (Math.abs(totVal(xp2)) > s.mode.xpRegulation) { xp2 = makeXp(0, 0, 0, 0); }}
  else if (!(s.mode.xpCap === -1)) {
    if (maxVal(sumVal(xp, xp2)) > Math.floor(s.mode.xpCap)) { xp2 = makeXp(0, 0, 0, 0); }
    else if (maxVal(sumVal(xp, xp2)) > Math.floor(s.mode.res / 2)) { xp2 = makeXp(0, 0, 0, 0); }}
  return xp2; }



// evil when something has so low moral value it is moral to hurt it?
//
// eth for self-inflicted
//
// exc for excellence
//
// mor for... ?


  
function calcPersons(X, Y) { if(s.Basic.maxDebug) {console.log("CALCPERSONS:"); }
  var debug = false;
  if (!(debug === false)) { console.log("CALCPERSONS on turn " + s.Basic.turn + " (" + s.Basic.personInTurn.name + ")"); }
  var personsDiff = [];
  var newX = 0;
  var newY = 0;
  var newVisX = 0;
  var newVisY = 0;
  var valDiff = relVal(0,0);
  var antiValDiff;
  var bensDiff = [];
  var levelUp;
  var preventXpChange;

  var stratsDiff;
  var buffer;
  
  for (var i = 0; i < s.Basic.persons.length; i++) {

    if (s.Basic.personInTurn === s.Basic.persons[i]) {
      newX = X;
      newY = Y;}
    else {
      newX = s.Basic.persons[i].X + X;
      newY = s.Basic.persons[i].Y + Y;}

    if (!((newX === 0) || (newY === 0))) {
      newVisX = s.Basic.persons[i].X + X;
      newVisY = s.Basic.persons[i].Y + Y; }
    if (!((newX === 0) || (newY === 0))) { 
      valDiff = relVal(newX, newY); }

    if (!s.Basic.persons[i].preventXpChange) {
      levelUp = levelUpCheck(s.Basic.persons[i].xp, newX, newY);
      if (!nullVal(levelUp)) {
        valDiff = relVal(newX, newY);
        preventXpChange = true; }}
    else {
      levelUp = makeXp(0, 0, 0, 0);
      preventXpChange = false; }

    if (totVal(valDiff) < 0) { antiValDiff = valDiff; }
    else { antiValDiff = relVal(0,0); }

    personsDiff.push(new Role(i, false, false, false, newX, newY, newVisX, newVisY, valDiff, antiValDiff, bensDiff, levelUp, preventXpChange)); }

  for (var i = 0; i < personsDiff.length; i++) {
    buffer = [];    
    for (var j = 0; j < personsDiff.length; j++) {
      if (!(j === getNumberOfPerson(s.Basic.personInTurn))) {
        buffer.push(relVal(0, 0));}
      else {
        buffer.push(relVal(personsDiff[i].X, personsDiff[i].Y)); }}
      personsDiff[i].bens = buffer;}
    
  if (!(debug === false)) {
    var dev;
    if (debug === "val") {
      for (var i = 0; i < s.Basic.persons.length; i++) {
        dev = debugVal(personsDiff[i].val);
        console.log(i + ". " + dev);}}
    else if (debug === "bens") {
      devBens(personsDiff);}
    else if (debug === "levelup") {
      for (var i = 0; i < s.Basic.persons.length; i++) {
        console.log(personsDiff[i].xp);}}}
      
  return personsDiff; }



function devBens(persons) { if(s.Basic.maxDebug) {console.log("DEVBENS:"); }
  var buffer;
  for (var i = 0; i < persons.length; i++) {
    var buffer = [];
    for (var j = 0; j < persons.length; j++) {
      buffer.push(necStaVal(persons[i].bens[j]));}
    console.log(buffer);}}



// ================
// PERSON STUFF END
// ================



// ===================
// PATTERN STUFF BEGIN
// ===================



function Pattern(id, name, ino, bio, soc, intl) {
  if (!this.id) { this.id = s.Basic.patterns.length; } // set id as true when calling this function if you DON'T want to add this to any list in the UI as a pattern... ?
  else { this.id = false; } // does this even work .
  if (!this.name) { this.name = ""; }
  else { this.name = name; }
  this.ino = ino;
  this.bio = bio;
  this.soc = soc;
  this.intl = intl;
  this.frm = "form";
  this.sbstc = "substance"; }

function makePVal(ino, bio, soc, intl) {
  this.asValue = new Val(0, 0, 0, 0, soc, ino, 0, intl, bio);

  ret = new PVal(0, 0, 0, 0, soc, ino, 0, intl, bio);
  return ret; } //zyy

function personIntoPattern(person) {
  var pat = new Pattern(person.name, person.body.val, person.val, relVal(0,0), relVal(0,0) );
  /*for (var i = 0; i < s.Basic.patterns.length; i++ ) {
    for (var j = 0; j < s.Basic.patterns.length; j++ ) {
      s.Basic.patterns[j].bens[i][s.Basic.patterns.length] = relVal(0,0); }
    s.Basic.patterns[i].bens.push(valForEach(relVal(0,0), s.Basic.patterns.length)); } //777
  s.Basic.patterns.push(pat);*/ }



// =================
// PATTERN STUFF END
// =================
  


function init() {
  s.mode = "BasicMode";
  s.Basic = { initDone : false };
  s.Spatial = { initDone : false };
  BasicMode();
  s.initDone = true;
  if (s.mode.autoPlayFirstTurn) {
    startGame();
    console.log(s.mode.personsDids);
    }
  }
  
  
  //for(var i = 0; i < s.Basic.persons.length; i++) {
    //console.log(s.Basic.persons[i].id); }



//deleting person in turn causes bug sometimes BUG FIXED proly
//upon create new person grid becomes too colorful BUG FIXED proly
// BUG! bug: bots should not try to acquire xp that's already been acquired FIXED???