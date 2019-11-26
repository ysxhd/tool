/*
 * @Author: JudyC 
 * @Date: 2018-01-05 10:31:34 
 * @Last Modified by: JudyC
 * @Last Modified time: 2018-03-28 16:17:48
 * 发布荣誉组件(班级教师学生通用)
 */
import '../../css/admin/pubHonor.css';
import React, { Component } from 'react';
import { SVG} from "../base";
import {ChoiceClass} from './shared/choiceClass';
import {error,success} from './index';
import { Card, Input, Select, Checkbox, Button } from "antd";
import _ from 'lodash';
import _x from '../../js/_x/index';
import '../../css/admin/pubHonor.css';

const Option = Select.Option;
const Search = Input.Search;

export class PubHonor extends Component {
  constructor(){
    super();
    this.state = {
      name:'',          //奖项名字
      honorType:1,      //荣誉类型
      targetIds:[],     //选中荣誉集合
      searchData:[],    //模糊查询数据
      tempTargetIds:[], //临时选中的荣誉
      rltBoxVis:false,  //列表是否显示
      ranking:true,    //是否包含名次
      addressIds:[],      //场所ID,
      // belongType:1,     //所属类型
      academicYear:'',  //学年
      hasChosedNum:0,   //已选择数目
      disabPub:false,   //发布按钮是否禁用
    };
    this.honorType = [{
      type:1,
      name:'奖杯'
    },{
      type:2,
      name:'奖牌'
    },{
      type:3,
      name:'红花'
    },{
      type:4,
      name:'流动红旗'
    }];
    this.uid = '';      //整个荣誉id
    this.honorLength = 0;//荣誉列表长度
    this.maxLength = 50;//最大荣誉列表长度
  }

  componentDidMount(){
    this.setState({
      academicYear:this.props.academicYear
    });
    if(this.props.uid){
      this.uid=this.props.uid;
      this.getData();
    }
  }

