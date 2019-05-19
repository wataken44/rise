
var view = {};

view.INTERVAL = 60; // 60 seconds
view.video = null;

view.init = function() {
  if(!($("#video") && $("#video")[0])) { return; } // do nothing
  
  view.video = $("#video")[0];

  view.adjust();
  
  if(Cookies.get('url') === location.href && Cookies.get('time')) {
    var ct = Math.max(parseInt(Cookies.get('time')) - 5, 0);
    view.video.currentTime = ct;
  }
  try {
    view.video.play();
  } catch(e) {
    // do nothing
  }
  setInterval("view.saveState()", view.INTERVAL * 1000);
};

view.saveState = function() {
  if(!view.video.ended) {
    var ct = view.video.currentTime;
    
    Cookies.set('url', location.href, { expires: 64, path: '/' });
    Cookies.set('time', ct.toString(), { expires: 64, path: '/' });
  } else {
    Cookies.remove('url', { path: '/' });
    Cookies.remove('time', { path: '/' });
  }
};

view.skip = function(delta) {
  var t = view.video.currentTime + delta;
  t = Math.max(t, 0);
  t = Math.min(t, view.video.duration);
  view.video.currentTime = t;
  return false;
};

view.adjust = function() {
  view._adjust();
  view._adjust();
};

view._adjust = function() {
  if(!view.video) { return; }

  var ww = $(window).width();
  var wh = $(window).height();
  
  var vw = view.video.videoWidth;
  var vh = view.video.videoHeight;

  var fh = $("#footer-row").height();

  var r = vw / ww * (wh - fh) / vh * 100;
  if( r > 100 ) { r = 100; }
  
  $("#video-div").width(r.toString() + "%");
};

window.onload = function() {
  view.init();
};

window.onresize = function() {
  setTimeout("view.adjust();", 250);
};
