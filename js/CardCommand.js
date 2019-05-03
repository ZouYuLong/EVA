
						
			CardCommand.pageType = 1;//页面布局栏1,2,3
			CardCommand.codeType = 1;//考号1-条形码2
			CardCommand.testType = 1;//网阅读1   手阅读2
			CardCommand.isMiss = 1;//缺考标记，0缺考
			CardCommand.showPageNum = 1;//1显示页脚，0不显示
			CardCommand.Card_Name = '答题卡名称';
			
			var C = false;
			
			function CardCommand(){
				var model = {};
				var targetId = 10000;
				//卡片排版-暂时只支持-1栏、2栏
				model.changePageType = function(type){
					CardCommand.pageType = type;
					model.reRankGroup(); 
				}
				//创建内部ID唯一标识
				model.createId = function(){
					return (++targetId);
				}
				//新建页面card
				model.createPage = function(){
					
					//PS 这里会出现3栏情况，一页代表可能代表1,2,3张纸
					
					var page = new pageVO();
					page.id = model.createId();
					CardUI.createPage(page);
				}
				//新建组
				model.createGroup = function(setData){
						
						var group = new groupVO();
						group.id = model.createId();
						group.title = setData.title;
						group.type = setData.type;//设置类型
									
						if(group.type == AnswerData.ANSWER_TYPE_RADIO || group.type == AnswerData.ANSWER_TYPE_MULTISELECT || group.type == AnswerData.ANSWER_TYPE_JUGE){
							if(setData.endId - setData.startId > 100){
								alert('最高只允许100道题');
								return;
							}
							
							//每种题组的最小切割高度不同
							group.minSplitH = CardUI.GROUP_PADDING_TOP * 2 + 5 * (CardUI.FILL_HEIGHT + CardUI.CHOICE_ITEM_OFFERY);

							for(var i = parseInt(setData.startId);i<=parseInt(setData.endId);i++){
								
//								var vo = new choiceAnswerVO(i,setData.answerNum,setData.isJuge);
								if(setData.isJuge){
									var item = new choiceItem(2,i,true);
								}
								else{
									var item = new choiceItem(setData.answerNum,i);
								}
								
								group.choiceData.push(item);
							}
							var div = cGroup(group);
							addGroupToCardId(0,div);//添加到舞台
							CardData.groupData.push(group);//新建组才会放入groupData
							//model.reRankGroup();
						}
						else if(group.type == AnswerData.ANSWER_TYPE_BLANK){
							if(setData.blankLineNum > 5){
								alert('每行最多5道题');
								return;
							}
							if(setData.blankLineNum  == 1){
								if(setData.endId - setData.startId > 24){
									alert('每行一个空格的填空题最多24个！')
									return;
								}
							}
							else if(setData.blankLineNum  == 2){
								if(setData.endId - setData.startId > 50){
									alert('每行2个空格的填空题最多50个！')
									return;
								}
							}
							if(setData.endId - setData.startId > 100){
									alert('一次性添加填空题不得超过100个！')
									return;
							}
							group.minSplitH = 50;

							for(var i = setData.startId;i<=setData.endId;i++){
								var item = new blankItem(i,parseInt(setData.blankLineNum));
								var vo = new blankVO(i,parseInt(setData.blankLineNum));
//								group.blankData.push(item);
								group.blankData.push(vo);		
							}
							for(var i = 0;i<group.blankData.length;i++){
								
							}
							var div = cGroup(group);
							div.addClass('group_'+group.id);
							addGroupToCardId(0,div);//添加到舞台
							CardData.groupData.push(group);//新建组才会放入groupData
							//model.reRankGroup();
						}
						else if(group.type == AnswerData.ANSWER_TYPE_ANSWER){
							if(setData.endId - setData.startId >20){
									alert('一次性添加简答题不得超过20个！')
									return;
							}
							for(var i = setData.startId;i<=setData.endId;i++){	
								var answerGroupVO = new groupVO();
								answerGroupVO.id = model.createId();
								answerGroupVO.title = setData.title;
								answerGroupVO.type = setData.type;//设置类型
								answerGroupVO.minSplitH = 100;
								answerGroupVO.solveId = i;
								var div = cGroup(answerGroupVO);
//								console.log(group.id)
								div.addClass('group_'+answerGroupVO.id);
								addGroupToCardId(0,div);//添加到舞台
								CardData.groupData.push(answerGroupVO);//新建组才会放入groupData
								
							}
							//model.reRankGroup();
						}
						else if(group.type == AnswerData.ANSWER_TYPE_CWORD){
							var answerGroupVO = new groupVO();
							answerGroupVO.id = model.createId();
							answerGroupVO.title = setData.title;
							answerGroupVO.type = setData.type;//设置类型
							answerGroupVO.minSplitH = 35;//最小切割高度为格数高度
							answerGroupVO.wordNum = answerGroupVO.restWordNum = setData.wordNum;
							
							var div = cGroup(answerGroupVO);
							div.addClass('group_'+answerGroupVO.id);
							addGroupToCardId(0,div);//添加到舞台
							CardData.groupData.push(answerGroupVO);//新建组才会放入groupData
							//model.reRankGroup();
						}
						else if(group.type == AnswerData.ANSWER_TYPE_EWORD){
							var answerGroupVO = new groupVO();
							answerGroupVO.id = model.createId();
							answerGroupVO.title = setData.title;
							answerGroupVO.type = setData.type;//设置类型
							answerGroupVO.minSplitH = 100;
							answerGroupVO.wordLineNum = setData.wordLineNum;
		
							var div = cGroup(answerGroupVO);
							div.addClass('group_'+answerGroupVO.id);
							addGroupToCardId(0,div);//添加到舞台
							CardData.groupData.push(answerGroupVO);//新建组才会放入groupData
							//model.reRankGroup();
						}
						model.reRankGroup();
						
				}
				//删除组
				model.deleteGroup = function(groupDiv){

					if(groupDiv[0].data.type == AnswerData.ANSWER_TYPE_BLANK_ITEM){
						//填空题组的item
						//删除同时删除当前组的item在父类blankData里面的引用,
						var father = groupDiv[0].data.blankSplitGroupFather;
						var itemData = groupDiv[0].itemData;
						for(var i = 0;i<itemData.length;i++){
							for(var j = 0;j<father[0].data.blankData.length;j++){
								if(itemData[i].id == father[0].data.blankData[j].id){
									father[0].data.blankData.splice(j,1);
								}
							}
						}
						groupDiv[0].data = null;
						groupDiv[0].itemData = null;
						groupDiv.remove();

						if(father[0].data.blankData.length <= 0){
							
							for(var i = 0;i<CardData.groupData.length;i++){
								if(father[0].data.id == CardData.groupData[i].id){
									CardData.groupData.splice(i,1);
									break;
								}
							}
							father[0].data = null;
							father[0].pos = null;
							father.remove();
						}
					}
					else{
						//移除group数据
						var groupId = groupDiv[0].data.id;//组的唯一标识，克隆体带有同样标识
						
						for(var i = 0;i<CardData.groupData.length;i++){
							if(groupId == CardData.groupData[i].id){
								CardData.groupData.splice(i,1);
								break;
							}
						}
						//连带本体和克隆体一起删除
						$('.group').each(function(i,item){
							if(item.data.id == groupId){
								item.data = null;
								item.pos = null;
								$(item).remove();
							}
						})
					}
					
					CardUI.flushAnswerNameList();
					//删除之后重新排裂
					model.reRankGroup();
				}
				//重新排序
				model.reRankGroup = function(){
					var idArr = {};
					
					//刷新排列，重置一切之前要拼合所有数据
					$('.group').each(function(i,div){
						var item = div;
						var itemId = item.data.id;

						if(!idArr[itemId]){
							
							if(item.data.type == AnswerData.ANSWER_TYPE_BLANK){
								CardUI.flushBlankDiv($(item));
							}
							idArr[itemId] = item;
						}
						else{
							//console.log(item)
							if(item.data.type == AnswerData.ANSWER_TYPE_ANSWER){
								idArr[itemId].pos.h += item.pos.h;//还原解答题高度
							}
							else if(item.data.type == AnswerData.ANSWER_TYPE_CWORD){//中文作文
								//CardUI.flushCwordDiv(idArr[itemId]);
							}
							else if(item.data.type == AnswerData.ANSWER_TYPE_EWORD){//英文作文
								idArr[itemId].pos.h += item.pos.h;//还原高度
							}
							else if(item.data.type == AnswerData.ANSWER_TYPE_BLANK){//还原填空选项
								//CardUI.flushBlankDiv($(idArr[itemId]));
							}
							else if(item.data.type == AnswerData.ANSWER_TYPE_BLANK_ITEM){
								idArr[itemId].itemData = idArr[itemId].itemData.concat(item.itemData);
								
								$(idArr[itemId]).find('.group_content').empty();
								
								for(var j = 0;j<idArr[itemId].itemData.length;j++){
									var vo = idArr[itemId].itemData[j];
									var bt = new blankItem(vo.id,vo.lineNum);
									$(idArr[itemId]).find('.group_content').append(bt);
								}
								CardUI.flushBlankItemDiv($(idArr[itemId]));
								$(item).remove();
							}
							item.itemData = null;
							item.data.splitIndex = 0;//重置分割
							item.data = null;
							item.pos = null;
							$(item).remove();
						}
					})
					idArr = null;
					

					

					//检测为空  -按照pageType删除
					var pageNum = parseInt(CardCommand.pageType);
					
					if(CardData.pageView.length <= pageNum){
							var targetPageNum = CardData.pageView.length;

							if(targetPageNum % pageNum != 0){
								var rest =pageNum - (targetPageNum % pageNum);
								while(rest){
									rest--;
									model.createPage();
								}
							}
							for(var i = 0;i<CardData.pageView.length;i++){
								var page = CardData.pageView[i];
								if(pageNum == 1){
									page.setPosType('A4');
								}
								else{
									if(i % pageNum == 0){
										page.showTitle(true);
										page.setPosType('A3-left');
									}
									else{
										page.showTitle(false);
										if(i % pageNum == 2){
											page.setPosType('A3-right');
										}
										else{
											if(pageNum == 3){
												page.setPosType('no')
											}
											else{
												page.setPosType('A3-right');
											}
										}

									}
									
								}
								
								var id = Math.floor(i / pageNum);
								page.setPageCode(id+1);
								page.setLanNum(pageNum);
							} 
					}
					else{
						//清除所有空白页，再补充栏数
						for(var i = 1;i<CardData.pageView.length;i++){
							
								
							var page = CardData.pageView[i];
							if(page.restHeight == page.orgHeight){
								page.remove();
								CardData.pageView.splice(i,1);
							}
						}
							//补充
						if(targetPageNum % pageNum != 0){
							var rest =pageNum - (targetPageNum % pageNum);
							while(rest){
								rest--;
								model.createPage();
							}
						}
						
					
						if(CardCommand.pageType == 1){
							for(var i = 0;i<CardData.pageView.length;i++){
								var page = CardData.pageView[i];
								page.setPosType('A4');//设置页面定位点
								//正反面
								if(i % 2 == 0){//正面
									page.showTitle(true);//全部设置为1栏模式
								}
								else{//背面
									page.showTitle(false);//全部设置为1栏模式
								}
								var id = Math.floor(i / pageNum);
								page.setPageCode(id+1);
								page.setLanNum(pageNum);
							}
						} 
						else{
							
							//3.2栏模式，偶数位，不足补齐
							var targetPageNum = CardData.pageView.length;
							if(targetPageNum % pageNum != 0){
								var rest =pageNum - (targetPageNum % pageNum);
								while(rest){
									rest--;
									model.createPage();
								}
							}
							for(var i = 0;i<CardData.pageView.length;i++){
								var page = CardData.pageView[i];
								if(i % (pageNum*2) == 0){//正面反面
									page.showTitle(true);
								}
								else{
									page.showTitle(false);
								}
								if(i % pageNum == 0){
									page.setPosType('A3-left');
								}
								else{

									if(i % pageNum == 2){
										page.setPosType('A3-right');
									}
									else{
										if(pageNum == 3){
											page.setPosType('no')
										}
										else{
											page.setPosType('A3-right');
										}
									}

								}
								var id = Math.floor(i / pageNum);
								page.setPageCode(id+1);
								page.setLanNum(pageNum);
							}
						}
					}
					for(var i = 0;i<CardData.pageView.length;i++){
						
						CardData.pageView[i].restHeight = CardData.pageView[i].orgHeight;

					}
					
					$('.group').each(function(i,item){
						if(item.data.type == AnswerData.ANSWER_TYPE_ANSWER){
							
						}
						else if(item.data.type == AnswerData.ANSWER_TYPE_BLANK){

						}
						else if(item.data.type == AnswerData.ANSWER_TYPE_CWORD){
							CardUI.flushCwordDiv($(item));
						}
						else if(item.data.type == AnswerData.ANSWER_TYPE_EWORD){

						}
						else if(item.data.type == AnswerData.ANSWER_TYPE_BLANK_ITEM){

						}
						else {
						    CardUI.flushChoiceDiv($(item));
						}
						addGroupToCardId(0,$(item));
					});
					
//					if(CardData.pageView.length > 1){
//						
//						if(CardData.pageView.length % (pageNum*2) == 1){
//							CardData.pageView.pop().remove();
//						}
//					}

				}
				//拖动的设置
				model.setDrag = function(group){
					model.reRankGroup();
//					console.log)
				}
				//追加到组group
				model.addItemToGroup = function (setData,group){
				
					if(group[0].data){

						var totleNum = parseInt(group[0].data.choiceData.length) + parseInt(setData.endId) - parseInt(setData.startId)

						if(totleNum > 100){
							alert('每组最多允许100道题');
							return;
						}
						if(group[0].data.type == AnswerData.ANSWER_TYPE_RADIO || group[0].data.type == AnswerData.ANSWER_TYPE_MULTISELECT || group[0].data.type == AnswerData.ANSWER_TYPE_JUGE){	
							
							for(var i = parseInt(setData.startId);i<=parseInt(setData.endId);i++){
								
								if(setData.isJuge){
									var item = new choiceItem(2,i);
								}
								else{
									var item = new choiceItem(setData.answerNum,i);
								}
								
								group[0].data.choiceData.push(item);
							}
							CardUI.flushChoiceDiv(group);
						}
						else if(group[0].data.type == AnswerData.ANSWER_TYPE_BLANK){
							
							for(var i = parseInt(setData.startId);i<=parseInt(setData.endId);i++){
//								var item = new blankItem(i,parseInt(setData.blankLineNum));
								var vo = new blankVO(i,parseInt(setData.blankLineNum));
								group[0].data.blankData.push(vo);
									
							}
							CardUI.flushBlankDiv(group);
						}
						else if(group[0].data.type == AnswerData.ANSWER_TYPE_BLANK_ITEM){
							var father = group[0].data.blankSplitGroupFather;//设置公用引用
							
							var bgroupVO = new groupVO();
							bgroupVO.type = AnswerData.ANSWER_TYPE_BLANK_ITEM;//填空题公用 groupVO,这里创建的group不会记录groupData，被引用于其父类的groupVO里面
							bgroupVO.minSplitH = 50;
							bgroupVO.id = model.createId();
							bgroupVO.blankSplitGroupFather = father;
							var bGroup = new blankGroup(null,bgroupVO);
							
							for(var i = parseInt(setData.startId);i<=parseInt(setData.endId);i++){

								var vo = new blankVO(i,parseInt(setData.blankLineNum));
								father[0].data.blankData.push(vo);
								bGroup[0].itemData.push(vo);
								var item = new blankItem(i,parseInt(setData.blankLineNum));
								bGroup.find('.group_content').append(item);
							}
							CardUI.flushBlankItemDiv(bGroup,true);
							

							$('.blankGroup').each(function(i,item){
								
								if(item.data.blankSplitGroupFather[0].data.id == father[0].data.id){

									$(item).after(bGroup);
								}
							})
						}
					}
					//新增之后重新排裂
					model.reRankGroup();
				} 
				//拆分填空题
				model.splitBlankGroup = function(group){
					if(group[0].data.type == AnswerData.ANSWER_TYPE_BLANK){
						group[0].data.minSplitH = 0;
//						group[0].blankAnswerIndex = null''
						group.addClass('splitGroup');
						group.find('.group_content').remove();
						group.find('.dragBtn').remove();
//						for(var i = 0;i<group[0].data.blankData.length;i++){
						for(var i = group[0].data.blankData.length - 1;i>=0;i--){
							
							
							var vo = group[0].data.blankData[i];
							var item = new blankItem(vo.id,vo.lineNum);
							
							var bgroupVO = new groupVO();
							bgroupVO.type = AnswerData.ANSWER_TYPE_BLANK_ITEM;//填空题公用 groupVO,这里创建的group不会记录groupData，被引用于其父类的groupVO里面
							bgroupVO.minSplitH = 50;
							bgroupVO.id = model.createId();
							bgroupVO.blankSplitGroupFather = group;
							
							var bGroup = new blankGroup(item,bgroupVO);
							bGroup[0].itemData.push(vo);
							
							CardUI.flushBlankItemDiv(bGroup);
							group.after(bGroup);
						}
						model.reRankGroup();
						$('.answer_content_item_operaTip').hide();
					}
					else if(group[0].data.type == AnswerData.ANSWER_TYPE_BLANK_ITEM){
						
						var id = group[0].data.id;
						group[0].itemData = group[0].itemData.sort(compare2('id'));
						
						
						var lastBlankGroup;
						for(var i = 0;i<group[0].itemData.length;i++){
							
							var vo = group[0].itemData[i];
							var item = new blankItem(vo.id,vo.lineNum);
							
							var bgroupVO = new groupVO();
							bgroupVO.type = AnswerData.ANSWER_TYPE_BLANK_ITEM;
							bgroupVO.minSplitH = 50;
							bgroupVO.id = model.createId();
							bgroupVO.blankSplitGroupFather = group[0].data.blankSplitGroupFather;
							
							var bGroup = new blankGroup($(item),bgroupVO);
							bGroup[0].itemData.push(vo);
							
							group.after(bGroup);
							lastBlankGroup = bGroup;
							CardUI.flushBlankItemDiv(bGroup);
						}
						
						group[0].data.blankSplitGroupFather = null;
						group[0].data = null;
						group[0].itemData = null;
						group.remove();
						
						
						
					}
				}
				//合并填空题
				model.comBlankGroup = function(bg){
					var nextGp = bg.next();
					if(nextGp && nextGp.hasClass('blankGroup')){						
						
						var item = bg.find('.blankItem');
						for(var i = 0;i<nextGp[0].itemData.length;i++){
							
							var vo = nextGp[0].itemData[i];
							var item = new blankItem(vo.id,vo.lineNum);
							nextGp.find('.group_content').prepend(item);
						}
						for(var i = 0;i<bg[0].itemData.length;i++){
							
							var vo = bg[0].itemData[i];
							var item = new blankItem(vo.id,vo.lineNum);
							
							nextGp.find('.group_content').prepend(item);
							nextGp[0].itemData.push(vo);
						}
						
						
						nextGp.find('.blankItem').css({
							'display':'block',
							'float':'none'
						});
						CardUI.flushBlankItemDiv(nextGp);

						
						//移除上一个
						bg[0].itemData = null;
						bg[0].data.blankSplitGroupFather = null;
						bg[0].data = null;
						bg.remove()
					}
				}
				//检测设置数据的重复性，拼接共有数据
				model.setDataCheckHas = function(groupVO){
					//重复ID表明可拼接 返回对应vo的视图groupDiv
					var groupDiv = null;
					$('.group').each(function(i,item){
						if(item.data.id == groupVO.id){
							groupDiv = item;
							return false;
						}
					})
					return groupDiv;
				}
				//刷新作文数据显示
				model.flushWordPage = function(setData,group){
					if(setData.type == AnswerData.ANSWER_TYPE_CWORD){
						group[0].data.wordNum = setData.wordNum;
						CardUI.flushCwordDiv(group);
						model.reRankGroup();
					}
					else if(setData.type == AnswerData.ANSWER_TYPE_EWORD){
						group[0].data.wordLineNum = setData.wordLineNum;
						CardUI.flushEwordDiv(group);
					}
				}
				//植入XML数据，设置卡片
				model.setData = function(xml){
					console.log(xml);
//					return;
					//清空舞台及数据，复制全局数据
					CardCommand.pageType = xml.getElementsByTagName('TPLInfo')[0].getAttribute('layout');
					CardCommand.testType = xml.getElementsByTagName('TPLInfo')[0].getAttribute('testType');
					CardCommand.codeType = xml.getElementsByTagName('TPLInfo')[0].getAttribute('codeType');
					
					
					
					CardData.groupData = [];
					CardData.pageView = [];
					$('.answer_card_area').empty();
					
					targetId = 0;
					var groupNum = xml.getElementsByTagName('Group').length;
//					console.log(groupNum);
					if(groupNum == 0){//创建空白页
						CardCommand.getInstance().createPage();
					}
					else{
						for(var i = 0;i<groupNum;i++){
							var xmlGroup = xml.getElementsByTagName('Group')[i];
							
							if(targetId <= parseInt(xmlGroup.getAttribute('id'))){
								targetId = parseInt(xmlGroup.getAttribute('id'));
							}
							console.log(targetId);
							if(xmlGroup.getAttribute('type') == AnswerData.ANSWER_TYPE_RADIO || xmlGroup.getAttribute('type') == AnswerData.ANSWER_TYPE_JUGE || xmlGroup.getAttribute('type') == AnswerData.ANSWER_TYPE_MULTISELECT){
								
								//创建groupVO 数据
								
								var gvo = new groupVO();
								gvo.id = parseInt(xmlGroup.getAttribute('id'));
								gvo.title = xmlGroup.getAttribute('title');
								gvo.type = xmlGroup.getAttribute('type');
								gvo.minSplitH = CardUI.GROUP_PADDING_TOP * 2 + 5 * (CardUI.FILL_HEIGHT + CardUI.CHOICE_ITEM_OFFERY);
								
								var div = model.setDataCheckHas(gvo);
								if(div){
									//拼接
									for(var j = 0;j<xmlGroup.getElementsByTagName('Topic').length;j++){
										var xmlChoice = xmlGroup.getElementsByTagName('Topic')[j];
										var answerNum = xmlChoice.getElementsByTagName('Area').length;
										var numberId = xmlChoice.getAttribute('numberId');
										var item = new choiceItem(parseInt(answerNum),parseInt(numberId));
										div.data.choiceData.push(item);
										CardUI.flushChoiceDiv($(div));
									}
								}
								else{
									//创建
									for(var j = 0;j<xmlGroup.getElementsByTagName('Topic').length;j++){
										var xmlChoice = xmlGroup.getElementsByTagName('Topic')[j];
										var answerNum = xmlChoice.getElementsByTagName('Area').length;
										var numberId = xmlChoice.getAttribute('numberId');
										var item = new choiceItem(parseInt(answerNum),parseInt(numberId));
										gvo.choiceData.push(item);
									}
									var div = cGroup(gvo);
									
									addGroupToCardId(0,div);
									CardData.groupData.push(gvo);
								}
								//model.reRankGroup();
								
							}
							else if(xmlGroup.getAttribute('type') == AnswerData.ANSWER_TYPE_BLANK){
		
								if(xmlGroup.getAttribute('split')){//拆分后的填空题父类                                                                                                                                                                                                                        
									var gvo = new groupVO();
									gvo.id = parseInt(xmlGroup.getAttribute('id'));
									gvo.title = xmlGroup.getAttribute('title');
									gvo.type = xmlGroup.getAttribute('type');
										
									var startIndex = xmlGroup.getAttribute('startIndex');
									var endIndex = xmlGroup.getAttribute('endIndex');
									for(var j = 0;j<xmlGroup.getElementsByTagName('Topic').length;j++){
										var xmlBlank = xmlGroup.getElementsByTagName('Topic')[j];
										var numberId = xmlBlank.getAttribute('numberId');
										var lineNum = xmlBlank.getAttribute('lineNum');
										var vo = new blankVO(parseInt(numberId),parseInt(lineNum));
										gvo.blankData.push(vo);
									}
									var div = cGroup(gvo);
									div[0].data.minSplitH = 0;
									div.addClass('splitGroup');
									div.find('.group_content').remove();
									div.find('.dragBtn').remove();
									addGroupToCardId(0,div);//添加的舞台
									//model.reRankGroup();
								}
								else{//没有拆分的填空题
									var gvo = new groupVO();
									gvo.id = parseInt(xmlGroup.getAttribute('id'));
									gvo.title = xmlGroup.getAttribute('title');
									gvo.type = xmlGroup.getAttribute('type');
									gvo.minSplitH = 50;
									var content = xmlGroup.firstChild.nodeValue;//保存的样式数据
									
									var orgDiv = model.setDataCheckHas(gvo);//存在，clone
									
									if(orgDiv){
										
										//拼接
										for(var j = 0;j<xmlGroup.getElementsByTagName('Topic').length;j++){
											var xmlBlank = xmlGroup.getElementsByTagName('Topic')[j];
											var numberId = xmlBlank.getAttribute('numberId');
											var lineNum = xmlBlank.getAttribute('lineNum');
	//										var item = new blankItem(numberId,lineNum);
											var vo = new blankVO(parseInt(numberId),parseInt(lineNum))
											orgDiv.data.blankData.push(vo);
										}
										CardUI.flushBlankDiv($(orgDiv));
									}
									else{
									
										//创建
										for(var j = 0;j<xmlGroup.getElementsByTagName('Topic').length;j++){
											var xmlBlank = xmlGroup.getElementsByTagName('Topic')[j];
											var numberId = xmlBlank.getAttribute('numberId');
											var lineNum = xmlBlank.getAttribute('lineNum');
	//										var item = new blankItem(numberId,lineNum);
											var vo = new blankVO(parseInt(numberId),parseInt(lineNum));
											gvo.blankData.push(vo);
										}
										var div = cGroup(gvo);
										//console.log(div[0]);
										addGroupToCardId(0,div);//添加的舞台

									}
									//model.reRankGroup();
									
									//刷新页面后填充数据
//									if(getDivClone(gvo.id) && orgDiv){//分页恢复
//										console.log(getDivClone(gvo.id));
//										$(orgDiv).find('.group_content').html(orgDiv.saveContent)
//										getDivClone(gvo.id).find('.group_content').html(content);
//									}
								}
								
							}
							else if(xmlGroup.getAttribute('type') == AnswerData.ANSWER_TYPE_BLANK_ITEM){
								var belongId = xmlGroup.getAttribute('belongId');
								var father;
								$('.group').each(function(i,item){
									if(item.data.id == belongId){
										father = $(item);
									}
								})

								var bgroupVO = new groupVO();
								bgroupVO.type = AnswerData.ANSWER_TYPE_BLANK_ITEM;//填空题公用 groupVO,这里创建的group不会记录groupData，被引用于其父类的groupVO里面
								bgroupVO.minSplitH = 50;
								bgroupVO.id = parseInt(xmlGroup.getAttribute('id'));
								bgroupVO.blankSplitGroupFather = father;
								var bGroup = new blankGroup(null,bgroupVO);
								var content = xmlGroup.firstChild.nodeValue;//保存的样式数据
								
								for(var j = 0;j<xmlGroup.getElementsByTagName('Topic').length;j++){
													
									var xmlBlank = xmlGroup.getElementsByTagName('Topic')[j];
									var numberId = xmlBlank.getAttribute('numberId');
									var lineNum = xmlBlank.getAttribute('lineNum');
									var vo = new blankVO(parseInt(numberId),parseInt(lineNum));
									var item = new blankItem(vo.numberId,vo.lineNum);
									
									bGroup[0].itemData.push(vo);
									bGroup.find('.group_content').append(item);
								}
								CardUI.flushBlankItemDiv(bGroup);
								
								bGroup.find('.group_content').html(content);
//								father.after(bGroup);
								addGroupToCardId(0,bGroup)
								$('.blankGroup').each(function(i,item){
									if(item.data.blankSplitGroupFather == father){
										$(item).after(bGroup);
									}
								})
								//model.reRankGroup();
							}
							else if(xmlGroup.getAttribute('type') == AnswerData.ANSWER_TYPE_ANSWER){
								
								var gvo = new groupVO();
								gvo.id = parseInt(xmlGroup.getAttribute('id'));
								gvo.title = xmlGroup.getAttribute('title');
								gvo.type = xmlGroup.getAttribute('type');
								gvo.minSplitH = 100;								
								
								var content = xmlGroup.firstChild.nodeValue;//保存的样式数据
								var contentH = xmlGroup.getAttribute('height');
								var div = cGroup(gvo);
								div[0].pos.h = parseInt(contentH) + CardUI.GROUP_TITLE_H ;
								div.find('.group_content').html(content);
								
								
								var orgDiv = model.setDataCheckHas(gvo);//存在，clone
								if(orgDiv){
									orgDiv.pos.h += parseInt(contentH);//还原高度
									div.remove();
								}
								else{
									CardData.groupData.push(gvo);
									addGroupToCardId(0,div);//添加的舞台
								}
								//model.reRankGroup();
								//刷新页面后出现的cloneDIV，赋值
								//if(getDivClone(gvo.id) && orgDiv){
									//getDivClone(gvo.id).find('.group_content').html(content);
								//}
								//model.reRankGroup();
							}
						}
					}
					model.reRankGroup();
					//注意事项样式
					var noticeContent = xml.getElementsByTagName('Notice')[0].firstChild.nodeValue;
					$('.tipBox').html(noticeContent);
					//名称
					var examName = xml.getElementsByTagName('TPLInfo')[0].getAttribute('name');
					$('.examName').val(examName);
					//答题列表
					CardUI.flushAnswerNameList();
				}
				return model;
			};
			CardCommand.instance = null;
			CardCommand.getInstance = function(){
				if(!this.instance){
					this.instance = new CardCommand();
				}
				return this.instance;
			}
			//拆分的填空题组
			function blankGroup (blankItem,vo){
				var div = $("<div style='position:relative;width:100%' class='group blankGroup'><p contenteditable='false' style='margin:0;font-weight:bold;height:20px;line-height:20px;padding:0 0 0 10px;'>"+vo.title+"</p>"
				+"<div contenteditable='false' style='border: 1px solid #000;box-sizing:border-box;position:relative;height:60px;overflow:hidden;'  class='group_content'></div>"
				+"<div class='comBtn' style='height:4px;width:20;background:#dadada;'></div>"
				+"</div>");
				
				if(!vo.title){
					div.find('p').remove();
				}
				div.find(".group_content").append(blankItem);
				div[0].itemData = [];//对于blankItem的引用
				div[0].data = vo;
				div[0].pos = {_h:0,
					set h(value){
						this._h = value;
						div.find(".group_content").css('height',(this._h - 20)+'px');
					},
					get h(){
						return this._h;
					}
				}
				return div;
			}
			
			cGroup.cloneGroup = function(group){
				var cloneDiv = group.clone();
				
				var cloneClassId = 'groupClone_' + String(group[0].data.id);
				cloneDiv.addClass(cloneClassId);
				
				cloneDiv[0].data = group[0].data;//这里产生了多重引用，之后要注意删除
				cloneDiv[0].pos = {_h:0,
					set h(value){
						this._h = value;
						cloneDiv.find(".group_content").css('height',(this._h - 20)+'px');
					},
					get h(){
						return this._h + 20;
					}
				}
				return cloneDiv;
			}
			function cGroup(vo){
				
				var div = $("<div style='position:relative;width:100%' class='group'><p contenteditable='false' style='text-align:left;margin:0;font-weight:bold;height:20px;line-height:20px;padding:0 0 0 10px;'>"+vo.title+"</p>"
				+"<div style='border: 1px solid #000;box-sizing:border-box;position:relative;height:200px;overflow:hidden' class='group_content'></div>"
				+"<div class='dragBtn' style='height:10px;width:20px;background:#999999;position:absolute;bottom:0;right:0'></div>"
				+"</div>");
				
				div[0].blankItemIndex = [0,1];//填空题对应的题数
				div[0].data = vo;
				div[0].pos = {
					_h:0,
					set h(value){
						this._h = value;
						div.find(".group_content").css('height',(this._h - 20)+'px');
					},
					get h(){
						return this._h;
//						return div.find(".group_content").height() + 20;
					}
				}
				div.find('.dragBtn').hide();

				div[0].pos.h = CardUI.FILL_HEIGHT * 5 + CardUI.GROUP_PADDING_TOP * 2 + CardUI.GROUP_TITLE_H;
				
				if(vo.type == AnswerData.ANSWER_TYPE_JUGE || vo.type == AnswerData.ANSWER_TYPE_MULTISELECT || vo.type == AnswerData.ANSWER_TYPE_RADIO)
				{
					div.find('.dragBtn').remove();
					CardUI.flushChoiceDiv (div);//设置内部项目
				}
				else if(vo.type == AnswerData.ANSWER_TYPE_ANSWER){
					div.find(".group_content").attr('contenteditable','true');
					var idNumber = $('<p style="float:left">'+vo.solveId+'.</p>');
					div.find(".group_content").append(idNumber);
					div[0].pos.h = 100;
				}
				else if(vo.type == AnswerData.ANSWER_TYPE_BLANK){
					div.find('.dragBtn').remove();
					CardUI.flushBlankDiv (div);	//设置内部项目	
				}
				else if(vo.type == AnswerData.ANSWER_TYPE_CWORD){
					div.find('.dragBtn').remove();
					CardUI.flushCwordDiv (div);
					
				}
				else if(vo.type == AnswerData.ANSWER_TYPE_EWORD){
					div.find('.dragBtn').remove();
					CardUI.flushEwordDiv (div);	//设置内部项目	
				}
				return div;
			}

			var test = 0;
			//添加到card
			function addGroupToCardId(id,div){
				var targetPage = CardData.pageView[id];
				if(targetPage){
					targetPage.addChild(div);
					if(targetPage.restHeight > 0){
						
					}
					else{
						
						//q切换页面
						 if(div[0].data.minSplitH !=0){
						 	var conentH = div[0].pos.h - CardUI.GROUP_TITLE_H;

						 	if(div[0].data.type == AnswerData.ANSWER_TYPE_CWORD){
						 		if(targetPage.restHeight + conentH >  div[0].data.minSplitH && conentH > div[0].data.minSplitH){
						 			
						 			splitDiv(div,targetPage);
						 		}
							 	else{
									addGroupToCardId(id+1,div);
							 	}
						 	}
						 	
						 	else{
						 		//对比最小切割高度
						 		if(targetPage.restHeight + conentH >  div[0].data.minSplitH && conentH > div[0].data.minSplitH){
						 			splitDiv(div,targetPage);
						 		}
							 	else{
									addGroupToCardId(id+1,div);
							 	}
						 	}

						 }
						 else{
							addGroupToCardId(id + 1,div);
						 }
					}
				}
				else{
					CardCommand.getInstance().createPage();
					addGroupToCardId(id,div);
				}
			}
			//获取对应div的clonediv
			function getDivClone(groupId){
				var classId = 'groupClone_' + groupId;
				return $('.'+classId);
			}
			//切割group 按照最小分离点切割
			function splitDiv(group,targetPage){
				if(targetPage.restHeight > 0)return;
				var pageIndex = CardData.pageView.indexOf(targetPage);
				var contentH = group[0].pos.h - CardUI.GROUP_TITLE_H; 
				var offerUp = contentH + targetPage.restHeight;//上半部分的高度

				//按类型切割数据
				if(group[0].data.type == AnswerData.ANSWER_TYPE_BLANK){
					
					if(group[0].idNum){//克隆数组的，题目标识
						var itemH = CardUI.BLANK_H + CardUI.BLANK_OFFERY;
						//这里获取切割位置，需要根据列数与行数的组合获取
						var col = group[0].data.blankData[0].lineNum;//列数
						var rol = (offerUp - offerUp % itemH)/itemH;
						var id = col * rol;
						CardUI.flushBlankDiv(group,[group[0].idNum,group[0].idNum+id - 1]);
						
						var cloneGroup = cGroup.cloneGroup(group);
						cloneGroup[0].idNum = id + group[0].idNum - 1;
						CardUI.flushBlankDiv(cloneGroup,[cloneGroup[0].idNum,group[0].data.blankData.length]);
						addGroupToCardId(pageIndex+1,cloneGroup);
					}
					else{
						var itemH = CardUI.BLANK_H + CardUI.BLANK_OFFERY;
						//这里获取切割位置，需要根据列数与行数的组合获取
						var col = group[0].data.blankData[0].lineNum;//列数
						var rol = (offerUp - offerUp % itemH)/itemH;
						var id = col * rol;
						CardUI.flushBlankDiv(group,[0,id]);
						
						var cloneGroup = cGroup.cloneGroup(group);
						cloneGroup[0].idNum = id;
						CardUI.flushBlankDiv(cloneGroup,[id,group[0].data.blankData.length]);
						addGroupToCardId(pageIndex+1,cloneGroup);
					}
				}
				else if(group[0].data.type == AnswerData.ANSWER_TYPE_BLANK_ITEM){
					
					var itemH = CardUI.BLANK_H + CardUI.BLANK_OFFERY;
					var splitIndex =  Math.floor(offerUp/itemH) - 1//;
		
					var cloneGroup = cGroup.cloneGroup(group);
					cloneGroup.find('.group_content').empty();//这里复制出来的group带有内部的item，对于blankGroup直接删除掉
					group.find('.group_content').empty();
					
					orgGroupItemData = [];
					cloneGroupItemData = [];
					
					group[0].itemData = group[0].itemData.sort(compare('id'));//排序
					
					
					for(var i = 0;i<group[0].itemData.length;i++){
						var vo = group[0].itemData[i];
						var item = new blankItem(vo.id,vo.lineNum);
						if(i > splitIndex){
							cloneGroup.find('.group_content').append(item);
							cloneGroupItemData.push(vo);
						}
						else{
							group.find('.group_content').append(item);
							orgGroupItemData.push(vo);
						}
					}
					
					group[0].itemData = orgGroupItemData;
					cloneGroup[0].itemData = cloneGroupItemData;

					CardUI.flushBlankItemDiv(group);
					CardUI.flushBlankItemDiv(cloneGroup);
					group.after(cloneGroup);
					addGroupToCardId(pageIndex+1,cloneGroup);
				}
				else if(group[0].data.type == AnswerData.ANSWER_TYPE_ANSWER){
					group[0].pos.h = offerUp;
					var cloneGroup = cGroup.cloneGroup(group)//group[0].cloneGroup();
					cloneGroup[0].pos.h = Math.abs(targetPage.restHeight);
					addGroupToCardId(pageIndex+1,cloneGroup);
				}
				else if(group[0].data.type == AnswerData.ANSWER_TYPE_CWORD){
					
					//此处、offerUp有可能大于一页高度，甚至大于多页高度 =======================
							
					group[0].pos.h = offerUp;
					
					//console.log(offerUp);
					
					id++;
					if(id >10){
						return;
					}
					
					var num = parseInt(offerUp/35) - 2;
					var data = {};
					console.log(offerUp)
					data.wordNum = num * 20;
					CardUI.flushCwordDiv(group,data);

					var cloneGroup = cGroup.cloneGroup(group);
					var data2 = {};
					
					//data2.wordNum = group[0].data.wordNum - data.wordNum;
					group[0].data.restWordNum = data2.wordNum = group[0].data.restWordNum - data.wordNum;
					//console.log(group[0].data.restWordNum);
					CardUI.flushCwordDiv(cloneGroup,data2);
					addGroupToCardId(pageIndex+1,cloneGroup);
				}
				else{
					//选择题
					for(var i = 0;i<group[0].data.choiceData.length;i++){
						var item = group[0].data.choiceData[i];
						var targetHeight = item.formTop + group[0].data.minSplitH;
	
						if(item.formTop + group[0].data.minSplitH > offerUp){
	
							group[0].data.splitIndex = i;//分割点
							
							CardUI.flushChoiceDiv(group,'front');//切分当前group
							
							//复制体 添加到新页面上去 ------。。
							var cloneGroup = cGroup.cloneGroup(group)
							CardUI.flushChoiceDiv(cloneGroup,'behind');
							addGroupToCardId(pageIndex+1,cloneGroup);
							break;
						}
					}
				}
				
				
			}
			var id = 0;
			function compare(property){
		         return function(obj1,obj2){
		             var value1 = obj1[property];
		             var value2 = obj2[property];
		             return value1 - value2;     // 升序
		         }
		    }
			function compare2(property){
				 return function(obj1,obj2){
		             var value1 = obj1[property];
		             var value2 = obj2[property];
		             return value2 - value1;     // 降序
		         }
			}
			 



