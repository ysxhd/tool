import React from 'react';
import '../../../css/znReport.css'
import { Button, DatePicker, Input, Modal, Form, Checkbox ,Row , Col ,message ,Spin} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import _x from '../../../js/_x/index';
import { connect } from 'react-redux';
import { zn_change_prop , showAddModal1 ,addReportMsg ,
    znCheck_report ,addChangeValue2 ,changeInside ,
    zn_change_input ,changeLoadCustomer ,zn_change_jsProp,
    initCustomeTable,zn_add_ajax
} from '../../../redux/zn.systemreducer'

const Format = _x.util.date.format;
const Search = Input.Search;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

@connect(
    state => state.znSystemReducer,
    { 
      addChangeValue2, //新增报告inout value
      changeInside, //新增包公案修改时间
      zn_change_prop, //改变表格所需的所有属性
      showAddModal1,// 新增报告modalshow
      addReportMsg, //新增click
      znCheck_report, //选中的check新增报告
      zn_change_input, //修改input
      changeLoadCustomer, //table loading
      zn_change_jsProp, //修改初始化参数
      initCustomeTable, //table ajax
      zn_add_ajax,// add ajax
    }
)
export default class ZnReportHead extends React.Component {

    constructor(){
        super();
        this.state = {
            startTime: moment(new Date(), 'YYYY/MM/DD'),
            endTime: moment(new Date(), 'YYYY/MM/DD'),
            startTimeAdd: Format(new Date(), 'yyyy/MM/dd'),
            endTimeAdd: Format(new Date(), 'yyyy/MM/dd'),
        }
    }

    componentDidMount() {
        //初始化日期插件
        let params = this.props.colParam;
        //是否展示
      // JSON.parse(sessionStorage.isShowdetail)
        params.startDate = new Date().setHours(0, 0, 0, 0);
        params.endDate = new Date().setHours(23, 59, 59, 59);
        let selDate1 = new Date().setHours(0, 0, 0, 0);
        let selDate2 = new Date().setHours(23, 59, 59, 59);
            this.props.changeInside(selDate1,0)
            this.props.changeInside(selDate2,1)
        //初始化
        this.props.zn_change_prop(params);
    }


    //外部开始时间
    onChangeStart = (date) => {
        let selDate1 = new Date(date).setHours(0, 0, 0, 0);
        let source = this.props.colParam;
        source.startDate = selDate1;
       this.setState({
         startTime: moment(new Date(date), 'YYYY/MM/DD')
       })
        console.log(moment(new Date(date), 'YYYY/MM/DD'))
        this.props.zn_change_jsProp(source)
    }


    //外部结束时间
    onChangeEnd = (date) => {
        let selDate2 = new Date(date).setHours(23, 59, 59, 59),prop = this.props;
        let source = prop.colParam;
        source.endDate = selDate2;
        

        let start = Format(new Date(prop.colParam.startDate),'yyyy/MM/dd');
        let end = Format(new Date(date), 'yyyy/MM/dd');
        //开始时间等于结束时间可以请求
        if(start === end){
            this.props.initCustomeTable(source,true);
            return;
        }

       //开始时间不能大于结束时间
       if(source.startDate > selDate2){
           message.warning("开始时间不能大于结束时间!");
           return;
       }

        this.setState({
            endTime: moment(new Date(date), 'YYYY/MM/DD')
          })
          this.props.initCustomeTable(source,true);
    }

    //新增报告多选
    onChangeCheck = (v) => {
        this.props.znCheck_report(v);
    }

        //新增开始时间
    onChangeStartAdd = (date) => {
            let selDate1 = new Date(date).setHours(0, 0, 0, 0);
            this.props.changeInside(selDate1,0)
    }
    
    
        //新增结束时间
    onChangeEndAdd = (date) => {
            let selDate2 = new Date(date).setHours(23, 59, 59, 59);
            this.props.changeInside(selDate2,1)
    }
     
    //input 内容改变
    changeInputOutside = (e) =>{
        let params = this.props.colParam
         params = {...params,seacherContent:e.target.value};
         this.props.zn_change_input(params);
    }

    //报告名字搜索
    report_search = (e) =>{
        let params = this.props.colParam
        this.props.initCustomeTable(params,true);
    }

