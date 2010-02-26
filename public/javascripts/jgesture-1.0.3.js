jQuery.fn.gesture = function(fn, settings) {
  return this.each(function(){


  var gesture = {
    moves : "",
    x : -1,
    y : -1,
    lastmove : "",
    continuesmode: false,
    getMoveNameAt : function(i){
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
        if ( (Number(this.moves.charAt(0))== 5) &&
             (Number(this.moves.charAt(this.moves.length-1)) == 7) &&
             (this.moves.indexOf("2") != -1)
           ) return "close";
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
     button: "012",
     mindistance: 10,
     continuesmode: false,
     repeat: false,
     disablecontextmenu: true
  }, settings);


  $(this).bind(settings.startgesture, function(e){
    if (e.button != null && settings.button.indexOf("" + e.button) == -1) return;
    
    // disable browser context menu.
    if (settings.disablecontextmenu) {
      $(this).bind("contextmenu", function(e) {
        return false;
      });
    }
  
    gesture.moves = "";
    gesture.x = -1;
    gesture.y = -1;
    gesture.continuesmode = settings.continuesmode;
    
    $(this).bind("mousemove", function(e){
      if ((gesture.x == -1) && (gesture.y == -1)){
        gesture.x = e.screenX;
        gesture.y = e.screenY;
        return;
      }
      var distance = Math.sqrt(Math.pow(e.screenX - gesture.x,2)+Math.pow(e.screenY - gesture.y,2));
      if( distance > settings.mindistance){
        var angle = Math.atan2(e.screenX - gesture.x, e.screenY - gesture.y) / Math.PI + 1;
        var dir = 0;
        if (3/8  < angle && angle < 5/8 ) dir = 8;
        if (5/8  < angle && angle < 7/8 ) dir = 7;
        if (7/8  < angle && angle < 9/8 ) dir = 6;
        if (9/8  < angle && angle < 11/8) dir = 5;
        if (11/8 < angle && angle < 13/8) dir = 4;
        if (13/8 < angle && angle < 15/8) dir = 3;
        if (15/8 < angle || angle < 1/8 ) dir = 2;
        if (1/8  < angle && angle < 3/8 ) dir = 1;

        gesture.x = e.screenX;
        gesture.y = e.screenY;
        
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

  $(this).bind(settings.stopgesture, function(e){
    if (e.button != null && settings.button.indexOf("" + e.button) == -1) return;
    if (!settings.disablecontextmenu) {
      $(this).unbind("contextmenu");
    }
    $(this).unbind("mousemove");
    if (gesture.moves.length != 0) {
      var t = $(this);
      t.hfn = fn;
      t.hfn(gesture);
    }
  });

  return this;
  });

}
