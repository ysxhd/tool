/*
 * @Author: kyl 
 * @Date: 2018-08-28 13:18:23 
 * @Last Modified by: kyl
 * @Last Modified time: 2018-08-29 16:42:53
 */

import React from 'react';
import { Pagination } from 'antd';
import '../../../css/ktzx_table.css';

class KtzxTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  jumpPage = (pageNumber) => {
    console.log(pageNumber);
  }
  render() {
    const comp = this.props.comp;
    return (
      <div>
        <table className="kyl-kt-table">
          <thead>
            {
              comp === "课堂秩序学院报表" ?
                <tr>
                  <th><span>学院</span></th>
                  <th><span>违纪次数</span></th>
                  <th><span>违纪扣分</span></th>
                </tr> :
                (
                  comp === "课堂质量学院报表" ?
                    <tr>
                      <th><span>学院</span></th>
                      <th><span>课程数</span></th>
                      <th><span>评分</span></th>
                    </tr> :
                    (
                      comp === "课堂秩序违纪事件报表" ?
                        <tr>
                          <th><span>违纪事件</span></th>
                          <th><span>次数</span></th>
                        </tr> :
                        (
                          comp === "课堂质量教师报表" ?
                            <tr>
                              <th><span>学院</span></th>
                              <th><span>教师</span></th>
                              <th><span>课程数</span></th>
                              <th><span>评分</span></th>
                            </tr> :
                            (
                              comp === "课堂秩序任务报表" ?
                                <tr>
                                  <th><span>学院</span></th>
                                  <th><span>巡课人</span></th>
                                  <th><span>任务数</span></th>
                                  <th><span>完成数</span></th>
                                  <th><span>完成率</span></th>
                                </tr> :
                                (
                                  comp === "课堂质量听课任务报表" ?
                                    <tr>
                                      <th><span>学院</span></th>
                                      <th><span>巡课人</span></th>
                                      <th><span>任务数</span></th>
                                      <th><span>完成数</span></th>
                                      <th><span>完成率</span></th>
                                    </tr> :
                                    (
                                      comp === "课堂秩序原始数据" ?
                                        <tr>
                                          <th><span>学院</span></th>
                                          <th><span>上课班级</span></th>
                                          <th><span>授课教师</span></th>
                                          <th><span>科目</span></th>
                                          <th><span>课类型</span></th>
                                          <th><span>违纪对象</span></th>
                                          <th><span>违纪事件</span></th>
                                          <th><span>扣分</span></th>
                                          <th><span>发生时间</span></th>
                                          <th><span>记录人</span></th>
                                        </tr> :
                                        <tr>
                                          <th><span>学院</span></th>
                                          <th><span>班级</span></th>
                                          <th><span>授课教师</span></th>
                                          <th><span>科目</span></th>
                                          <th><span>评分教师</span></th>
                                          <th><span>评分</span></th>
                                          <th><span>发生时间</span></th>
                                        </tr>
                                    )
                                )
                            )
                        )
                    )
                )
            }
          </thead>
          <tbody>
            {
              comp === "课堂秩序学院报表" ?
                <tr>
                  <td><span>学院</span></td>
                  <td><span>违纪次数</span></td>
                  <td><span>违纪扣分</span></td>
                </tr> :
                (
                  comp === "课堂质量学院报表" ?
                    <tr>
                      <td><span>学院</span></td>
                      <td><span>课程数</span></td>
                      <td><span>评分</span></td>
                    </tr> :
                    (
                      comp === "课堂秩序违纪事件报表" ?
                        <tr>
                          <td><span>违纪事件</span></td>
                          <td><span>次数</span></td>
                        </tr> :
                        (
                          comp === "课堂质量教师报表" ?
                            <tr>
                              <td><span>学院</span></td>
                              <td><span>教师</span></td>
                              <td><span>课程数</span></td>
                              <td><span>评分</span></td>
                            </tr> :
                            (
                              comp === "课堂秩序任务报表" ?
                                <tr>
                                  <td><span>学院</span></td>
                                  <td><span>巡课人</span></td>
                                  <td><span>任务数</span></td>
                                  <td><span>完成数</span></td>
                                  <td><span>完成率</span></td>
                                </tr> :
                                (
                                  comp === "课堂质量听课任务报表" ?
                                    <tr>
                                      <td><span>学院</span></td>
                                      <td><span>巡课人</span></td>
                                      <td><span>任务数</span></td>
                                      <td><span>完成数</span></td>
                                      <td><span>完成率</span></td>
                                    </tr> :
                                    (
                                      comp === "课堂秩序原始数据" ?
                                        <tr>
                                          <td><span>学院</span></td>
                                          <td><span>上课班级</span></td>
                                          <td><span>授课教师</span></td>
                                          <td><span>科目</span></td>
                                          <td><span>课类型</span></td>
                                          <td><span>违纪对象</span></td>
                                          <td><span>违纪事件</span></td>
                                          <td><span>扣分</span></td>
                                          <td><span>发生时间</span></td>
                                          <td><span>记录人</span></td>
                                        </tr> :
                                        <tr>
                                          <td><span>学院</span></td>
                                          <td><span>班级</span></td>
                                          <td><span>授课教师</span></td>
                                          <td><span>科目</span></td>
                                          <td><span>评分教师</span></td>
                                          <td><span>评分</span></td>
                                          <td><span>发生时间</span></td>
                                        </tr>
                                    )
                                )
                            )
                        )
                    )
                )
            }
          </tbody>

        </table>
        <div className="kyl-kt-clear">
          <span className="kyl-kt-pageInfo">每页14条数据，共1000条</span>
          <input className="kyl-kt-jumpZdPage"></input>
          <Pagination className="kyl-kt-fy" showQuickJumper defaultCurrent={2} total={500} onChange={this.jumpPage} />
        </div>
      </div>
    );
  }
}

export default KtzxTable;