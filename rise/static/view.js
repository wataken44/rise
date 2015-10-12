
var view = {};

view.INTERVAL = 60; // 60 seconds
view.video = null;

view.init = function() {
  if(!($("#video") && $("#video")[0])) { return; } // do nothing
  
  view.video = $("#video")[0];
  if(Cookies.get('url') === location.href && Cookies.get('time')) {
    ct = Math.max(parseInt(Cookies.get('time')) - 5, 0);
    view.video.currentTime = ct;
  }
  view.video.play();
  setInterval("view.saveState()", view.INTERVAL * 1000);
};

view.saveState = function() {
  if(!view.video.ended) {
    ct = view.video.currentTime;
    
    Cookies.set('url', location.href, { expires: 64, path: '/' });
    Cookies.set('time', ct.toString(), { expires: 64, path: '/' });
  } else {
    Cookies.remove('url', { path: '/' });
    Cookies.remove('time', { path: '/' });
  }
};

window.onload = function() {
  view.init();
};
