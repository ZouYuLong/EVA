			
			

		
		
		
		
		function CardData(){}
		//保存所有的页面数据
		CardData.pageView = [];
		//group数据，
		CardData.groupData = [];
		
		
		//页面数据
		function pageVO () {
			this.id = 1; 
			this.data = [];
			this.pageNumber = 1;
		}
		//一组
		function groupVO () {
			this.title = '';
			this.id = 1;
			this.minSplitH = 0;//最小可拆分高度
			this.type = 0;
			
			
			//切割定位索引--仅仅针对选择题
			this.splitIndex = 0;//
			//选择题item
			this.choiceData = [];
			
			
			//填空题item
			this.blankData = [];
			//填空题拆分组的父类指针
			this.blankSplitGroupFather = null;
			
			
			//解答题相关-原始高度
			this.solveH = 0;
			//解答题的切割高度
			this.splitH = 0;
			this.solveId = 0;
		}
		//选择题、多选、判断
		function choiceAnswerVO (_number,_answerNum,_isJuge){
			this.id = 1;
			this.number = _number || 1;
			this.answerNum = _answerNum || 4;
			this.isJuge = _isJuge || false;
		}
		
		CardData.setXml = function(){
			

			
			var xml  = createXMLDOM();

			var root = xml.createElement('YSAMTPL');//root节点
			var TPLInfo = xml.createElement('TPLInfo');
			TPLInfo.setAttribute('name',$('.examName').val());
			TPLInfo.setAttribute('testType',CardCommand.testType);//阅卷类型，2手阅卷。1网阅卷
			TPLInfo.setAttribute('layout',CardCommand.pageType);//几栏布局
			TPLInfo.setAttribute('codeType',CardCommand.codeType);//准考证或者贴码区域 2贴码，1准考证
			TPLInfo.setAttribute('displaySealLine','0');//密封线显示
			TPLInfo.setAttribute('displayFooter','0');//页脚显示
			TPLInfo.setAttribute('displayMissingMark',CardCommand.isMiss);//缺考标记
			TPLInfo.setAttribute('desc','0');//描述
			xml.appendChild(root);
			root.appendChild(TPLInfo);
			
			
			var pageCode = createPageCode(xml);//页码
			TPLInfo.appendChild(pageCode);
			var posInfo = createPosInfo(xml);//定位信息
			TPLInfo.appendChild(posInfo);
			
			var pageNum = parseInt(CardCommand.pageType);//1栏，2栏，3栏
			
			var pageXMlNodes = {};
			for(var i = 0;i<CardData.pageView.length;i++){
				var pageDiv = CardData.pageView[i];
				var n = i%pageNum;
				if(n == 0){//第一栏
					pageDiv.pageOffset = 0;
				}
				else if(n == 1){//第二栏
					pageDiv.pageOffset = CardUI.CARD_WIDTH;
				}
				else if(n == 2){//第三栏
					pageDiv.pageOffset = CardUI.CARD_WIDTH  * 2;
				}
				
//				if(pageNum == 1){
//					pageDiv.pageOffset = 0;
//				}
//				else if(pageNum == 2){
//					var n = i%2;
//					if(n == 0){//2栏的第一页
//						pageDiv.pageOffset = 0;
//					}
//					else if(n == 1){//2栏的第二页
//						pageDiv.pageOffset = CardUI.CARD_WIDTH;
//					}
//				}
//				else if(pageNum == 3){
//					var n = i%3;
//					if(n == 0){//3栏的第一页
//						pageDiv.pageOffset = 0;
//					}
//					else if(n == 1){//3栏的第二页
//						pageDiv.pageOffset = CardUI.CARD_WIDTH;
//					}
//					else if(n == 2){//3栏的第三页
//						pageDiv.pageOffset = CardUI.CARD_WIDTH  * 2;
//					}
//				}
				
				var id = Math.floor(i / pageNum);

				if(!pageXMlNodes[id]){
					var page = xml.createElement('Page');//卡片页面
//					page.setAttribute('pageNum',String(i+1));	

					
					pageXMlNodes[id] = page;
					var notice = xml.createElement('Notice');//注意事项
	
					var noticeContent = $('.tipBox').html();
					var noticeNode = xml.createCDATASection(noticeContent);
					notice.appendChild(noticeNode);
					
					
					var ticketNumber = createTicketNumberNode(xml,pageDiv);//准考证区域
					
					
					var misMark = xml.createElement('MissingMark');//缺考标记
					if(pageNum == 3){
						misMark.setAttribute('x','219');//定值 只有3栏的时候
					}
					else{
						misMark.setAttribute('x','318');//定值 只有1/2栏的时候
					}
					
					misMark.setAttribute('y','318');
					misMark.setAttribute('width','30');
					misMark.setAttribute('height','10');
					misMark.setAttribute('desc','');
					
					//正反面
					if(id%2 == 0){//正面
//						page.setAttribute('pageNum',Math.ceil((id+1)/2));
//						page.setAttribute('direction','front');
						page.setAttribute('pageNum',id+1);
						//这面才有这些 信息
						page.appendChild(notice);
						page.appendChild(misMark);
						page.appendChild(ticketNumber);
					}
					else{
//						page.setAttribute('pageNum',Math.ceil(id/2));
						page.setAttribute('pageNum',id+1);
//						page.setAttribute('direction','back');
					}
					
//					if(pageNum == 1){
//						if(id%2 == 0){//正面
//							
//							page.setAttribute('pageNum',Math.ceil((id+1)/2));
//							page.setAttribute('direction','front');
//							//这面才有这些 信息
//							page.appendChild(notice);
//							page.appendChild(misMark);
//							page.appendChild(ticketNumber);
//						}
//						else{
//							page.setAttribute('pageNum',Math.ceil(id/2));
//							page.setAttribute('direction','back');
//						}
//					}
//					else if(pageNum == 2){
//						if(id%2 == 0){//正面
//							
//							page.setAttribute('pageNum',Math.ceil((id+1)/2));
//							page.setAttribute('direction','front');
//							//这面才有这些 信息
//							page.appendChild(notice);
//							page.appendChild(misMark);
//							page.appendChild(ticketNumber);
//						}
//						else{
//							page.setAttribute('pageNum',Math.ceil(id/2));
//							page.setAttribute('direction','back');
//						}
//					}
//					else if(pageNum == 3){
//						
//					}

					createTopicsNode(xml,pageDiv,page);

					TPLInfo.appendChild(page);
				}
				else{
					var page = pageXMlNodes[id];
					createTopicsNode(xml,pageDiv,page);

				}	
			}
			for(var str in pageXMlNodes){
				pageXMlNodes[str] = null;
				delete str;
			}
			for(var str in idArr){
				idArr[str] = null;
				delete str;
			}
			idArr = {};
//			var noticeContent = xml.getElementsByTagName('YSAMTPL')[0].getElementsByTagName('TPLInfo')[0].getElementsByTagName('Page')[0].getElementsByTagName('notice')[0].firstChild.nodeValue;
//			$('.tipBox').html(noticeContent);
 
			saveXML(xml);
		}
		function createPageCode(xml){
			var pageCode = xml.createElement('PageCode');//页码
			$('.pageCodeItem').each(function(i,item){
				if(i<3){
					var itemCode = xml.createElement('PageCode'+String(i+1));
					itemCode.setAttribute('x',$(item).position().left - CardUI.BASIC_POSINFO_X);
					itemCode.setAttribute('y',$(item).position().top - CardUI.BASIC_POSINFO_Y);
					itemCode.setAttribute('width','20');
					itemCode.setAttribute('height','20');
					pageCode.appendChild(itemCode);
				}			
			})
			return pageCode;
			
		}
		function createPosInfo(xml){
			


			var posInfo = xml.createElement('PosInfo');//定位信息
			posInfo.setAttribute('type','2');
			posInfo.setAttribute('width','20');
			posInfo.setAttribute('height','10');
			posInfo.setAttribute('desc','');
			
			for(var i = 0;i<4;i++){
				var nodeName;
				var dx = 0;
				var dy = 0;	
				if(i == 0){
					nodeName = 'LT';
					dx = 0;
					dy = 0;
				}
				else if(i == 1){
					nodeName = 'RT';
					dx = CardUI.CARD_WIDTH - CardUI.BASIC_POSINFO_X * 2 - 20;
					dy = 0;
					if(CardCommand.pageType != 1){//A3
						dx = CardUI.CARD_WIDTH * 2 - CardUI.BASIC_POSINFO_X * 2 - 20;
					}
				}
				else if(i == 2){
					nodeName = 'LB';
					dx = 0;
					dy = CardUI.CARD_HEIGHT - CardUI.BASIC_POSINFO_Y * 2 - 20;	
				}
				else if(i == 3){
					nodeName = 'RB';
					dx = CardUI.CARD_WIDTH - CardUI.BASIC_POSINFO_X * 2 - 20;
					dy = CardUI.CARD_HEIGHT - CardUI.BASIC_POSINFO_Y * 2 - 20;
					if(CardCommand.pageType != 1){//A3
						dx = CardUI.CARD_WIDTH * 2 - CardUI.BASIC_POSINFO_X * 2 - 20;
					}
				}
				var nodeItem =  xml.createElement(nodeName);
				nodeItem.setAttribute('x',dx);
				nodeItem.setAttribute('y',dy);
				posInfo.appendChild(nodeItem);
			}
			return posInfo;
		}
		var codeId = 0;
		function getCodeId(){
			return (++codeId);
		}
		var open = false;
		function saveXML(xml){
			
			CardCommand.getInstance().setData(xml);
			return;	
			if(open){
				return;
			}
			open = true;
				
			var id = $('.cardId').html();
			var oSerializer = new XMLSerializer();
			var sXML = oSerializer.serializeToString(xml);
			var data
			if(id){
				data = {'cardXml':sXML,'cardId':id};
			}
			else{
				data = {'cardXml':sXML};
			}
			var item=$('<div  ></div>');
			var elements=CardCommand.pageType;
			for(var i = 0;i<CardData.pageView.length;i++){
				var div = CardData.pageView[i].clone();
				div.css({
					'margin':'0',
					'float':'left',
				})
				item.append(div);
			}
			elements=elements+item[0].outerHTML;
			data.elements =elements;  
			var jsonData = JSON.stringify(data);
			//禁止点击
			//$('.answer_card_ui').css('pointer-events','none');
			$.ajax({
				type : "post",
				url:'/edu/rest/yjcard/create',
	            dataType :'json',
	            data:data,
	            success:function(e){
	            	if("success"!=e){
	            		alert(e);
	            	}else{
	            		$('#sureWindow').modal('show');
		            	open = false;
	            	}
	            	//alert('保存成功，即将跳转')
	            	//window.location.href= saveUrl;//"${ctx}/rest/yjcard/init?userId=${user.user_id}"
	            },
	            error:function(e){
	            	alert('保存失败');
	            	open = false;
	            	$('.answer_card_ui').css('pointer-events','all');
	            }
			});
		}
		/*********************************写操作************************************/
		function createXMLDOM() {
		    var xmlDOM;
		    if (window.ActiveXObject) {
		        xmlDOM = new ActiveXObject('Microsoft.XMLDOM');
		    } else if (document.implementation
		            && document.implementation.createDocument) {
		        	xmlDOM = document.implementation.createDocument('', '', null);
		    } else {
		        alert('您的浏览器不支持文档对象XMLDOM');
		        return;
		    }
		    return xmlDOM;
		}
		function createTicketNumberNode (xml,pageDiv) {
			var node = xml.createElement('TicketNumber');
			node.setAttribute('desc','');
			
			var cols = {};
			pageDiv.find('.ticketNumber').find('.fillItem').each(function(i,item){
				
				var col = parseInt(i / 10);
				if(!cols[col]){
					
					var Number = xml.createElement('Number');
					Number.setAttribute('id',col + 1);
					cols[col] = Number;
					node.appendChild(Number);
					
					var Area = xml.createElement('Area');
					Area.setAttribute('val',i%10);
					Area.setAttribute('x',item.offsetLeft - CardUI.BASIC_POSINFO_X + 1);//+1偏移量
					Area.setAttribute('y',item.offsetTop - CardUI.BASIC_POSINFO_Y + 1);
					Area.setAttribute('width',CardUI.FILL_WIDTH);
					Area.setAttribute('height',CardUI.FILL_HEIGHT);
					Number.appendChild(Area);
				}
				else{
					var Area = xml.createElement('Area');
					Area.setAttribute('val',i%10);
					Area.setAttribute('x',item.offsetLeft - CardUI.BASIC_POSINFO_X + 1);
					Area.setAttribute('y',item.offsetTop - CardUI.BASIC_POSINFO_Y + 1);
					Area.setAttribute('width',CardUI.FILL_WIDTH);
					Area.setAttribute('height',CardUI.FILL_HEIGHT);
					cols[col].appendChild(Area);
				}
//				console.log(item.offsetLeft +'-'+ item.offsetTop + '-' +item.offsetHeight + '-' + item.offsetWidth);
			})
			cols = null;
			return node;
		}
		var idArr = {};//临时数据
		//创建题目
		function createTopicsNode(xml,pageDiv,pageXML){
			
			var node;
			
			if(pageXML.getElementsByTagName('Topics').length == 0){
				node = xml.createElement('Topics');
				node.setAttribute('desc','题目');
			}
			else{
				node = pageXML.getElementsByTagName('Topics')[0];
			}
			
			var groupIds = {};//用于筛选
			pageDiv.find('.group').each(function(i,group){
//				console.log(group.data);
				var groupOfferY = group.offsetTop + CardUI.GROUP_TITLE_H;//Group偏移量
				groupOfferY += pageDiv.offerY;//页面区域TOP
				
				var groupXML = xml.createElement('Group');
				
				groupXML.setAttribute('type',group.data.type);
				groupXML.setAttribute('title',group.data.title);
				groupXML.setAttribute('id',group.data.id);
				
				
				
//				console.log(group.data.id)

				if(group.data.type == AnswerData.ANSWER_TYPE_RADIO || group.data.type == AnswerData.ANSWER_TYPE_MULTISELECT || group.data.type == AnswerData.ANSWER_TYPE_JUGE){
					
					$(group).find('.choiceItem').each(function(i,choiceItem){
						var topick = xml.createElement('Topic');
						topick.setAttribute('numberId',choiceItem.numberId);
						topick.setAttribute('code',getCodeId());

						//当前题针对当前group的偏移量
						var dx = choiceItem.offsetLeft + CardUI.BASIC_POSINFO_X + pageDiv.pageOffset + 1;//偏移量
						var dy = choiceItem.offsetTop + groupOfferY + 2;
						
						$(choiceItem).find('.ticketNumberFillItem').each(function(i,fillItem){
//							console.log(fillItem);
							var Area = xml.createElement('Area');
							Area.setAttribute('val',fillItem.val);
							Area.setAttribute('x',dx + fillItem.offsetLeft);
							Area.setAttribute('y',dy + fillItem.offsetTop);
							Area.setAttribute('width',CardUI.FILL_WIDTH);
							Area.setAttribute('height',CardUI.FILL_HEIGHT);
							topick.appendChild(Area);
						})
						groupXML.appendChild(topick);
					})
					groupXML.setAttribute('answerNum',groupXML.getElementsByTagName('Topic').length);
				}
				else if(group.data.type == AnswerData.ANSWER_TYPE_ANSWER){
					
					if(!idArr[group.data.id]){
						
						groupXML.setAttribute('code',getCodeId());
						idArr[group.data.id] = groupXML.getAttribute('code');
					}
					else{
						groupXML.setAttribute('code',idArr[group.data.id]);
					}
					
//						
					var content = $(group).find('.group_content').html();
					var contentNode = xml.createCDATASection(content);//保存内容
//					console.log(groupXML);
					
					
//					groupXML.setAttribute('name',group.data.title);
					groupXML.setAttribute('x',CardUI.BASIC_POSINFO_X + pageDiv.pageOffset);
					groupXML.setAttribute('y',groupOfferY);
					groupXML.setAttribute('width',CardUI.CARD_WIDTH - CardUI.BASIC_POSINFO_X * 4);
					groupXML.setAttribute('height',group.pos.h - CardUI.GROUP_TITLE_H);
					groupXML.appendChild(contentNode);
					groupXML.setAttribute('numberId',group.data.solveId);
					groupXML.setAttribute('answerNum',1);
					
				}
				else if(group.data.type == AnswerData.ANSWER_TYPE_BLANK){//没有group_content是为拆分后的填空的标题
					
					
					var content = $(group).find('.group_content').html();
					var contentNode = xml.createCDATASection(content);//保存内容						
//					groupXML.setAttribute('name',group.data.title);
					groupXML.appendChild(contentNode);
					//填空题原题也需要保存（保留的是列数和id）
					for(var i = group.blankAnswerIndex[0];i<group.blankAnswerIndex[1];i++){
						
						var item = group.data.blankData[i];
						if(item){
							var topick = xml.createElement('Topic');
							topick.setAttribute('numberId',item.numberId);
							topick.setAttribute('lineNum',item.lineNum);
							groupXML.appendChild(topick);
						}
						
					}
					if(!$(group).hasClass('splitGroup'))//证明没有拆分过
					{
						groupXML.setAttribute('x',CardUI.BASIC_POSINFO_X + pageDiv.pageOffset);
						groupXML.setAttribute('y',groupOfferY);
						groupXML.setAttribute('width',CardUI.CARD_WIDTH - CardUI.BASIC_POSINFO_X * 4);
						groupXML.setAttribute('height',group.offsetHeight - CardUI.GROUP_TITLE_H);
						
						groupXML.setAttribute('answerNum',groupXML.getElementsByTagName('Topic').length);
						groupXML.setAttribute('code',getCodeId());
						
					}
					else{//拆分过后的填空题标题+数据
						groupXML.setAttribute('split',true);
					}
				}
				else if(group.data.type == AnswerData.ANSWER_TYPE_BLANK_ITEM){
					

						var dy = pageDiv.offerY  + group.offsetTop;
						
						var content = $(group).find('.group_content').html();
						var contentNode = xml.createCDATASection(content);//保存内容
//						groupXML.setAttribute('name',group.data.title);
						groupXML.setAttribute('x',CardUI.BASIC_POSINFO_X + pageDiv.pageOffset);
						groupXML.setAttribute('y',dy);
						groupXML.setAttribute('width',CardUI.CARD_WIDTH - CardUI.BASIC_POSINFO_X * 4);
						groupXML.setAttribute('height',group.offsetHeight - 4);//合并按钮区域高度
						groupXML.setAttribute('belongId',group.data.blankSplitGroupFather[0].data.id);
						groupXML.setAttribute('code',getCodeId());
						groupXML.appendChild(contentNode);
						
//						
						//填空题内部数据索引保存 
//						console.log(group.blankAnswerIndex);
						for(var i = 0;i<group.itemData.length;i++){
							var item = group.itemData[i];
							var topick = xml.createElement('Topic');
							topick.setAttribute('numberId',item.numberId);
							topick.setAttribute('lineNum',item.lineNum);
							groupXML.appendChild(topick)
						}
						groupXML.setAttribute('answerNum',groupXML.getElementsByTagName('Topic').length);
				}
				
				node.appendChild(groupXML);
			})
//			console.log(node);
			pageXML.appendChild(node);
			return node;
		}
		function createObjectiveNode(xml){
			
		}
		function createSubjectiveNode(xml){
			
		}
		/*********************************读操作************************************/
		function getNoticeFromPage(){
			
		}


		

		
		
		

		
