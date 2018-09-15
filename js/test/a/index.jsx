import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux';
import { allReducer } from './redux/allreducer';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import HTMLHead from './components/public/head'
import { Header as Navbar } from './components/public/header'
import { setConfig, request as ajax } from './js/clientRequest';
// import { server_config } from './server/server-conf.js';
import { G as server_config } from './js/global'

import Router from 'next/router'

// if (!!process.browser && window) {
//     //数据服务初始化及相关逻辑 前端请求中间层
//     const dataServices = `${server_config.middlewarePath}:${server_config.nextServicePort}/`;
//     //从sso截取token
//     const search = decodeURI(window.location.search.replace('?', ''));
//     let strs = search.split("&"), orgcode, token;
//     try {
//         orgcode = strs[0].split("=")[1];
//         token = strs[1].split("=")[1];
//     } catch (error) {
//         orgcode = "";
//         token = "";
//     }

//     server_config.token = token;
//     server_config.orgcode = orgcode;
//     console.log('初始化token能否获取？',token)
//     setConfig(dataServices, orgcode, token);
// }

// console.log("container ");


//redux相关
const store = createStore(allReducer, composeWithDevTools(applyMiddleware(thunkMiddleware)));

const Contain = function (props) {
    return props.children;
}

//页面相关配置
const serverTitle = server_config.serverTitle;

export default class Container extends React.Component {
    constructor(props) {
        super(props)
    }

    // componentWillMount(){
    //     if (!!process.browser && window) {
    //         //数据服务初始化及相关逻辑 前端请求中间层
    //         const dataServices = `${server_config.middlewarePath}:${server_config.nextServicePort}/`;
    //         //从sso截取token
    //         const search = decodeURI(window.location.search.replace('?', ''));
    //         let strs = search.split("&"), orgcode, token;
    //         try {
    //             orgcode = strs[0].split("=")[1];
    //             token = strs[1].split("=")[1];
    //         } catch (error) {
    //             orgcode = "";
    //             token = "";
    //         }
        
    //         server_config.token = token
    //         server_config.orgcode = orgcode
    //         setConfig(dataServices, orgcode, token);
    //     }
    // }

    // componentDidMount() {
   
    //     console.log("G",server_config)
    //     ajax("ssoLogin", {
    //         token: server_config.token,
    //         orgCode: 8650011800001
    //     }, res => {
    //         if (res.status === 200) {
    //             console.log('new token:',res);
    //             if (!res.data.result || !res.data.data && !res.data.data.token ) {
    //                 // Router.push("/_error")
    //             } else {
    //                 sessionStorage.setItem("user", JSON.stringify(res.data.data));
    //                 sessionStorage.setItem("token", res.data.data.token);
    //                 server_config.name = res.data.data.name;
    //                 // Router.push('/classRoom')
    //             }
    //         }
    //     })
    // }

    render() {

        return (
            <Contain>
                <HTMLHead title={serverTitle} />
                <Provider store={store}>
                    <div className="JC-page-html">
                        <Navbar />
                        <div className="JC-page-body">
                            <PerfectScrollbar>
                                {this.props.children}
                            </PerfectScrollbar>
                        </div>
                    </div>
                </Provider>
            </Contain>
        )
    }
}
