/*
 * @Author: xiangting 
 * @Date: 2018-08-28 13:26:11 
 * @Last Modified by: xiangting
 * @Last Modified time: 2018-09-13 15:49:41
 * 柱状——带边框版
 * data:数据，数组格式
 * color:柱状图显示颜色
 * xAxis：横坐标，数组格式
 * type:1——课堂质量：教师教研评分排行，2——课堂质量：评分项得分比例，3——教师出勤：考勤异常类型次数排行，4——教师考勤：教师考勤异常平均次数排行
 * number：tooltip中子单位数据
 */

import React from 'react';
import ReactEcharts from 'echarts-for-react';

export default class BarChartBorder extends React.Component {
    state = {
        border: [],             //内框数据
        inline: []               //内填充数据
    }

    componentWillReceiveProps(props) {
        let border = [], inline = [], max = Math.max(...props.data);
        for (let i = 0; i < props.data.length; i++) {
            if (max < 20 && max > 10) {
                if (props.data[i] > 4) {
                    border.push(props.data[i] - 0.3);
                    inline.push(props.data[i] - 3);
                } else if (props.data[i] <= 4 && props.data[i] >= 1) {
                    border.push(props.data[i] - 0.3);
                    inline.push(props.data[i] - 1);
                } else {
                    border.push(0);
                    inline.push(0);
                }
            } else if (max <= 10 && max > 3) {
                if (props.data[i] > 4) {
                    border.push(props.data[i] - 0.2);
                    inline.push(props.data[i] - 1);
                } else if (props.data[i] <= 4 && props.data[i] >= 1) {
                    border.push(props.data[i] - 0.2);
                    inline.push(props.data[i] - 0.5);
                } else {
                    border.push(0);
                    inline.push(0);
                }
            } else if (max <= 3 && max > 1) {
                if (props.data[i] >= 1) {
                    border.push(props.data[i] - 0.02);
                    inline.push(props.data[i] - 0.5);
                } else {
                    border.push(0);
                    inline.push(0);
                }
            } else if (max <= 1) {
                border.push(props.data[i]);
                inline.push(0);
            } else {
                if (props.data[i] > 6) {
                    border.push(props.data[i] - 0.5);
                    inline.push(props.data[i] - 5);
                } else if (props.data[i] <= 6 && props.data[i] >= 1) {
                    border.push(props.data[i] - 0.5);
                    inline.push(props.data[i] - 1);
                } else {
                    border.push(0);
                    inline.push(0);
                }
            }
        };
        this.setState({ border, inline })
    }

