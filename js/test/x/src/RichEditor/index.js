/**
 *  created by yaojun on 2017/11/4
 *
 */
import React from "react";
import "./wangEditor.css";
import WangEditor from "./wangEditor";

export default class RichEditor extends React.Component {
    editorId="editor-"+Math.random().toString().slice(2);
    
    componentDidMount(){
        let editor = new WangEditor(`#${this.editorId}`);
        let onChange =this.props.onChange;
           
            
            editor.customConfig.onchange=(html)=>{
                onChange && onChange(html);
            }
            editor.customConfig.uploadImgServer="/cjmt/file/uploadFile";
            editor.customConfig.uploadImgParams={
                fileDir:"platform/rich"
            }
    
        /**
         * 限制 200kb
         * @type {number}
         */
        editor.customConfig.uploadImgMaxSize = 200000
            editor.customConfig.uploadImgHooks={
                customInsert:function(insertImg, result, editor){
        
                    if(result.code =='0'){
                        let img=decodeURIComponent(result.data[0].full_url);
                        insertImg(img);
                    }else{
                        alert(result.msg)
                    }
                    
        
                }
            }
           
    
            editor.create();
            editor.txt.html(this.props.value||"");
            this.editor=editor;
    }
    
    componentReceiveProps(props,nextProps){
        if(nextProps.value ===void 0){ // invoke form.resetFields
            this.editor.txt.clear();
        }
    }
    
    // 仅在需要的时候才使用此函数，避免双向绑定带来的各种问题
    setEditorValue(value){
        this.editor.txt.html(value);
    }
    
    render() {
        return (<div id={this.editorId}/>)
    }
}