/*
 * @Author: lxx 
 * @Date: 2018-06-22 16:09:07 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-07-26 09:19:28
 */
import React, { Component } from 'react';
 //import ReactEcharts from 'echarts-for-react';
import './../notic_ctrl/addNotic.css'
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入折线图
import 'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import  {format}  from '../../js/_x/util/date';
import { connect } from 'react-redux';

@connect(
    state => state.UseMatter_reducer,
)
export default class LinChart extends Component {

    componentWillReceiveProps(nextProps){
              //深度克隆
      let data = JSON.parse(JSON.stringify(nextProps.history_data)),
      formdata,
      xdata = [],
      ydata = [];
      if(data && data.length){
        data.map((val)=>{
            formdata = new Date(val.xData);
            formdata = format(formdata,'yyyy/MM/dd');
            xdata.push(formdata);
            let num = parseInt(val.yData);
           
            if(nextProps.humanTime == 2){
              num = (num / 3600 / 1000).toFixed(1) ;
            }
            ydata.push(num);
        }) 
      }
      console.log(ydata);
  
          // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('zn-advise-echarts'));
        myChart.setOption({
            grid: {
                top: '5%',
                left: nextProps.humanTime == 2?'3%':'2%',
                right: '4%',
                bottom: '10%',
            },
            legend: {
                textStyle: {
                    color: '#ccc'
                },
                left: 0
            },
            xAxis: {
                data: xdata,  //x轴数据
                axisLine: {
                    lineStyle: {
                        color: '#097ED9'
                    }
                },
                axisLabel: {
                    color: '#fff',
                },
            },
            yAxis: {
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#20384E'
                    }
                },
                axisLine: {
                    show: false,
                },
                axisLabel: {
                    color: '#fff',
                    formatter: nextProps.humanTime == 2? '{value} h':'{value}'
                },
            },
            series: [{
                type: 'line',
                showAllSymbol: true,
                symbol: 'circle',
                symbolSize: 10,
                data: ydata,//Y轴数据
                lineStyle: {
                    normal: {
                        color: '#049781',
                        width: 2,
                    }
                },
                itemStyle: {
                    normal: {
                        borderWidth: 1,
                        borderColor: '#0A7AD2',
                        color: '#333755'
                    }
                }
            }]
        })
    }

    render() {
        return ( 
             <div id="zn-advise-echarts" style={{ width: '100%', height: '360px'}}></div>
        )
    }
}