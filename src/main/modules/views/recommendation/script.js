var _persone = function () {
    var highsearch =  $("#highSeach");
    //定义开始结束时间参数
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
    //验证高级检索必填
    $("#recommend-form").bootstrapValidator({
        message:'This value is not valid',
//            定义未通过验证的状态图标
        feedbackIcons: {/*输入框不同状态，显示图片的样式*/
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
//            字段验证
        fields:{      
            introduction:{
                    message: '',
                    validators:{
                    notEmpty:{
                        message:'案情描述不能为空'
                        }
                    }
                }, 
            },
        
    })
    //验证检索必填
    $("#keyword-form").bootstrapValidator({
        message:'This value is not valid',
        feedbackIcons: {/*输入框不同状态，显示图片的样式*/
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
//            字段验证
        fields:{      
            keyword:{
                    message: '',
                    validators:{
                    notEmpty:{
                        message:'请输入需要搜索的关键词'
                        }
                    }
                }, 
            },
        
    })
    $({})._Ajax({
        url: "casetype/apiTree",
        success: function (result) {
                if (result.code==0) {
                    var html = template("search-reason-templete",result)
                    $("#navbar-menu").html(html);
                }
             }
    });

    function highSeachSumbit(){
        var reason =$("#reasonslect .reaseontext").text();
        var areaid = $("input[name='courtCityId']").attr("area-id");
        var appellors = $("input[name='appellors']").val()
        var defendant = $("input[name='defendant']").val();
        var trialDateBegin = $("input[name='trialDateBegin']").val();
        var trialDateEnd = $("input[name='trialDateEnd']").val();
        var introduction = $("textarea[name='introduction']").val();
        var standardAmount = $("select[name='standardAmount']").find("option:selected").val();
        var lawyerFeeLimit = $("select[name='lawyerFeeLimit']").find("option:selected").val();
        var lawyerSex = $("select[name='lawyerSex']").find("option:selected").val();
        var lawyerAge = $("select[name='lawyerAge']").find("option:selected").val();
        var lawyerWorkYears = $("select[name='lawyerWorkYears']").find("option:selected").val();
        var lawyerCaseCount = $("select[name='lawyerCaseCount']").find("option:selected").val();
        var lawyerLanguage = $("select[name='lawyerLanguage']").find("option:selected").val();
        var lawyerOther = $("textarea[name='lawyerOther']").val();
        if(reason == "全部" ){
            reason = "";
        }
        if(standardAmount == 0 ){
            standardAmount = "";
        }
        if(lawyerFeeLimit == 0 ){
            lawyerFeeLimit = "";
        }
        if(lawyerSex == 0 ){
            lawyerSex = "";
        }
        if(lawyerAge == 0 ){
            lawyerAge = "";
        }
        if(lawyerWorkYears == 0 ){
            lawyerWorkYears = "";
        }
        if(lawyerCaseCount == 0 ){
            lawyerCaseCount = "";
        }
        if(lawyerLanguage == 0 ){
            lawyerLanguage = "";
        }
        if(areaid == 0){
            areaid = "";
        }
        var params = {
              reason : reason,
              courtCityId :areaid,
              offset:0,
              appellors : appellors,
              defendant : defendant,
              trialDateBegin : trialDateBegin,
              trialDateEnd : trialDateEnd,
              introduction : introduction,
              standardAmount : standardAmount ,
      //      lawyerFeeLimit : lawyerFeeLimit,
      //      lawyerSex : lawyerSex,
       //     lawyerAge : lawyerAge,
      //      lawyerWorkYears : lawyerWorkYears ,
      //      lawyerCaseCount : lawyerCaseCount,
      //      lawyerLanguage : lawyerLanguage,
      //      lawyerOther : lawyerOther
        }

        $('#list-page .pager').tablePagerOne({
        
            url: "case/lawyerRecommend",
            searchParam:params,
            success: function (result) {
               if(result.code == 0){
            //    result.data.host=  api.link+"lawyerDetail?";
                result.data.host=  api.host+"lawyerDetail?";
                var html = template('search-result-templete', result.data); 
                $("#search-result").html(html);
                if(result.data.totalCount>1){
                    $(".page-row").hide()
                // }else{
                //     $(".page-row").show()
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

    function keywordSumbit(){
        var keywords = $("input[name='keyword']").val()
        var reason =$(".caseresours").find("option:selected").val();
        var areaid = $("input[name='courtCityId']").attr("area-id");
        if(reason == "全部" ){
            reason = "";
        }
        if(areaid == 0){
            areaid = "";
        }
        
        var params = {
            offset:0,
           keyword : keywords,
           reason : reason,
           courtCityId :areaid
        }
        $('#list-page .pager').tablePagerOne({
        
            url: "case/lawyerRecommend",
            searchParam:params,
            success: function (result) {
               if(result.code == 0){
          //   result.data.host=  api.link+"lawyerDetail?";
                result.data.host=  api.host+"lawyerDetail?";
                var html = template('search-result-templete', result.data); 
                $("#search-result").html(html);

                sessionStorage.setItem("lawyer",result.data);
                if(result.data.totalCount==0){
                    $("#search-result").html("<P class='noresult'>抱歉，没有该检索内容数据</P>")
                }
                if(result.data.totalCount>1){
                    $(".page-row").hide()
                // }else{
                //     $(".page-row").show()
                }
               }else{
                    toastr.warning(result.msg);
               }
              
            }
        })
    }

  

    function seachSumbit(){
        if($(".recommend-form").hasClass("show")){
            $("#recommend-form").bootstrapValidator('validate');
            if ($("#recommend-form").data('bootstrapValidator').isValid()){
                highSeachSumbit();
                highsearch.trigger("click");
               
                $(".search-result").show();

            }
        }else{
            // $("#keyword-form").bootstrapValidator('validate');//提交验证
            //     if ($("#keyword-form").data('bootstrapValidator').isValid()){//获取验证结果，如果成功，执行下面代码
                  
            //         keywordSumbit();
            //         $(".search-result").show();
                      
            //     }
                 keywordSumbit();
                 $(".search-result").show();
        }
    }
  
    $(function(){

     var conHeight = $(".main-content .container").outerHeight();
     var conWidth = $(".main-content .container").outerWidth();
     $(".main-content").height(winH-233);
    var bgh =  $(".main-content").height();
  //   console.log(conHeight,conWidth)
     var loginLeft = conWidth/2;
     var loginTop = conHeight/2; 
     console.log(bgh)
     $(".main-content .container").css({"top":bgh/2-loginTop+"px","left":winW/2-loginLeft+"px"})  
    //地区选择
    init_city_select($("#area-select"));

    //时间选择 
    $("#start-date").jeDate(start);
    $("#end-date").jeDate(end);


    })
 
        
    return {
        init: function () {
            change_main_current_class(1); 
          
            highsearch.click(function(){
                $(".recommend-form").toggle();
                $(".recommend-form").toggleClass("show");
                if ($(".recommend-form").hasClass("show")) { 
                    $(this).children().removeClass("glyphicon-menu-left").addClass("glyphicon-menu-down")
                    $(this).css("color","#ed7a39");
                    $(".page-search").css("padding-bottom","30px");
                    $(".page-title p").css("padding","5px");
                  
                } else {
                    $(this).children().removeClass("glyphicon-menu-down").addClass("glyphicon-menu-left")
                    $(this).css("color","#333")
                    $(".page-title p").removeAttr("style")
                }
            }) ;
            $(document).on("click","#searchBtn",function(){
                seachSumbit();

            })
            
            $(document).on("click",".serachtext",function(){
                var keywords = $(this).text();
               
                var reason =$(".caseresours").find("option:selected").val();
                var areaid = $("input[name='courtCityId']").attr("area-id");
                if(reason == 0 ){
                    reason = "";
                }
                
                var params = {
                    offset:0,
                    keyword : keywords,
               //     reason : reason,
              //      courtCityId :areaid
                }
                $('#list-page .pager').tablePagerOne({
                
                    url: "case/lawyerRecommend",
                    searchParam:params,
                    success: function (result) {
                       if(result.code == 0){
                        result.data.host=  api.host+"lawyerDetail?";
                        var html = template('search-result-templete', result.data); 
                        $("#search-result").html(html);
                        $(".search-result").show();
                        if(result.data.totalCount>1){
                            $(".page-row").hide()
                        // }else{
                        //     $(".page-row").show()
                        }

                       }else{
                            toastr.warning(result.msg);
                       }
                      
                    }
                })
            })
           

            $(document).on("keydown", function (e) {
                e.stopPropagation();
                var key = e.which;
                if (key == 13) {
                    seachSumbit();
                }
            });
            $(document).on("click","#reasonslect .reaseontext",function(event){
                $("#navbar-menu").toggle()
                event.stopPropagation();
            })
            $(document).on("click",".first-val",function(){
                var data = $(this).text();
                $("#reasonslect .reaseontext").text(data);
                $("#navbar-menu").hide();
                
            })
            $(document).on("click",".second-val",function(){
                var data = $(this).text();
                // var parent = $(this).attr("parent-name");
                // $("#reasonslect .reaseontext").text(parent+"-"+data);
                $("#reasonslect .reaseontext").text(data);
                $("#navbar-menu").hide();
            })
            $(document).on("click",".last-val",function(){
                var data = $(this).text();
                $("#reasonslect .reaseontext").text(data);
                // var parentname = $(this).attr("parent-name");
                // var parent = $(this).attr("parent");
                // $("#reasonslect .reaseontext").text(parent+" - "+parentname+" - "+data);
                $("#navbar-menu").hide();
            })
            $(document).on("click",function(event){
                $("#navbar-menu").hide();
            });
            
        }
    }
} ();
_persone.init();