    componentDidMount() {
        let border = [], inline = [], max = Math.max(...this.props.data);
        for (let i = 0; i < this.props.data.length; i++) {
            if (max < 20 && max > 10) {
                if (this.props.data[i] > 4) {
                    border.push(this.props.data[i] - 0.3);
                    inline.push(this.props.data[i] - 3);
                } else if (this.props.data[i] <= 4 && this.props.data[i] >= 1) {
                    border.push(this.props.data[i] - 0.3);
                    inline.push(this.props.data[i] - 1);
                } else {
                    border.push(0);
                    inline.push(0);
                }
            } else if (max <= 10 && max > 3) {
                if (this.props.data[i] > 4) {
                    border.push(this.props.data[i] - 0.2);
                    inline.push(this.props.data[i] - 1);
                } else if (this.props.data[i] <= 4 && this.props.data[i] >= 1) {
                    border.push(this.props.data[i] - 0.2);
                    inline.push(this.props.data[i] - 0.5);
                } else {
                    inline.push(0);
                    border.push(0);
                }
            } else if (max <= 3 && max > 1) {
                if (this.props.data[i] >= 1) {
                    border.push(this.props.data[i] - 0.02);
                    inline.push(this.props.data[i] - 0.5);
                } else {
                    inline.push(0);
                    border.push(0)
                }
            } else if (max <= 1) {
                border.push(this.props.data[i]);
                inline.push(0);
            } else {
                if (this.props.data[i] > 6) {
                    border.push(this.props.data[i] - 0.5);
                    inline.push(this.props.data[i] - 5);
                } else if (this.props.data[i] <= 6 && this.props.data[i] >= 1) {
                    border.push(this.props.data[i] - 0.5);
                    inline.push(this.props.data[i] - 1);
                } else {
                    border.push(0);
                    inline.push(0);
                }
            }
        };
        this.setState({ border, inline })
    }

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
            // tooltip（提示框组件）
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
                        value = '教研课数：' + this.props.number[params[0].dataIndex] + '<br />' + "评分平均分：" + params[0].data
                    } else if (this.props.type === 2) {
                        value = '全校平均分：' + this.props.number[params[0].dataIndex] + '<br />' + "得分比例：" + params[0].data + "%"
                    } else if (this.props.type === 3) {
                        value = '课程数：' + this.props.number[params[0].dataIndex] + '<br />' + "异常数：" + params[0].data
                    } else if (this.props.type === 4) {
                        value = '课程数：' + this.props.number[params[0].dataIndex] + '<br />' + "异常比例：" + params[0].data + '%'
                    }
                    return value;
                },
            },
            //echarts图表的相对于容器的布局,
            grid: {
                top: 50,
            },
            xAxis: [{
                type: 'category',
                //axisTick 坐标轴刻度相关设置
                axisTick: {
                    show: false
                },
                //axixLine 坐标轴轴线相关设置
                axisLine: {
                    lineStyle: {
                        color: '#FFFFFF',
                    }
                },
                // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                data: this.props.xAxis,
                //axisLabel 坐标轴刻度标签的相关设置
                // axisLabel: {
                //     show: false,
                // }
                // axisLabel: {rotate: 50, interval: 0}
            },
            {
                type: 'category',
                axisTick: {
                    show: false
                },

                axisLine: {
                    lineStyle: {
                        color: '#FFFFFF',
                    }
                },
                data: [],
                axisLabel: {
                    show: false,
                }
            }, {
                type: 'category',
                axisTick: {
                    show: false
                },

                axisLine: {
                    lineStyle: {
                        color: '#FFFFFF',
                    }
                },
                data: [],
                axisLabel: {
                    show: false,
                }
            },
            ],
            yAxis: [{
                type: 'value',
                axisLabel: {
                    color: '#fff',
                    fontSize: 14,
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#fff',
                    },
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    formatter: this.props.max ? '{value} %' : '{value}'
                }
            }],
            series: [
                {
                    type: 'bar',
                    data: this.props.data,
                    // data: [25, 60, 80, 100, 100],
                    barWidth: '53',
                    z: 0,
                    itemStyle: {
                        // barBorderRadius:50,
                        color: this.props.color,
                        // opacity:0.5
                    },
                }, {
                    type: 'bar',
                    name: '内填充',
                    xAxisIndex: 1,
                    // data: [20, 40, 60, 80, 100],
                    data: this.state.inline,
                    barWidth: '25',
                    z: 2,
                    itemStyle: {
                        // barBorderRadius:50,
                        color: this.props.color,
                        // opacity:0.5
                    },
                },
                {
                    type: 'bar',
                    name: '内框',
                    xAxisIndex: 2,
                    data: this.state.border,
                    // data: [24.5, 59.5, 79.5, 99.5, 99.5],
                    barWidth: '52',
                    z: 1,
                    itemStyle: {
                        // barBorderRadius:50,
                        // color: 'rgba(0,0,0,0.5)',
                        color: 'rgba(13,28,45,0.9)',
                        // color:this.props.color,
                        // opacity:0.1
                    },
                }
            ]
        };

        return option;
    }
    render() {
        return (
            <div>
                <div></div>
                <ReactEcharts style={this.props.style} option={this.getOption()} />
            </div>
        )
    }
}