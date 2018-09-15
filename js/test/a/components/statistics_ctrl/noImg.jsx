import React, { Component } from 'react';
import { Spin } from 'antd';

export class IMG extends Component{
    constructor(props){
      super(props);
      this.state = {
        success: Boolean(this.props.src),
        loading: Boolean(this.props.src)
      }
      this.onImgError = this.onImgError.bind(this);
      this.onImgLoad = this.onImgLoad.bind(this);
    }
  
    componentWillReceiveProps(nextProps){
      if(nextProps.src != this.props.src){
        if(nextProps.src){
          this.setState({
            loading: true,
            success: true //cjy添加
          });
        }else{
          this.setState({
            loading: false,
            success: false
          });
        }
      }
    }
  
    onImgError(){
      this.setState({
        success: false,
        loading: false
      })
    }
  
    onImgLoad(){
      this.setState({
        success: true,
        loading: false
      });
    }
  
    render(){
      var alt = this.props.alt || 'picture', style = {};
      if(this.props.width) style.width = this.props.width;
      if(this.props.height) style.height = this.props.height;
      return <Spin spinning={this.state.loading} wrapperClassName="xt-imgbox">
        {
          // this.state.success ? <img onError={this.onImgError} onLoad={this.onImgLoad} src={this.props.src} style={style}/>
          // : <div className="xt-imgerror" style={style}><SVG type={alt} /></div>
          this.state.success ? <img onError={this.onImgError} onLoad={this.onImgLoad} src={this.props.src} style={{width:"240px",height:"120px"}}/>
          : <div>
          <img width="100" src={require('../../static/noData.png')} style={style}/>
          <div>图片加载失败...</div>
          </div>
        }
        </Spin>
    }
  }
  