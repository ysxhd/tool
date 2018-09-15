/*
 * @Author: JC.Liu 
 * @Date: 2018-07-11 13:55:54 
 * @Last Modified by: xq
 * @Last Modified time: 2018-09-12 15:30:35
 * 头部 场所 天气 时间 显示
 */
import React, { Component } from 'react'
import _x from '../../js/_x/index'
import request from '../../js/_x/util/request';
import './header.css'
import G from '../../js/g'


const format = _x.util.date.format;
const Request = request.request;
export class HeaderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataWeather: null,
      newTime: new Date(),
    }
    this.getWeather = this.getWeather.bind(this);
  }
  // 头部天气获取
  getWeather() {
    let params = {
      "buildingid": G.buildingId
    };

    Request('find_weather', params, (res) => {
      if (res.code !== "500"){
        if (res.result && res.data) {
          this.setState({ dataWeather: res.data })
        } else {
          this.setState({ dataWeather: null })
        }
        this.props.Message("")
      }else{
        this.props.Message(res.message)
      }
    })
  }

  componentDidMount() {
    let _this = this;
    _this.getWeather();
    setInterval(function () {
      _this.setState({
        newTime: new Date()
      })
      _this.getWeather();
    }, 20000)
  }


  render() {

    let dataWeather = this.state.dataWeather;
    return (
      <div className="JC-bs-header" >
        <div className="JC-bs-h-inline JC-bs-h-tit" >教室引导系统</div>
        <div className="JC-bs-h-inline JC-bs-h-place">
        <p className="ZOE-bs-h-p" >
          {
            dataWeather ? dataWeather.buildName : '- -'
          }
        </p>
        </div>
        {/* 时间 和教室数据一起 20S 刷一次 */}
        <div className="JC-bs-h-inline JC-bs-h-date">
          <span>{format((this.state.newTime), "HH:mm")}</span>
        </div>
        <div className="JC-bs-h-inline JC-bs-h-weather" >
          {
            dataWeather ?
              <div className='xq-weather'>
                <div>{dataWeather.tmp}℃</div>
                <div>{dataWeather.condTxt}</div>
                <div>
                  <img src={require(`../../static/weather/${dataWeather.condCode}.png`)} alt="" className='xq-weather-img' />
                </div>
                <div>{dataWeather.date}</div>
                <div>{dataWeather.weekday}</div>
                <div>第{dataWeather.weeks ? dataWeather.weeks : '-'}周</div>
                <div>第{dataWeather.session ? dataWeather.session : '-'}节</div>
              </div>
              : <div className='xq-weather'>
                <div>-℃</div>
                <div></div>
                <div>-</div>
                <div>星期-</div>
                <div>第-周</div>
                <div>第-节</div>
              </div>
          }
        </div>
      </div>
    )
  }
}