/*
 * @Author: hf 
 * @Date: 2018-07-24 14:16:49 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-08 16:33:41
 */
/**
 * 学科  + 班级
 * 学生没有班级
 */
import React from 'react';
import './../../css/mc_subClass.css';
import { getSubCurInfo_ac } from './../../redux/mc_SubClass.reducer';
import { changeCurrentWeek_ac } from './../../redux/mc_YearTermWeek.reducer';
import { getScheduleList_ac, getSemCurNum_ac } from '../../redux/mc_Table.reducer';
import { connect } from 'react-redux';
import G from './../../js/g';
@connect(
  state => state.SubClassReducer,
  { getSubCurInfo_ac, getScheduleList_ac, getSemCurNum_ac, changeCurrentWeek_ac }
)
export default class McSubClass extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selValue: {
        subInd: 'all',
        classInd: 'all'
      },
      unfoldsubject: false,
      unfoldclass: false,
      showBoxSubject: false,
      showBoxClass: false,
    }
  }

  componentWillReceiveProps(nextprops) {

    if (this.props.subClass != nextprops.subClass) {
      this.setState({
        data: nextprops.subClass,
        selValue: {
          subInd: 'all',
          classInd: 'all',
        },
        showBoxSubject: false
      }, () => {
        this.getBoxHei('subject');

        G.userInfo.accTypeId == 4
          ?
          null
          :
          this.getBoxHei('class')

      });

      let param = {
        "acdYearId": nextprops.condition.acdYearId,
        "semId": nextprops.condition.semId,
        "weekNum": nextprops.condition.weekNum,
        "semStartDate": nextprops.condition.semStartDate,
        "subjectId": "all",
        "claId": 'all'
      }
      this.selRequset(param)
    }

  }

  selRequset = (param) => {
    this.props.getScheduleList_ac(param)
    this.props.getSemCurNum_ac(param)
    // this.props.changeCurrentWeek_ac(param)
  }
  /**
   * 科目选择
   */
  subChange = (ind) => {
    let data = this.state.data;
    this.setState({
      selValue: {
        subInd: ind,
        classInd: "all",
      },
      showBoxClass: false
    }, () => {
      G.userInfo.accTypeId == 4
        ?
        null
        :
        this.getBoxHei('class')
    })

    this.selRequset({
      "subjectId": ind == 'all' ? 'all' : data[ind].subjectId,
      "claId": 'all'
    })

  }
  /**
   * 班级选择
   */
  classChange = (ind) => {
    let data = this.state.data;
    let selValue = this.state.selValue;
    selValue.classInd = ind;
    this.setState({
      selValue
    })

    this.selRequset({
      "claId": selValue.subInd == 'all' ? 'all' : selValue.classInd == 'all' ? 'all' : data[selValue.subInd].classList[ind].classId
    })
  }


  /**
   * getBoxHei
   * 获取高度
   * sel:subject：科目，class:班级
   */
  getBoxHei = (sel) => {
    let hei = 0;
    switch (sel) {
      case 'subject':
        let subject = this.subjectbox;
        subject.style.height = null;
        hei = subject.clientHeight;
        if (hei > 50) {
          subject.style.paddingRight = '60px';
          subject.style.height = '42px';
          this.setState({
            unfoldsubject: true,
            subjectHei: hei,
          });
        } else {
          this.setState({
            unfoldsubject: false
          });
        }
        break;
      case 'class':
        let oClass = this.classbox;
        oClass.style.height = null;
        hei = oClass.clientHeight;
        if (hei > 50) {
          oClass.style.paddingRight = '60px';
          oClass.style.height = '42px';
          this.setState({
            unfoldclass: true,
            classHei: hei
          });
        } else {
          this.setState({
            unfoldclass: false
          });
        };
        break;
    }
  }
  /**
   * 收缩显示
   * sel:subject：科目，class:班级
   */
  handleShowHide = (sel) => {
    let state = this.state;
    switch (sel) {
      case "subject":
        let subject = this.subjectbox;
        subject.style.height = null;
        if (!state.showBoxSubject) {
          subject.style.height = state.subjectHei + 'px';
        } else {
          subject.style.height = '42px';
        }
        this.setState({
          showBoxSubject: !this.state.showBoxSubject
        });
        break;
      case "class":
        let oClass = this.classbox;
        oClass.style.height = null;
        if (!state.showBoxClass) {
          oClass.style.height = state.classHei + 'px';
        } else {
          oClass.style.height = '42px';
        };
        this.setState({
          showBoxClass: !this.state.showBoxClass
        });
        break;
    }

  }


  render() {
    let data = this.state.data;
    let selValue = this.state.selValue;
    let classData = [];
    if (data.length > 0 && selValue.subInd != 'all') {
      classData = data[selValue.subInd].classList || [];
    }

    return (
      <div className="hf-msc-main" style={{ marginBottom: 30 }}>
        <div className="hf-msc-sub">
          <label className="hf-msc-label">科目:</label>
          <div ref={(ref) => this.subjectbox = ref} className="hf-msc-selBox"  >
            <span value="all" className={selValue.subInd == 'all' ? 'hf-msc-span hf-msc-span-active' : 'hf-msc-span'} onClick={(ind) => this.subChange('all')}>全部</span>
            {
              data.map((item, i) => (
                <span key={i} value={i.toString()} className={i == selValue.subInd ? 'hf-msc-span hf-msc-span-active' : 'hf-msc-span'} onClick={(ind) => this.subChange(i)}>{item.subName}</span>
              ))
            }
            {
              !this.state.unfoldsubject
                ?
                null
                :
                <div className="lxx-m-isUnfold" onClick={() => this.handleShowHide('subject')}>
                  <span>{!this.state.showBoxSubject ? '展开' : '收缩'}</span>
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref={!this.state.showBoxSubject ? '#icon-pullDown' : '#icon-pullUp'}></use>
                  </svg>
                </div>
            }
          </div>
        </div>
        {
          G.userInfo.accTypeId == 4
            ?
            null
            :
            <div className="hf-msc-sub">
              <label className="hf-msc-label">班级:</label>
              <div ref={(ref) => this.classbox = ref} className="hf-msc-selBox" >
                <span value="all" className={selValue.classInd == 'all' ? 'hf-msc-span hf-msc-span-active' : 'hf-msc-span'} onClick={(ind) => this.classChange('all')}>全部</span>
                {
                  classData.map((item, i) => (
                    <span key={i} value={i.toString()} className={i == selValue.classInd ? 'hf-msc-span hf-msc-span-active' : 'hf-msc-span'} onClick={(ind) => this.classChange(i)} >{item.className}</span>
                  ))
                }
                {
                  !this.state.unfoldclass
                    ?
                    null
                    :
                    <div className="lxx-m-isUnfold" onClick={() => this.handleShowHide('class')}>
                      <span>{!this.state.showBoxClass ? '展开' : '收缩'}</span>
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref={!this.state.showBoxClass ? '#icon-pullDown' : '#icon-pullUp'}></use>
                      </svg>
                    </div>
                }
              </div>
            </div>
        }

      </div>
    )
  }
}