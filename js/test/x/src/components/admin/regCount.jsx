/*
 * @Author: JudyC 
 * @Date: 2018-01-05 10:11:53 
 * @Last Modified by: JCheng.L
 * @Last Modified time: 2018-03-19 09:55:42
 * 报名统计组件
 */
import '../../css/admin/regCount.css';
import React, { Component } from 'react';
import { SVG } from "../base";
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import _x from '../../js/_x/index';
import {G} from '../../js/g';
export class RegCount extends Component {
  constructor(){
    super();
    this.state = {
      data:[],
      count:0,
      title:'',
      id:'',
      disable:false
    }
  }

  // 报名统计组件 传入选中的id 
  componentWillReceiveProps(newsProps){
    let title = '';
    let x = [],
        y = [];
    
    if (newsProps.data){
      newsProps.data.gradeList.map(dt => {
        if(dt.grade === null){
          x.push("无年级报名");
          this.setState({
            disable:true
          })
        }else{
          x.push(dt.grade);
          this.setState({
            disable: false
          })
        }

        y.push(dt.num);
      })
      var myChart = echarts.init(document.getElementById('main'));
      // 绘制图表
      myChart.setOption({
        title: {
          // 数据 
          text: newsProps.data.title,
          left: "center",
          textStyle: {
            color: '#4d4d4d',
            fontWeight: 'normal',
            fontSize: 18,
          }
        },
        tooltip: {
          show: false,
        },
        grid: {
          left: '7%',
          right: '5%',
          bottom: '23%',
          top: "25%",
          containLabel: false,
        },
        xAxis: {
          // 数据
          data: x,
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          barWidth: '25px',
          // 数据
          data: y,
          itemStyle: {
            normal: {
              color: "#ff9934"
            }
          },
          label: {
            normal: {
              show: true,
              position: 'top',
              color: '#333333',
            }
          }
        }]
      });

      this.setState({
        data: newsProps.data,
        title: newsProps.data.title,
        count: newsProps.data.count,
        id: newsProps.data.id,
      })
    }
  }

  render() {
    return (
      <div className="ljc-rc-container" >
        <div id="main" style={{ width: "100%", height: 400 }}></div>
        <div className="ljc-rc-num" ><SVG type="users" color="#b3b3b3" />&nbsp;
          {this.state.count + "人"}
        </div>
      <div className="ljc-rc-input" >
          <a 
            href={`${G.serverUrl}api/web/manager_school_activity/sign/download_sign_info/${this.state.id}`} 
            disabled={this.state.disable}
            download={ this.state.data ? `${this.state.data.title}`+'报名统计表' : "filename" } >导出报名详情</a>
      </div>
      </div>
    );
  }
}