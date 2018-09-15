
const getQueryString = function (name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r && r[2]) return unescape(r[2]);
  else return null;
}

export default { getQueryString };