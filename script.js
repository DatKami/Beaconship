/*
Welcome! You're viewing the beaconship source code! Few things of note:

- This code may not be commented sufficiently or may look disorganized.

- This code belongs to the programmer, reached at beaconshipme@gmail.com.
  You are free to look at the code, but you may not steal a significant part of it for
  implementation in your website.
  As such, this code is only meant to exist on beaconship.me or any of it's sister sites.
  (C) 2014-2016 Brandon Ha (alias Kami)
*/

//working tables

var connect = true; //debug variable for testing offline
var chars = [];
var charf = [];
var colors = [];
var fakeElo = [];   
var charGraph = [];
var colorsGraph = [];
var eloGraph = [];
var resToggle = false;
var inProgress = false;

//static variables 

var SPEED = 350;			//the speed of animation for pertaining animations
var RES_BOX_HEIGHT = .65;   //the height in decimal of the results box
var FIELD_HEIGHT = .73;     //the height in decimal of the playfield
var MAX_LENGTH_RATIO = 9;
var K_FACTOR = 1;
var CHART_WIDTH = .75;
var CHART_HEIGHT = .60;

var resizeTimer;

  if (!connect) { localData(); } //load up a local dataset

/**
* Load up some locally stored data. Called usually when we can not connect to the server.
*/
function localData() {

    chars = ["Ruby Rose", "Weiss Schnee", "Blake Belladonna", "Yang Xiao Long", //0123
             "Jaune Arc", "Nora Valkyrie", "Pyrrha Nikos", "Lie Ren", //4567
             "Cardin Winchester",  //8,9,10,11
             "Velvet Scarlatina",  //12 
             "Professor Ozpin", "Glynda Goodwitch", //13,14,15,16
             "Cinder Fall", "Roman Torchwick", "Neopolitan (Neo)", "Mercury Black", "Emerald Sustrai", //17,18,19,20,21
             "Hei Xiong (Junior)", "Melanie Malachite", "Miltiades Malachite", //22,23,24
             "Adam Taurus", //25
             "Sun Wukong", "Neptune Vasilias", //26, 27
             "Penny Polendina", "James Ironwood", "Bartholomew Oobleck", "Zwei",
             "Raven Branwen", "Coco Adel",
             "Reese Chloris", "Qrow Branwen", "Winter Schnee",
             "Peter Port",
             "Fox Alistair", "Yatsuhashi Daichi",
             "Scarlet David", "Sage Ayana"
             ]; //28, 29 

    charf = ["Ruby", "Weiss", "Blake", "Yang",
             "Jaune", "Nora", "Pyrrha", "Ren",
             "Cardin",
             "Velvet",
             "Ozpin", "Glynda",
             "Cinder", "Torchwick", "Neo", "Mercury", "Emerald",
             "Junior", "Melanie", "Miltiades",
             "Adam",
             "Sun", "Neptune",
             "Penny", "Ironwood" , "Oobleck", "Zwei",
             "Raven", "Coco",
             "Reese", "Qrow", "Winter",
             "Port",
             "Fox", "Yatsuhashi",
             "Scarlet", "Sage"
             ];		                  
                  
    colors = ["#dd3144", "#2C75FF", "#302045", "#f9d366",
              "#f9db7d", "#e6837d", "#902831", "#416853",
              "#8f4312", 
              "#64402a", 
              "#1d4c18", "#8c0089", 
              "#a00200", "#ff5400", "#ebb4c7", "#535353", "#7ae8bb",
              "#1f0c00", "#90d9d9", "#ab0101",
              "#7e0001",
              "#dddc89", "#3cc7fe",
              "#2ff94d", "#7c807b", "#357236", "#CFCFCF",
              "#AA0000", "#987D5A",
              "#433B5D", "#3F1810", "#5A5E8B",
              "#660000",
              "#903509", "#FBC580",
              "#832424", "#386D28" 
              ];
                   
    fakeElo = [1600, 1800, 1800, 1200,
               1200, 2000, 2000, 1000,
               800,
               1400,
               1200, 1600,
               1600, 1800, 2000, 1200, 1400,
               1200, 1400, 1400,
               1400,
               1600, 1500,
               2000, 1400, 1400, 1400,
               1400, 1400,
               1400, 1600, 1600,
               1400,
               1400, 1400,
               1400, 1400
              ];
}
    
