;var userCenter = function () {
    var page = 1;
    var inquery_validate;
    var clientId =  sessionStorage.getItem("clientid")
      var phone = window.sessionStorage.getItem("mobile");

      $({mobile:phone})._Ajax({
          url:"client/queryByMobile",
          success:function(result){
             if(result.code == 0){
              
              sessionStorage.setItem("clientid",result.client.clientId)
             }else{
               

             }
            
          }
      })

/* 我的案件 */
      //我的案件数据请求
      function getMycase(){
     
        var params = {
          clientId:clientId,
          sidx : "createTime",
          order : "desc"
        }
        $('.my-cases-content .pager').tablePager({
          url: "order/queryOrderList",
          searchParam:params,
          success: function (result) {
             if(result.code == 0){
                var html = template('my-cases-template', result.data); 
                $(".my-cases-box").html(html);
            
              if(result.data.totalCount<10){
                  $(".page-row").hide()
              }else{
                  $(".page-row").show()
              }
              if(result.data.totalCount==0){
                  $(".my-cases-box").html("<P class='noresult'>抱歉，没有该检索内容数据</P>")
              }
             }else{
                  toastr.warning("数据请求失败");
             }
            $(".searchbar .totalNum").text(result.data.totalCount);
          }
      })
      }

      function seachMycase(){
       
        var starttime = $("#start-date").val();
        var endtime = $("#end-date").val();
        var params = {
          clientId:clientId,
          beginDate:starttime,
          endDate:endtime,
          sidx : "createTime",
          order : "desc"
        }
        $('.my-cases-content .pager').tablePager({
          url: "order/queryOrderList",
          searchParam:params,
          success: function (result) {
             if(result.code == 0){
                var html = template('my-cases-template', result.data); 
                $(".my-cases-box").html(html);
            
              if(result.data.totalCount<10){
                  $(".page-row").hide()
              }else{
                  $(".page-row").show()
              }
              if(result.data.totalCount==0){
                  $(".my-cases-box").html("<P class='noresult'>抱歉，没有该检索内容数据</P>")
              }
             }else{
                  toastr.warning("数据请求失败");
             }
            
          }
      })
      }

  //我的案件选中计价
  var selectNum = 0;
function selectFeatureByFid(obj) {

	var dataid = $(obj).attr("dataid");
	if($(obj).prop("checked") == true){
		$(obj).addClass("active");
		$(obj).parents("tr").addClass("active-blue").siblings("tr").removeClass("active-blue");
		blueLightId = $(obj).parents("tr").attr("id");
    showNowSelectNum(obj);
   

}
}
//显示当前总数和选中的数量
function showNowSelectNum() {

  var dataIdsSelectArray = new Array();
  var dataIdsArray = new Array();

      /*$("#tbodyInit input[type='checkbox']").each(function() {*/
    $(".my-cases-box table tr td input[type='checkbox']").each(function() {
          if ($(this).prop("checked") == true) {
              dataIdsSelectArray.push($(this).attr("dataid"));
              dataIdsArray.push($(this).attr("dataid"));
          }
      });
  //}
  //去掉数组中重复的id
  dataIdsArray = unique(dataIdsArray);
  dataIdsSelectArray = unique(dataIdsSelectArray);
  var dataIds = "";
  for (var i = 0; i < dataIdsArray.length; i++) {
      dataIds += dataIdsArray[i] + ",";
  }
 
  //判断端是否含有dataIds
  if (stringIsNull(dataIds)) {
      $(".loan-items-counts").html(dataIdsSelectArray.length);
  } else {
      dataIds = dataIds.substring(0, dataIds.length - 1);
     
      $(".loan-items-counts").html(dataIdsSelectArray.length);
  }

}


  $(function() {
    var start = {
      isinitVal: true,
      initDate:[{DD:"-7"},true],
      format: "YYYY-MM-DD",
      maxDate: $.nowDate({DD:0}), //最大日期
      zIndex: 99999,
      isClear:false,
      isok:false,
      okfun: function (elem, date) {
              end.minDate = elem.val.replace(/\//g,"-"); //开始日选好后，重置结束日的最小日期
        //     endDates();
      },
  };
  var end = {
      isinitVal: true,
      isok: false,
      isClear:false,
      zIndex: 99999,
      maxDate: $.nowDate({DD:0}), //最大日期
      format: "YYYY-MM-DD",
      okfun: function (elem, date) {
              start.maxDate = elem.val.replace(/\//g,"-"); //将结束日的初始值设定为开始日的最大日期
      }
  };

  getMycase();
 

     //时间选择 
    $("#start-date").jeDate(start);
    $("#end-date").jeDate(end);
    $("#start-date-loan").jeDate(start);
    $("#end-date-loan").jeDate(end);
    //$('#calendar').fullCalendar({})
    $('.fc-widget-header .fc-sun span').html('星期天')
    $('.fc-widget-header .fc-mon span').html('星期一')
    $('.fc-widget-header .fc-tue span').html('星期二')
    $('.fc-widget-header .fc-wed span').html('星期三')
    $('.fc-widget-header .fc-thu span').html('星期四')
    $('.fc-widget-header .fc-fri span').html('星期五')
    $('.fc-widget-header .fc-sat span').html('星期六')
    $('.right-icon').click(function(e) {
      e.stopPropagation()
      if (e.target.classList.contains('fa-chevron-down')) {
        $(e.target)
          .siblings('div.dropdown-menu')
          .show()
        $(e.target)
          .addClass('fa-chevron-up')
          .removeClass('fa-chevron-down')
      } else if (e.target.classList.contains('fa-chevron-up')) {
        $(e.target)
          .siblings('div.dropdown-menu')
          .hide()
        $(e.target)
          .removeClass('fa-chevron-up')
          .addClass('fa-chevron-down')
      }

    })
    $('.nav-link').click(function(e) {
      $('.nav-link').removeClass('active')
      $(e.target).addClass('active')
      var title = e.target.text
      $('.page-title').html(title)
      $('.page').removeClass('pageNow')
      // if(e.target.id ==='')
      $('#' + e.target.id + '.page').addClass('pageNow')
      return false
    })
  })

  return {
    init: function() {

      $(".my-cases-content .primary-btn").on("click",function(){
        seachMycase();
      })

      //  satelliteApplication();
      $('.user-info').html(
        template('userinfo-template', {
          user: {
            name: '13264444444',
            user: 'user',
            created: '2015-06-05 15:33:30'
          }
        })
      )
      $('.applications').html(
        template('application-template', {
          application: {
            project: '法务贷/案件委托',
            laywer: '张三',
            contact: '15622542221',
            bill: '贷款费用/律师费',
            time: '2015-06-05 15:33:30',
            office: '广东东莞A律师事务所',
            decription:
              '法务贷：XX时间申请法务贷款XX金额，还歀期XXX，本息总计XXX；案件委托：律师的案件描述'
          }
        })
      )
      // $('.reports-content').html(
      //   template('report-template', {
      //     reports: {
      //       count: 21,
      //       cases: [
      //         {
      //           title: '志明等与春娇所有权确认纠纷二审民事判决书',

      //           content:
      //             'Designed as Ant Design，提炼和服务企业级中后台产品的交互语言和视觉风格。React Component ',
      //           created: '2015-06-05 15:33:30'
      //         },
      //         {
      //           title: '志明等与春娇所有权确认纠纷二审民事判决书',

      //           content:
      //             'Designed as Ant Design，提炼和服务企业级中后台产品的交互语言和视觉风格。React Component ',
      //           created: '2015-06-05 15:33:30'
      //         },
      //         {
      //           title: '志明等与春娇所有权确认纠纷二审民事判决书',

      //           content:
      //             'Designed as Ant Design，提炼和服务企业级中后台产品的交互语言和视觉风格。React Component ',
      //           created: '2015-06-05 15:33:30'
      //         },
      //         {
      //           title: '志明等与春娇所有权确认纠纷二审民事判决书',

      //           content:
      //             'Designed as Ant Design，提炼和服务企业级中后台产品的交互语言和视觉风格。React Component ',
      //           created: '2015-06-05 15:33:30'
      //         },
      //         {
      //           title: '志明等与春娇所有权确认纠纷二审民事判决书',

      //           content:
      //             'Designed as Ant Design，提炼和服务企业级中后台产品的交互语言和视觉风格。React Component ',
      //           created: '2015-06-05 15:33:30'
      //         },
      //         {
      //           title: '志明等与春娇所有权确认纠纷二审民事判决书',

      //           content:
      //             'Designed as Ant Design，提炼和服务企业级中后台产品的交互语言和视觉风格。React Component ',
      //           created: '2015-06-05 15:33:30'
      //         }
      //       ]
      //     }
      //   })
      // )
      // $('.reports-content').html(
      //   template('report-template', {
      //     // // reports: {
      //     // //   count: 21,
      //     // //   cases: [
      //     // //     {
      //     // //       title: '志明等与春娇所有权确认纠纷二审民事判决书',

      //     // //       content:
      //     // //         'Designed as Ant Design，提炼和服务企业级中后台产品的交互语言和视觉风格。React Component ',
      //     // //       created: '2015-06-05 15:33:30'
      //     // //     },
      //     // //     {
      //     // //       title: '志明等与春娇所有权确认纠纷二审民事判决书',

      //     // //       content:
      //     // //         'Designed as Ant Design，提炼和服务企业级中后台产品的交互语言和视觉风格。React Component ',
      //     // //       created: '2015-06-05 15:33:30'
      //     // //     },
      //     // //     {
      //     // //       title: '志明等与春娇所有权确认纠纷二审民事判决书',

      //     // //       content:
      //     // //         'Designed as Ant Design，提炼和服务企业级中后台产品的交互语言和视觉风格。React Component ',
      //     // //       created: '2015-06-05 15:33:30'
      //     // //     },
      //     // //     {
      //     // //       title: '志明等与春娇所有权确认纠纷二审民事判决书',

      //     // //       content:
      //     // //         'Designed as Ant Design，提炼和服务企业级中后台产品的交互语言和视觉风格。React Component ',
      //     // //       created: '2015-06-05 15:33:30'
      //     // //     },
      //     // //     {
      //     // //       title: '志明等与春娇所有权确认纠纷二审民事判决书',

      //     // //       content:
      //     // //         'Designed as Ant Design，提炼和服务企业级中后台产品的交互语言和视觉风格。React Component ',
      //     // //       created: '2015-06-05 15:33:30'
      //     // //     },
      //     // //     {
      //     // //       title: '志明等与春娇所有权确认纠纷二审民事判决书',

      //     // //       content:
      //     // //         'Designed as Ant Design，提炼和服务企业级中后台产品的交互语言和视觉风格。React Component ',
      //     // //       created: '2015-06-05 15:33:30'
      //     // //     }
      //     // //   ]
      //     // }
      //   })
      // )

      $('.my-loan-box').html(
        template('lawyer-loan-template', {
          loans: {},
          bills: [
            {
              no: '1123234256532',
              amount: '250.00',
              lawyer: '仗义飞',
              phone: '12345671223',
              state: '平台审批中',
              time: '2015-06-05 15:33:30'
            },
            {
              no: '1123234256532',
              amount: '250.00',
              lawyer: '仗义飞',
              phone: '12345671223',
              state: '平台审批中',
              time: '2015-06-05 15:33:30'
            },
            {
              no: '1123234256532',
              amount: '250.00',
              lawyer: '仗义飞',
              phone: '12345671223',
              state: '平台审批中',
              time: '2015-06-05 15:33:30'
            }
          ]
        })
      )
   
      $('.my-bills-content').html(
        template('my-bills-template', {
          loans: {},
          bills: [
            {
              no: '1123234256532',
              name: '某某某抢劫案',
              loan: '250.00',
              servicefee: '350.00',
              state: '平台审批中',
              time: '2015-06-05 15:33:30'
            },
            {
              no: '1123234256532',
              name: '某某某抢劫案',
              loan: '250.00',
              servicefee: '350.00',
              state: '平台审批中',
              time: '2015-06-05 15:33:30'
            },
            {
              no: '1123234256532',
              name: '某某某抢劫案',
              loan: '250.00',
              servicefee: '350.00',
              state: '平台审批中',
              time: '2015-06-05 15:33:30'
            }
          ]
        })
      )
      $('.system-messages').html(
        template('system-messages-template', {
          loans: {},
          messages: [
            {
              name:
                '某某某抢劫案某某某抢劫案某某某抢劫案某某某抢劫案某某某抢劫案',
              time: '2015-06-05 15:33:30'
            },
            {
              name: '某某某抢劫案',
              time: '2015-06-05 15:33:30'
            },
            {
              name: '某某某抢劫案',
              time: '2015-06-05 15:33:30'
            },
            {
              name: '某某某抢劫案',
              time: '2015-06-05 15:33:30'
            },
            {
              name: '某某某抢劫案',
              time: '2015-06-05 15:33:30'
            },
            {
              name: '某某某抢劫案',
              time: '2015-06-05 15:33:30'
            }
          ],
          readedMessages: [
            {
              name: '某某某抢劫案某',
              time: '2015-06-05 15:33:30'
            }
          ]
        })
      )
      $('.personal-messages').html(
        template('personal-messages-template', {
          loans: {},
          messages: [
            {
              name:
                '某某某抢劫案某某某抢劫案某某某抢劫案某某某抢劫案某某某抢劫案',
              time: '2015-06-05 15:33:30'
            },
            {
              name: '某某某抢劫案',
              time: '2015-06-05 15:33:30'
            },
            {
              name: '某某某抢劫案',
              time: '2015-06-05 15:33:30'
            },
            {
              name: '某某某抢劫案',
              time: '2015-06-05 15:33:30'
            },
            {
              name: '某某某抢劫案',
              time: '2015-06-05 15:33:30'
            },
            {
              name: '某某某抢劫案',
              time: '2015-06-05 15:33:30'
            }
          ],
          readedMessages: [
            {
              name: '某某某抢劫案某',
              time: '2015-06-05 15:33:30'
            },
            {
              name: '某某某抢劫案',
              time: '2015-06-05 15:33:30'
            },
            {
              name: '某某某抢劫案',
              time: '2015-06-05 15:33:30'
            }
          ]
        })
      )
      $('.contacts').html(
        template('contacts-template', {
          loans: {},
          messages: [
            {
              name: '张三律师',
              time: '2015-06-05 15:33:30'
            },
            {
              name: '李四律师',
              time: '2015-06-05 15:33:30'
            },
            {
              name: '李四律师',
              time: '2015-06-05 15:33:30'
            },
            {
              name: '李四律师',
              time: '2015-06-05 15:33:30'
            },
            {
              name: '李四律师',
              time: '2015-06-05 15:33:30'
            },
            {
              name: '李四律师',
              time: '2015-06-05 15:33:30'
            }
          ],
          readedMessages: [
            {
              name: '某某某抢劫案某',
              time: '2015-06-05 15:33:30'
            },
            {
              name: '某某某抢劫案',
              time: '2015-06-05 15:33:30'
            },
            {
              name: '某某某抢劫案',
              time: '2015-06-05 15:33:30'
            }
          ]
        })
      )
    }
  }
}();
userCenter.init();
