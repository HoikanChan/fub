var userCenter = (function() {
  var page = 1
  var inquery_validate

  function getMycase(){ 
    var params = {
      isRead:0
    }
  $('#my-cases .pager').tablePager({
      url: "notice/api/list",
      searchParam:params,
      success: function (result) {
              if (result.code==0) {
             
                if (result) {
                  
                    var html = template("systemNews-result-templete",result.data)
            
                    $("#content1read").html(html); 
                    if(result.data.totalCount<10){
                        $(".page-row").hide()
                    }else{
                        $(".page-row").show()
                    }
                    if(result.data.totalCount==0){
                        $("#content1read").html("<P class='noresult'>抱歉，没有系统消息</P>")
                    }
                    }else{
                        toastr.warning(result.msg);
                    }
                 
                }

      }
 })

 
  }
  $(function() {
   
   
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
    
  
  })
  return {
    init: function() {
      getMycase()
    $(document).on("click",".hadread",function(){
      var dataid = $(this).attr("dataid");
      $({})._Ajax({
        url: "usernotice/api/update/"+dataid,
        success: function (result) {
                if (result.code==0) {
                   
                }
             }
            });
    })
    $(document).on("click",".setReaded",function(){
      var ids = $(this).attr("dataid");
      $({})._Ajax({
        url: "usernotice/api/batchUpdate/"+ids,
        success: function (result) {
                if (result.code==0) {
                   
                }
             }
        });
      });
      $(document).on("click",".label-right",function(){
        getMycase()
         
      })
    }
  }
})()
userCenter.init()
