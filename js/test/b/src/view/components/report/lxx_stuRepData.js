/*
 * @Author: lxx 
 * @Date: 2018-09-03 13:58:47 
 * @Last Modified by: lxx
 * @Last Modified time: 2018-09-13 11:35:26
 * 学生出勤报表-原始数据组件
 */
import React, { Component } from 'react';
import { Select, Table, Pagination, DatePicker, Input, message } from 'antd';
import { connect } from 'react-redux';
import { _x } from './../../../js/index';
import { SVG } from './../../common';
import G from './../../../js/g';
import { updateDataParams, getDataList, changeLoadingStatus } from './../../../redux/lxx.student.reducer';
import moment from 'moment';

const selStyle = {
    width: 200,
    marginRight: 10
}
const spanStyle = {
    marginLeft: 5,
    color: '#3498DB',
    fontWeight: 'bold',
    fontSize: 16,
}
const inBlock = {
    display: 'inline-block'
}
const noBlock = {
    display: 'none'
}
const Request = _x.util.request.request;
const Option = Select.Option;
const dateFormat = 'YYYY/MM/DD';
const Format = _x.util.date.format;
const RequestList = _x.util.request.requestMultiple;

@connect(
    state => state,
    { updateDataParams, getDataList, changeLoadingStatus }
)
class StuRepData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colList: [],
            classroomList: [],
            openTrgList: [],
            typeList: [],
            teacherList: [],
            classList: [],
            colIndex: '0',
            claIndex: '0',
            openIndex: '0',
            typeIndex: '0',
            teaIndex: '0',
            classIndex: '0',
            startTime: Format(new Date(), 'yyyy/MM/dd'),
            endTime: Format(new Date(), 'yyyy/MM/dd'),
            courPage: 1,
            inputValue: '',
            params: {
                "startTime": '', //开始时间
                "endTime": '', //结束时间
                "trgName": "", //学院名称
                "classId": "all", //教师id
                "orgId": "all", //机构名称 如果为所有传 "all "
                "type": "all", // 如果为所有传 "all "
                "teacherId": "all", //教教师id 如果为所有传 "all "
                "courseId": "all", //课程id 如果为所有传 " all"
                "pageSize": 1, //每页显示多少条
                "pageIndex": 1, //当前页
            },
            indexNum: 0
        }
    }
    componentDidMount() {
        let colList;
        console.log(G.isVer);
        if (G.isVer === '1') {
            colList = G.trgList ? G.trgList : []
        } else {
            colList = G.grdList ? G.grdList : []
        }
        let openTrgList = G.openTrgList ? G.openTrgList : [],
            typeList = G.typeList ? G.typeList : [];
        this.setState({
            colList,
            openTrgList,
            typeList
        });
        this.getClassroomData(colList[0].trgName);
        this.getTeacherData(openTrgList[0].orgId, typeList[0].id);
        let params = this.props.studentReducer.dataParam;
        params.startTime = new Date(this.state.startTime).setHours(0, 0, 0, 0);
        params.endTime = new Date(this.state.endTime).setHours(23, 59, 59, 59);
        params.trgName = colList[0].trgName;
        // 更新入参
        this.props.updateDataParams(params);
    }

    /**
     * 获取学院对应的班级数据
     */
    getClassroomData(trgName) {
        let param = {
            trgName: trgName
        }
        Request('api/web/common/get_class_trgId', param, (res) => {
            let data = res.data;
            if (res.result && data) {
                this.setState({
                    classroomList: data,
                    claIndex: '0'
                })
            } else {
                data = [{ classId: "all", className: "全部班级" }];
                this.setState({
                    classroomList: data,
                    claIndex: '0'
                })
            }
            let params = this.props.studentReducer.dataParam;
            params.classId = data[0].classId;
            params.pageIndex = 1;
            this.setState({
                courPage: 1,
            })
            // 更新入参
            this.props.updateDataParams(params);
            if (this.state.indexNum) {
                // 获取报表数据
                this.props.getDataList(params);
            }
            this.setState({
                indexNum: 1
            })
        }, () => {
            let data = [{ classId: "all", className: "全部班级" }];
            this.setState({
                classroomList: data,
                claIndex: '0'
            })
            message.warning('获取数据失败');
        })
    }

    /**
     * 获取授课老师数据
     */
    getTeacherData(orgId, courseType) {
        let param = {
            orgId: orgId,
            courseType: courseType
        }
        Request('api/web/public/get_all_teacher', param, (res) => {
            let data = res.data;
            if (res.result && data) {
                this.setState({
                    teacherList: data,
                    teaIndex: '0'
                })
                this.getClassData(orgId, courseType, data[0].id);
            } else {
                data = [{
                    courseName: null,
                    id: "all",
                    name: null,
                    teacherName: "全部授课老师"
                }]
                this.setState({
                    teacherList: data,
                    teaIndex: '0'
                })
                this.getClassData(orgId, courseType, 'all');
            }
        }, () => {
            let data = [{
                courseName: null,
                id: "all",
                name: null,
                teacherName: "全部授课老师"
            }]
            this.setState({
                teacherList: data,
                teaIndex: '0'
            })
            message.warning('获取数据失败');
        })
    }

    /**
     * 获取课程数据
     */
    getClassData(orgId, courseType, teacherId) {
        let param = {
            orgId: orgId,
            courseType: courseType,
            teacherId: teacherId
        }
        Request('api/web/public/get_all_course', param, (res) => {
            let data = res.data;
            if (res.result && data) {
                this.setState({
                    classList: data,
                    classIndex: '0',
                })
            } else {
                let data = [{
                    courseName: "全部课程",
                    id: "all",
                    name: null,
                    teacherName: null,
                }];
                this.setState({
                    classList: data,
                    classIndex: '0',
                })
            }
            let params = this.props.studentReducer.dataParam;
            params.orgId = orgId;
            params.teacherId = teacherId;
            params.type = courseType;
            params.courseId = data[0].id;
            params.pageIndex = 1;
            this.setState({
                courPage: 1,
            })
            // 更新入参
            this.props.updateDataParams(params);
            // 获取报表数据
            this.props.getDataList(params);
        }, () => {
            let data = [{
                courseName: "全部课程",
                id: "all",
                name: null,
                teacherName: null,
            }];
            this.setState({
                classList: data,
                classIndex: '0',
            })
            message.warning('获取数据失败');
        })
    }


    /**
     * 筛选机构
     */
    onChangeCol = (ind) => {
        let colList = this.state.colList;
        this.setState({
            colIndex: ind
        });
        let params = this.props.studentReducer.dataParam;
        params.trgName = colList[ind].trgName;
        params.pageIndex = 1;
        this.setState({
            courPage: 1,
        })
        // 更新入参
        this.props.updateDataParams(params);
        // 获取学院对应的班级数据
        this.getClassroomData(colList[ind].trgName);
    }

    /**
     * 筛选班级
     */
    onChangeClassroom = (ind) => {
        let classroomList = this.state.classroomList;
        this.setState({
            claIndex: ind
        });
        let params = this.props.studentReducer.dataParam;
        params.classId = classroomList[ind].classId;
        params.pageIndex = 1;
        this.setState({
            courPage: 1,
        })
        // 更新入参
        this.props.updateDataParams(params);
        // 获取报表数据
        this.props.getDataList(params);
    }

    /**
     * 开始时间选择
     */
    onPanelChange = (dateString) => {
        let params = this.props.studentReducer.dataParam;
        let date = new Date(dateString).setHours(0, 0, 0, 0);
        params.startTime = date;
        params.pageIndex = 1;
        this.setState({
            courPage: 1,
        })
        // 更新入参
        this.props.updateDataParams(params);
        // 获取报表数据
        this.props.getDataList(params);
    }

    /**
     * 结束时间选择
     */
    onPanelChange1 = (dateString) => {
        let params = this.props.studentReducer.dataParam;
        let date = new Date(dateString).setHours(23, 59, 59, 59);
        params.endTime = date;
        params.pageIndex = 1;
        this.setState({
            courPage: 1,
        })
        // 更新入参
        this.props.updateDataParams(params);
        // 获取报表数据
        this.props.getDataList(params);
    }

    /**
     * 开课机构
     */
    onChangeOrg = (ind) => {
        let openTrgList = this.state.openTrgList;
        this.setState({
            openIndex: ind
        });
        let params = this.props.studentReducer.dataParam;
        // 获取授课老师数据
        this.getTeacherData(openTrgList[ind].orgId, params.type);
    }

    /**
     * 课程类型选择
     */
    onChangeType = (ind) => {
        let typeList = this.state.typeList;
        this.setState({
            typeIndex: ind
        });
        let params = this.props.studentReducer.dataParam;
        // 获取授课老师数据
        this.getTeacherData(params.orgId, typeList[ind].id);
    }

    /**
     * 授课老师选择
     */
    onChangeTeacher = (ind) => {
        let teacherList = this.state.teacherList;
        this.setState({
            teaIndex: ind
        });
        let params = this.props.studentReducer.dataParam;
        // 获取课程数据
        this.getClassData(params.orgId, params.type, teacherList[ind].id);
    }

    /**
     * 全部课程选择
     */
    onChangeClass = (ind) => {
        let classList = this.state.classList;
        this.setState({
            classIndex: ind
        });
        let params = this.props.studentReducer.dataParam;
        params.courseId = classList[ind].id;
        params.pageIndex = 1;
        // 更新入参
        this.props.updateDataParams(params);
        // 获取报表数据
        this.props.getDataList(params);
    }

    /**
     * 切换页码
     * @param {* 当前页码} p 
     */
    handlePageChange = (p) => {
        let params = this.props.studentReducer.dataParam;
        this.setState({
            courPage: p
        })
        params.pageIndex = p;
        // 更新入参
        this.props.updateDataParams(params);
        // 获取报表数据
        this.props.getDataList(params);
    }

    /**
     * 输入框值
     */
    changeInput = (e) => {
        let val = e.target.value,
            isNum = /^[0-9]+$/.test(val);
        if (isNum) {
            this.setState({
                inputValue: Number(val)
            });
        } else if(!val) {
            return;
        } else {
            message.warning('请输入纯数字！');
        }

    }

    /**
     * 输入框回车回调
     */
    handleChangePage = () => {
        let p = this.state.inputValue,
            isMax = p > Math.ceil(this.props.studentReducer.dataTotal / 20);
        let params = this.props.studentReducer.dataParam;
        if (isMax) {
            message.warning('输入的页码不能大于当前总页数!');
            this.setState({
                inputValue: ''
            })
        } else {
            this.setState({
                courPage: p,
                inputValue: ''
            })
            params.pageIndex = p;
            // 更新入参
            this.props.updateDataParams(params);
            // 获取报表数据
            this.props.getDataList(params);
        }
    }

    /**
     * 报表导出
     */
    downloadFile = () => {
        Request('api/web/stu_report/export_original_report', this.props.studentReducer.dataParam, (res) => {
            if (res.result && res.data) {
                let downUrl = G.dataServices + res.data;
                window.open(downUrl);
                message.warning(res.message);
            } else {
                message.warning(res.message);
            }
        })
    }

    render() {
        const columns = [{
            title: `${G.isVer === '1' ? '学院' : '年级'}`,
            dataIndex: 'gradeName',
            width: 100,
        }, {
            title: '班级',
            dataIndex: 'className',
            width: 100,
        }, {
            title: '授课老师',
            dataIndex: 'teacherName',
            width: 100,
        }, {
            title: '科目',
            dataIndex: 'courseName',
            width: 100,
        }, {
            title: '应到人数',
            dataIndex: 'totalNum',
            width: 100,
        }, {
            title: '实到人数',
            dataIndex: 'actualNum',
            width: 100,
        }, {
            title: '发生时间',
            dataIndex: 'occurTime',
            width: 140,
        }, {
            title: '出勤率',
            dataIndex: 'attendence',
            width: 100,
        }];
        let state = this.state,
            data = this.props.studentReducer.dataList,
            total = this.props.studentReducer.dataTotal;

        return (
            <div className="lxx-g-report">
                <div className="lxx-g-flex lxx-g-re-header">
                    <div className="lxx-hd-g-lf lxx-m-flex">
                        <div id="lxx-select" style={{ marginBottom: 10 }}>
                            <span>机构：</span>
                            {/* 学院 */}
                            <Select
                                value={state.colIndex}
                                showSearch
                                style={selStyle}
                                onChange={this.onChangeCol}
                                getPopupContainer={() => document.getElementById('lxx-select')}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                {
                                    state.colList.map((item, index) => {
                                        return <Option key={index} value={index.toString()} title={item.trgName}>{item.trgName}</Option>
                                    })
                                }
                            </Select>
                            {/* 班级 */}
                            <Select
                                value={state.claIndex}
                                showSearch
                                style={selStyle}
                                onChange={this.onChangeClassroom}
                                getPopupContainer={() => document.getElementById('lxx-select')}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                {
                                    state.classroomList.map((item, index) => {
                                        return <Option key={index} value={index.toString()} title={item.className}>{item.className}</Option>
                                    })
                                }
                            </Select>
                            <span>时间：</span>
                            <DatePicker
                                allowClear={false}
                                placeholder="开始时间"
                                defaultValue={moment(state.startTime, dateFormat)}
                                format={dateFormat}
                                className="kyl-crc-selectSj"
                                style={{ width: "140px" }}
                                onChange={this.onPanelChange} />
                            <span>&nbsp;--&nbsp;</span>
                            <DatePicker
                                allowClear={false}
                                placeholder="结束时间"
                                defaultValue={moment(state.endTime, dateFormat)}
                                format={dateFormat}
                                className="kyl-crc-selectSj"
                                style={{ width: "140px" }}
                                onChange={this.onPanelChange1} />
                        </div>
                        <div id="lxx-second">
                            <span>课程：</span>
                            {/* 开课机构 */}
                            {
                                G.isVer === '1'
                                    ? <Select
                                        value={state.openIndex}
                                        showSearch
                                        style={selStyle}
                                        onChange={this.onChangeOrg}
                                        getPopupContainer={() => document.getElementById('lxx-second')}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                        {
                                            state.openTrgList.map((item, index) => {
                                                return <Option key={index} value={index.toString()} title={item.orgName}>{item.orgName}</Option>
                                            })
                                        }
                                    </Select>
                                    : ''
                            }
                            {/* 课程类型 */}
                            {
                                G.isVer === '1'
                                    ? <Select
                                        style={G.isVer === '1' ? inBlock : noBlock}
                                        value={state.typeIndex}
                                        showSearch
                                        style={selStyle}
                                        onChange={this.onChangeType}
                                        getPopupContainer={() => document.getElementById('lxx-second')}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                        {
                                            state.typeList.map((item, index) => {
                                                return <Option key={index} value={index.toString()} title={item.name}>{item.name}</Option>
                                            })
                                        }
                                    </Select>
                                    : ''
                            }

                            {/* 授课老师 */}
                            <Select
                                value={state.teaIndex}
                                showSearch
                                style={selStyle}
                                onChange={this.onChangeTeacher}
                                getPopupContainer={() => document.getElementById('lxx-second')}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                {
                                    state.teacherList.map((item, index) => {
                                        return <Option key={index} value={index.toString()} title={item.teacherName}>{item.teacherName}</Option>
                                    })
                                }
                            </Select>
                            {/* 全部课程 */}
                            <Select
                                value={state.classIndex}
                                showSearch
                                style={selStyle}
                                onChange={this.onChangeClass}
                                getPopupContainer={() => document.getElementById('lxx-second')}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                {
                                    state.classList.map((item, index) => {
                                        return <Option key={index} value={index.toString()} title={item.courseName}>{item.courseName}</Option>
                                    })
                                }
                            </Select>
                        </div>
                    </div>
                    <div onClick={this.downloadFile} style={{ cursor: 'pointer' }}>
                        <SVG type="dcbb" color="#3498DB" width={20} height={19} />
                        <span style={spanStyle}>导出报表</span>
                    </div>
                </div>
                <div className="lxx-hd-g-rg">
                    <Table
                        className="zn-report-table"
                        columns={columns}
                        pagination={false}
                        loading={this.props.studentReducer.loading}
                        rowKey="id"
                        dataSource={data} />
                    {
                        !total
                            ? ''
                            : <div className="kyl-kt-clear">
                                <span className="kyl-kt-pageInfo">每页 20 条数据，共 {total} 条</span>
                                <Input
                                    className="kyl-kt-jumpZdPage"
                                    disabled={!total ? true : false}
                                    value={state.inputValue}
                                    disabled={!total|| total < 20 ? true : false}
                                    onChange={this.changeInput}
                                    onPressEnter={this.handleChangePage} />
                                <Pagination
                                    className="kyl-kt-fy"
                                    pageSize={20}
                                    defaultCurrent={1}
                                    current={state.courPage}
                                    total={total}
                                    onChange={this.handlePageChange} />
                            </div>
                    }
                </div>
            </div>
        )
    }
}

export default StuRepData;
