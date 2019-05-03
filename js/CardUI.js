
	
			function CardUI(){};
			//基准点 ：794×1123 px
			CardUI.BASIC_POSINFO_X = 20;
			CardUI.BASIC_POSINFO_Y = 20;
			//填土区域数据
			CardUI.FILL_WIDTH = 20;
			CardUI.FILL_HEIGHT = 12;
			//卡片大小区域 794×1123px (210 * 297mm);
			CardUI.CARD_WIDTH = 794;
//			CardUI.CARD_WIDTH = 529       //794 * 2 / 3==三栏布局
			CardUI.CARD_HEIGHT = 1123;
			//答题区域 
			CardUI.ANSWER_WIDTH = 794 - (20 + 20) * 2// - 100;
			CardUI.ANSWER_HEIGHT = 1123;
			//选择题间距
			CardUI.CHOICE_ITEM_OFFERY = 10;
			//选择题组间距
			CardUI.CHOICE_OFFERX = 10;
			CardUI.CHOICE_OFFERY = 10;
			
			//group组内边距
			CardUI.GROUP_PADDING_LEFT = 10;
			CardUI.GROUP_PADDING_TOP = 10;
			//group组titlH度
			CardUI.GROUP_TITLE_H = 20;
			
			//选这题高度-间距
			CardUI.BLANK_H = 40;
			CardUI.BLANK_OFFERX = 5;
			CardUI.BLANK_OFFERY = 10;
			
			function getBlankNum(num){
				var str = '';
				for(var i = 0;i<num || 0;i++){
					str += '&emsp;';
				}
				return str;
			}
			//渲染卡片Card
			CardUI.NewCard = function(){
				
				
				
				
				
				
				
				
				var div = $("<div class='answer_card'></div>");
				var headDiv = $("<div class='answer_card_head'></div>");
				var headInfo = $("<div class='answer_card_title'>鹰硕技术</div>");
				var titleInput = $('<textarea class="examName" />');
				titleInput.text(CardCommand.Card_Name);

				var stuInfoBlank = getBlankNum(14);
				var stuInfo = $("<div contenteditable='true' class='stuEdit'>"
										+ "<div>姓名：<u>" + stuInfoBlank + "</u></div>"
										+ "&nbsp;&nbsp;&nbsp;<div>班级：<u>" + stuInfoBlank + "</u></div>"
										+ "&nbsp;&nbsp;&nbsp;<div>学号：<u>" + stuInfoBlank + "</u></div>"
								+	"</div>");
				var tipBox = $("<div contenteditable='true' class='tipBox'>"
								+"<p style='font-size: 15px;font-weight: bold;text-align:center;margin:0'>注意事项</p>"
								+"<p class='content' style='font-size:12px'>1．答题前请将姓名、班级、学号、准考证号填写清楚。<br />"
								+"2．客观题答题，必须使用2 B铅笔填涂，修改时用橡皮擦干净。<br />"
								+"3．主观题答题，必须使用黑色签字笔书写,<br />"
								+"4．必须在题号对应的答题区域内作答，超出答题区域书写无效。<br />"
								//+"5．保持答卷清洁、完整。 <br />"
								+"</p>"
								+"</div>");
				var drawTip = $("<div class='drawTip'>"
							+ '<span>正确填涂<div style="background: #000000;width: 30px;height: 10px;display: inline-block;margin-left: 10px;"></div></span>'
							+ '<span class="missMark">缺考标记<div style="border: 1px solid #000000;width: 30px;height: 10px;display: inline-block;margin-left: 10px;"></div></span>'
				+"</div>");
				var showArea = $("<div class='showArea'/>");
				showArea.css({
					'top':'380px',
					'height':(CardUI.CARD_HEIGHT - 380 - 40) + 'px',
					'left':'40px'
				})

				var info = CardUI.PosInfo();
				
				var adminCard = CardUI.TicketNumber(460);
				var codeArea = CardUI.codeArea();
				var pageNum = $("<p style='position:absolute;text-align:center;bottom:0;width:100%' class='pageNum'>第1页</p>");
				var pageCode = CardUI.pageCode();
				
				headDiv.append(headInfo);
				headDiv.append(titleInput);
				headDiv.append(stuInfo);
				headDiv.append(tipBox);
				headDiv.append(drawTip);
				headDiv.append(adminCard);
				headDiv.append(codeArea);
				
				div.append(headDiv);
				div.append(showArea);
				div.append(info);
//				div.append(codeArea);
				div.append(pageNum);
				div.append(pageCode);
				
				codeArea.hide();
				//多栏布局
				div.setLanNum = function(num){
					if(num == 3){//三栏布局
						
						tipBox.css('padding','0 0px');
						pageCode.setLan(true);
						div.css({'width':'140mm',
								'margin':'20px 180px',
						});
						//$('.answer_card').css('margin','100px;');
						headDiv.css('width','100%');
						var stuInfoBlank = getBlankNum(8);
						stuInfo.html("<div>姓名：<u>" + stuInfoBlank + "</u></div>"
										+ "&nbsp;&nbsp;&nbsp;<div>班级：<u>" + stuInfoBlank +"</u></div>"
										+ "&nbsp;&nbsp;&nbsp;<div>学号：<u>" + stuInfoBlank +"</u></div>")
						adminCard.remove();
						adminCard = CardUI.TicketNumber(288);
						headDiv.append(adminCard);
						
						codeArea.setOfferX(288);
						
						CardUI.CARD_WIDTH = 529;
						CardUI.ANSWER_WIDTH = CardUI.CARD_WIDTH - 20 * 4;
						showArea.css('width',CardUI.ANSWER_WIDTH + 'px');
						drawTip.css('margin-left','20px');
						tipBox.css('margin-left','20px');
					}
					else{
						tipBox.css('padding','0 10px');
						pageCode.setLan(false);
						div.css({'width':'210mm',
								'margin':'20px 35px',
						});
						headDiv.css('width','100%');
						var stuInfoBlank = getBlankNum(14);
						stuInfo.html("<div>姓名：<u>" + stuInfoBlank + "</u></div>"
										+ "&nbsp;&nbsp;&nbsp;<div>班级：<u>" + stuInfoBlank +"</u></div>"
										+ "&nbsp;&nbsp;&nbsp;<div>学号：<u>" + stuInfoBlank +"</u></div>")
						adminCard.remove();
						adminCard = CardUI.TicketNumber(460);
						headDiv.append(adminCard);
						
						codeArea.setOfferX(460);
						
						CardUI.CARD_WIDTH = 794;
						CardUI.ANSWER_WIDTH = CardUI.CARD_WIDTH - 20 * 4;	
						showArea.css('width',CardUI.ANSWER_WIDTH + 'px');
						drawTip.css('margin-left','40px');
						tipBox.css('margin-left','40px');
					}
					if(CardCommand.codeType == 1){
						adminCard.show();
						codeArea.hide();
					}
					else{
						adminCard.hide();
						codeArea.show();
					}
				}
				div.setPosType = function(type){
					info.setType(type);
				}
				div.setPageNum = function(num){
					pageNum.html('第'+num+'页');
					
				}
				div.setPageCode = function(num){
					pageCode.setPageNum(num);
				}
				div.showTitle = function(b){
					if(b){
						headDiv.show();
						
						showArea.css({
							'top':'380px',
							'height':(CardUI.CARD_HEIGHT - 380 - 40) + 'px',
							'left':'40px'
						})
						if(CardCommand.codeType == 1){
							adminCard.show();
							codeArea.hide();
						}
						else{
							adminCard.hide();
							codeArea.show();
						}
						var pxTop = div.find('.showArea').css('top');
						div.offerY = parseInt(pxTop.substr(0,pxTop.length - 2)) - CardUI.BASIC_POSINFO_Y - 10;//标准店高度
					}
					else{
						headDiv.hide();
						adminCard.hide();
						codeArea.hide();
						showArea.css({
							'top':'60px',
							'height':(CardUI.CARD_HEIGHT -  40 - 40 - 20) + 'px',
							'left':'40px'
						})
						var pxTop = div.find('.showArea').css('top');
						div.offerY = parseInt(pxTop.substr(0,pxTop.length - 2)) - CardUI.BASIC_POSINFO_Y
					}
//					div.restHeight = div.find('.showArea').height(); SB   BUG。。。= =！。 
					div.restHeight += div.find('.showArea').height() - div.orgHeight;
					div.orgHeight = div.find('.showArea').height();

				}
				//剩余可用高度
				div.restHeight = div.find('.showArea').height();
				//原始高度（不改变）
				div.orgHeight = div.find('.showArea').height();
				//当前答题区域的offerY
				var pxTop = div.find('.showArea').css('top');
				div.offerY = parseInt(pxTop.substr(0,pxTop.length - 2)) - CardUI.BASIC_POSINFO_Y
				
				div.addChild = function(group){
							div.find('.showArea').append(group);
							div.restHeight -= group.height();
						}
				
				return div;
			}
			//页面识别号
			CardUI.pageCode = function(){
				var div = $('<div></div>');
				var offerX = 600;
				if(CardCommand.pageType == 3){
					offerX = 400;
				}
				else{
					offerX = 600;
				}
				for(var i = 0;i<3;i++){
					var item = $('<div class="pageCodeItem" style="width:20px;height:20px;border:1px solid #000;position:absolute;left:0;top:0"></div>');
					item.css({
						//'left':100 + i* (20+5) + 'px',
						//'top': String(1123-60 + 20) + 'px',
						'left':offerX + i* (20+5) + 'px',
						'top': 30 + 'px',
					});
					if(i == 1){
						item.css('background','#000')
					}
					div.append(item);
				}
				div.setLan = function(isThree){
					if(isThree){
						div.find('.pageCodeItem').each(function(i,item){
							$(item).css({
								'left':400 + i* (20+5) + 'px',
							});
						})
					}
					else{
						div.find('.pageCodeItem').each(function(i,item){
							$(item).css({
								'left':600 + i* (20+5) + 'px',
							});
						})
					}
				}
				div.setPageNum = function(num){
					if(parseInt(num) > 8){
						return;
					} 
					var data = []
					if(num == 1){
						data = ['none','none','none'];
					}
					else if(num == 2){
						data = ['none','none','#000'];
					}
					else if(num == 3){
						data = ['none','#000','none'];
					}
					else if(num == 4){
						data = ['none','#000','#000'];
					}
					else if(num == 5){
						data = ['#000','none','none'];
					}
					else if(num == 6){
						data = ['#000','none','#000'];
					}
					else if(num == 7){
						data = ['#000','#000','none'];
					}
					else if(num == 8){
						data = ['#000','#000','#000'];
					}
					div.find('div').each(function(i,item){
						$(item).css('background',data[i]);
					})
				}
				return div;
			}
			//准考证号
			CardUI.TicketNumber = function (dx) {
				var fillItemSpaceX = 10;
				var fillItemSpaceY = 4;
				var fillItemWidth = CardUI.FILL_WIDTH;
				var fillItemHeight = CardUI.FILL_HEIGHT;
				var div = $("<div class='ticketNumber'></div>");
				
				//偏移量
				var fillItemOfferY = 200 - fillItemHeight * 2;
				var fillItemOfferX = dx;
				
				var border = $("<div style='position:absolute'></div>");
				border.css({'top':fillItemOfferY - fillItemSpaceY * 2 + 'px','left':fillItemOfferX + 'px'});
				for(var i = 0;i<8;i++){
					var borderBox = $("<div  style='float:left;width:" + (fillItemWidth+fillItemSpaceX) +"px;height:" + (fillItemHeight*12 + fillItemSpaceY * 11) + "px;border:1px solid #000;border-left:none'>&nbsp;</div>");
					border.append(borderBox);
					if(i == 0){
						borderBox.css({
							'border-left':'#000 1px solid',

							});
					}
				}
				div.append(border);
				
				var borderHeadLine = $("<div style='position:absolute;border-bottom:solid 1px #000;box-sizing:border-box'></div>");
				borderHeadLine.css({
								 'width': (fillItemWidth *  8 + fillItemSpaceX * 8) + 'px',
								 'left' : fillItemOfferX + 'px',
								 'top' : fillItemOfferY + fillItemHeight + 'px',
				});
				div.append(borderHeadLine);
				
				var borderTitle = $("<div style='position:absolute;border:solid 1px #000;border-bottom:none;box-sizing:border-box;text-align:center;font-size:12px'>准考证号</div>");
				borderTitle.css({'height': (fillItemHeight + fillItemSpaceY) +'px',
								 'width': (fillItemWidth *  8 + fillItemSpaceX * 8) + 'px',
								 'left' : fillItemOfferX + 'px',
								 'top' : fillItemOfferY - (fillItemHeight) * 2  + 'px',
				});
				div.append(borderTitle);
				
				for(var i = 0;i < 80;i++){
					var col = i % 10;//行号
					var rol = parseInt(i / 10);//列数
					var dx = rol * (fillItemWidth + fillItemSpaceX) + fillItemOfferX + fillItemSpaceX/2;
					var dy = col * (fillItemHeight + fillItemSpaceY) + fillItemOfferY + fillItemSpaceY * 4;
					var item = $("<div class='fillItem'><span style='float:left'>[</span>" + col + "<span style='float:right'>]</span></div>");
					item.css({'top': dy +'px','left': dx + 'px'});
					div.append(item);
				}
				
				return div;
			}
			//条形码
			CardUI.codeArea = function (){
				//偏移量
				var fillItemOfferY = 200;
				var fillItemOfferX = 460;
				var div = $("<div class='codeArea'><p>贴条形码区域</p><p>(正面朝上，切勿贴出虚线方框)</p></div>");
				div.css({'top':'168px','left':'460px'});
				div.setOfferX = function(X){
					div.css({'top':'168px','left':X + 'px'});
				}
				return div;
			}
			CardUI.POS_AFOR_DATA = [];
			CardUI.POS_ATHREE_DATA_LEFT = [];
			CardUI.POS_ATHREE_DATA_RIGHT = [];
			//定位信息 'A4'，'A3-left','A3-right'
			CardUI.PosInfo = function (type) {
				//定位点初始规定为页面的内边距20*20px
				//所有标准定位以x:20.y:20。来比对
				//A4大小 ：794×1123px (210 * 297mm)
				var data = [	
					{
						x:20,
						y:20,
					},
					{
						x:794-20 - 20,
						y:20,
					},
					{
						x:20,
						y:1123-20 - 20,
					},
					{
						x:794-20 - 20,
						y:1123-20 - 20,
					}
				]

				
				var W = 20;//点位宽度
				var H = 10;//点位高度flushCwordDiv
				
				var areaX = data[0].x ;
				var areaY = data[0].y ;

				var posiInfo = $('<div style="top:' + 0 + 'px;left:' + 0 + 'px;position:relative;width:' + 794 + 'px;height:' + 1123 + 'px"></div>');
				for(var i = 0;i < data.length; i++){
					var div = $("<div style='position:absolute;left:" + String(data[i].x) + "px;top:" + String(data[i].y) + "px;width:" + W + "px;height:" + H + "px;background:#000' class='posInfoP'></div>");
					posiInfo.append(div);
				}
				
				posiInfo.setType = function(type){
					if(!type || type == 'A4'){
						var nData = [	
							{
								x:20,
								y:20,
							},
							{
								x:794-20 - 20,
								y:20,
							},
							{
								x:20,
								y:1123-20 - 20,
							},
							{
								x:794-20 - 20,
								y:1123-20 - 20,
							}
						]
					}
					else if(type == 'A3-left'){
						var nData = [	
							{
								x:20,
								y:20,
							},
							{
								x:20,
								y:1123-20 - 20,
							},
						]
					}
					else if(type == 'A3-right'){
						var nData = [	
							{
//								x:794-20 - 20,
								x:CardUI.CARD_WIDTH - 20 - 20,
								y:20,
							},
							{
//								x:794-20 - 20,
								x:CardUI.CARD_WIDTH - 20 - 20,
								y:1123-20 - 20,
							}
						]
					}
					else if(type == 'no'){
						var nData = [];
					}
					posiInfo.empty();
					for(var i = 0;i < nData.length; i++){
						var div = $("<div style='position:absolute;left:" + String(nData[i].x) + "px;top:" + String(nData[i].y) + "px;width:" + W + "px;height:" + H + "px;background:#000' class='posInfoP'></div>");
						posiInfo.append(div);
					}
				}
				
				
				
				
				
				
				
				
				return posiInfo;
			}
			//缺考标记
			CardUI.MissingMark = function () {
				var X = 200;
				var Y = 400;
				var W = 40;
				var H =	20; 
//				<div class="drawTip">
//								<span>正确填涂<div style="background: #000000;width: 30px;height: 10px;display: inline-block;margin-left: 20px;"></div></span>
//								<span>缺考标记<div style="border: 1px solid #000000;width: 30px;height: 10px;display: inline-block;margin-left: 20px;"></div></span>
//							</div>
				//位置= 文字宽度60+间隔20+dx
				var box = $("<table class='missMark'  style='position:absolute;left:" + (X-60-20) + "px;top:" + Y + "px;'>"
								+'<td style="width:60px;text-align:center;display:inline-block;">缺考标记</td><td style="border:1px solid #000;width: ' + W +'px;height: ' + H + 'px;display: inline-block;margin-left: 20px;"/>'
								+"</table>");
								
				return box;
			}
			
			//填图块Data 此处dx是相对坐标  唯一class ticketNumberFillItem
			function fillItem (dx,dy,code){
				this.width = CardUI.FILL_WIDTH;
				this.height = CardUI.FILL_HEIGHT;
				var div = $("<div class='fillItem ticketNumberFillItem'><span style='float:left;font-size:8px'>[</span>" + code + "<span style='float:right;font-size:8px'>]</span></div>");
				div.css({
					'left':dx+'px',
					'top':dy+'py',
				})
				return div;
			}
			//一道选择题  相对坐标
			function choiceItem(answerNum,id,isJuge){

				var answer = $("<li style='position:absolute;pointer-events: none;over-flow:hidden;' class='choiceItem'></li>");
				var offer = 5;//间距
				if(isJuge){
					
						var topmicID = $("<div class='fillItem'>" + id + "</div>");//题号
						var topmicT = new fillItem(0*(CardUI.FILL_WIDTH+offer) + CardUI.FILL_WIDTH,20,'T');
						topmicT[0].val = 'T';
						var topmicF = new fillItem(1*(CardUI.FILL_WIDTH+offer) + CardUI.FILL_WIDTH,20,'F');
						topmicF[0].val = 'F';
						answer.append(topmicID);
						answer.append(topmicT);
						answer.append(topmicF);
						
				}
				else{
					for(var i = 0;i<=answerNum;i++){
						var topmic;
						if(i == 0){
							topmic = $("<div class='fillItem'>" + id + "</div>");//题号
						}
						else{
							var number = String.fromCharCode(i+65 - 1);
							topmic = new fillItem((i-1)*(CardUI.FILL_WIDTH+offer) + CardUI.FILL_WIDTH,20,number);
							topmic[0].val = number;
						}
						answer.append(topmic);
					}
				}
				
				answer.width = (parseInt(answerNum)+1) * CardUI.FILL_WIDTH + (answerNum - 1) * offer;//单条选择题的宽度

				answer[0].numberId = answer.numberId = id;
				answer.height = CardUI.FILL_HEIGHT + CardUI.CHOICE_ITEM_OFFERY;//高度
				answer.answer = answerNum;//宽度
				answer.formTop = 0;//一组（5个)item的起始top位置--------用于切分
				answer.css({
					'width':answer.width+'px',
					'height':answer.height + 'px',
				});
				if(id <= 0){
					//此为填充补位
//					answer.hide();
					answer.css('opacity','0');
				}
				answer.pos = {
					_x : 0,
					_y : 0,
					set x(value){
						_x = value;
						answer.css('left',value + 'px');
					},
					get x(){
						return _x || 0;
					},
					set y(value){
						_y = value;
						answer.css('top',value + 'px');
					},
					get y(){
						return _y || 0;
					}
				}
				return answer;
			}
