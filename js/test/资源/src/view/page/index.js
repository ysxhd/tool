/*
 * @Author: junjie.lean 
 * @Date: 2018-07-20 11:22:39 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-07-31 13:54:22
 */

import React from 'react';
import IndexTabBar from './../components/i_TabBar'

import { HeaderNav} from './JC_header'
export default class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props
        }
    }
    render() {
        return (
            <div>
                {/* <IndexTabBar /> */}
                111
                <HeaderNav />
            </div>
        )
    }
}
