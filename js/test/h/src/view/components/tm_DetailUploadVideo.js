import React, { Component } from 'react'
import { Button, message } from 'antd'
import { addUploadCurriculumVideo_ac, getCurDetailed_ac } from './../../redux/b_teacherClassDetail.reducer';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { UploadSpinLoad } from './../common';
@withRouter
@connect(
  state => state.B_TacherClassManDetailReducer,
  { addUploadCurriculumVideo_ac, getCurDetailed_ac }
)
export default class TmDetailUploadVideo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      srcData: '',
      srcName: '请点击右边按钮选择文件',
      ModalShowOrHide: false
    }
  }


  //上传视频
  handleUploadVideo = (e) => {
    const target = e.target;
    const file = target.files[0];
    if (!file) {
      this.setState({
        srcData: '',
        srcName: '请点击右边按钮选择文件'
      })
    } else {
      if (file.type.indexOf('video') > -1) {
        this.setState({
          srcData: file,
          srcName: file.name
        })
      } else {
        this.setState({
          srcData: '',
          srcName: '请点击右边按钮选择文件'
        });
        message.warning('请上传正确格式的视频资源！')
      }
    }
  }

  comfirClick = () => {
    if (!this.state.srcData) {
      message.warning('未选择任何文件')
    } else {
      this.props.addUploadCurriculumVideo_ac(
        {
          curResourceId: this.props.ID,
          file: this.state.srcData
        }
      );
      this.setState({ ModalShowOrHide: true })
    }
  }

  componentWillReceiveProps(nextprops) {
    if (this.props.uploadVideo_data != nextprops.uploadVideo_data) {
      if (nextprops.uploadVideo_data.result) {
        message.success('上传成功');
        const curID = this.props.match.params.id;
        this.props.getCurDetailed_ac(curID);
        this.props.closeModal();
      } else {
        message.error(nextprops.uploadVideo_data.message);
      }
      this.setState({ ModalShowOrHide: false })
    }
  }


  render() {
    const styleCss = {
      containter: {
        padding: '20px 40px',
      },
      flexDiv: {
        display: 'flex',
      },
      textBox: {
        width: 440,
        border: '1px solid #ccc',
        borderRadius: 5,
        margin: 20,
        height: 50,
        lineHeight: '50px',
        paddingLeft: '4px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      },
      uploadBtn: {
        display: 'block',
        width: 100,
        textAlign: 'center',
        border: '1px solid #ccc',
        borderRadius: 5,
        margin: 20,
        height: 50,
        lineHeight: '50px',
        cursor: 'pointer'
      },
      btns: {
        textAlign: 'center'
      }
    }
    return (
      <div style={styleCss.containter}>
        <div style={styleCss.flexDiv}>
          <div style={styleCss.textBox}>{this.state.srcName}</div>
          <div >
            <label htmlFor="upload" style={styleCss.uploadBtn} className="lxx-s-orange">
              选择文件
            </label>
            <input type="file" id="upload" style={{ display: 'none' }} onChange={this.handleUploadVideo} />
          </div>
        </div>

        <div style={styleCss.btns}>
          <Button className="lxx-s-blue" onClick={this.comfirClick}>开始上传</Button>
        </div>

        <UploadSpinLoad ModalShowOrHide={this.state.ModalShowOrHide} />
      </div>
    )
  }
}