//			填空题data
			function blankVO(id,lineNum){
				this.numberId = this.id = id;
				this.lineNum = lineNum;
			}
			//填空题item
			function blankItem(id,lineNum){
				
				var num = lineNum || 1;
				var spanNum = 0;
				if(num == 1){
					if(CardCommand.pageType != 3){
						spanNum = 50
					}else{
						spanNum = 30
					}
				}
				else if(num == 2){
					if(CardCommand.pageType != 3){
						spanNum = 25;
					}else{
						spanNum = 15;
					}
				}
				else if(num == 3){
					if(CardCommand.pageType != 3){
						spanNum = 16
					}else{
						spanNum = 10;
					}
					
				}
				else if(num == 4){
					if(CardCommand.pageType != 3){
						spanNum = 12
					}else{
						spanNum = 7;
					}
					
				}
				else if(num == 5){
					if(CardCommand.pageType != 3){
						spanNum = 9
					}else{
						spanNum = 5;
					}
					
				};
				var str = '';
				for(var i = 0;i<spanNum;i++){
//					str += '&nbsp;';
					str += '&emsp;';//使用半角或者半角空格，兼容浏览器空格宽度
				}
				var blank = $("<div style='height:20px;float:left;' class='blankItem'>"+id+".<u class=''>" + str + "</u></div>");
				blank.height = CardUI.BLANK_H + CardUI.BLANK_OFFERY;
				blank[0].lineNum = blank.lineNum = num;//列数
				blank[0].numberId = blank.numberId = id;

				blank.css({
					'margin-left':CardUI.BLANK_OFFERX + 'px',
					'height':blank.height + 'px',
					'line-height':blank.height + 'px',
				});
				return blank;
			}
			//左上角工具栏+ x
			CardUI.toolSet = function (){
				var div = $("<div class='answer_content_item_operaTip'>"
				+"<span class='splitItemBtn'>→</span>"
				+"<span class='addItemBtn' data-toggle='modal' data-target='#myModal'>+</span>"
				+"<span class='deleteItemBtn'>x</span>"
				+"</div>");
				return div;
			}
			

			//更具choiceData数据重新创建视图Group的高度 -,-允许切割group index []
			CardUI.flushChoiceDiv =function(group,splitType) {
				
				//内部的padding距离
				var paddingLeft = CardUI.GROUP_PADDING_LEFT;
				var paddingTop = CardUI.GROUP_PADDING_TOP;

				var div = group.find('.group_content');
				var data= group[0].data.choiceData;

				div.empty();
				var totle = data.length;//总提数
				var beginIndex = 0;
				if(splitType && group[0].data.splitIndex != 0){
					if(splitType =='front'){
						totle = group[0].data.splitIndex;
						beginIndex = 0;
					}
					else if(splitType == 'behind'){
						totle = group[0].data.choiceData.length - beginIndex - 1;
						beginIndex = group[0].data.splitIndex;
					}
				}
				else{
					totle =data.length;
					beginIndex = 0;
				}
				
				createGroupLine(beginIndex,0,true);
				
				function createGroupLine(startId,dy,changeLine){
					if(startId > totle){
						return;
					}
					//刷新div的高度
					group[0].pos.h = dy + (CardUI.FILL_HEIGHT + CardUI.CHOICE_ITEM_OFFERY) * 5 - CardUI.CHOICE_ITEM_OFFERY + paddingTop*2 + CardUI.GROUP_TITLE_H;
					
					if(changeLine){
						var orgX = 0;
					}
					else{
						var orgX = data[startId-1].pos.x + data[startId-1].width;
						var maxOrgOfferW = 0;
						for(var i = startId-1;i>=startId-5;i--){
							if(data[i]){
								if(maxOrgOfferW < data[i].width){
									maxOrgOfferW = data[i].width;
								}
							}
						}
						orgX = data[startId-1].pos.x + maxOrgOfferW;
//						console.log(maxOrgOfferY);

					}
					for(var i = 0;i<5;i++){
						var item = data[i+startId];

						if(item){
							div.append(item);
							item.pos.x = orgX + paddingLeft;
							item.pos.y = i *item.height + dy + paddingTop;
							item.formTop = dy + paddingTop;
						//	转行
							if(item.pos.x + item.width > CardUI.ANSWER_WIDTH){

									var dy = item.pos.y + item.height * 5 + CardUI.CHOICE_OFFERY ;//当前的Y坐标
									item = null;
									if(startId < totle){
										createGroupLine(startId,dy,true);
									}
									return;
							}
							else{
								div.append(item);
							}
						}
						
					}
					if(startId < totle - 5){
						startId += 5;
						createGroupLine(startId,dy,false);
					}
					
				}
			}
			CardUI.flushCwordDiv =function(group,data){
				
				//1.2栏 20格数，，3栏12格数
				
				if(data){//刷新的数据
					var obj = data;
				}
				else{
					var obj = group[0].data;
				}
				
				group.find('.group_content').empty();
				var div = $("<div style='width:86%;margin:35px 7%;height:auto'></div>")
				for(var i = 0;i<obj.wordNum;i++){
					var item = $("<div style='width:30px;height:30px;border:1px solid #000000;float:left;margin-bottom:5px;'/>");
					div.append(item);
				}
				group.find('.group_content').append(div);
				
				var realH;
				if(CardCommand.pageType == 3){
					realH = obj.wordNum/ 12 * (30 + 5) + 20 + 35 * 2;
				}
				else{
					realH = obj.wordNum/ 20 * (30 + 5) + 20 + 35 * 2;
				}
				
				
				
				group[0].pos.h = realH;
				//console.log(group.find('.group_content')[0].offsetHeight);
			} 
			CardUI.flushEwordDiv =function(group,data){
				if(data){//刷新的数据
					var obj = data;
				}
				else{
					var obj = group[0].data;
				}
				
				group.find('.group_content').empty();
				var div = $("<div style='width:90%;margin:35px 5%;height:auto'></div>")
				
				for(var i = 0;i<obj.wordNum;i++){
					var item = $("<div style='width:30px;height:30px;border:1px solid #000000;float:left;margin-bottom:5px;'/>");
					div.append(item);
				}
				group.find('.group_content').append(div);
				
				var realH; 
				if(CardCommand.pageType == 3){
					realH = obj.wordNum/ 12 * (30 + 5) + 20 + 35 * 2;
				}
				else{
					realH = obj.wordNum/ 20 * (30 + 5) + 20 + 35 * 2;
				}

				group[0].pos.h = realH;
				
			}
			CardUI.flushBlankDiv =function(group,splitArr){

				var startId;
				var endId;
				
				if(splitArr){
					 startId = splitArr[0];
					 endId = splitArr[1]; 
				}
				else{
					startId = 0;
					endId = group[0].data.blankData.length;
				}
				
				
				
				group[0].blankAnswerIndex = [startId,endId];//保存数据的index
				var div = group.find('.group_content');
				div.css('height','auto');
				div.empty();
				var colNum = 0;
				
				for(var i = startId;i<endId;i++){
//					var item = group[0].data.blankData[i];
//					colNum += parseFloat(1/(item.lineNum));
//					div.append(item);
					var vo = group[0].data.blankData[i];
					colNum += parseFloat(1/(vo.lineNum));
					var item = new blankItem(vo.id,vo.lineNum);
					div.append(item);
				}
				
				colNum = Math.ceil(colNum);
				group[0].pos.h = (CardUI.BLANK_H + CardUI.BLANK_OFFERY) * colNum + 2 + 20;//item*num+上下border + title

				
			}
			//合并blank后的刷新
			CardUI.flushBlankItemDiv = function(blankGroup,needLine){
				var len = blankGroup[0].itemData.length//blankGroup.find('.blankItem').length;
				if(needLine){
					var colNum = 0;
					blankGroup.find('.blankItem').each(function(i,item){
						colNum += parseFloat(1/(item.lineNum));
					})
					
					colNum = Math.ceil(colNum);
					blankGroup[0].pos.h = (CardUI.BLANK_H + CardUI.BLANK_OFFERY) * colNum + 2 + 20;//item*num+上下border + title
				}
				else{
					
					blankGroup[0].pos.h = (CardUI.BLANK_H + CardUI.BLANK_OFFERY) * len + 2 + 20;
				}

//				console.log(blankGroup[0].blankAnswerIndex)
//				console.log(blankGroup.find('.blankItem')[0].numberId + "-" + blankGroup.find('.blankItem')[len - 1].numberId)
			}
			
			
			//创建新页面
			CardUI.createPage = function(pageVO){
						var card = CardUI.NewCard();
						card.id = pageVO.id;
						$('.answer_card_area').append(card);
						
						var type = CardCommand.pageType;
						var targetPageNum = CardData.pageView.length;
						if(targetPageNum % (type * 2) == 0){
							card.showTitle(true);
						}
						else{
							card.showTitle(false);
						}
							
						
						CardData.pageView.push(card);
						
						
					for(var i = 0;i<CardData.pageView.length;i++){
						var card = CardData.pageView[i];
						card.setPageNum(String(i+1));
					}
					
			}

			function createList(groupVO,list){
				if(groupVO.type == AnswerData.ANSWER_TYPE_RADIO || groupVO.type == AnswerData.ANSWER_TYPE_MULTISELECT || groupVO.type == AnswerData.ANSWER_TYPE_JUGE || groupVO.type == AnswerData.ANSWER_TYPE_BLANK){
					
					if(groupVO.type == AnswerData.ANSWER_TYPE_BLANK){
						list.find('span')[0].innerHTML = '填空题';
						var dataArr = groupVO.blankData.sort(compare('numberId'));
					}
					else{
						var dataArr = groupVO.choiceData.sort(compare('numberId'));
					}
					
					
					var points  = [];
					var startObj = {
									type:'start',
									id:dataArr[0].numberId
								}
					points.push(startObj);
					for(var i = 0;i<dataArr.length - 1;i++){
						var lastId =  dataArr[i].numberId;
						var nextId = dataArr[i+1].numberId;
						if(nextId - lastId != 1){
							var objEnd = {
								type:'end',
								id:lastId
							}
							var objStart = {
								type:'start',
								id:nextId
							}
							points.push(objEnd);
							points.push(objStart);
						}
					}
					var endObj = {
									type:'end',
									id:dataArr[dataArr.length - 1].numberId
								}
					points.push(endObj);
					var str = ''
					for(var i = 0;i<points.length;i++){
	
						if(points[i].type == 'start'){
							str += points[i].id+'~';
						}
						else if(points[i].type == 'end'){
							str += points[i].id+','
						}
					}
					if(groupVO.type == AnswerData.ANSWER_TYPE_RADIO){
						list.find('span')[0].innerHTML = '单选题';
					}
					if(groupVO.type == AnswerData.ANSWER_TYPE_MULTISELECT){
						list.find('span')[0].innerHTML = '多选';
					}
					if(groupVO.type == AnswerData.ANSWER_TYPE_JUGE){
						list.find('span')[0].innerHTML = '判断';
					}
					list.find('span')[1].innerHTML += str;
				}
				else if(groupVO.type == AnswerData.ANSWER_TYPE_ANSWER){
					list.find('span')[0].innerHTML = '简答题';
					list.find('span')[1].innerHTML += groupVO.solveId+','; 
				}
			}
			var answerTypeList = {};
			CardUI.flushAnswerNameList = function(){
				for(var str in answerTypeList){
					answerTypeList[str].find('span')[1].innerHTML = '';
				}

				for(var i = 0;i<CardData.groupData.length;i++){
					var groupVO = CardData.groupData[i];
					var type = groupVO.type;
					if(!answerTypeList[type]){
						var list = $("<li class='testListItem'><span class='testListItem_txt typeName'>xx</span><span class='testListItem_txt answerId'/></span><div style='clear:both'></div></li>");
						answerTypeList[type] = list;
						createList(groupVO,list);
					}
					else{
						var list = answerTypeList[type]
						createList(groupVO,list)
					}

				}

				$('.answerInfo').find('ul').empty();
				for(var str in answerTypeList){
					$('.answerInfo').find('ul').append(answerTypeList[str]);
				}
			}

	
