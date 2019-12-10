/**
 * @author mrdoob / http://mrdoob.com/
 */

var Stats = function () {

	var startTime = Date.now(), prevTime = startTime;
	var ms = 0, msMin = Infinity, msMax = 0;
	var fps = 0, fpsMin = Infinity, fpsMax = 0;
	var frames = 0, mode = 0;

	var container = document.createElement( 'div' );
	container.id = 'stats';
	container.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); setMode( ++ mode % 2 ) }, false );
	container.style.cssText = 'width:80px;opacity:0.9;cursor:pointer';

	var fpsDiv = document.createElement( 'div' );
	fpsDiv.id = 'fps';
	fpsDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#002';
	container.appendChild( fpsDiv );

	var fpsText = document.createElement( 'div' );
	fpsText.id = 'fpsText';
	fpsText.style.cssText = 'color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
	fpsText.innerHTML = 'FPS';
	fpsDiv.appendChild( fpsText );

	var fpsGraph = document.createElement( 'div' );
	fpsGraph.id = 'fpsGraph';
	fpsGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0ff';
	fpsDiv.appendChild( fpsGraph );

	while ( fpsGraph.children.length < 74 ) {

		var bar = document.createElement( 'span' );
		bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#113';
		fpsGraph.appendChild( bar );

	}

	var msDiv = document.createElement( 'div' );
	msDiv.id = 'ms';
	msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#020;display:none';
	container.appendChild( msDiv );

	var msText = document.createElement( 'div' );
	msText.id = 'msText';
	msText.style.cssText = 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
	msText.innerHTML = 'MS';
	msDiv.appendChild( msText );

	var msGraph = document.createElement( 'div' );
	msGraph.id = 'msGraph';
	msGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0f0';
	msDiv.appendChild( msGraph );

	while ( msGraph.children.length < 74 ) {

		var bar = document.createElement( 'span' );
		bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#131';
		msGraph.appendChild( bar );

	}

	var setMode = function ( value ) {

		mode = value;

		switch ( mode ) {

			case 0:
				fpsDiv.style.display = 'block';
				msDiv.style.display = 'none';
				break;
			case 1:
				fpsDiv.style.display = 'none';
				msDiv.style.display = 'block';
				break;
		}

	}

	var updateGraph = function ( dom, value ) {

		var child = dom.appendChild( dom.firstChild );
		child.style.height = value + 'px';

	}

	return {

		REVISION: 11,

		domElement: container,

		setMode: setMode,

		begin: function () {

			startTime = Date.now();

		},

		end: function () {

			var time = Date.now();

			ms = time - startTime;
			msMin = Math.min( msMin, ms );
			msMax = Math.max( msMax, ms );

			msText.textContent = ms + ' MS (' + msMin + '-' + msMax + ')';
			updateGraph( msGraph, Math.min( 30, 30 - ( ms / 200 ) * 30 ) );

			frames ++;

			if ( time > prevTime + 1000 ) {

				fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) );
				fpsMin = Math.min( fpsMin, fps );
				fpsMax = Math.max( fpsMax, fps );

				fpsText.textContent = fps + ' FPS (' + fpsMin + '-' + fpsMax + ')';
				updateGraph( fpsGraph, Math.min( 30, 30 - ( fps / 100 ) * 30 ) );

				prevTime = time;
				frames = 0;

			}

			return time;

		},

		update: function () {

			startTime = this.end();

		}

	}

};