    //新增报告
    add(json){
        let prop = this.props;
        prop.addReportMsg(prop.addInputValue,prop.addStartTime,prop.addEndTime,json);
        
        this.setState({
            startTime: moment(new Date(), 'YYYY/MM/DD'),
            endTime: moment(new Date(), 'YYYY/MM/DD')
        })
    }
  
    //
    disabledDate = (current) => {
        // Can not select days before today and today
        return current && current > moment().endOf('day');
   }



    render() {
        const formItemLayout = {
            labelCol: {
                md: { span: 4 },
            },
            wrapperCol: {
                md: { span: 20 },
            },
        };
        const dateFormat = 'YYYY-MM-DD';
        let prop = this.props,state = this.state,params = this.props.colParam;
        //取出选中的数组拼接进入对象
        let select = prop.addcheck,json={};
        select.map((val)=>{
            json[val] = 1;
        })
        return <div className="zn-height-head zn-flex zn-spaceBetween">
            <div>
                <span className="zn-fontsize">生成时间 : </span>
                <DatePicker
                    allowClear={false}
                    placeholder="开始时间"
                    value={state.startTime}
                    onChange={this.onChangeStart}
                    disabledDate={this.disabledDate}
                    format={dateFormat}
                     />
                <span className="zn-pdlr10">--</span>
                <DatePicker
                    allowClear={false}
                    onChange={this.onChangeEnd}
                    value={state.endTime}
                    placeholder="结束时间" 
                    disabledDate={this.disabledDate}
                    format={dateFormat}
                    />
                <Search
                    maxLength={"15"}
                    placeholder="请输入报告名"
                    value={params.seacherContent}
                    onChange={this.changeInputOutside}
                    onSearch={this.report_search}
                    style={{ width: 220 }}
                />
            </div>
            <div className="zn-head-btn">
                <Button onClick={() => { prop.showAddModal1(true) }}>新增报告</Button>
            </div>
            <Modal
                maskClosable={false}
                width={590}
                className="zn-modal-add"
                title="新增报告"
                centered
                visible={prop.addShow}
                footer={null}
                onCancel={() => { prop.showAddModal1(false) }}
            >
               <Spin spinning={prop.btnStatus}>
                <Form>
                    <FormItem {...formItemLayout} label="请输入报告名">
                        <div className="zn-from-pdl10">
                            <Input maxLength={"15"} value={prop.addInputValue} onChange={(e)=>{prop.addChangeValue2(e.target.value)}} className="zn-input-wid196" />
                        </div>
                    </FormItem>
                    <FormItem {...formItemLayout} label="请选择时间段">
                        <div className="zn-from-pdl10">
                            <DatePicker
                                allowClear={false}
                                defaultValue={moment(state.startTimeAdd, dateFormat)}
                                onChange={this.onChangeStartAdd}
                                disabledDate={this.disabledDate}
                                placeholder="开始时间" />
                            <span className="zn-pdlr10">--</span>
                            <DatePicker
                                allowClear={false}
                                defaultValue={moment(state.endTimeAdd, dateFormat)}
                                onChange={this.onChangeEndAdd}
                                disabledDate={this.disabledDate}
                                placeholder="结束时间" />
                        </div>
                    </FormItem>
                    <FormItem {...formItemLayout} label="报告包含内容">
                        <div className="zn-from-pdl10">
                            {/* <CheckboxGroup value={prop.checkedList} options={prop.options} onChange={this.onChangeCheck} /> */}
                        

                   <Checkbox.Group  onChange={this.onChangeCheck} value={prop.addcheck}>
                      <Row>
                    {
                        prop.options.map((val) => { 
                        return <Checkbox key={val.value} value={val.value}>{val.label}</Checkbox>
                          })
                   }

                  </Row>
                     </Checkbox.Group>
                      </div>
                    </FormItem>
                    <FormItem>
                        <Row>
                            <Col md={{ span: 4 }}>
                            </Col>
                            <Col md={{ span: 20 }}>
                                <div className="zn-addmod-btn">
                                    <Button 
                                    onClick={
                                        this.add.bind(this,json )
                                        
                                    } disabled={prop.btnStatus}>
                                        新增
                                    </Button>
                                    <Button onClick={()=>{prop.showAddModal1(false)}}>
                                        取消
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </FormItem>
                </Form>
                </Spin>
            </Modal>
        </div>
    }
}