jQuery(document).ready(function(){
    
  if(connect) { getData(true, false, false); }
  
  var anim1 = ele('break');

  anim1.addEventListener('webkitAnimationIteration', function(){
    anim1.style.webkitAnimationPlayState = "paused";
    anim1.style.animationPlayState = "paused";
  }); //whenever the animation ends, pause it
  
  var sides = { LEFT: 0, RIGHT: 1 };
  
  var names = 		[ ele('name1'), 	ele('name2')	];
  var conts = 		[ ele('cont1'), 	ele('cont2')	];
  var picconts = 	[ ele('piccont1'), 	ele('piccont2')	];
  var bleeds = 		[ ele('bleed1'), 	ele('bleed2')	];
  var hovers = 		[ ele('p1hvr'), 	ele('p2hvr')	];
  var bbs = 		  [ ele('bb1'), 		ele('bb2')		];
  
  //reverse of the side that is input, for reverse animation
  var reverse = [ sides.RIGHT , sides.LEFT ];
  
  /**
  * Plugs in a style string to the left or the right of the element's style.
  */
  function plugStyle(element, side, change)
  {
    if (side == sides.LEFT) { element.style.left = change; }
    else { element.style.right = change; }
  }
  
  var name1 = ele('name1');       var name2 = ele('name2');     
  var cont1 = ele('cont1');       var cont2 = ele('cont2');
  var piccont1 = ele('piccont1'); var piccont2 = ele('piccont2');
  var bleed1 = ele('bleed1');     var bleed2 = ele('bleed2');
  var p1hvr = ele('p1hvr');       var p2hvr = ele('p2hvr');
  var bb1 = ele('bb1');           var bb2 = ele('bb2');
  
  var res1 = ele('res-box1');     var res2 = ele('res-box2');
  var disc1 = ele("disclaimer");  var disc2 = ele("disclaimer2");
  var undo = ele('undo');
  var intrep = ele('percent');
  var results = ele('results-field');
  var nojava = ele('nojava-field');
  var resultsLabel = ele('results-label');
  var tip = ele('tooltip');
  var startButton = ele("start");
  
  //this doesn't run if javascript is disabled; removes the nojava page
  nojava.style.top = "-100%"; 
  
  var finishedList;                 //contains ids of winners in order
  var charsdata;                    //contains contender objects
  var tokenStack;                   //contains undoToken objects
  var click1Lock; var click2Lock;   //exclusive locks to prevent animations
  var hover1Lock; var hover2Lock;
  var char1;      var char2;        //contenders
  var killswitch;                   //end variable
  
  reset();//initialization
  
  responsive(); //responsive initialization
  
  
  /*
  Resizing the window updates responsive and resize function.
  */
  $(window).resize(function() {
    clearTimeout(resizeTimer); //causes a delay on the timer if the user
                               //is still resizing the window
    resizeTimer = setTimeout(function(){ 
      rze();
      responsive();
    }, 200);
  });
  
  /*
  Closing the window while in progress will prompt the user if they meant to.
  */
  $(window).on('beforeunload', function() {
    if (inProgress == true) { return "Looks like you're still doing " + 
    "Beaconship. Continuing through will erase your progress! " +
    "If you're following a link, perhaps you might want to cancel and right " +
    "click the link to open it in a new tab?"; }
  });
  
  /*
  Responsive modifies text elements to look reasonable on mobile devices.
  */
  function responsive() {
    var wi = $(window).width();
    var hi = $(window).height();
    if (wi <= 674 && hi > 640 || wi <= 480)  {
      disc2.innerHTML = "(c) Kami 2014 | <a href='./privacy/'>Privacy</a> | " +
      "<a href='./terms/'>Terms</a>";
    }
    else {
      disc2.innerHTML = "Beaconship.me is (c) Kami, 2014. " +
      "<a href='http://blakebellatuna.tumblr.com/'>tumblr</a> | " +
      "beaconshipme@gmail.com | <a href='./privacy/'>Privacy</a> | " +
      "<a href='./terms/'>Terms</a>";
    }
  }
  
  /*
  Resize resizes fonts relative to the ratio of the page.
  Thin pages get font sizes set relative to width, and
  wide pages get font sizes set relative to height.
  */
  function rze() {  var y = $(window).height(); var x = $(window).width();

      for (i = 1; (res = document.getElementById('no'+i)) != null ; i++) {
        var divy = res.offsetHeight; var divx = res.offsetWidth;
        var vh = divy/y*100; var vw = divx/x*100;
        if (calcFontRule(calcPixelRatio(res), MAX_LENGTH_RATIO) == 'vh') { res.style.fontSize = vh + 'vh'; }
        else { res.style.fontSize = vw/MAX_LENGTH_RATIO + 'vw'; }
      }
  }
  
  function calcPixelRatio(div) { return div.offsetWidth/div.offsetHeight; }
  function calcFontRule(ratio, limit) { if (ratio >= limit) {return 'vh';} else {return 'vw';} }

  /*
  ResetAnimations deletes the styles on animated elements,
  in essence resetting their positions.
  */
  function resetAnim() {
    piccont1.style.right=''; 		piccont2.style.left='';
    cont1.style.left='';     		cont2.style.right='';
    bleed1.style.left='';    		bleed2.style.right='';
    bb1.style.left='';       		bb2.style.right='';
    plugStyle(names[sides.LEFT], reverse[sides.LEFT], '');    	plugStyle(names[sides.RIGHT], reverse[sides.RIGHT], ''); 
    or.style.top='';        	 	intrep.style.top='';
  }

	//do stuff when random is clicked
	$("#undo").click(function(){
    click1Lock = true; click2Lock = true;
    if (!killswitch) {
      char1 = eligibleContender();
      char2 = newContender(char1);
      piccont1.style.right='150%'; piccont2.style.left='150%';
      cont1.style.left='-50%';     cont2.style.right='-50%';
      bleed1.style.left='-50%';    bleed2.style.right='-50%';
      bb1.style.left='-50%';       bb2.style.right='-50%';
      plugStyle(names[sides.LEFT], reverse[sides.LEFT], '150%');    plugStyle(names[sides.RIGHT], reverse[sides.RIGHT], '150%'); 
      undo.style.top='150%';       intrep.style.top='-50%';
      or.style.top='150%';

      setTimeout(function(){
        setColors(colors[char1], colors[char2]); setNames(char1, char2);
        anim1.style.zIndex='100';
        resetAnim();
        click1Lock = false;
        click2Lock = false;
      }, SPEED*1.2);
      setTimeout(function(){
        anim1.style.webkitAnimationPlayState = "running";
        anim1.style.animationPlayState = "running";
        anim1.style.mozAnimationPlayState = "running";
        anim1.style.msAnimationPlayState = "running";
      }, SPEED*2.4);
      
      setTimeout(function(){ anim1.style.zIndex='-2'; undo.style.top=''; }, 
      2300 + SPEED*2.4);
    }
	}); 
    
  $("#results").click(function(){
    if (connect) {
      if (!resToggle) { 
        getData(false, true, true); 
        tip.textContent = "Return to the previous screen.";
      }
      else {
        chartToggle(false); 
        tip.textContent = "Display the overall results! But don't spoil the " + 
        "fun, make sure you've completed Beaconship at least once!";
      }
    }
    else { 
    var ranking = document.getElementById("results");
    ranking.textContent = 'DISABLED';
    setTimeout(function(){ ranking.textContent = 'RANKING'; }, SPEED*3);
    }
  });
  
  $("#start").click(function(){
    var landing = document.getElementById("landing");
    var menu = document.getElementById("menu");
    var start = document.getElementById("start");
    landing.style.top = '-101%'; menu.style.top = '2.5%';
    inProgress = true;
    setTimeout(function(){start.style.right = '-50%';}, SPEED);
  });
  
  $("#menu").click(function(){
    var landing = document.getElementById("landing");
    var menu = document.getElementById("menu");
    var start = document.getElementById("start");
    landing.style.top = ''; menu.style.top = '';
    setTimeout(function(){reset(); start.style.right = ''; results.style.top = '';}, SPEED);
  });
  
    //do stuff when undo is hovered
    $("#undo").hover(function(){hover1Lock = true; hover2Lock = true; 
    tip.textContent = "Can't decide? Pick two other characters and come back to it later!";},
    function(){ hover1Lock = false; hover2Lock = false; 
    tip.textContent = '';});
    
    $("#percent").hover(function(){tip.textContent = "The closer this is to 100%, the closer you are to being done!";},
    function(){tip.textContent = '';});
    
    $("#menu").hover(function(){tip.textContent = "Warning! Returning to the starting page resets your progress!";},
    function(){tip.textContent = '';});
    
    $("#start").hover(function(){tip.textContent = "Go ahead! Click it!";},
    function(){tip.textContent = '';});
    
    $("#donut").hover(function(){tip.textContent = "Scripting takes time, websites cost money! Throw a couple dollars my way? (Redirects to Paypal, Right click to open in new tab)";},
    function(){tip.textContent = '';});
    
    $("#results").hover(function(){
    if (!connect) {tip.textContent = "You're offline right now. We can't retrieve the ranking if that's the case!";}
    else if (!resToggle) {tip.textContent = "Display the overall results! But don't spoil the fun, make sure you've completed Beaconship at least once!";}
    else {tip.textContent = "Return to the previous screen.";}},
    function(){tip.textContent = '';});
	
    /**
    * Clear the side of the playing field opposite to the indicated side.
    */
    function animateClearOtherSide(side)
    {
          plugStyle(picconts[reverse[side]], side, '150%');
          plugStyle(names[reverse[side]],    side, '150%'); 
          setColors((side == sides.LEFT )  ? null : "#000000",
                    (side == sides.RIGHT ) ? null : "#000000");
    }
  
    $("#p1hvr").click(function(){
      if (!click1Lock) {
        //deny any clicks while animating
        click1Lock = true; click2Lock = true;
        if (!killswitch) {
		
          animateClearOtherSide(sides.LEFT);
          wins(char1, char2);
          
          if(!eligible(char1)) { //check if the winner needs to be switched out
            
            animateClearOtherSide(reverse[sides.LEFT]);
            
            if (!isItDone()) { char1 = eligibleContender(); }
            else { killswitch = true; }
          }
        }
        
        if (!killswitch) {
        
          char2 = newContender(char1);
          
          setTimeout(function(){ setNames(char1, char2); }, SPEED);
          setTimeout(function(){
            setColors(colors[char1], colors[char2]);
            if (!hover2Lock) { /*piccont1.style.right='';*/ plugStyle(picconts[sides.LEFT] , reverse[sides.LEFT], '');  plugStyle(names[sides.LEFT], reverse[sides.LEFT], ''); }
            if (!hover1Lock) { /*piccont2.style.left='';*/  plugStyle(picconts[sides.RIGHT], reverse[sides.RIGHT], ''); plugStyle(names[sides.RIGHT], reverse[sides.RIGHT], '');  }
            else if (hover1Lock) { hover1(); }
            click1Lock = false; click2Lock = false;
          }, SPEED*1.4);
        
        }
      }
    });
	
    $("#p2hvr").click(function(){
      if (!click2Lock) {
        //deny any clicks while animating
        click2Lock = true; click1Lock = true;
        if (!killswitch) {
          
          animateClearOtherSide(sides.RIGHT);
          wins(char2, char1);
          
          if(!eligible(char2)) { //check if the winner needs to be switched out

            animateClearOtherSide(reverse[sides.RIGHT]);
            
            if (!isItDone()) { char2 = eligibleContender(); }
            else {killswitch = true;}
          }
        }
        
        if (!killswitch) {
        
          char1 = newContender(char2);
          
          setTimeout(function(){ setNames(char1, char2); }, SPEED);
          setTimeout(function(){
            setColors(colors[char1], colors[char2]);
            //TODO why is this out of order?
            if(!hover2Lock){ /*piccont1.style.right='';*/ plugStyle(picconts[sides.LEFT] , reverse[sides.LEFT], '');  plugStyle(names[sides.LEFT], reverse[sides.LEFT], ''); }
            else if (hover2Lock) { hover2(); }
            if(!hover1Lock){ /*piccont2.style.left='';*/ plugStyle(picconts[sides.RIGHT], reverse[sides.RIGHT], '');  plugStyle(names[sides.RIGHT], reverse[sides.RIGHT], ''); }
            click1Lock = false; click2Lock = false;
          }, SPEED*1.4);
      
        }
      }
    });
    
	//do stuff when p1hvr is hovered
    $("#p1hvr").hover(hover1, hover1end); p1hvr.addEventListener("touchend", hover1end, false);
    //do stuff when p2hvr is hovered
    $("#p2hvr").hover(hover2, hover2end); p2hvr.addEventListener("touchend", hover2end, false);
    
    function graph() {
      formatChart(1, charGraph.length, 'chart-names', CHART_HEIGHT*100/charGraph.length, CHART_HEIGHT);
      var diff = eloGraph[0] - eloGraph[charGraph.length - 1];
      var minElo; var maxElo; var newDiff; var label; var differ; var divisions;
      if (diff < 100) { differ = 10; }
      else if (diff < 500) { differ = 25; }
      else if (diff < 1000) { differ = 50; }
      else { differ = 100; }
      minElo = Math.floor(eloGraph[charGraph.length - 1]/differ)*differ;
      maxElo = Math.ceil(eloGraph[0]/differ)*differ;
      newDiff = maxElo - minElo;
      divisions = (newDiff/differ)+1;
      var chartf = document.getElementById("chart-field");
      var chart = document.getElementById("results-chart");
      while ( chart.firstChild ) chart.removeChild( chart.firstChild ); //purge contents
      for(i = 1; (label = document.getElementById("la"+i)) != null; i++) {
        label.remove();
      }
      for(j = 1; j <= divisions; j++) {
        if(j%2==1) {
          var line2 = document.createElement('div'); line2.id = 'bl'+j;
          line2.className = "line2 anim";
          line2.style.left = 100/(divisions-1)*(j-1) + '%';
          line2.style.width = 100/(divisions-1) + '%';
          chart.appendChild(line2);
        }
        label = document.createElement('div'); label.id = 'la'+(j);
        label.className = "chartnumber anim";
        label.textContent = minElo + (differ*(j-1)) + '';
        label.style.left = 20 + (.75*100/(divisions-1)*(j-1)) + '%';
        chartf.appendChild(label);
      }
      for (i = 0; i < charGraph.length; i++) {
        var tempDiv = document.createElement('div'); tempDiv.id = 'gb'+(i+1);
        var percent = (eloGraph[i] - minElo)/newDiff*100;
        tempDiv.className = "bar anim"; tempDiv.style.width = percent + '%';
        tempDiv.style.height = 50/charGraph.length + '%';
        tempDiv.style.top = (100/(charGraph.length)*(i))+(25/(charGraph.length)) + '%';
        chart.appendChild(tempDiv);
      }
      
      for (g = 0; g < charGraph.length; g++){
        var tableItem = document.getElementById("nn" + (g+1));
        tableItem.style.backgroundColor = colorsGraph[g];
        tableItem.textContent = charGraph[g];
      }
    }
    
    function formatChart(start, end, divString, size, absHeight) {
    var divTo = document.getElementById(divString);
    while ( divTo.firstChild ) divTo.removeChild( divTo.firstChild ); //purge contents
    for (i = start; i <= end; i++) {
      var tempDiv = document.createElement('div'); tempDiv.id = 'nn'+i;
      tempDiv.className = "chartlabel anim";
      styler(start, end, tempDiv, size+'vh', absHeight); divTo.appendChild(tempDiv);
      }
    }
    
    function chartToggle(tog) {
      resToggle = tog;
      var chartf = document.getElementById("chart-field");
      var ranking = document.getElementById("results");
      if (!resToggle) { chartf.style.top = ''; ranking.textContent = 'RANKING';}
      else { chartf.style.top = '13.5%'; ranking.textContent = 'RETURN'; }
    }
    
    
    function reset(){
      if (chars.length >= 2) {
          finishedList = [];
          charsdata = [];
          for (i = 0; i < chars.length; i++) { charsdata.push(new Contender(i, fakeElo[i])); } //initialize contenders & introduce ELOs
          for (j = 0; j < charsdata.length; j++) { expectedSum(j, charsdata); } //calculated an expected score for the session
          tokenStack = [];
          click1Lock = false; click2Lock = false; hover1Lock = false; hover2Lock = false;
          
          //initialize the board
          char1 = getRandomInt(0,3); //Team RWBY
          char2 = newContender(char1); // anyone besides the first chosen
        
          centSlide(0, 0); //initialize the progress counter
        
          killswitch = false;
        
          //initialize colors and names
          setColors(colors[char1], colors[char2]);
          setNames(char1, char2);
          
          resetAnim();
          document.getElementById("consent-box").checked = true;
          rze();
          
          resToggle = false;
          divisions = 1;
          inProgress = false;
          
          formatResults(2, 10, 'res-box1', 2, FIELD_HEIGHT*RES_BOX_HEIGHT);
          formatResults(11, chars.length, 'res-box2', 1.25, FIELD_HEIGHT*RES_BOX_HEIGHT);
      }
    }
    
    function hover1(){
      hover1Lock = true; transCont(cont2, 1);  v = '-calc(85% - 100px)';
      piccont2.style.left = '-webkit' + v; piccont2.style.left = '-moz' + v;
      piccont2.style.left = v; plugStyle(names[sides.RIGHT], reverse[sides.RIGHT], '80%'); 
      tip.textContent = "Choose " + charf[char1] + '.';
    }
    function hover1end(){ hvrend(cont2, click1Lock, piccont2, names[reverse[sides.LEFT]]); hover1Lock = false;
    tip.textContent = ''; }
    
    function hover2(){
      hover2Lock = true; transCont(cont1, -1); v = '-calc(85% - 100px)';
      piccont1.style.right = '-webkit' + v; piccont1.style.right = '-moz' + v;
      piccont1.style.right = v; plugStyle(names[sides.LEFT], reverse[sides.LEFT], '80%'); 
      tip.textContent = "Choose " + charf[char2] + '.';
    }  
	
    function hover2end(){ hvrend(cont1, click2Lock, piccont1, names[reverse[sides.RIGHT]]); hover2Lock = false;
    tip.textContent = ''; }
    
    function transCont(dc, mul) {
      a = 'skew('+mul*25+'deg,0deg) translate('+mul*20+'%, 0)';
      dc.style.webTransform=a; dc.style.msTransform=a; dc.style.transform=a;
    }
    //slider is the opposite slider, clickLock is this side's lock, picCont is the opposite container , contName is the opposite name
    function hvrend(slider, clickLock, picCont, contName){
      slider.style.webkitTransform = ''; slider.style.msTransform = ''; slider.style.transform = '';
      if (!clickLock){ picCont.style.right = ''; picCont.style.left = ''; contName.style.right = ''; contName.style.left = ''; }
      //hoverLock = false;
    }
    
    function cGet(charN, isAbove) { //get the above or below array of the id
      if (isAbove) { return charsdata[charN].getAbove(); } else { return charsdata[charN].getBelow(); }
    }
    function cPush(charN, isAbove, data) { //push data into the above or below
      if (isAbove) { charsdata[charN].pushAbove(data); } else { charsdata[charN].pushBelow(data); }
    }
    function exchange(take, to, from) {
      cPush(to, from, take);
      for (i = 0; i < cGet(take, from).length; i++) { 
        var tar = cGet(take, from)[i]; //get target - one of the sender's
        cPush(to, from, tar); //push that to the recipient
        cPush(tar, !from, to); //add the recipient to the opposite list of tar
      }
    }
    
    function wins(win, lose) {
      var oldv = totalCompares(); var ABOVE = true; var BELOW = false;
      exchange(lose, win, BELOW); //exchange all the loser's belows to winner
      exchange(win, lose, ABOVE); //exchange all the winner's aboves to loser
      centSlide(oldv, totalCompares());
    }
    
    function newContender(winner) {
      temp = winner;
      while(temp == winner || (charsdata[winner].getAbove().indexOf(temp) != -1 || charsdata[winner].getBelow().indexOf(temp) != -1)) 
      { temp = getRandomInt(0,chars.length-1) }; //Anybody besides the person just chosen
      return temp;
    }
    
    function eligibleContender() {
      temp = getRandomInt(0,chars.length-1);
      while(!eligible(temp)) { temp = getRandomInt(0,chars.length-1); }
      return temp;
    }
    
    function eligible(character) {
      if (character < 0 || character > chars.length - 1) {return false;}
      if (charsdata[character].getAbove().length + charsdata[character].getBelow().length >= chars.length - 1) {return false;}
      return true;
    }
    

    
    function isItDone() {
      for (i = 0; i < charsdata.length; i++) { if (eligible(i)) { return false; } }
      charsdata.sort(function(a,b) {return a.getAbove().length - b.getAbove().length}); //sort for the finished list
      for (d = 0; d < charsdata.length; d++) {
        charsdata[d].setChange(Math.round(K_FACTOR*(charsdata[d].getBelow().length - charsdata[d].getSum()))); //decide an elo change
        finishedList.push(charsdata[d].getID());
      }
      charsdata.sort(function(a,b) {return a.getID() - b.getID()}); //sort back to id list
      //set up the results table
      for (g = 0; g < finishedList.length; g++){
        var daName = "no" + (1+g);
        var tableItem = document.getElementById(daName);
        var winnerBox = document.getElementById("winner-box");
        var winPic = document.getElementById("win-pic");
        winPic.style.backgroundImage = ("url(char/" + charf[finishedList[0]] + ".png)");
        winnerBox.style.backgroundColor = colors[finishedList[0]];
        tableItem.style.backgroundColor = colors[finishedList[g]];
        //tableItem.textContent = (chars[finishedList[g]] + ', ' + charsdata[finishedList[g]].getChange() + ', ' + charsdata[finishedList[g]].getELO() + ', ' + charsdata[finishedList[g]].getBelow().length + '-' + charsdata[finishedList[g]].getSum()); //name, elo change, ELO, sum
        tableItem.textContent = chars[finishedList[g]];
      }
      rze(); inProgress = false;
      setTimeout(function() { intrep.textContent = "100%"; results.style.top = "13.5%"; }, SPEED*2 + 20);
      if (connect) { postData(); }
      return true;
    }
    
  function totalCompares() {
    summ = 0;
    for (i = 0; i < charsdata.length; i++) {
      summ += charsdata[i].getAbove().length + charsdata[i].getBelow().length;
    }
    return summ;
  }
  
  /**
  * Animate the progress counter linearly from one integer to another integer.
  */
  function intSlide(oldv, newv) {
    var max = (chars.length*(chars.length-1));
    for (t = 0; t < 50; t++) {
      var display = (oldv + Math.round((newv-oldv)/50*t));
      doIntSlide(max, display, t);
    }
  }
  
  /**
  * Animate the progress counter linearly from one percentage to another percentage.
  */
  function centSlide(oldv, newv) {
    var max = (chars.length*(chars.length-1));
    for (t = 0; t < 50; t++) {
      var display = Math.round(((oldv/max) + (((newv-oldv)/max)/50*t))*10000)/100 ;
      doCentSlide(display, t);
    }
  }
  function doIntSlide(max, display, t) {
    setTimeout(function() { intrep.textContent = display + "/" + max; }, SPEED/25 * t);
  }
  function doCentSlide(display, t) {
    setTimeout(function() { intrep.textContent = display + "%"; }, SPEED/25 * t);
  } 
  
  /**
  * Set the colors on the containers and bleeds on the playing field.
  * Pass null as one of the colors to not change that color.
  */
  function setColors(clr1, clr2) {
    //The container is the background of a contender's side. For instance, Blake's is purple.
    if (clr1 != null) conts[sides.LEFT] .style.backgroundColor = clr1; 
    if (clr2 != null) conts[sides.RIGHT].style.backgroundColor = clr2;
    //The bleed is the color behind the opponent's container. You can see the bleed
    //of the other side if you hover over one side.
    if (clr2 != null) bleeds[sides.LEFT] .style.backgroundColor = clr2; 
    if (clr1 != null) bleeds[sides.RIGHT].style.backgroundColor = clr1;
	}
	
  /**
  * Sets the name fields on the left and right, given the ids pertaining
  * to those names.
  */
  function setNames(nm1, nm2) {
    names[sides.LEFT] .textContent = chars[nm1];
    names[sides.RIGHT].textContent = chars[nm2];
    changeAnim("piccont1","0s"); changeAnim("piccont2","0s");
	piccont1.style.backgroundImage = ("url(char/" + charf[nm1] + ".png)");
	piccont2.style.backgroundImage = ("url(char/" + charf[nm2] + ".png)");
    changeAnim("piccont1",".35s ease"); changeAnim("piccont1","35s ease");
  }
  function changeAnim(divString, dur){
    v = 'transition';
    $(divString).css(v, dur); $(divString).css('-o-' + v, dur);
    $(divString).css('-moz-' + v, dur); $(divString).css('-webkit-' + v, dur);
  }
  /***
  formatResults:  formats the results to a div to make them uniform
  arguments:
    start:      the start of the results list to derive members from
    end:        the end   of the results list to derive members from
    divString:  the name of the div to format results to
    size:       initial size of the font, in vw
    absHeight:  
  */
  function formatResults(start, end, divString, size, absHeight) {
    var divTo = document.getElementById(divString);
    while ( divTo.firstChild ) divTo.removeChild( divTo.firstChild ); //purge contents
    for (i = start; i <= end; i++) {
      var tempDiv = document.createElement('div'); tempDiv.id = 'no'+i;
      tempDiv.className = "to5 anim";
      styler(start, end, tempDiv, size+'vw',   absHeight); divTo.appendChild(tempDiv);
      //make a new div to append
      tempDiv = document.createElement('div'); tempDiv.id = "to5Label"; 
      tempDiv.className = "anim"; tempDiv.textContent = i+'';
      styler(start, end, tempDiv, size + 'vw', absHeight); divTo.appendChild(tempDiv);
    }
  }
  
  function styler(sta, end, div, size, absHeight) {
    div.style.top = 100/(end-sta+1)*(i-sta) + '%';
    div.style.height = 100/(end-sta+1) + '%';
    div.style.fontSize = size;
    div.style.lineHeight = 100/(end-sta+1)*absHeight + 'vh';
  }
  
  function getData(init, grapher, show) {
   if (init == true) { var hit = 1; } else { var hit = 0; }
   if (grapher == true) { var gra = 1; } else { var gra = 0; }
   $.ajax({
      type: "POST",
      url:'get.php',
      data:{ "hit": hit, "gra": gra },
      complete: function (response) {
          var all = JSON.parse(response.responseText);
          if (all[0].length == 0) { 
            localData(); 
            reset(); 
            connect = false; 
            setTimeout(function(){ alert("We can't get a valid response. We'll switch to offline mode. Perhaps refreshing the page will fix this?"); }, 200);
          }
          else {
            if (!grapher) {
              chars = all[0]; charf = all[1]; colors = all[2]; var elos = all[3];
              fakeElo = [];
              for (i = 0; i < elos.length; i++) {fakeElo.push(parseInt(elos[i]));} 
              reset();
            }
            else { //if we're graphing
              charGraph = all[0]; colorsGraph = all[2]; var elos = all[3]; var cc = all[4];
              document.getElementById("chart-label").textContent = "Polling "+cc+" submissions, the average rating for each person is:";
              eloGraph = [];
              for (i = 0; i < elos.length; i++) {eloGraph.push(parseInt(elos[i]));} 
              graph();
              if (show) {chartToggle(true);}
            }
          }
      },
      error: function () { 
        connect = false;
        localData();
        reset();
        setTimeout(function(){ alert("We can't connect to server. We'll switch to offline mode. Perhaps refreshing the page will fix this?"); }, 200);
      }
    });
  }
  
  function postData() {
    if (document.getElementById("consent-box").checked == true) {
      var changes = [];
      for (i = 0; i < charsdata.length; i++) {
        changes.push(charsdata[i].getChange());
      }
      $.ajax({
        type: "POST",
        url:'post.php', 
        data:{ "changes": JSON.stringify(changes), "winner": finishedList[0], "permission": 1 },
        error: function () { alert("Sorry, we couldn't post your data."); }
      })
      .done( function() { getData(false, true, false); } );
    }
    else {
      $.ajax({
        type: "POST",
        url:'post.php', 
        data:{ "permission": 0 },
        error: function () { }
      })
      .done( function() { getData(false, true, false); } );
    }
  }
});
function rndColor() { return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)}