let allData =  [
	{
	  "name": "工商主体信息",
	  "label": {
		"color": "#333333"
	  },
	  "itemStyle": {
		"color": "#F8B551"
	  },
	  "children": [
		{
		  "name": "工商主体信息2%",
		  "label": {
			"color": "#333333"
		  },
		  "itemStyle": {
			"fontSize": 12,
			"color": "#F8B551"
		  },
		  "children": [
			{
			  "name": "企业清算信息",
			  "value": 1,
			  "itemStyle": {
				"color": "#F8B551",
				"fontSize": 12
			  },
			  "label": {
				"color": "#F8B551"
			  }
			},
			{
			  "name": "企业上级单位信息",
			  "value": 1,
			  "itemStyle": {
				"color": "#F8B551",
				"fontSize": 12
			  },
			  "label": {
				"color": "#F8B551"
			  }
			},
			{
			  "name": "企业股权冻结",
			  "value": 1,
			  "itemStyle": {
				"color": "#F8B551",
				"fontSize": 12
			  },
			  "label": {
				"color": "#F8B551"
			  }
			},
			{
			  "name": "企业关联企业信息",
			  "value": 1,
			  "itemStyle": {
				"color": "#F8B551",
				"fontSize": 12
			  },
			  "label": {
				"color": "#F8B551"
			  }
			},
			{
			  "name": "企业对外投资",
			  "value": 1,
			  "itemStyle": {
				"color": "#F8B551",
				"fontSize": 12
			  },
			  "label": {
				"color": "#F8B551"
			  }
			},
			{
			  "name": "企业分支机构",
			  "value": 1,
			  "itemStyle": {
				"color": "#F8B551",
				"fontSize": 12
			  },
			  "label": {
				"color": "#F8B551"
			  }
			},
			{
			  "name": "联系方式",
			  "value": 1,
			  "itemStyle": {
				"color": "#F8B551",
				"fontSize": 12
			  },
			  "label": {
				"color": "#F8B551"
			  }
			},
			{
			  "name": "企业动产抵押",
			  "value": 1,
			  "itemStyle": {
				"color": "#F8B551",
				"fontSize": 12
			  },
			  "label": {
				"color": "#F8B551"
			  }
			},
			{
			  "name": "企业变更信息",
			  "value": 1,
			  "itemStyle": {
				"color": "#F8B551",
				"fontSize": 12
			  },
			  "label": {
				"color": "#F8B551"
			  }
			},
			{
			  "name": "企业司法判决信息",
			  "value": 1,
			  "itemStyle": {
				"color": "#F8B551",
				"fontSize": 12
			  },
			  "label": {
				"color": "#F8B551"
			  }
			},
			{
			  "name": "企业知识产权出质信息",
			  "value": 1,
			  "itemStyle": {
				"color": "#F8B551",
				"fontSize": 12
			  },
			  "label": {
				"color": "#F8B551"
			  }
			},
			{
			  "name": "企业备案信息",
			  "value": 1,
			  "itemStyle": {
				"color": "#F8B551",
				"fontSize": 12
			  },
			  "label": {
				"color": "#F8B551"
			  }
			},
			{
			  "name": "别名库",
			  "value": 1,
			  "itemStyle": {
				"color": "#F8B551",
				"fontSize": 12
			  },
			  "label": {
				"color": "#F8B551"
			  }
			},
			{
			  "name": "企业基础信息",
			  "value": 1,
			  "itemStyle": {
				"color": "#F8B551",
				"fontSize": 12
			  },
			  "label": {
				"color": "#F8B551"
			  }
			},
			{
			  "name": "企业变更信息",
			  "value": 1,
			  "itemStyle": {
				"color": "#F8B551",
				"fontSize": 12
			  },
			  "label": {
				"color": "#F8B551"
			  }
			},
			{
			  "name": "企业股权出质",
			  "value": 1,
			  "itemStyle": {
				"color": "#F8B551",
				"fontSize": 12
			  },
			  "label": {
				"color": "#F8B551"
			  }
			},
			{
			  "name": "年报",
			  "value": 1,
			  "itemStyle": {
				"color": "#F8B551",
				"fontSize": 12
			  },
			  "label": {
				"color": "#F8B551"
			  }
			},
			{
			  "name": "法人对外任职",
			  "value": 1,
			  "itemStyle": {
				"color": "#F8B551",
				"fontSize": 12
			  },
			  "label": {
				"color": "#F8B551"
			  }
			},
			{
			  "name": "法人对外投资",
			  "value": 1,
			  "itemStyle": {
				"color": "#F8B551",
				"fontSize": 12
			  },
			  "label": {
				"color": "#F8B551"
			  }
			},
			{
			  "name": "企业股东信息",
			  "value": 1,
			  "itemStyle": {
				"color": "#F8B551",
				"fontSize": 12
			  },
			  "label": {
				"color": "#F8B551"
			  }
			},
			{
			  "name": "企业抽查检查信息",
			  "value": 1,
			  "itemStyle": {
				"color": "#F8B551",
				"fontSize": 12
			  },
			  "label": {
				"color": "#F8B551"
			  }
			}
		  ]
		}
	  ]
	},
	{
	  "name": "公共信用信息",
	  "label": {
		"color": "#333333"
	  },
	  "itemStyle": {
		"color": "#EC6B6B"
	  },
	  "children": [
		{
		  "name": "联合惩戒0%",
		  "label": {
			"color": "#333333"
		  },
		  "itemStyle": {
			"fontSize": 12,
			"color": "#EC6B6B"
		  },
		  "children": [
			{
			  "name": "市场禁入",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "处罚信息",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			}
		  ]
		},
		{
		  "name": "行政处罚1%",
		  "label": {
			"color": "#333333"
		  },
		  "itemStyle": {
			"fontSize": 12,
			"color": "#EC6B6B"
		  },
		  "children": [
			{
			  "name": "行政处罚",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			}
		  ]
		},
		{
		  "name": "黑名单77%",
		  "label": {
			"color": "#333333"
		  },
		  "itemStyle": {
			"fontSize": 12,
			"color": "#EC6B6B"
		  },
		  "children": [
			{
			  "name": "提供虚假材料申请超限运输行政许可证当事人信息汇总表",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "堵塞交通、强行闯卡、暴力抗法、破坏相关设施违法当事人信息汇总表",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "慈善捐助失信问题领域黑名单",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "非法集资名单（法人）",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "非法集资名单（自然人）",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "税务公布名单（自然人）",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "出入境严重失信企业名单",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "海关失信认证企业名单",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "重大税收违法案件当事人名单",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "失信被执行人",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "1年违法超限运输超过3次的货运车辆信息",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "其他严重违法名单（法人）",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "1年内违法超限运输超过3次的货运车辆驾驶人信息",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "严重失信债务人名单",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "1年内违法超限运输超过本单位货运车辆10%的道路运输企业信息",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "拖欠农民工工资黑名单",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "工商吊销企业",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "出入境严重失信企业",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "严重失信PEVC企业名单",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "失信被执行人",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "统计上严重失信企业",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "税务公布名单（法人）",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "2017年第一批严重违法超限超载运输失信当事人名单",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "安全生产黑名单",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			}
		  ]
		},
		{
		  "name": "行政许可0%",
		  "label": {
			"color": "#333333"
		  },
		  "itemStyle": {
			"fontSize": 12,
			"color": "#EC6B6B"
		  },
		  "children": [
			{
			  "name": "行政许可",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			}
		  ]
		},
		{
		  "name": "灰名单0%",
		  "label": {
			"color": "#333333"
		  },
		  "itemStyle": {
			"fontSize": 12,
			"color": "#EC6B6B"
		  },
		  "children": [
			{
			  "name": "慈善捐助失信问题领域灰名单",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "异常经营名录",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			}
		  ]
		},
		{
		  "name": "红名单0%",
		  "label": {
			"color": "#333333"
		  },
		  "itemStyle": {
			"fontSize": 12,
			"color": "#EC6B6B"
		  },
		  "children": [
			{
			  "name": "2018年公路工程建设领域守信典型企业目录公示(施工/设计/监理)",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "海关高级认证企业",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "2018年水运工程建设领域守信典型企业目录（施工/设计/监理）",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			},
			{
			  "name": "A级纳税人名单",
			  "value": 1,
			  "itemStyle": {
				"color": "#EC6B6B",
				"fontSize": 12
			  },
			  "label": {
				"color": "#EC6B6B"
			  }
			}
		  ]
		}
	  ]
	},
	{
	  "name": "其他信用信息",
	  "label": {
		"color": "#333333"
	  },
	  "itemStyle": {
		"color": "#5DCD80"
	  },
	  "children": [
		{
		  "name": "配置0%",
		  "label": {
			"color": "#333333"
		  },
		  "itemStyle": {
			"fontSize": 12,
			"color": "#5DCD80"
		  },
		  "children": [
			{
			  "name": "相关信息表",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			}
		  ]
		},
		{
		  "name": "资质0%",
		  "label": {
			"color": "#333333"
		  },
		  "itemStyle": {
			"fontSize": 12,
			"color": "#5DCD80"
		  },
		  "children": [
			{
			  "name": "网络文化经营许可",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "产品质量认证",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "国家&省级测绘资质认证",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "网络游戏出版许可",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "安全系统销售许可",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "环境标志获证企业数据信息",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "通信建设企业资质",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "无公害农产品认证",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "医院等级认证",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "基金管理人信息",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "公路工程资质企业",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "信息系统工程监理资质",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "环保数据-国家重点监控企业",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "GSP认证",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			}
		  ]
		},
		{
		  "name": "产权0%",
		  "label": {
			"color": "#333333"
		  },
		  "itemStyle": {
			"fontSize": 12,
			"color": "#5DCD80"
		  },
		  "children": [
			{
			  "name": "土地供应",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "域名备案",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "土地出质",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "专利",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "计算机软件著作权登记公告",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "土地市场-地块公示",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "作品著作权登记公告",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "土地出让",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "商标",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			}
		  ]
		},
		{
		  "name": "司法0%",
		  "label": {
			"color": "#333333"
		  },
		  "itemStyle": {
			"fontSize": 12,
			"color": "#5DCD80"
		  },
		  "children": [
			{
			  "name": "人民法院公告",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "开庭公告",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "裁判文书",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "被执行人",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			}
		  ]
		},
		{
		  "name": "公示信用信息0%",
		  "label": {
			"color": "#333333"
		  },
		  "itemStyle": {
			"fontSize": 12,
			"color": "#5DCD80"
		  },
		  "children": [
			{
			  "name": "企业欠税",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "住建部违法违规企业名单",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "保险行业",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			}
		  ]
		},
		{
		  "name": "宏观0%",
		  "label": {
			"color": "#333333"
		  },
		  "itemStyle": {
			"fontSize": 12,
			"color": "#5DCD80"
		  },
		  "children": [
			{
			  "name": "世界银行_注册资本",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "世界银行_开办企业",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "世界银行_执行合同",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			}
		  ]
		},
		{
		  "name": "经营风险0%",
		  "label": {
			"color": "#333333"
		  },
		  "itemStyle": {
			"fontSize": 12,
			"color": "#5DCD80"
		  },
		  "children": [
			{
			  "name": "司法拍卖",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "借贷担保",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			}
		  ]
		},
		{
		  "name": "经营0%",
		  "label": {
			"color": "#333333"
		  },
		  "itemStyle": {
			"fontSize": 12,
			"color": "#5DCD80"
		  },
		  "children": [
			{
			  "name": "中标",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "招标",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "招聘",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			}
		  ]
		},
		{
		  "name": "金融专题信息0%",
		  "label": {
			"color": "#333333"
		  },
		  "itemStyle": {
			"fontSize": 12,
			"color": "#5DCD80"
		  },
		  "children": [
			{
			  "name": "网贷之家P2P",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "众筹",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "交易中国P2P",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			},
			{
			  "name": "境外投资",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			}
		  ]
		},
		{
		  "name": "舆情0%",
		  "label": {
			"color": "#333333"
		  },
		  "itemStyle": {
			"fontSize": 12,
			"color": "#5DCD80"
		  },
		  "children": [
			{
			  "name": "舆情",
			  "value": 1,
			  "itemStyle": {
				"color": "#5DCD80",
				"fontSize": 12
			  },
			  "label": {
				"color": "#5DCD80"
			  }
			}
		  ]
		}
	  ]
	}
  ];