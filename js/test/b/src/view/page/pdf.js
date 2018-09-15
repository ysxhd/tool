/*
 * @Author: zhengqi 
 * @Date: 2018-08-28 16:43:39 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-09-12 18:24:06
 */
/*展示pdf文件页面*/

import React from 'react';
import PDFObject from './../../js/pdfobject.min.js';
import { Spin , message } from 'antd'
import { Container } from './../common'
import { _x } from '../../js/index'
import G from '../../js/g';

const Request = _x.util.request.request; //请求

class Pdf extends React.Component {
  constructor(){
    super();
    this.state = {
      loading:false
    }
  }


  componentDidMount() {
        let targetEle = document.getElementById('zn-pdf-play');
        Request('api/web/report_center/read_download_pdf', {"pdfName":this.props.match.params.id,"type":"read"}, (res) => {
          if (res.result && res.data) {
                let downUrl = G.dataServices + res.data;
                if (PDFObject.supportsPDFs) {
                  let config = {
                      page: 0,
                      pdfOpenParams: {
                          // pagemode: 'thumbs',
                          view: 'FitH',
                          zoom: 150,
                          scrollbar: 0,
                          toolbar: 0,
                          statusbar: 0,
                          messages: 0,
                          navpanes: 100,
                      },
                      fallbackLink: "此浏览器不支持文档播放器"
                  }
                    PDFObject.embed(downUrl, '#zn-pdf-play', config);
              } else {
                  targetEle.innerHTML = '当前浏览器不支持在线浏览文档，请升级浏览器版本或跟换其他高级浏览器';
              }
              
            this.setState({
              loading:false
            })
          } else {
            this.setState({
              loading:false
            })
            message.warning(res.message);
          }
        })


}

  render() {
    return (
      <Container>
        <div id='zn-pdf-play' style={{ height: '100%'}}>
          {this.ele
              ? this.ele
              : '正在请求资源，请稍候...'
          }
        </div>
     </Container>
    );
  }
}

export default Pdf;