function undoToken (winner, loser, belowExchanged, aboveExchanged) {
  this.winner = winner;
  this.loser = loser;
  this.belowExchanged = belowExchanged;
  this.aboveExchanged = aboveExchanged;
}

function Contender(iden, ELO) {
  var opts = {ID: iden, above: [], below: [], e: ELO, eSum: 0, eChg: 0, status: true};
  
  this.getID = function() { return opts.ID; };
  this.getAbove = function() { return opts.above; };
  this.pushAbove = function(item) { if(opts.above.indexOf(item) == -1 && opts.below.indexOf(item) == -1 && item != opts.ID) { opts.above.push(item); } };
  this.getBelow = function() { return opts.below; };
  this.pushBelow = function(item) { if(opts.below.indexOf(item) == -1 && opts.above.indexOf(item) == -1 && item != opts.ID) { opts.below.push(item); } };
  this.spliceAny = function() { opts.above.splice(0, 1); };
  this.getELO = function() { return opts.e; };
  this.setSum = function(value) { opts.eSum = value; };
  this.getSum = function() { return opts.eSum; };
  this.setChange = function(value) { opts.eChg = value; };
  this.getChange = function() { return opts.eChg; };
  this.shutdown = function() { opts.status = false; };
  this.getStatus = function() { return opts.status; };
}

