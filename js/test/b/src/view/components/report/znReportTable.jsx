import React from 'react';
import { Table, Pagination ,Input ,message} from 'antd';
import { SVG } from '../../common'
import { connect } from 'react-redux';
import _x from '../../../js/_x/index';
import G from './../../../js/g';
import { 
  zn_change_prop ,changeLoadCustomer,
  zn_change_jsProp,initCustomeTable
} from '../../../redux/zn.systemreducer'


const Format = _x.util.date.format;
const Request = _x.util.request.request;
const goWith = _x.util.url.goWith;

@connect(
  state => state.znSystemReducer,
  {
    zn_change_prop,changeLoadCustomer,
    zn_change_jsProp,initCustomeTable
  }
)
export default class ZnReportTable extends React.Component {
  constructor() {
    super();
    this.state = {
    }
  }




  jumpPage = (pageNumber) => {
    let colParam = this.props.colParam;
    colParam.pageIndex = pageNumber;
    this.props.zn_change_prop(colParam);
  }

  
  /**
   * 输入框回车回调
   */
  handleChangePage = (e) => {
     let params = this.props.colParam,
            val = e.target.value,
            isNum = /^[0-9]+$/.test(val),
        totalPage = this.props.totalPage;
         params = {...params,pageIndex:val};

         if(isNum || e.keyCode == 8){
          if (e.keyCode == 13){
              if(totalPage < Number(val)){
                message.warning('输入的页码不能大于总页数');
                return;
              }
              
              if(Number(val) < 1){
                message.warning('输入的页码不能小于1');
                return;
              }
              
              this.props.zn_change_prop(params);
           }
      }else{
        message.warning('请输入纯数字！');
      }
  
  }

  //下载
  downLoad = (id) =>{
    Request('api/web/report_center/read_download_pdf', {pdfName:id,"type":"down"}, (res) => {
      if (res.result && res.data) {
        let downUrl = G.dataServices + res.data;
        var iframe = document.createElement("iframe");
        iframe.setAttribute("style", "display: none");
        iframe.setAttribute("src", downUrl);
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(iframe);
        message.success("下载成功!");
      } else {
        message.warning(res.message);
      }
    })
  }
  //查看报告
  look = (id) =>{
    let goWhere = {
      to: 'pdf',
      with: [id]
    }
    goWith(goWhere);
  }

  render() {
    const columns = [{
      title: '报告名',
      align: 'left',
      width: 140,
      dataIndex: 'reportName',
      render: text => <div>{text}</div>,
    }, {
      title: '生成时间',
      width: 640,
      align: 'center',
      dataIndex: 'createTime',
    }, {
      title: '',
      width: 240,
      align: 'right',
      dataIndex: 'pdfId',
      render: (text, record, index) => {
        return <div className="zn-report-sear">
          <div className="zn-svg-hover" onClick={()=>{this.downLoad(text)}}>
            <SVG type="down" />
            <span>下载报告</span>
          </div>
          <div className="zn-svg-hover" onClick={()=>{this.look(text)}}>
            <SVG type="find" />
            <span>查看报告</span>
          </div>

        </div>
      }
    }];
    let prop = this.props , data = prop.custome_list,data2=[],state = this.state;
    data.map((val)=>{
      
      let a = {...val,key:val.reportId ,createTime:Format(new Date(val.createTime), 'yyyy-MM-dd')};
      data2.push(a);
    })
    return <div className="kyl-crc-body">
      <Table
        loading={this.props.loading_cust}
        className="zn-report-table"
        columns={columns}
        pagination={false}
        dataSource={data2} />
      {
        prop.totalElements ? <div className="kyl-kt-clear">
        <span className="kyl-kt-pageInfo">每页20条数据，共{prop.totalElements}条</span>
        <Input
          className="kyl-kt-jumpZdPage"
          disabled={prop.totalPage <= 1}
          onKeyUp={this.handleChangePage} />
        <Pagination className="kyl-kt-fy" 
            defaultPageSize={20}
            showQuickJumper 
            current={Number(prop.colParam.pageIndex)}
            defaultCurrent={1}
            total={prop.totalElements}
            onChange={this.jumpPage} />
      </div>:""
      }

    </div>
  }
}