  /**
   * 获取荣誉数据
   */
  getData = () => {
    let req = {
      action:'api/web/information/manager_honor/find',
      data:{
        uid:this.uid
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        let targetIds = [];
        let addressIds = [];
        ret.data.details.map(dt=>{
          targetIds.push({
            uid:dt.uid,
            rank:dt.rank,
            name:dt.belongName,
            belongId:dt.belongId,
            status:'A'
          });
          addressIds.push(dt.belongId);
        });

        // let data={
        //   uid:ret.data.uid,
        //   title:ret.data.title,
        //   ranking:ret.data.ranking===1?true:false,
        //   honorType:ret.data.honorType,
        //   academicYear:ret.data.academicYear.replace(/_/g,'-') + '学年',
        //   details
        // };
        this.honorLength = targetIds.length;
        this.setState({
          // belongType:ret.data.belongType,
          name:ret.data.title,
          honorType:ret.data.honorType,
          ranking:ret.data.ranking===1?true:false,
          // academicYear:ret.data.academicYear,
          targetIds,
          addressIds,
          hasChosedNum:addressIds.length
        });
      }
    });
    // let data = {
    //   uid : 111,
    //   title : "2017年第二学期优秀学生",
    //   ranking : true,//(是否排名)
    //   honorType : 1,//（奖杯1，奖牌2）
    //   academicYear : 'id',//（学年）
    //   details : [{
    //     uid : 1,
    //     belongId : 'AA',
    //     rank : 1,
    //     name : '初一一班',
    //   },{
    //     uid : 2,
    //     belongId : 'AB',
    //     rank : 2,
    //     name : '初一二班',
    //   }]
    // };
    // this.uid = data.uid;
    // this.setState({
    //   targetIds:data.details,
    //   honorType:data.honorType,
    //   ranking:data.ranking
    // });
  }

  /**
   * 改变荣誉名称
   */
  changeName = (e) => {
    this.setState({
      name:e.target.value
    });
  };

  /**
   * 改变荣誉类型
   */
  changeType = (value) => {
    if(value===4){
      this.setState({
        honorType:value,
        ranking:false
      });
    }else{
      this.setState({
        honorType:value,
        ranking:true
      });
    }
  };

  /**
   * 显示选择范围
   */
  showChoiceAdr = () => {
    this.setState({
      choiceAdrVis:true
    });
  };

  /**
   * 隐藏选择范围
   */
  hideChoiceAdr = (addressObj,ssIds) => {
    if(addressObj.length){
      // if(this.honorLength + addressObj.length > this.maxLength){
        // error('荣誉数目超过50',1500);
      // }else{
        let addTargetIds = [];
        let newAddressIds = [];
        addressObj.map(ao=>{
          let idx = _.findIndex(this.state.targetIds,{belongId:ao.classId});
          if(idx===-1){
            addTargetIds.push({
              belongId:ao.classId,
              name:ao.addressName,
              rank:'1',
              status:'A'
            });
            newAddressIds.push(ao.classId);
          }
        });
        this.setState({
          targetIds:[...addTargetIds,...this.state.targetIds],
          addressIds:[...newAddressIds,...this.state.addressIds],
          choiceAdrVis:false,
          hasChosedNum:this.state.hasChosedNum + newAddressIds.length
        });
      // }
    }else{
      this.setState({
        choiceAdrVis:false
      });
    }
    


    // if(addressObj.length){
    //   let tempTargetIds = [];
    //   let newAddressIds = [];
    //   addressObj.map(ao=>{
    //     tempTargetIds.push({
    //       belongId:ao.addressId,
    //       name:ao.addressName,
    //       rank:1,
    //       status:'A'
    //     });
    //     newAddressIds.push(ao.addressId);
    //   });
    //   this.setState({
    //     choiceAdrVis:false,
    //     tempTargetIds,
    //     addressIds:[...new Set([...newAddressIds,...this.state.addressIds])]
    //   });
    //   this.sure();
    // }else{
    //   this.setState({
    //     choiceAdrVis:false
    //   });
    // }
  };

  /**
   * 删除荣誉名称列中的项
   */
  del = (belongId) => {
    let newTargetIds = this.state.targetIds;
    let idx = _.findIndex(newTargetIds, {belongId});
    if(newTargetIds[idx].uid){
      newTargetIds[idx].status = 'D';
    }else{
      newTargetIds.splice(idx,1);
    }
    this.honorLength--;
    let hasChosedNum = 0;
    newTargetIds.map(nt=>{
      if(nt.status==='A'){
        hasChosedNum++;
      }
    });
    this.setState({
      targetIds:newTargetIds,
      hasChosedNum
    });
  };

  /**
   * 搜索老师和学生
   */
  searchName = (value) => {
    if(value.trim().length){
      let req = {
        action:this.props.belongType===2?'api/web/information/honor/find_teachers':'api/web/information/honor/find_students',
        data:{
          name:value,
          pageIndex:1,
          pageSize:30
        }
      };
      _x.util.request.formRequest(req,(ret)=>{
        if(ret.result){
          let data = [];
          ret.data.pageContent.map(pc=>{
            data.push({
              uid:pc.uid,
              name:pc.name,
              staffNumber:this.props.belongType===2?pc.staffNumber:pc.className
            });
          });
          this.setState({
            searchData:data,
            rltBoxVis:true,
           
          });
         
        }
      });

      // let data = [];
      // for(let i=0;i<20;i++){
      //   data.push({
      //     uid:i,
      //     name:'学生'+i,
      //     staffNumber:i
      //   })
      // }
      // this.setState({
      //   searchData:data,
      //   rltBoxVis:true
      // });
    }
  };

  /**
   * 选中老师和学生
   */
  selectName = (uid,name) => {
    let idx = _.findIndex(this.state.tempTargetIds,{belongId:uid});
    if(idx === -1){
      let data = {
        belongId:uid,
        name,
        rank:'1',
        status:'A'
      };
      this.setState({
        tempTargetIds:[data,...this.state.tempTargetIds]
      });
    }else{
      let newTempTargetIds = this.state.tempTargetIds;
      let idx = _.findIndex(newTempTargetIds,{belongId:uid});
      newTempTargetIds.splice(idx,1);
      this.setState({
        tempTargetIds:newTempTargetIds
      });
    }
  };

  /**
   * 模糊匹配的确定按钮
   */
  sure = () => {
    // if(this.honorLength + this.state.tempTargetIds.length > this.maxLength){
    //   error('荣誉数目超过50',1500);
    // }else{
      let addTargetIds = [];
      this.state.tempTargetIds.map(tti=>{
        let idx = _.findIndex(this.state.targetIds,{belongId:tti.belongId});
        if(idx===-1){
          addTargetIds.push(tti);
        }
      });
      this.setState({
        targetIds:[...addTargetIds,...this.state.targetIds],
        rltBoxVis:false,
        tempTargetIds:[]
      });
    // }
  };

  /**
   * 模糊匹配的取消按钮
   */
  cancel = () => {
    this.setState({
      rltBoxVis:false,
      tempTargetIds:[]
    });
  };

  /**
   * 是否排名
   */
  changeIncl = () => {
    this.setState({
      ranking:!this.state.ranking
    });
  };

  /**
   * 改变名次
   */
  changeRank = (belongId,e) => {
    let rank = '';
    let n = e.target.value;
    if (!isNaN(n)){
      rank = n;
    }else{
      rank = e.target.value;
    }
    let newTargetIds = this.state.targetIds;
    let idx = _.findIndex(newTargetIds,{belongId});
    newTargetIds[idx].rank = rank;
    this.setState({
      targetIds:newTargetIds
    });
  };

  /**
   * 发布按钮
   */
  pub = () => {
    if(this.state.name.trim()===''){
      error('请填写奖项名称',1500);
    }else if(this.state.addressIds.length===0&&this.props.belongType===1){
      error('请选择班级',1500);
    }else if(this.state.targetIds.length===0&&this.props.belongType===2){
      error('请选择老师',1500);
    }else if(this.state.targetIds.length===0&&this.props.belongType===3){
      error('请选择学生',1500);
    }else{
      if(this.state.ranking){
        let targetIds = this.state.targetIds;
        let canPub = true;
        for(let i=0;i<targetIds.length;i++){
          if(String(targetIds[i].rank).trim()===''){
            error('请填写名次',1500);
            canPub = false;
            break;
          }
        }
        if(canPub){
          if(this.props.pubState===0){
            this.addHonor();
          }else{
            this.pubHonor();
          }
        }
      }else{
        if(this.props.pubState===0){
          this.addHonor();
        }else{
          this.pubHonor();
        }
      }
    }
  };

  /**
   * 添加荣誉
   */
  addHonor = () => {
    this.setState({
      disabPub:true
    });
    let req = {
      action:'api/web/information/manager_honor/add',
      data:{
        title:this.state.name,
        ranking:this.state.ranking?1:0,
        honorType:this.state.honorType,
        belongType:this.props.belongType,
        academicYear:this.state.academicYear,
        details:this.state.targetIds
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        success('发布成功',1500);
        this.props.hideModal();
        this.props.getClaHnData(null,null,null);
      }
      this.setState({
        disabPub:true
      });
    });
  }

  /**
   * 发布荣誉
   */
  pubHonor = () => {
    this.setState({
      disabPub:true
    });
    let req = {
      action:'api/web/information/manager_honor/update',
      data:{
        uid:this.uid,
        title:this.state.name,
        ranking:this.state.ranking?1:0,
        honorType:this.state.honorType,
        belongType:this.props.belongType,
        academicYear:this.state.academicYear,
        details:this.state.targetIds
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        success('修改成功',1500);
        this.props.hideModal();
        this.props.getClaHnData(null,null,null);
      }
      this.setState({
        disabPub:true
      });
    });
  }

  render(){
    const academicYear = this.state.academicYear.replace(/_/g,'-') + '学年';
    return (
      <div>
        <div className="cjy-ph-yearBox">{academicYear}</div>
        <div className="cjy-ph-ctBox">
          <div className="cjy-ph-nameLine">
            <span className="cjy-label">奖项名称：</span>
            <Input onChange={this.changeName} value={this.state.name} maxLength="50"/>
          </div>
          <div className="cjy-ph-titleLen">{this.state.name?this.state.name.length:0}/50</div>
          <div className="cjy-ph-typeLine">
            <span className="cjy-label">荣誉类型：</span>
            <Select value={this.state.honorType} style={{width: 180}} onChange={ this.changeType }>
              {
                this.honorType.map(ht => (
                  <Option key={ht.type} value={ht.type}>{ht.name}</Option>
                ))
              }
            </Select>
            {
              this.state.honorType===4
              ? ''
              : <Checkbox checked={this.state.ranking} onChange={this.changeIncl}>包含名次</Checkbox>
            }
          </div>
          {
            this.props.belongType===1
            ? <div className="cjy-ph-rangeLine">
              <span className="cjy-label">范围：</span>
              <span className="cjy-ph-range" onClick={this.showChoiceAdr}><SVG type="plus"/>选择班级</span>
              <span className="cjy-ph-left10">已选择{this.state.hasChosedNum}个</span>
            </div>
            : <div className="cjy-ph-rangeLine">
              <span className="cjy-label">姓名：</span>
              <Search className="cjy-ph-ipt" placeholder="输入姓名" onSearch={this.searchName} enterButton="搜索"/>
              &nbsp;&nbsp;<span>已选择{this.state.targetIds.length}个</span>
              <div className={`cjy-ph-resultBox ${this.state.rltBoxVis?'cjy-ph-block':'cjy-ph-none'}`}>
                <div className="cjy-ph-nameSdata">
                  {
                    this.state.searchData.length
                    ? this.state.searchData.map((sd)=>{
                      let checked = false;
                      let idx = _.findIndex(this.state.tempTargetIds,{belongId:sd.uid});
                      if(idx !== -1){
                        checked = true;
                      }else{
                        checked = false;
                      }
                      return <div key={sd.uid} className="cjy-ph-nameBox" onClick={()=>this.selectName(sd.uid,sd.name)}>
                        <span className="cjy-ellip cjy-ph-nameNum">{`${sd.name} (${sd.staffNumber})`}</span>
                        <Checkbox checked={checked}/>
                      </div>
                    })
                    : <div className="cjy-ph-noSearch">
                      无匹配结果
                    </div>
                  }
                </div>
                <div className="cjy-ph-btnBox">
                  <Button disabled={this.state.tempTargetIds.length?false:true} onClick={this.sure}>确定</Button>
                  <Button onClick={this.cancel}>取消</Button>
                </div>
              </div>
            </div>
          }
          <div className="cjy-ph-honorBox">
            {
              this.state.targetIds.length
              ? this.state.targetIds.map((hd,index) => {
                if(hd.status==='A'){
                  let svgType = '';
                  if (this.state.honorType===1){
                    if(this.state.ranking){
                      if(hd.rank==='1'){
                        svgType = 'trophy1';
                      }else if(hd.rank==='2'){
                        svgType = 'trophy2';
                      }else if(hd.rank==='3'){
                        svgType = 'trophy3'
                      } else {
                        svgType = 'trophy'
                      }
                    }else {
                      svgType = 'trophy'
                    }
                  }else if(this.state.honorType===2){
                    if(this.state.ranking){
                      if(hd.rank==='1'){
                        svgType = 'medal1';
                      }else if(hd.rank==='2'){
                        svgType = 'medal2';
                      }else if(hd.rank==='3'){
                        svgType = 'medal3'
                      } else {
                        svgType = 'medal4'
                      }
                    } else {
                      svgType = 'medal4'
                    }
                  }else if(this.state.honorType===3){
                    if(this.state.ranking){
                      if(hd.rank==='1'){
                        svgType = 'flower1';
                      }else if(hd.rank==='2'){
                        svgType = 'flower2';
                      }else if(hd.rank==='3'){
                        svgType = 'flower3'
                      }else {
                        svgType = 'flower'
                      }
                    } else {
                      svgType = 'flower'
                    }
                  }else{
                    svgType = 'banner';
                  }
                  return <div className="cjy-ph-rankBox" key={hd.belongId}>
                    <span className="cjy-eliip cjy-ph-rankName">{hd.name}</span>
                    {
                      this.state.ranking
                      ? <Input defaultValue={hd.rank} maxLength="8" value={hd.rank} onChange={(e)=>this.changeRank(hd.belongId,e)}/>
                      : <div className="cjy-ph-blank"></div>
                    }
                    <span className={`cjy-ph-rankType ${(svgType==='banner'||svgType==='flower')?'cjy-ph-red':''}`}><SVG type={svgType}/></span>
                    <span className="cjy-ph-del" onClick={()=>this.del(hd.belongId)}><SVG type="cross"/></span>
                  </div>
                }
              })
              : <div className="cjy-ph-noData">
                暂无相关数据
              </div>
            }
          </div>
          <div className="ant-modal-footer">
            <Button className={`cjy-btn ${this.state.disabPub===true?'zn-disable-btn':'cjy-orange-sure'}`} disabled={this.state.disabPub} onClick={this.pub}>发布</Button>
            <Button className="cjy-btn" onClick={this.props.hideModal}>取消</Button>
          </div>
        </div>
        {
          this.state.choiceAdrVis
          ? <ChoiceClass choiceAdrVis={ this.state.choiceAdrVis } hideChoiceAdr={this.hideChoiceAdr} hideAddre={true}/>
          : ''
        }
        {/* <ChoiceClass choiceAdrVis={ this.state.choiceAdrVis } hideChoiceAdr={this.hideChoiceAdr}/> */}
      </div>
    );
  }
}