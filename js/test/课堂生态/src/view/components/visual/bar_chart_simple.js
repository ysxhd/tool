/*
 * @Author: xiangting 
 * @Date: 2018-08-28 13:26:11 
 * @Last Modified by: xiangting
 * @Last Modified time: 2018-09-14 10:00:25
 * 柱状——简单版
 * color:柱状图颜色
 * data：数据，数组格式
 * xAxis：横坐标，数组格式
 * type:1——课堂秩序：教学机构、教师违纪扣分，2——学生出勤,4——课堂秩序：违纪类型次数
 * number：tooltip中子单位数据
 */

import React from 'react';
import ReactEcharts from 'echarts-for-react';

export default class BarChartSimple extends React.Component {

    getOption = () => {
        let xAxisData=this.props.xAxis;
        for (let i = 0; i < xAxisData.length; i++) {
            if (!xAxisData[i]){
                xAxisData[i]='-'
            }
            let xAxis = [];
            for (let j = 0; j < Math.floor(xAxisData[i].length / 5); j++) {
                xAxis.push(xAxisData[i].slice(j * 5, (j + 1) * 5))
            }
            if ((xAxisData[i].length % 5) > 0) {
                xAxis.push(xAxisData[i].slice(Math.floor(xAxisData[i].length / 5) * 5))
            }
            xAxisData[i]=xAxis.join('\n')
        }
        let option = {
            tooltip: {
                //trigger(触发类型)，可选'item','axis','none'
                trigger: 'axis',
                axisPointer: {
                    //指示器类型,可选'line','shadow','cross'
                    type: 'shadow'
                },
                formatter: (params) => {
                    let value;
                    if (this.props.type === 1) {
                        value = '课程数：' + this.props.number[params[0].dataIndex] + '<br />' + "发生次数：" + params[0].data
                    } else if (this.props.type === 2) {
                        value = '课程数：' + this.props.number[params[0].dataIndex] + '<br />' + "平均出勤率：" + params[0].data+'%'
                    }else if (this.props.type === 3) {
                        value = '课程数：' + this.props.number[params[0].dataIndex] + '<br />' + "发生次数：" + params[0].data
                    }
                    return value;
                },
            },
            grid: {
                top: 30,
            },
            xAxis: {
                type: 'category',
                data: xAxisData,
                // data: ['马克思列宁主义毛泽东思想基本理论'],
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    },
                },
                // axisLabel: {}
                axisLine: {
                    lineStyle: {
                        color: '#FFFFFF',
                    }
                },
                nameRotate: 45,
                axisTick: {
                    show: false
                },
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    }
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#FFFFFF',
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    formatter: this.props.max ? '{value}%' : '{value}'
                }
            },
            series: [{
                data: this.props.data,
                type: 'bar',
                itemStyle: {
                    color: this.props.color || '#d37f2d',
                },
                barWidth: 40,
            }]
        };

        return option;
    }
    render() {
        return (
            <div>
                <ReactEcharts
                    // style={{ width: '400px', height: '291px' }}
                    style={this.props.style}
                    option={this.getOption()}
                />
            </div>
        )
    }
}