//Returns number between min and max, inclusive
function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

//using an ID and a contendList, find the expected score for the session.
function expectedSum(ID, cList) {
    var eSum = 0;
    for (l = 0; l < cList.length; l++) {
        if (cList[l].getID() != ID) { eSum += expected(cList[ID].getELO(), cList[l].getELO()); }
    }
    eSum = Math.round(eSum * 100) / 100;
    cList[ID].setSum(eSum);
    return eSum;
}

// Returns the expected probability of contender A winning against B.
function expected(rA, rB) { return (1 /(1 + Math.pow(10,(rB-rA)/400))); }
// Returns the HTML element that has the ID
function ele(name) { return document.getElementById(name); }

// better image preloading @ http://perishablepress.com/press/2009/12/28/3-ways-preload-images-css-javascript-ajax/
function preloader() {
	if (document.getElementById) {
    for (ele = 3; ele <= 54; ele++) {
      var tempDiv = createPreload(pad(ele, 2));
      tempDiv.style.background = "url(anim1/" + pad(ele-2, 2) + ".png) no-repeat -9999px -9999px";
    }
    for (ele = 55; ele <= (54 + chars.length); ele++) {
      var tempDiv = createPreload(pad(ele, 2));
      tempDiv.style.background = "url(char/" + charf[ele-55] + ".png) no-repeat -9999px -9999px";
    }
	}
}

function createPreload(id) {
  var tempDiv = document.createElement('div'); tempDiv.id = 'preload-'+id;
  document.body.appendChild(tempDiv);
  return tempDiv;
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function addLoadEvent(func) { 
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function() {
			if (oldonload) {
				oldonload();
			}
			func();
		}
	}
}
addLoadEvent(preloader);