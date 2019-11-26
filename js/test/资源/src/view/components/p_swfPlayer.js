/*
 * @Author: lxx 
 * @Date: 2018-08-07 19:09:36 
 * @Last Modified by: lxx
 * @Last Modified time: 2018-08-08 10:37:41
 * pdf播放
 */
import React, { Component } from 'react';
import { Container } from './../common';

const style = {
    height: '100%',
    width: '100%'
}

export default class SwfPlayer extends Component {
    render() {
        let props = this.props;
        return (
            <Container>
                <object style={style} data={props.resUrl} type='application/x-shockwave-flash' >
                    <param name="foo" value="bar" />
                </object>
            </Container>
        )
    }
}