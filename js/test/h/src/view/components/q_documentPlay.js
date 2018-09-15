/*
 * @Author: lxx 
 * @Date: 2018-08-06 10:44:22 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-03 18:27:37
 * pdf播放
 */
import React, { Component } from 'react';
import PDFObject from './../../public/pdfobject.min.js';
import { Container } from './../common';

class DocumentPlay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            params: ''
        }
    }

    componentDidMount() {
        this.setState({
            params: this.props
        })
    }

    componentDidUpdate() {
        let props = this.props;
        if (props && props !== this.state.params) {
            this.setState({
                params: props
            })
            let targetEle = document.querySelector(`.lxx-g-pdfBody${props.file}`);
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
                        navpanes: 0
                    },
                    fallbackLink: "此浏览器不支持文档播放器"
                }
                let url = '';
                if (props.resUrl.indexOf(props.resFormat) > -1 && props.resFormat) {
                    // console.log(props.resUrl);
                    PDFObject.embed(props.resUrl, `.lxx-g-pdfBody${props.file}`, config);
                }
            } else {
                targetEle.innerHTML = '当前浏览器不支持在线浏览文档，请升级浏览器版本或跟换其他高级浏览器';
            }
        }
    }

    render() {
        let props = this.props;
        // console.log(props);
        let targetEle = document.querySelector(`.lxx-g-pdfBody${props.file}`);
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
                    navpanes: 0
                },
                fallbackLink: "此浏览器不支持文档播放器"
            }
            let url = '';
            if (props.resUrl.indexOf(props.resFormat) > -1 && props.resFormat) {
                // console.log(props.resUrl);
                PDFObject.embed(props.resUrl, `.lxx-g-pdfBody${props.file}`, config);
            }
        } else {
            targetEle.innerHTML = '当前浏览器不支持在线浏览文档，请升级浏览器版本或跟换其他高级浏览器';
        }
        return (
            <Container>
                <div ref={(ref) => this.pdf = ref} className={'lxx-g-pdfBody' + props.file + ' lxx-g-pdfBody'} style={{ height: '100%' }}>
                    {this.ele
                        ? this.ele
                        : '正在请求资源，请稍候'
                    }
                </div>
            </Container>
        )
    }
}

export default DocumentPlay;
