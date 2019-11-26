/*
 * @Author: zhangning 
 * @Date: 2018-01-22 12:59:01 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-14 14:52:22
 */
import React, { Component } from 'react';
import { Layout, Row, Col } from 'antd';
import { withRouter } from 'react-router-dom';
import { SVG } from './../../components/base';
import { StuLeft, StuMien, StuRight } from './../../components/student/index';
import './../../css/frameStudent.css';
import _x from '../../js/_x/index';

const { Header, Content } = Layout;
export class FraStudent extends Component {

    
    constructor() {
        super();
        this.state = {
            cntHei: 0,
        }
    }
    componentDidMount() {
        // 组件加载完成后计算内容模块高度
        let getContentHeight = () => {
            let bodyHei = document.body.clientHeight;
            let cntHei = bodyHei ;
            this.setState({
                cls:[],
                cntHei: cntHei,
                classId:"", //存储班级Id
                clsName:"",//班级名称
            })
        }
        getContentHeight();
          //请求所有班级的数据
         this.getAjaxByclsId();

    }

    //根据班级Id请求数据
    getAjaxByclsId() {
        let index = sessionStorage.getItem("clsIndex");
        let userId = sessionStorage.getItem('userId');
        var that = this;
        let req = {
            action: 'api/web/teacher_class_brand_management/get_all_classes',
            data: {
                "userId": userId
            }
        }
        _x.util.request.formRequest(req, function (ret) {
            if(ret.data.length){
                that.setState({
                    cls: ret.data,
                    classId: ret.data[index].classId, //存储第一个班级Id显示
                    clsName: ret.data[index].className
                })
            }

        });
    }

     //切换班级Id
     changeClass = (id, ids, clsN,index) => {
        this.setState({
            classId: "",
            clsName: "",
            index
        },() => {
            this.setState({
                classId: id,
                clsName: clsN,
                index
            })
            sessionStorage.setItem("clsIndex",index);
        });
    }

    render() {
        const rightTop = [
            { type: 1, title: '班级通知', pub: '发布通知' },
            { type: 2, title: '班级活动', pub: '发布活动' },
          ];
        const rightBottom = [
            { type: 3, title: '失物招领', pub: '发布失物招领' },
            { type: 4, title: '寻物启事', pub: '发布寻物启事' },
          ];
        let classCont = this.state.cls,
            len;
        if(classCont){
            //如果大于1个班级，小三角才显示
            if(classCont.length > 1){
                len = true;
            }
        }
      
        return (
            <div>
             
                <Content className="scrollbar" style={{ top:"64px",position:"absolute" }}>
                <Row>
                        <Col className="zn-tea-g-name">
                            <div className="zn-tea-t-wid"><span>{this.state.clsName}</span>
                                 {/* 如果只有一个班级切换班级的箭头消失 */}
                                 {len ? <SVG type="arrow"></SVG> :"" }  
                                <ul className="zn-tea-select-class">
                                    {
                                        len ?
                                            classCont.map((item, index) => {
                                                return <li onClick={this.changeClass.bind(this, item.classId, item.ssId, item.className,index)} key={index}>{item.className}</li>
                                            }) : ""
                                    }
                                </ul>
                            </div>
                        </Col>
                </Row>
                    <Row className="lxx-stu-g-cnt">
                        <div className="lxx-stu-g-left">
                            <StuLeft classId={this.state.classId} />
                        </div>
                        <div className="lxx-stu-g-center">
                            <StuMien classId={this.state.classId}/>
                        </div>
                        <div className="lxx-stu-g-right">
                            <StuRight titleData={rightTop} classId={this.state.classId} />
                            <StuRight titleData={rightBottom} classId={this.state.classId} />
                        </div>
                    </Row>
                </Content>
            </div>
        )
    }
}

export const FrameTeacherToStudent = withRouter(FraStudent);