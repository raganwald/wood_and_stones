// The MIT License
// 
// Copyright (c) 2010 Reginald Braithwaite
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// This code modified from jGesture, http://plugins.jquery.com/project/jGesture,
// (c) 2008 Nico Goeminne and released under Apache License 2.0

// Mods (so far) include support for mobile touch events under Mobile Safari,
// storing the target for creating custom events, and expanding the predefined
// events so that things like "close" can be written with eight different
// symmetric gestures.

jQuery.fn.gesture = function(fn, settings) {
	
  return this.each( function () {
	
		var topleft = 1;
		var top = 2;
		var topright = 3;
		var right = 4;
		var bottomright = 5;
		var bottom = 6;
		var bottomleft = 7;
		var left = 8;

	  var gesture = {
			target: null,
	    moves : "",
	    x : -1,
	    y : -1,
	    lastmove : "",
	    continuesmode: false,
	    getMoveNameAt: function (i) {
	      switch(Number(this.moves.charAt(i))){
	        case 1:
	          return "topleft";
	        case 2:
	          return "top";
	        case 3:
	          return "topright";
	        case 4:
	          return "right";
	        case 5:
	          return "bottomright";
	        case 6:
	          return "bottom";
	        case 7:
	          return "bottomleft";
	        case 8:
	          return "left";
	        default:
	          return "unknown";
	      }
	    },
	    getName : function(){
    
	      if(this.continuesmode && this.moves.length > 0){
	      	return this.getMoveNameAt(this.moves.length-1);
	      }
    
	      if(this.moves.length == 1) {
	        return this.getMoveNameAt(0);
	      }
	      if(this.moves.length == 2) {
	        return this.getMoveNameAt(0) + "_" + this.getMoveNameAt(1);
	      }

	   //   if (this.moves.length < 7) {
	        if ( (Number(this.moves.charAt(0))== 6) &&
	             (Number(this.moves.charAt(this.moves.length-1)) == 4) &&
	             (this.moves.indexOf("1") != -1)
	           ) return "open";
					var g = this;
					var half_close_gestures = [
						{ start: bottomright, connect: top, finish: bottomleft }, { start: topleft, connect: bottom, finish: topright },
						{ start: bottomright, connect: left, finish: topright }, { start: topleft, connect: right, finish: bottomleft }
					];
					for (i in half_close_gestures) {
						var e = half_close_gestures[i];
		        if ( (Number(g.moves.charAt(0))== e.start) &&
		             (Number(g.moves.charAt(g.moves.length-1)) == e.finish) &&
		             (g.moves.indexOf('' + e.connect) != -1)
		           ) return 'close';
		        if ( (Number(g.moves.charAt(0))== e.finish) &&
		             (Number(g.moves.charAt(g.moves.length-1)) == e.start) &&
		             (g.moves.indexOf('' + e.connect) != -1)
		           ) return 'close';
					};
	   //   }

	      if (this.moves.length >= 7) {
	        if( (function (str){
	          for (var i = 1 ; i < 8; i++){
	            var pre = Number(str.charAt(i-1));
	            var cur = Number(str.charAt(i));
	            if (( pre + 1 == cur) || (pre == cur + 7)) {
	              continue;
	            }
	            return false;
	          }
	          return true;
	        })(this.moves) ) return "rotateclockwise";

	        if( (function (str){
	          for (var i = 1 ; i < 8; i++){
	            var pre = Number(str.charAt(i-1));
	            var cur = Number(str.charAt(i));
	            if (( pre == cur + 1) || (pre + 7 == cur )) {
	              continue;
	            }
	            return false;
	          }
	          return true;
	        })(this.moves) ) return "rotatecounterclockwise";
	      }

	      return "unknown";
	    }
	  };

	  settings = jQuery.extend({
	     startgesture: "mousedown",
	     stopgesture: "mouseup",
				intragesture: "mousemove",
	     button: "012",
	     mindistance: 10,
	     continuesmode: false,
	     repeat: false,
	     disablecontextmenu: true
	  }, settings);


	  $(this).bind(settings.startgesture, function (e) {
	    if (e.button != null && settings.button.indexOf("" + e.button) == -1) return;
	
			gesture.target = e.target;
    
	    // disable browser context menu.
	    if (settings.disablecontextmenu) {
	      $(this).bind("contextmenu", function(e) {
	        return false;
	      });
	    }
			if (e.preventDefault) { e.preventDefault(); } // added by reg to see if it fixes default image drag
  
	    gesture.moves = "";
	    gesture.x = -1;
	    gesture.y = -1;
	    gesture.continuesmode = settings.continuesmode;
    
	    $(this).bind(settings.intragesture, function(e){
				var x = typeof(e.screenX) == 'number' ? e.screenX : event.targetTouches[0].pageX;
				var y = typeof(e.screenY) == 'number' ? e.screenY : event.targetTouches[0].pageY;
			
	      if ((gesture.x == -1) && (gesture.y == -1)){
	        gesture.x = x;
	        gesture.y = y;
	        return;
	      }
	      var distance = Math.sqrt(Math.pow(x - gesture.x,2)+Math.pow(y - gesture.y,2));
	      if( distance > settings.mindistance){
	        var angle = Math.atan2(x - gesture.x, y - gesture.y) / Math.PI + 1;
	        var dir = 0;
	        if (3/8  < angle && angle < 5/8 ) dir = 8;
	        if (5/8  < angle && angle < 7/8 ) dir = 7;
	        if (7/8  < angle && angle < 9/8 ) dir = 6;
	        if (9/8  < angle && angle < 11/8) dir = 5;
	        if (11/8 < angle && angle < 13/8) dir = 4;
	        if (13/8 < angle && angle < 15/8) dir = 3;
	        if (15/8 < angle || angle < 1/8 ) dir = 2;
	        if (1/8  < angle && angle < 3/8 ) dir = 1;

	        gesture.x = x;
	        gesture.y = y;
        
	        if(gesture.moves.length == 0) {
	          gesture.moves += dir;
	          gesture.lastmove = "" + dir;
	        }
	        else {
	          if (settings.repeat || (gesture.moves.charAt(gesture.moves.length - 1) != dir) ){
					    gesture.moves += dir;
					    gesture.lastmove = "" + dir;
					  }
	        }
	        if (settings.continuesmode){
	          var t = $(this);
		  			t.hfn = fn;
	          t.hfn(gesture);
	        }
	      }
	    });
	  });

	  $(this).bind(settings.stopgesture, function (e) {
	    if (e.button != null && settings.button.indexOf("" + e.button) == -1) return;

	    if (!settings.disablecontextmenu) {
	      $(this).unbind("contextmenu");
	    }
	    $(this).unbind(settings.intragesture);
	    if (gesture.moves.length != 0) {
	      var t = $(this);
	      t.hfn = fn;
	      t.hfn(gesture);
	    }
	  });

  	return this;

  });

}
