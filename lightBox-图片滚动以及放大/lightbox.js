;(function($) {
	var LightBox = function() {
		var self=this;
		
		//创建遮罩和弹出层
		this.popupMusk=$('<div id="G-lightbox-mask">');
		this.popupWin=$('<div id="G-lightbox-popup">');
		
		//保存body
		this.bodyNode=$(document.body);
		
		//渲染剩余的DOM，并且插入到body
		this.renderDOM();
		
		this.picViewArea = this.popupWin.find("div.lightbox-pic-view") ;//图片预览区域
		this.popupPic = this.popupWin.find("img.lightbox-image"); //图片地址
		this.picCaptionArea = this.popupWin.find("div.lightbox-pic-caption"); //图片描述区域
		this.nextBtn= this.popupWin.find("span.lightbox-next-btn"); 
		this.prevBtn= this.popupWin.find("span.lightbox-prev-btn");
		this.captionText= this.popupWin.find("p.lightbox-pic-desc"); //图片描述
		this.currentIndex= this.popupWin.find("span.lightbox-of-index"); //图片当前索引
		this.closeBtn=this.popupWin.find("span.lightbox-close-btn"); //关闭按钮
		
		 //启用事件委托，获取组数据
		this.groupName=null;
		this.groupData=[]; //放置同一组数据
		this.bodyNode.delegate(".js-lightbox","click",function(e){
			//阻止事件冒泡
			e.stopPropagation();
			var currentGroupName=$(this).attr('data-group');
			if(currentGroupName!=self.groupName){
				self.groupName=currentGroupName;
				//根据当前组名获取同一组数据
				self.getGroup();
			};
			
			//初始化弹出
			self.initPopup($(this));
			
		})
		//关闭弹出
		this.popupMusk.click(function(){
			$(this).fadeOut();
			self.popupWin.fadeOut();
			self.clear=false;
		})
		this.closeBtn.click(function(){
			self.popupMusk.fadeOut();
			self.popupWin.fadeOut();
			self.clear=false;
		})
		//绑定上下切换按钮事件
		this.flag=true;
		 this.nextBtn.hover(function(){
		 	if(!$(this).hasClass("disabled")&&self.groupData.length>1){
		 		$(this).addClass("next-icon");
		 	}
		 },function(){
		 	if(!$(this).hasClass("disabled")&&self.groupData.length>1){
		 		$(this).removeClass("next-icon");
		 	}
		 }).click(function(e){
		 	if(!$(this).hasClass("disabled")&&self.flag){
		 		self.flag=false;
		 		e.stopPropagation();
		 		self.goto("next");
		 	}
		 });
		 
		 this.prevBtn.hover(function(){
		 	if(!$(this).hasClass("disabled")&&self.groupData.length>1){
		 		$(this).addClass("prev-icon");
		 	}
		 },function(){
		 	if(!$(this).hasClass("disabled")&&self.groupData.length>1){
		 		$(this).removeClass("prev-icon");
		 	}
		 }).click(function(e){
		 	if(!$(this).hasClass("disabled")&&self.flag){
		 		self.flag=false;
		 		e.stopPropagation();
		 		self.goto("prev");
		 	}
		 });
		 
		 //绑定窗口调整事件
		 var timer=null;
		 this.clear=false;
		 $(window).resize(function(){
		 	if(self.clear){
		 		window.clearTimeout(timer);
		 		timer=window.setTimeout(function(){
		 			self.loadPicSize(self.groupData[self.index].src);
		 		},500)
		 	};
		 }).keyup(function(e){
		 	var keyValue=e.which;
		 	if(self.clear){
		 	if(keyValue===38||keyValue===37){
		 		self.prevBtn.click();
		 	}else if(keyValue===39||keyValue===40){
		 		self.nextBtn.click();
		 	}
		 	}
		 });
	};

	LightBox.prototype = {
		goto:function(dir){
			if(dir==="next"){
				//this.groupData
				//this.index
				this.index++;
				if(this.index>=this.groupData.length-1){
					this.nextBtn.addClass("disabled").removeClass("next-icon");
				}
				
				if(this.index!=0){
					this.prevBtn.removeClass("disabled")
				}
				
				var src=this.groupData[this.index].src;
				this.loadPicSize(src);
			}else if(dir==="prev"){
				this.index--;
				if(this.index<=0){
				this.prevBtn.addClass("disabled").removeClass("prev-icon");
				}
				
				if(this.index!=this.groupData.length-1){
					this.nextBtn.removeClass("disabled")
				}
				var src=this.groupData[this.index].src;
				this.loadPicSize(src);
			}
		},
		loadPicSize:function(sourceSrc){
			var self=this;
			self.popupPic.css({width:"auto",height:"auto"}).hide();
			this.picCaptionArea.hide();
			this.preLoadImg(sourceSrc,function(){
				self.popupPic.attr("src",sourceSrc);
				var picWidth=self.popupPic.width(),
				    picHeight=self.popupPic.height();
				 console.log(picWidth+":"+picHeight)
				self.changePic(picWidth,picHeight); 
			});
		},
		changePic:function(width,height){
			var self=this,
				winWidth=$(window).width(),
				winHeight=$(window).height();
				
			//如果图片的宽高大于浏览器视图的宽高比例，看一下是否溢出	
			var scale=Math.min(winWidth/(width+10),winHeight/(height+10),1);
			
			width=width*scale;
			height=height*scale;
				
			this.picViewArea.animate({
				width:width-10,
				height:height-10
			});
			
			this.popupWin.animate({
				width:width,
				height:height,
				marginLeft:-(width)/2,
				top:(winHeight-height)/2
			},function(){
				self.popupPic.css({
					width:width-10,
					height:height-10
				}).fadeIn();
				self.picCaptionArea.fadeIn();
				self.flag=true;
				self.clear=true;
			});
			
			//设置描述文字和当前索引
			this.captionText.text(this.groupData[this.index].caption);
			this.currentIndex.text("当前索引为"+(this.index+1)+" of "+this.groupData.length);
			
		},
		preLoadImg:function(src,callback){
			var img=new Image();
			if(!!window.ActiveXObject){
				img.onreadystatechange=function(){
					if(this.readyState=="complete"){
							callback();
					};
				};
			}else{
				img.onload=function(){
					callback();
				}
			}
			img.src=src;
		},
		showMuskAndPopup:function(sourceSrc,currentId){
			var self=this;
			this.popupPic.hide();
			this.picCaptionArea.hide();
			this.popupMusk.fadeIn();
			//设置可视区的宽高
			var winWidth=$(window).width(),
			    winHeight=$(window).height();
			this.picViewArea.css({
				width:winWidth/2,
				height:winHeight/2
			});
			
			this.popupWin.fadeIn();
			var viewHeight=winHeight/2+10;
			this.popupWin.css({
				width:winWidth/2+10,
				height:winHeight/2+10,
				marginLeft:-(winWidth/2+10)/2,
				top:-viewHeight
			}).animate({
				top:(winHeight-viewHeight)/2
			},function(){
				//加载图片
				self.loadPicSize(sourceSrc);
			});
			//根据当前点击的元素的id获取在当前组别里面的
			this.index=this.getIndexOf(currentId);
			var groupDatalength=this.groupData.length;
			if(groupDatalength>1){
				if(this.index===0){
					this.prevBtn.addClass('disabled');
					this.nextBtn.removeClass('disabled');
				}else if(this.index===groupDatalength-1){
					this.prevBtn.removeClass('disabled');
					this.nextBtn.addClass('disabled');
				}else{
					this.prevBtn.removeClass('disabled');
					this.nextBtn.removeClass('disabled');
				}
			}
		},
		getIndexOf:function(currentId){
			var index=0;
			$(this.groupData).each(function(i){
				index=i;
				if(this.id===currentId){
					return false;//跳出整个循环
				}
			})
			
			return index;
		},
		initPopup:function(currentObj){
			var self     =this,
			    sourceSrc=currentObj.attr("data-source"),
			    currentId=currentObj.attr("data-id");
			    //展示遮罩层并且弹出
			    this.showMuskAndPopup(sourceSrc,currentId);
		},
		getGroup:function(){
			var self=this;
			//根据当前组别的名称获取页面中所有的相同组别的对象
			var groupList=this.bodyNode.find("*[data-group="+this.groupName+"]");
			//清空数组中的数据
			self.groupData.length=0;
			groupList.each(function(){
				self.groupData.push({
					src:$(this).attr("data-source"),
					id:$(this).attr("data-id"),
					caption:$(this).attr("data-caption")
				})
			})
			
		},
		renderDOM:function(){
			var strDom='<div class="lightbox-pic-view">'+
					'<span class="lightbox-btn lightbox-prev-btn"></span>'+
					'<img class="lightbox-image" src="images/2-2.jpg"/>'+	
					'<span class="lightbox-btn lightbox-next-btn"></span>'+
				'</div>'+
				'<div class="lightbox-pic-caption">'+
					'<div class="lightbox-caption-area">'+
					'<p class="lightbox-pic-desc"></p>'+	
					'<span class="lightbox-of-index">当前索引：0 of 0</span>'+
					'</div>'+
					'<span class="lightbox-close-btn"></span>'+
				'</div>';
				
		     //插入到popwin
		     this.popupWin.html(strDom);
		     this.bodyNode.append(this.popupMusk,this.popupWin);
		}
	};

	window['LightBox'] = LightBox;
})(jQuery);