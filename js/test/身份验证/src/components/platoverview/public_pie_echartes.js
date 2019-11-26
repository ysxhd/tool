/*
 * @Author: JC.liu 
 * @Date: 2018-05-16 11:12:34 
 * @Last Modified by: kyl
 * @Last Modified time: 2018-05-30 18:09:22
 * 总览 - 圆形echarts 组件
 */
import '../../css/equipment_condition.css';
import React, {
  Component,
  PropTypes
} from 'react'
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

export class Pie_Echarts extends Component {
  componentWillReceiveProps(p) {
    if (p.type === "1") {
      console.log(p.echartsData)
      this.overview_equipment_echarts(p.echartsData);
    } else if (p.type === "2") {
      // 考后统计第一个饼图
      this.kyl(p);
    } else if (p.type === "3") {
      // 考后统计第二个饼图
      this.kyl1(p);
    }
  }

  overview_equipment_echarts = (data) => {
    var data = data;
    var myChart = echarts.init(document.getElementById('ljcMain'));
    myChart.setOption({
      series: [{
        name: '访问来源',
        type: 'pie',
        radius: '50%',
        label: {
          normal: {
            trigger: 'item',
            position: "right",
            formatter: "{c}%"
          }
        },

        // 次序：1正常  2软件异常  3硬件异常  4数据异常  5其他异常  6巡查
        data: [{
          value: data.normal,
          name: `${data.normal}%`,
          label: {
            color: "#000000"
          }, // 控制文字的颜色
          itemStyle: {
            color: "#60a1a9"
          } // 控制扇形图的颜色
        },
        {
          value: data.software,
          name: `${data.software}%`,
          itemStyle: {
            color: "#91c7af"
          },
          label: {
            color: "#000000"
          },
        },
        {
          value: data.hardware,
          name: `${data.hardware}%`,
          itemStyle: {
            color: "#bda39b"
          },
          label: {
            color: "#000000"
          },
        },
        {
          value: data.data,
          name: `${data.data}%`,

          itemStyle: {
            color: "#d58364"
          },
          label: {
            color: "#000000"
          },
        },
        {
          value: data.other,
          name: `${data.other}%`,
          itemStyle: {
            color: "#2e4454"
          },
          label: {
            color: "#000000"
          },
        },
        {
          value: data.noInspection,
          name: `${data.noInspection}%`,
          itemStyle: {
            color: "#c5cdd3"
          },
          label: {
            color: "#000000"
          },
        }
        ]
      }]
    });
  }

  kyl = (props) => {
    var pie1 = props.params;
    var myChart = echarts.init(document.getElementById('kylMain1'));
    myChart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      series: [{
        name: '访问来源',
        type: 'pie',
        radius: '50%',
        label: {
          normal: {
            trigger: 'item',
            position: "right",
            formatter: "{c}%"
          }
        },
        // 次序：1验证通过  2未验证  3人工通过  4未通过 
        data: [{
          value: pie1.validationRate,
          name: `${(pie1.validationRate)}%`,
          label: {
            color: "#000000"
          }, // 控制文字的颜色
          itemStyle: {
            color: "#91c7af"
          } // 控制扇形图的颜色
        },
        {
          value: pie1.noValidationRate,
          name: `${(pie1.noValidationRate)}%`,
          itemStyle: {
            color: "#c5cdd3"
          },
          label: {
            color: "#000000"
          },
        },
        {
          value: pie1.shtgrsRate,
          name: `${(pie1.shtgrsRate)}%`,
          itemStyle: {
            color: "#60a1a9"
          },
          label: {
            color: "#000000"
          },
        },
        {
          value: pie1.notThroughRate,
          name: `${(pie1.notThroughRate)}%`,
          itemStyle: {
            color: "#d58364"
          },
          label: {
            color: "#000000"
          },
        }
        ]
      }]
    });
  }

  kyl1 = (props) => {
    var myChart = echarts.init(document.getElementById('kylMain2'));
    var pie2 = props.params1;
    myChart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      series: [{
        name: '访问来源',
        type: 'pie',
        radius: '50%',
        label: {
          normal: {
            trigger: 'item',
            position: "right",
            formatter: "{c}%"
          }
        },
        // 次序：1验证缺考  2确认缺考  3正常 
        data: [{
          value: pie2.qkrsRate,
          name: `${(pie2.qkrsRate)}%`,
          label: {
            color: "#000000"
          }, // 控制文字的颜色
          itemStyle: {
            color: "#bda39b"
          } // 控制扇形图的颜色
        },
        {
          value: pie2.zhbdqkrsRate,
          name: `${(pie2.zhbdqkrsRate)}%`,
          itemStyle: {
            color: "#d58364"
          },
          label: {
            color: "#000000"
          },
        },
        {
          value: pie2.normalMissRate,
          name: `${(pie2.normalMissRate)}%`,
          itemStyle: {
            color: "#60a1a9"
          },
          label: {
            color: "#000000"
          },
        }
        ]
      }]
    });
  }

  render() {
    const style1 = {
      width: "215px",
      height: "120px",
    }

    const style2 = {
      width: "200px",
      height: "120px",
    }

    return (
    <div className="ljc-overview-echarts" >
      {
        this.props.type === "1" ?
          <div id="ljcMain" style={style2} > < /div> :
          this.props.type === "2" ?
          <div id="kylMain1" style={style1} > < /div>
          : this.props.type === "3" ?
          <div id="kylMain2" style={style1} > < /div>: ""
      }
      </div>
              )
  }
}