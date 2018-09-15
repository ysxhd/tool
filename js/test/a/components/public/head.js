/*
 * @Author: junjie.lean 
 * @Date: 2018-06-21 13:05:06 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-06-25 11:05:33
 */

import React from 'react';
import NextHead from 'next/head';

export default class HTMLHead extends React.Component {

  constructor(props) {
    super(props);
    
  }

  render() {
    return (
      <NextHead>
        <meta charSet="UTF-8" />
        <title>{this.props.title || ''}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/_next/static/style.css" />
        <link rel="shortcut icon" href="/static/favicon.ico" />
      </NextHead>
    )
  }
}
