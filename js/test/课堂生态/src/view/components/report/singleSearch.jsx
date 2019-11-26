import React from 'react';
import { SVG } from '../../common'

export const Single = () => {
    return <div className="zn-report-sear">
              <div>
            <SVG type="down" />
            <span>下载报告</span>
          </div>
          <div>
            <SVG type="find" />
            <span>查看报告</span>
          </div>

  </div>
}
