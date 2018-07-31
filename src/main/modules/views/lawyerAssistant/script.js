var userCenter = (function() {
  var page = 1
  var inquery_validate;
  var lawyerName,trialRound,judge,trialYear,court,legalBases,appellors,courtLevel,docType,officeName,area
  

  var searchOptions = [
   
    { name: '被告人', value: 'defendant' },
    { name: '代理律师', value: 'lawyerName' },
    { name: '律师事务所', value: 'officeName' },
    { name: '法院名称', value: 'court' },
    { name: '地区', value: 'courtCityId' },
    { name: '所属年份', value: 'trialYear' },
    { name: '法院层级', value: 'courtLevel' },
    { name: '裁判人员', value: 'judge' },
    { name: '文书类型', value: 'docType' },
    { name: '审判程序', value: 'trialRound' },
    { name: '法律依据', value: 'legalBases' }

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

$({})._Ajax({
  url: "casetype/apiTree",
  success: function (result) {
          if (result.code==0) {
              var html = template("search-reason-templete",result)
              $("#navbar-menu").html(html);
          }
      }
});

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
    $(".page-result .sidenav-menu").html("");
    $(".page-result .case-list").html("");
    var searhKey = $("#alltext").val();
    var defendant = $("#defendant").val();
    var starttime = $("#starttime").val();
    var endtime = $("#endtime").val();
    var reason = $("#reasonslect .reaseontext").text();
    lawyerName = $("#lawyerName1").val()?$("#lawyerName1").val():"";
    trialRound = $("#trialRound1").val()?$("#trialRound1").val():"";
    judge = $("#judge1").val()?$("#judge1").val():"";
    trialYear = $("#trialYear1").find("option:selected").val()?$("#trialYear1").find("option:selected").val():"";
    court = $("#court1").val()?$("#court1").val():"";
    legalBases = $("#legalBases1").val()?$("#legalBases1").val():"";
    appellors = $("#appellors1").val()?$("#appellors1").val():"";
    courtLevel = $("#courtLevel1").find("option:selected").val()?$("#courtLevel1").find("option:selected").val():"";
    docType = $("#docType1").find("option:selected").val()?$("#docType1").find("option:selected").val():"";
    officeName = $("#officeName1").val()?$("#officeName1").val():"";
    area = $("#area-select").attr("data-id")?$("#area-select").attr("data-id"):"";
   if(reason == "全部"){
    reason = "";
   }
    var params = {
      keywork : searhKey,
      defendant : defendant,
      trialDateBegin : starttime,
      trialDateEnd : endtime,
      reason : reason,
      isGroupCategory : true,
      lawyerName : lawyerName,
      courtCityId : area,
      trialRound : trialRound,
      trialYear : trialYear,
      appellors : appellors,
      officeName : officeName,
      court : court,
      courtLevel : courtLevel,
      judge : judge,
      docType : docType,
      legalBases : legalBases,

    }
    $('.result-contents .pager').tablePager({
        
      url: "case/lawyerRecommendCaseList",
      searchParam:params,
      success: function (result) {
         if(result.code == 0){
           $(".page-result").show();
           $(".options-block-hide").trigger("click");
            result.data.host=  api.host+"caseDetail?";
            $(".result-count").text(result.data.totalCount);
            var html = template('lawyer-list-templete', result.data); 
            $(".case-list").html(html);
       //     result.data.hosts=  api.link+"lawyerDetail?name="+codename;
            result.data.hosts=  api.host+"lawyerDetail";
            var html2 = template('lawyer-slider-templete', result.data); 
            $(".sidenav-menu").html(html2);




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
    init_city_select($("#area-select"));
    $('[data-sidenav]').sidenav(); 

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
      searchOptions = searchOptions.filter(function(option){
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
      // $('#lawyer-assistant .search-page').removeClass('pageNow')
      // $('#lawyer-assistant .result-page').addClass('pageNow')
      var keywords = $("#top-keyword").val();
   
     
      var params = {
          offset:0,
          keyword : keywords,
          isGroupCategory : true,
      }
      $('.page-result .pager').tablePager({
      
          url: "case/lawyerRecommendCaseList",
          searchParam:params,
          success: function (result) {
             if(result.code == 0){
              $(".page-result").show();
              $(".options-block-hide").trigger("click");
              result.data.host=  api.host+"caseDetail?";          
              $(".result-count").text(result.data.totalCount);
              var html = template('lawyer-list-templete', result.data); 
              $(".case-list").html(html);
  
              result.data.hosts=  api.host+"lawyerDetail";
              var html2 = template('lawyer-slider-templete', result.data); 
              $(".sidenav-menu").html(html2);
  
              if(result.data.totalCount>10){
                  $(".page-row").show()
              }else{
                  $(".page-row").show()
              }
  
             }else{
                  toastr.warning(result.msg);
             }
            
          }
      })

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
        $(".options-block-hide").trigger("click");
        searchHigt();
      })

      
    $(document).on("click",".slider-result",function(){
      $(".options-block-hide").trigger("click");
      var sonid =  $(this).attr("data-id");
      console.log(sonid)
      var params = {
       caseQueryLogId:sonid,
       isGroupCategory:true,
       offset:0
   }
      $('.case-list-page .pager').tablePager({
       url: "case/lawyerRecommendCaseList",
       searchParam:params,
       success: function (result) {     
        // result.data.host=  api.host+"caseDetail?";          
         $(".result-count").text(result.data.totalCount);
         var html = template('lawyer-list-templete', result.data); 
         $(".case-list").html(html);
        
       if(result.data.totalCount<10){
           $(".page-row").hide()
       }else{
           $(".page-row").show()
       }
       }
   })
   location.reload();
   }) 

   $(document).on("click",".search-options span",function(){
    var keywords = $(this).text();
   
    $(".options-block-hide").trigger("click");
    var params = {
        offset:0,
        keyword : keywords,
        isGroupCategory : true
    }
    $('.page-result .pager').tablePager({
    
        url: "case/lawyerRecommendCaseList",
        searchParam:params,
        success: function (result) {
           if(result.code == 0){
            result.data.host=  api.host+"caseDetail?";          
            $(".result-count").text(result.data.totalCount);
            var html = template('lawyer-list-templete', result.data); 
            $(".case-list").html(html);

            result.data.hosts=  api.host+"lawyerDetail";
            var html2 = template('lawyer-slider-templete', result.data); 
            $(".sidenav-menu").html(html2);

            if(result.data.totalCount>10){
                $(".page-row").show()
            }else{
                $(".page-row").show()
            }

           }else{
                toastr.warning(result.msg);
           }
          
        }
    })
})
        $(document).on("click","#reasonslect .reaseontext",function(event){
          $("#navbar-menu").toggle()
          event.stopPropagation();
        })
        $(document).on("click",".first-val",function(){
          var data = $(this).text();
          var dataid = $(this).attr("data-id");
          $("#reasonslect .reaseontext").text(data);
          $("#reasonslect .reaseontext").attr("data-id",dataid);
          $("#navbar-menu").hide();
          
        })
        $(document).on("click",".second-val",function(){
          var data = $(this).text();
          var dataid = $(this).attr("data-id");
     //   var parent = $(this).attr("parent-name");
         $("#reasonslect .reaseontext").text(data);
          $("#reasonslect .reaseontext").text(parent+"-"+data);
        //  $("#reasonslect .reaseontext").attr("data-id",dataid);
          $("#navbar-menu").hide();
        })
        $(document).on("click",".last-val",function(){
          var data = $(this).text();
          var dataid = $(this).attr("data-id");
    //      var parentname = $(this).attr("parent-name");
    //      var parent = $(this).attr("parent");
         $("#reasonslect .reaseontext").text(data);
          $("#reasonslect .reaseontext").attr("data-id",dataid);
      //    $("#reasonslect .reaseontext").text(parent+" - "+parentname+" - "+data);
          $("#navbar-menu").hide();
        })
        $(document).on("click",function(event){
          $("#navbar-menu").hide();
        });

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
