const contextMenu = require("sdk/context-menu");
const { Panel } = require("sdk/panel");
const tabs = require('sdk/tabs');
const { data } = require('self');

function contentScript(fn) {
  return '(' + fn.toString() + '.call(this));';
}

function queryString(params) {
  return Object
    .keys(params)
    .map(function (key) {
      return key + '=' + encodeURIComponent(params[key]);
    }, '')
    .join('&');
}

contextMenu.Item({
  label: "Pin Image",
  image: data.url('pinterest-logo.png'),
  context: contextMenu.SelectorContext("img"),
  contentScript: contentScript(function () {
    self.on("click", function (node, data) {
      self.postMessage(node.src);
    });
  }),
  onMessage: function (imgSrc) {
    let pinUrl = "http://pinterest.com/pin/create/button/?" + queryString({
      url: tabs.activeTab.url,
      media: imgSrc
    });

    let panel = Panel({
      contentURL: pinUrl,
      width: 800,
      height: 600
    });
    panel.show();
  }
});
