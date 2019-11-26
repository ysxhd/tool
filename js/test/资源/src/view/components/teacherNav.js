/*
 * @Author: junjie.lean 
 * @Date: 2018-07-20 14:10:13 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-07-23 15:10:49
 */

/**
 * 业务端导航栏+搜索条
 */

import React from 'react';
import { Link } from 'react-router-dom';

export default class Tnav extends React.Component {

    constructor(props) {
        super(props)
        需要判断当前是否打开各种模块
    }

    render() {
        return (
            <div>
                <ul>
                    <li>
                        <Link></Link>
                    </li>
                </ul>
            </div>
        )
    }

}
