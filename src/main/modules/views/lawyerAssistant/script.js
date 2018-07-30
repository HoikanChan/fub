var userCenter = (function() {
  var page = 1
  var inquery_validate
  var searchOptions = [
    // { name: '全文检索', value: 'global' },
    // { name: '标题', value: 'title' },
    { name: '被告人', value: 'defendant' },
    { name: '原告人', value: 'appellors' },
    { name: '代理律师', value: 'lawyerName' },
    { name: '律师事务所', value: 'officeName' },
    { name: '法院名称', value: 'court' },
    { name: '法院层级', value: 'courtLevel' },
    // { name: '裁判时间', value: 'judgingtime' },
    // { name: '案由', value: 'route' },
    { name: '裁判人员', value: 'judge' },
    { name: '文书类型', value: 'docType' },
    { name: '审判程序', value: 'trialRound' },
    { name: '法律依据', value: 'legalBases' },
  ]
  var addedOptions = []
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
         //   endDates();
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
  function getMycase() {
    var params = {
      clientId: clientId,
      sidx: 'createTime',
      order: 'desc'
    }

    $('#my-cases .pager').tablePager({
      url: 'order/queryOrderList',
      searchParam: params,
      success: function(result) {
        if (result.code == 0) {
          if (result) {
            var html = template('case-result-templete', result.data)

            $('.my-case-box').html(html)
          }
        }
      }
    })

  }

  function searchHigt(){
    var searhKey = $("#alltext").val();
    var defendant = $("#defendant").val();
    var starttime = $("#starttime").val();
    var endtime = $("#endtime").val();
    var reason = $("#resources").attr("data-id");
    var lawyerName = $("#lawyerName").val();
    var officeName = $("#officeName").val();
    var lawyerName = $("#lawyerName").val();
    var lawyerName = $("#lawyerName").val();
    var lawyerName = $("#lawyerName").val();
    var lawyerName = $("#lawyerName").val();
    var lawyerName = $("#lawyerName").val();
    var lawyerName = $("#lawyerName").val();
    var lawyerName = $("#lawyerName").val();
    var lawyerName = $("#lawyerName").val();
    var params = {
      keywork:searhKey,
      defendant:defendant,
      trialDateBegin:starttime,
      trialDateEnd:endtime,
      reason:reason,
      isGroupCategory:true,
      lawyerName:lawyerName
    }
    $('.result-contents .pager').tablePagerOne({
        
      url: "case/lawyerRecommendCaseList",
      searchParam:params,
      success: function (result) {
         if(result.code == 0){
    
            result.data.host=  api.link+"caseDetail?";
            $(".result-count").text(result.data.totalCount);
            var html = template('lawyer-list-templete', result.data); 
            $(".case-list").html(html);
       //     result.data.hosts=  api.link+"lawyerDetail?name="+codename;
            result.data.hosts=  api.link+"lawyerDetail";
            var html2 = template('lawyer-slider-templete', result.data); 
            $(".sidenav-menu").html(html2);




            if(result.data.totalCount<10){
                $(".page-row").hide()
            }else{
               $(".page-row").show()
            }

          if(result.data.totalCount>10){
              $(".page-row").hide()
          }else{
              $(".page-row").show()
          }
          if(result.data.totalCount==0){
              $("#search-result").html("<P class='noresult'>抱歉，没有该检索内容数据</P>")
          }
         }else{
              toastr.warning("数据请求失败");
         }
        
      }
  })
  }


  $(function() {
    $("#my-assistant").addClass("active");
    $("#starttime").jeDate(start);
    $("#endtime").jeDate(end);
    $('aside .right-icon').click(function(e) {
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
    //lawyer assistant
    $('#lawyer-assistant .options-block-show').click(function() {
      $('#lawyer-assistant .options-block').show()
    })
    $('#lawyer-assistant .options-block-hide').click(function() {
      $('#lawyer-assistant .options-block').hide()
    })
    var addOptionHandeler = function(e) {
      e.stopPropagation()
      var pickedValue = e.target.id ? e.target.id : e.target.parentNode.id
      addedOptions.push(
        searchOptions.filter(function(option) {
          return option.value === pickedValue
        })[0]
      )
      searchOptions = searchOptions.filter(function(option) {
        return option.value !== pickedValue
      })
      // $('#lawyer-assistant .options-block').html(
      //   template('lawyer-assistant-template', {
      //     options: searchOptions,
      //     addedOptions: addedOptions
      //   })
      // )
      $('#lawyer-assistant .aside-btns').html(
        template('lawyer-assistant-template', {
          options: searchOptions
        })
      )
      $('#lawyer-assistant #addedOption').html(
        template('lawyer-added-template', {
          addedOptions: addedOptions
        })
      )
    }
    $('#lawyer-assistant .options-block').on(
      'click',
      '.topick-option',
      function(e) {
        addOptionHandeler(e)
      }
    )

    var subOptionHandeler = function(e) {
      e.stopPropagation()
      console.log(e)
      var pickedValue = e.target.id ? e.target.id : e.target.parentNode.id
      console.log(pickedValue)
      searchOptions.push(
        addedOptions.filter(function(option) {
          return option.value === pickedValue
        })[0]
      )
      addedOptions = addedOptions.filter(function(option) {
        return option.value !== pickedValue
      })       
      // $('#lawyer-assistant .options-block').html(
      //   template('lawyer-assistant-template', {
      //     options: searchOptions,
      //     addedOptions: addedOptions
      //   })
      // )
      $('#lawyer-assistant .resource-options').html(
        template('lawyer-assistant-template', {
          options: searchOptions
        })
      )
      $('#lawyer-assistant #addedOption').html(
        template('lawyer-added-template', {
          addedOptions: addedOptions
        })
      )
    }
    $('#lawyer-assistant .options-block').on('click', '.added-option', function(
      e
    ) {
      subOptionHandeler(e)
    })
    $('#lawyer-assistant .search-page .search-btn').click(function() {
      $('#lawyer-assistant .search-page').removeClass('pageNow')
      $('#lawyer-assistant .result-page').addClass('pageNow')
    })
    $('#lawyer-assistant .result-page .visualization-btn').click(function() {
      $('#lawyer-assistant .result-page').removeClass('pageNow')
      $('#lawyer-assistant .visual-result-page').addClass('pageNow')

      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('route-result'))
      var mylawChart = echarts.init(document.getElementById('law-result'))

      // 指定图表的配置项和数据
      var option = {
        dataset: {
          source: [
            ['score', 'amount', 'product'],
            [89.3, 58212, 'Matcha Latte'],
            [57.1, 78254, 'Milk Tea'],
            [74.4, 41032, 'Cheese Cocoa'],
            [50.1, 12755, 'Cheese Brownie'],
            [89.7, 20145, 'Matcha Cocoa'],
            [68.1, 79146, 'Tea'],
            [19.6, 91852, 'Orange Juice'],
            [10.6, 101852, 'Lemon Juice'],
            [32.7, 20112, 'Walnut Brownie']
          ]
        },
        grid: { containLabel: true },
        xAxis: {},
        yAxis: { type: 'category' },
        series: [
          {
            type: 'bar',
            encode: {
              // Map the "amount" column to X axis.
              x: 'amount',
              // Map the "product" column to Y axis
              y: 'product'
            }
          }
        ]
      }
      var lawOption = {
        backgroundColor: '#2c343c',
        visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
            colorLightness: [0, 1]
          }
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            data: [
              { value: 235, name: '视频广告' },
              { value: 274, name: '联盟广告' },
              { value: 310, name: '邮件营销' },
              { value: 335, name: '直接访问' },
              { value: 400, name: '搜索引擎' }
            ],
            roseType: 'angle',
            label: {
              normal: {
                textStyle: {
                  color: 'rgba(255, 255, 255, 0.3)'
                }
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: 'rgba(255, 255, 255, 0.3)'
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#c23531',
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
      mylawChart.setOption(lawOption)
    })
  })



  return {
    init: function() {
      // $('#lawyer-assistant .options-block').html(
      //   template('lawyer-assistant-template', {
      //     options: searchOptions,
      //     addedOptions: addedOptions
      //   })
      // )


      $('#lawyer-assistant .resource-options').html(
        template('lawyer-assistant-template', {
          options: searchOptions
        })
      )
      $('#lawyer-assistant #addedOption').html(
        template('lawyer-added-template', {
          addedOptions: addedOptions
        })
      )
      $(document).on("click","#searchBtn",function(){
        searchHigt();
      })

      $('#lawyer-assistant .result-page').html(
        template('lawyer-assistant-result-template', {
          count: 301,
          results: [
            {
              title: '张明等于刘燕纯所有权确认纠纷二审民事判决书',
              court: '北京市第三中级人民法院',
              no: '（2018）京03号民终6586号',
              time: '2018-05-31',
              type: '民事 二审 判决',
              content:
                ' 本院认为：张明主张分割其与刘艳春之间的夫妻共同财产，其中其中包括1994年兴建房屋及另行兴建的东厢房三间。关于19'
            },
            {
              title: '张明等于刘燕纯所有权确认纠纷二审民事判决书',
              court: '北京市第三中级人民法院',
              no: '（2018）京03号民终6586号',
              time: '2018-05-31',
              type: '民事 二审 判决',
              content:
                ' 本院认为：张明主张分割其与刘艳春之间的夫妻共同财产，其中其中包括1994年兴建房屋及另行兴建的东厢房三间。关于19'
            },
            {
              title: '张明等于刘燕纯所有权确认纠纷二审民事判决书',
              court: '北京市第三中级人民法院',
              no: '（2018）京03号民终6586号',
              time: '2018-05-31',
              type: '民事 二审 判决',
              content:
                ' 本院认为：张明主张分割其与刘艳春之间的夫妻共同财产，其中其中包括1994年兴建房屋及另行兴建的东厢房三间。关于19'
            }
          ]
        })
      )
    }
  }
})()
userCenter.init()
