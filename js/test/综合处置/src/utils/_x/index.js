import env from './env/index';
import util from './util/index';

var _x = () => { };
_x.request = util.request.request;
_x.multiRequest = util.request.requestMultiple;
_x.request.setConfig = util.request.setConfig;
_x.animation = util.animation;
_x.env = env.env;
_x.format = util.date.format;
_x.toChinese = util.number.toChinese;

export default _x;