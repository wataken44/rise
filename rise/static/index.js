
var index = {}

index.markLast = function() {
  url = Cookies.get('url');
  if(!url) { return; };

  url = url.replace(/.*\//,'')
  anchors = $('a[href$="' + url + '"]');
  if(!anchors) { return; };

  anchors.addClass("text-info");
};

window.onload = function() {
  index.markLast();
};
