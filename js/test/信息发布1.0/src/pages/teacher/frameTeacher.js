import React, { Component } from 'react';
import { Layout, Row, Col } from 'antd';
import { SVG } from './../../components/base';
import './../../css/frameTeacher.css';
import { TeaLeft, TeaRight, TeaBot } from './../../components/teacher/index';
import _x from '../../js/_x/index';

const { Content } = Layout;
export class FrameTeacher extends Component {
    constructor(){
        super();
        this.state = {
           cls:[], //存储班级内容
           clsId:"", //存储班级Id
           ids:"",  //显示的设备ID
           clsName:"",//班级名称
           cntHei:"" //内容的整体高度
        }
    }

    componentWillMount(){
        //请求所有班级的数据
    
       this.getAjaxByclsId();

    }

    componentDidMount() {
        // 组件加载完成后计算内容模块高度
        let getContentHeight = () => {
            let bodyHei = document.body.clientHeight;
            let cntHei = bodyHei - 64;
            this.setState({
                cntHei: cntHei
            })
        }
        getContentHeight();
    }


    //根据班级Id请求数据
    getAjaxByclsId(){
        let index = sessionStorage.getItem("clsIndex");
        let userId = sessionStorage.getItem('userId');
        var that = this;
        let req = {
            action: 'api/web/teacher_class_brand_management/get_all_classes',
            data: {
                "userId": userId
            }
          }
          _x.util.request.formRequest(req, function(ret){
              if(ret.data.length){
                that.setState({
                    cls: ret.data,
                    clsId:ret.data[index].classId, //存储第一个班级Id显示
                    ids:ret.data[index].ssId,//存储第一个设备Id显示
                    clsName:ret.data[index].className
                })
              }
          });
          
    }

    //切换班级Id
    changeClass = (id, ids, clsN,index) => {
        this.setState({
            clsId: "",
            ids: "",
            clsName: "",
            index
        },() => {
            this.setState({
                clsId: id,
                ids: ids,
                clsName: clsN,
                index
            })
            sessionStorage.setItem("clsIndex",index);
        });
    }

  render() {
    let classCont = this.state.cls;//头像的存储数据
    return (
            <div id="zn-tea-overflow-y">
                <Content>
                    <Row>
                        <Col className="zn-tea-g-name">
                            <div className="zn-tea-t-wid"><span>{this.state.clsName}</span>
                            {/* 如果只有一个班级切换班级的箭头消失 */}
                                  {classCont.length > 1 ? <SVG type="arrow"></SVG> :"" }  
                                <ul className="zn-tea-select-class">
                                {
                                 classCont.length > 1 ?
                                 classCont.map((item,index) => {
                                     return <li onClick={this.changeClass.bind(this,item.classId,item.ssId,item.className,index)} key={index}>{item.className}</li>
                                 }):""
                                }
                                </ul>
                            </div>
                        </Col>
                    </Row>
                    <Row className="zn-tea-g-up">
                        <div className="zn-tea-g-left">
                            <TeaLeft clsId={this.state.clsId}/>
                        </div>
                        <div className="zn-tea-g-right">
                            <TeaRight machineId={this.state.ids} clsId={this.state.clsId}/>
                        </div>
                    </Row>
                    <Row className="zn-tea-g-down">
                        <div className="zn-tea-g-bot">
                            <TeaBot clsId={this.state.clsId}/>
                        </div>
                    </Row>
                </Content>
            </div>
    );
  }
}