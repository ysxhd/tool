/*
 * @Author: hf 
 * @Date: 2018-08-07 09:24:01 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-15 19:33:47
 */

/**
 * 管理员 管理课堂 置顶管理
 */
import number from './../../js/_x/util/number';
import React from 'react';
import { Button, Tooltip, message } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { cancelTopRecommendCur_ac } from './../../redux/b_managerClassDetail.reducer';

@withRouter
@connect(
  state => state.B_ManagerClassManDetaileReducer,
  { cancelTopRecommendCur_ac }
)
export default class MmStickManageItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  /**
   * 取消置顶
   * id：curResourceId 资源id
   */
  cancelTopRecommendCur = (id) => {
    this.props.cancelTopRecommendCur_ac(id)
  }


  /**
   * 取消置顶
   */

  render() {
    const styleCss = {
      container: {
        padding: '0 40px',
      },
      itemBox: {
        border: '1px solid #ccc',
        marginBottom: 20,
        padding: '10px 20px 0',
        lineHeight: '30px'
      },
      flexDiv: {
        display: 'flex',
        alignItems: 'center'
      },
      text: {
        fontSize: 18,
        height: 70,
        lineHeight: '70px',
      },
      cName: {
        maxWidth: 600,
        display: 'inline-block',
        fontSize: 16,
        fontWeight: 'bold',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        verticalAlign: 'bottom',
        cursor: 'pointer'
      },
      marginRight: {
        marginRight: 40
      },
    };
    const data = this.props.data;

    return (
      <div style={styleCss.container}>
        <div style={styleCss.text}>周{Number(data.weekday).toChinese()}（{Number(data.actureDate).formatTime().substring(5)}）第{Number(data.weekday).toChinese()}节 ({Number(data.actureStartTime).formatTime(false).substring(11)} ~ {Number(data.actureEndTime).formatTime(false).substring(11)})</div>
        <div style={styleCss.itemBox}>
          <Tooltip placement="right" title={data.curName}>
            <div style={styleCss.cName}>{data.curName}</div>
          </Tooltip>
          <div style={{ ...styleCss.flexDiv, margin: '10px 0' }}>
            <div style={styleCss.marginRight}>科目：{data.subName}</div>
            <div style={{ ...styleCss.marginRight, flex: 1 }}>授课教师：{data.teacherName}</div>
            <Button className="lxx-s-orange" onClick={(id) => this.cancelTopRecommendCur(data.curResourceId)}>取消置顶</Button>
          </div>
          <div style={styleCss.flexDiv}>
            {
              data.videoNum
                ?
                <div style={styleCss.marginRight}>录播：{data.videoNum}</div>
                :
                null
            }
            {
              data.daoxueNum
                ?
                <div style={styleCss.marginRight}>导学：{data.daoxueNum}</div>
                :
                null
            }
            {
              data.jiaoanNum
                ?
                <div style={styleCss.marginRight}>教案：{data.jiaoanNum}</div>
                :
                null
            }
            {
              data.kejianNum
                ?
                <div style={styleCss.marginRight}>课件：{data.kejianNum}</div>
                :
                null
            }
            {
              data.xitiNum
                ?
                <div style={styleCss.marginRight}>习题：{data.xitiNum}</div>
                :
                null
            }
            {
              data.sucaiNum
                ?
                <div style={styleCss.marginRight}>素材：{data.sucaiNum}</div>
                :
                null
            }
            {
              data.qitaNum
                ?
                <div style={styleCss.marginRight}>其他：{data.sucaiNum}</div>
                :
                null
            }
          </div>

        </div>
      </div>
    )
  }
}
