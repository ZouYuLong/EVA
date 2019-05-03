				
				
				
				
				$(function(){
					//题目设置数据
					var setAnswerData = new AnswerData();
					initEvent();
					initUI();
					var targetAnswerNum = 1;
					function initEvent(){
						//提交名称
						$(document).on('change','.examName',function(e){
							var targetName = e.target.value || '未命名';
							var jsonData = JSON.stringify({'cardName':targetName});
							$.ajax({
								type : "get",
								url:'/edu/rest/yjcard/checkCardName?cardName='+targetName,
					            success:function(e){
					            	//$('.examName').val('targetName');
					            },
					            error:function(e){
					            	
					            }
							});
						})
						//页脚显示
						$('.pageNumBtn').change(function(e){
							CardCommand.showPageNum = e.target.value;
							if(CardCommand.showPageNum == 1){
								$('.pageNum').show();
							}
							else{
								$('.pageNum').hide();
							}
						})
						//考号板式
						$('.testNumberType').change(function(e){
							CardCommand.codeType = e.target.value;
							if(e.target.value == 1){
								console.log(1);
								$('.ticketNumber').show();
								$('.codeArea').hide();
							}
							else{
								$('.ticketNumber').hide();
								$('.codeArea').show();
							}
						})
						//页面布局
						$('.pageTypeBtn').change(function(e){
//							console.log(e.target.value);
							CardCommand.getInstance().changePageType(e.target.value);
						})
						//缺考标记
						$('.missMarkBtn').change(function(e){
							CardCommand.isMiss = e.target.value;
							
							if(e.target.value == 1){
								console.log()
								$('.missMark').show();
							}
							else{
								$('.missMark').hide();
							}
						})
						//功能按钮
						$('.subItem').on('click',function(e){
							var value = $(e.target).html();
							$('。').removeClass()
							if(value == "保存")
							{
								CardData.setXml();
							}
							else if(value == '预览'){
								$('.review').show();
								$('.answer_card_ui').hide();
								
								if(CardCommand.pageType == 1){
									for(var i = 0;i<CardData.pageView.length;i++){
										var div = CardData.pageView[i].clone();
										div.css({
											'margin':'auto',
											'margin-bottom':'10px',
//											'float':'left',
										})
										$('.review_content').append(div);
									}
								}
								else{
									for(var i = 0;i<CardData.pageView.length;i++){
										var div = CardData.pageView[i].clone();
										div.css({
											'margin':'0',
											'margin-bottom':'10px',
											'float':'left',
										})
										$('.review_content').append(div);
									}
								}
								
							}
						})
						$('.review-close').on('click',function(e){
							$('.review_content').empty();
							$('.review').hide();
							$('.answer_card_ui').show();
						})
						//保存返回
						$('#back').on('click',function(e){
							window.location.href= saveUrl;
						})
						
						
						//选择题
						$('#addRadioBtn').on('click',function(e){
							setAnswerData.type = AnswerData.ANSWER_TYPE_RADIO;
							initSetWindow(setAnswerData.type)
						})
						$('#addJugeBtn').on('click',function(e){
							setAnswerData.type = AnswerData.ANSWER_TYPE_JUGE;
							initSetWindow(setAnswerData.type)
						})
						$('#addMultiselectBtn').on('click',function(e){
							setAnswerData.type = AnswerData.ANSWER_TYPE_MULTISELECT;
							initSetWindow(setAnswerData.type)
						})
						//填空题
						$('#addBlankBtn').on('click',function(e){
							setAnswerData.type = AnswerData.ANSWER_TYPE_BLANK;
							initSetWindow(setAnswerData.type)
						})
						//解答题
						$('#addAnswerBtn').on('click',function(e){
							setAnswerData.type = AnswerData.ANSWER_TYPE_ANSWER;
							initSetWindow(setAnswerData.type);
						})
						//语文作文
						$('#addChineseWord').on('click',function(e){
							setAnswerData.type = AnswerData.ANSWER_TYPE_CWORD;
							initSetWindow(setAnswerData.type);
						})
						//英语作文
						$('#addEnglishWord').on('click',function(e){
							setAnswerData.type = AnswerData.ANSWER_TYPE_EWORD;
							initSetWindow(setAnswerData.type);
						})
						//判断题
						$('input[type=checkbox]').on('change',function(e){
//							if($(e.target).is(':checked')){
								setAnswerData.type = AnswerData.ANSWER_TYPE_JUGE;
								setAnswerWindowJuge($(e.target).is(':checked'))
//							}
						})
						

						var isDargMove = false;
						var targetGroupType = '';
						//group选中
						$(window).on('mousedown',function(e){
							var item = $(e.target);
							
							if(item.hasClass('addItemBtn') || item.hasClass('deleteItemBtn') || item.hasClass('splitItemBtn') || item.hasClass('comBtn'))
							{
								var activeGroup = $('.group_content_active').parent();

								if(item.hasClass('addItemBtn')){		
									$(".setAnswerContent_item[type=题目名称] input").val('添加题目');
									if(targetGroupType){
										initSetWindow(targetGroupType);
									}
//									$('.group_contentt').removeClass('group_contentt_active');
								}
								else if(item.hasClass('deleteItemBtn')){
									set.hide();	
									CardCommand.getInstance().deleteGroup(activeGroup);
								}
								else if(item.hasClass('splitItemBtn')){
									CardCommand.getInstance().splitBlankGroup(activeGroup);
								}
								else if(item.hasClass('comBtn')){//合并同类项-针对blankGroup
									
							
									CardCommand.getInstance().comBlankGroup(item.parent());
								
	
								}
							}
							else if(item.hasClass('dragBtn')){
								//对于区域的拉伸
								var targetY = e.clientY;
								var group = item.parent();
								var orgH = group[0].pos.h;
								$(window).off('mousemove').on('mousemove',function(e){
									var h = e.clientY - targetY;
									group[0].pos.h = orgH + h;
									isDargMove = true;
								})
							}
							else
							{
								if($('#myModal').css('display') == 'none'){
									
									set.hide();	
									$('.group_content').removeClass('group_content_active');
									$('.dragBtn').hide();
								}
							}
							
							if(item.hasClass('group_content')){
								var dataType = item.parent()[0].data.type;
								targetGroupType = dataType;

								if(dataType == AnswerData.ANSWER_TYPE_ANSWER){
									set.find('.addItemBtn').hide();
									set.find('.splitItemBtn').hide();
								}
								else if(dataType == AnswerData.ANSWER_TYPE_BLANK || dataType == AnswerData.ANSWER_TYPE_BLANK_ITEM){
									set.find('.splitItemBtn').css('display','block');
									set.find('.addItemBtn').css('display','block');
								}
		
								else if(dataType == AnswerData.ANSWER_TYPE_MULTISELECT || AnswerData.ANSWER_TYPE_RADIO){
									set.find('.splitItemBtn').hide();
									set.find('.addItemBtn').css('display','block');
								}
								
								//组内部区域容器
								item.addClass('group_content_active');
								item.parent().find('.dragBtn').show();
								item.parent().append(set);
								set.show();	
							}else if( item.parent().hasClass('group_content')){
								//组内部区域容器的子集
								var target = item.parent();
								target.addClass('group_content_active');
								target.parent().find('.dragBtn').show();
								target.parent().append(set);
								set.show();	
							}

						})
						$(window).on('mouseup',function(e){
							//针对拖动的重置
							$(window).off('mousemove');
							if(isDargMove){
								isDargMove = false;
								var activeGroup = $('.group_content_active').parent();
								if(activeGroup[0]){
									CardCommand.getInstance().setDrag(activeGroup);
								}
							}
						})

						//确认设置
						$('#setAnswerBtnSure').on('click',function(){
							
							setAnswerData.title = $(".setAnswerContent_item[type=题目名称] input").val()
							setAnswerData.answerNum = parseInt($(".setAnswerContent_item[type=选项个数] input").val());
							setAnswerData.startId = parseInt($(".setAnswerContent_item[type=题号] input:first-child").val());
							setAnswerData.endId = parseInt($(".setAnswerContent_item[type=题号] input:last-child").val());
							setAnswerData.blankLineNum = parseInt($(".setAnswerContent_item[type=每行题数] input").val());
							
							setAnswerData.wordNum = parseInt($(".setAnswerContent_item[type=作文格数] input").val());
							setAnswerData.wordLineNum = parseInt($(".setAnswerContent_item[type=作文栏数] input").val());
							
	
							var activeGroup =  $('.group_content_active').parent()[0];
							
							if(activeGroup)
							{//有当前选中的，表示在此组追加 
								if(setAnswerData.type == AnswerData.ANSWER_TYPE_CWORD || setAnswerData.type == AnswerData.ANSWER_TYPE_EWORD){

									CardCommand.getInstance().flushWordPage(setAnswerData,$(activeGroup));
									return;
								}
								if(!checkReNumber(activeGroup)){
									
									CardCommand.getInstance().addItemToGroup(setAnswerData,$(activeGroup));
								}
							}
							else{
								
								CardCommand.getInstance().createGroup(setAnswerData);//创建
							}
							CardUI.flushAnswerNameList();//刷新列表显示
						})
					}
					//检测序号重复
					function checkReNumber(activeGroup){
						var targetIds = [];
						var data;
						if(activeGroup.data.type == AnswerData.ANSWER_TYPE_RADIO || activeGroup.data.type == AnswerData.ANSWER_TYPE_MULTISELECT || activeGroup.data.type == AnswerData.ANSWER_TYPE_JUGE){//选择题
							data = activeGroup.data.choiceData;
						}
						else if(activeGroup.data.type == AnswerData.ANSWER_TYPE_BLANK){//填空题
							data = activeGroup.data.blankData;
						}
						else if(activeGroup.data.type == AnswerData.ANSWER_TYPE_BLANK_ITEM){
							data = activeGroup.data.blankSplitGroupFather[0].data.blankData;
						}
					
						for(var i = 0;i<data.length;i++){
							targetIds.push(data[i].numberId);
						}
						for(var i = setAnswerData.startId;i<=setAnswerData.endId;i++){
							if(targetIds.indexOf(i) != -1){
								alert('有重复序号')
								return true;
							}
						}
						
						return false;
					}
					function setAnswerWindowJuge(b){
						setAnswerData.isJuge = b;
						if(b){
							$(".setAnswerContent_item[type=题目名称] input").val('判断题')
							$(".answerNum").val(2);
							$(".answerNum").attr('disabled','false');
							$(".answerNum").css('background','#eeeeee');
							setAnswerData.isJuge = true;
						}
						else{
							$(".setAnswerContent_item[type=题目名称] input").val('单选题')
							$(".answerNum").val(4);
							$(".answerNum").removeAttr('disabled');
							$(".answerNum").css('background','#ffffff');
							setAnswerData.isJuge = false;
						}
					}
					var card;
					var set;
					function initUI(){
//						CardUI.createPage(null)
						CardCommand.getInstance().createPage();
						set = CardUI.toolSet();
					}
					function initSetWindow(type){
						var title;
						
						$(".setAnswerContent_item").hide();
						$(".setAnswerContent_item[type=题目名称]").show();
						
					//	$(".setAnswerContent_item[type=每行题数]").hide();
						$('.setAnswerContent_item_juge').removeClass('disabled');
					//	$(".setAnswerContent_item[type=作文格数]").hide();
					//	$(".setAnswerContent_item[type=作文栏数]").hide();
						setAnswerWindowJuge(false);	
						if(type == AnswerData.ANSWER_TYPE_RADIO){
							title = '单选题';
							$(".setAnswerContent_item[type=选项个数]").show();
							$(".setAnswerContent_item[type=题号]").show();
						//	$(".setAnswerContent_item[type=每行题数]").hide();
							$('.setAnswerContent_item_juge').show();
						}
						else if(type == AnswerData.ANSWER_TYPE_MULTISELECT){
							title = '多选题';
							$(".setAnswerContent_item[type=选项个数]").show();
							$(".setAnswerContent_item[type=题号]").show();
						//	$(".setAnswerContent_item[type=每行题数]").hide();
							$('.setAnswerContent_item_juge').show();
							$('.setAnswerContent_item_juge').addClass('disabled');
						}
						else if(type == AnswerData.ANSWER_TYPE_BLANK){
							title = '填空题';
							$(".setAnswerContent_item[type=每行题数]").show();
							$(".setAnswerContent_item[type=题号]").show();
						//	$(".setAnswerContent_item[type=选项个数]").hide();
							$('.setAnswerContent_item_juge').hide();
						}
						else if(type == AnswerData.ANSWER_TYPE_ANSWER){
							title = '简答题';
							$(".setAnswerContent_item[type=题号]").show();
						//	$(".setAnswerContent_item[type=选项个数]").hide();
						//	$(".setAnswerContent_item[type=每行题数]").hide();
						}
						else if(type == AnswerData.ANSWER_TYPE_JUGE){
							$(".setAnswerContent_item[type=题号]").show();
							setAnswerWindowJuge(true);
						}
						else if(type == AnswerData.ANSWER_TYPE_CWORD){
							title = '语文作文'
							$(".setAnswerContent_item[type=作文格数]").show();
						}
						else if(type == AnswerData.ANSWER_TYPE_EWORD){
							title = '英文作文'
							$(".setAnswerContent_item[type=作文栏数]").show();
						}

						$('input[type=checkbox]').removeAttr('checked')
						$(".setAnswerContent_item[type=题目名称] input").val(title);
						$(".setAnswerContent_item[type=题号] input:first-child").val(1);
						$(".setAnswerContent_item[type=题号] input:last-child").val(5);
					}
				})
				
				//数据类型：选择题，填空题
				function AnswerData(){
					this.title = '';
					this.type = 1;
					this.startId = 1;
					this.endId = 2;
					this.answerNum = 4;//选择题答案个数
					this.blankLineNum = 1;//填空题每行个数
					this.wordNum = 0;//作文
					this.wordLineNum = 0;//作文栏数
				}
				AnswerData.ANSWER_TYPE_RADIO = 1;
				AnswerData.ANSWER_TYPE_MULTISELECT = 2;
				AnswerData.ANSWER_TYPE_JUGE= 4;
				AnswerData.ANSWER_TYPE_BLANK = 3;
				AnswerData.ANSWER_TYPE_ANSWER = 5;
				AnswerData.ANSWER_TYPE_CWORD = 6; 
				AnswerData.ANSWER_TYPE_EWORD = 7;
				
				
				
				
				
				AnswerData.ANSWER_TYPE_BLANK_ITEM = 10;//拆分的填空题
				
				//当前页面高度区域记录
				function cardPosData(){
					this.targetHeightPointer = 0;//当前的Y坐标指针
				}
