/*
 * @Author: xiangting 
 * @Date: 2018-08-28 13:26:11 
 * @Last Modified by: xiangting
 * @Last Modified time: 2018-09-14 10:23:42
 * 折线图
 * data:数据，数据格式
 * color：折线图颜色
 * xAxis：横坐标，数组格式
 * type:1——课堂秩序，2——学生出勤，3——教师考勤
 * number：tooltip中子单位数据
 */

import React from 'react';
import ReactEcharts from 'echarts-for-react';

export default class LineChart extends React.Component {

    getOption = () => {
        for (let i = 0; i < this.props.xAxis.length; i++) {
            if (!this.props.xAxis[i]) {
                this.props.xAxis[i] = '-'
            }
            let xAxis = [];
            for (let j = 0; j < Math.floor(this.props.xAxis[i].length / 5); j++) {
                xAxis.push(this.props.xAxis[i].slice(j * 5, (j + 1) * 5))
            }
            if ((this.props.xAxis[i].length % 5) > 0) {
                xAxis.push(this.props.xAxis[i].slice(Math.floor(this.props.xAxis[i].length / 5) * 5))
            }
            this.props.xAxis[i] = xAxis.join('\n')
        }
        let option = {
            tooltip: {
                //trigger(触发类型)，可选'item','axis','none'
                trigger: 'axis',
                axisPointer: {
                    //指示器类型,可选'line','shadow','cross'
                    type: 'line'
                },
                formatter: (params) => {
                    let value;
                    if (this.props.type === 1) {
                        value = '课程数：' + this.props.number[params[0].dataIndex] + '<br />' + "发生次数：" + params[0].data
                    } else if (this.props.type === 2) {
                        value = '课程数：' + this.props.number[params[0].dataIndex] + '<br />' + "出勤率：" + params[0].data + '%'
                    } else if (this.props.type === 3) {
                        value = '课程数：' + this.props.number[params[0].dataIndex] + '<br />' + "异常次数：" + params[0].data
                    }
                    return value;
                },
            },
            grid: {
                top: 20,
            },
            xAxis: {
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                data: this.props.xAxis,
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    }
                }
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    }
                },
            },
            series: [{
                data: this.props.data,
                type: 'line',
                smooth: true,
                lineStyle: {
                    color: this.props.color
                },
                itemStyle: {
                    color: this.props.color,
                    borderWidth: 3
                },
                connectNulls: true
            }]
        };

        return option;
    }
    render() {
        return (
            <div>
                <ReactEcharts style={this.props.style} option={this.getOption()} />
            </div>
        )
    }
}