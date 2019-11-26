import React from 'react';
import { message, Table, Pagination, Radio ,Input } from 'antd'
import { SVG } from '../../common'
import { _x } from '../../../js/index'

const Request = _x.util.request.request; //请求
const goWith = _x.util.url.goWith;

export default class ReportSystem extends React.Component {
    constructor() {
        super();
        this.state = {
            inputValue:"",//分页输入框
            data:[],//table data
            type:"1", //1：日报 2：周报 3：月报
            loading:false, //table loading
            page:{
                totalElements:0,
                current:1,
                totalPage:0
            },
        }
    }

    //分页跳转
    jumpPage = (pageNumber) => {
        this.getAjax(this.state.type,20,pageNumber);
    }

    componentDidMount() {
     this.getAjax("1",20,1);
     this.setState({type:"1"})
    }

    //ajax

    /**
     * type:1：日报 2：周报 3：月报
     */
    getAjax = (type,pageSize,pageIndex) =>{
       let data = {
             type,
             pageSize,
             pageIndex
        }
        this.setState({loading:true})
        Request('api/web/report_center/system_report', data, (res) => {
        this.setState({loading:false})
            if(res.result){
                if(res.data && res.data.pageContent){
                    this.setState({
                        data:res.data.pageContent,
                        page:{...this.state.page,
                               totalElements:res.data.totalElements,
                               totalPage:res.data.totalPage,
                               current:pageIndex
                            }
                    })
                }else{
                    this.setState({
                        data:[],
                        page:{...this.state.page,totalElements:0,current:1,totalPage:0}
                    })
                }
            }else{
                message.error(res.message)
            }
        })
    }

    // select data
    changeData = (e) =>{
        let type = e.target.value
         this.getAjax(type,20,1)
         this.setState({type})
    }

  
  /**
   * 输入框回车回调
   */
  handleChangePage = (e) => {
    let totalPage = this.state.page.totalPage,
         val = e.target.value,
        isNum = /^[0-9]+$/.test(val);
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
          
             this.getAjax(this.state.type,20,Number(val));
            }
       }else{
         message.warning('请输入纯数字！');
       }

  }

    //下载
    downLoad = (id) =>{
        Request('api/web/report_center/read_download_pdf', {"pdfName":id,"type":"down"}, (res) => {
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
            dataIndex: 'report_name',
            render: text => <div>{text}</div>,
          }, {
            title: '',
            width: 140,
            align: 'right',
            dataIndex: 'report_pdf_id',
            render: (text) => {
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
        let data = this.state.data,data2=[],state=this.state;
        // antd table的key唯一值
        data.map((val)=>{
            let a = {...val,key:val.uid};
            data2.push(a);
        })

        return <div className="zn-bg" ref={(ref) => { this.tablebox = ref }}>
            <div className="zn-height-head zn-fontsize zn-flex-space-reverse">
                <Radio.Group value={this.state.type} 
                    onChange={this.changeData}
                     buttonStyle="solid">
                    <Radio.Button value="1">日报</Radio.Button>
                    <Radio.Button value="2">周报</Radio.Button>
                    <Radio.Button value="3">月报</Radio.Button>
                </Radio.Group>
            </div>
            <div className="kyl-crc-body">
                <Table
                    loading={this.state.loading}
                    className="zn-report-table"
                    columns={columns}
                    pagination={false}
                    dataSource={data2} />
                    {
                        state.page.totalElements ?<div className="kyl-kt-clear">
                        <span className="kyl-kt-pageInfo">每页20条数据，共{state.page.totalElements}条</span>
                        <Input
                          className="kyl-kt-jumpZdPage"
                          disabled={state.page.totalPage <= 1}
                          onKeyUp={this.handleChangePage} />
                         <Pagination className="kyl-kt-fy"
                             current={Number(state.page.current)}
                             defaultPageSize={20}
                             showQuickJumper 
                             defaultCurrent={1}
                             total={state.page.totalElements} 
                             onChange={this.jumpPage}
                           />
                    </div>:""
                    }

  
            </div>
            
                {/* this.props.isdownload && <div className="zn-all-musk">
                    <Spin size="large" tip="报告生成中请稍后...">
                    </Spin>
                </div> */}
            

        </div>
    }
}