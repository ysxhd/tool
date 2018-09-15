/*
 * @Author: junjie.lean 
 * @Date: 2018-06-21 12:26:24 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-06-21 18:27:48
 */

import React from 'react';

export default class InitialData extends React.Component {

    constructor(props) {
        super(props)
        this.state = { ...props }
    }
    componentWillReceiveProps(newProps) {
        // console.log(newProps)
        this.setState({
            ...newProps
        })
    }

    render() {
        return (
            <div className="datatype">
                <style jsx>
                    {
                        `
                        .datatype{
                            padding-left:10px;
                        }
                            .datatype>h3{
                                color:#fff!important;
                            }
                        `
                    }
                </style>
                <h3>{this.state.isServer ? "服务端渲染数据：" : "客户端渲染数据："}&nbsp;{this.state.star || "-"}</h3>
            </div>
        )
    }

}