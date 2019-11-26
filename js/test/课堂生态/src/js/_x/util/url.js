
const getQueryString = function (name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}



//基于资源平台2.1高教版的新开页面逻辑   
const goWith = (pr = { to: 'index', with: [] }) => {
  let url = window.location.href;
  let href = url.slice(0, url.indexOf('#') + 2);
  console.log(href);
  href += pr.to + '/' + pr.with.join('/');
  window.open(href);
}
export default { getQueryString, goWith };