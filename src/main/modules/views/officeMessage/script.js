var msgSytem = (function() {
  function getMycase(){ 
    var params = {
      loginUserId:userid
    }
  $('#my-cases .pager').tablePager({
      url: "usernotice/api/list",
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
 function getnoReadMycase(){ 
  var params = {
    loginUserId:userid,
    isRead:0
  }
$('#my-cases .pager').tablePager({
    url: "usernotice/api/list",
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
    $('#office-messages').addClass('active')
   
   
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
      $("#"+dataid).addClass("hadreadicon");
     
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
      var megdiv = $("#content1read .messages-item");
      console.log(megdiv)
      var ids =[];
      for(var i=0;i<megdiv.length;i++){
        console.log(megdiv[i].id)
        ids += megdiv[i].id+",";
      }
      ids = ids +"]";
      var idss = ids.replace(",]","");
      console.log(idss)
      $({ids:idss})._Ajax({
        url: "usernotice/api/batchUpdate/",
        success: function (result) {
                if (result.code==0) {
                  location.reload();
                }
             }
        });
      });
      
      $(document).on("click",".del",function(){
        var id = $(this).attr("dataid");
        $({})._Ajax({
          url: "usernotice/api/delete/"+id,
          success: function (result) {
                  if (result.code==0) {
                    location.reload();
                  }
               }
          }); 
      })
      $(document).on("click",".label-right",function(){
        getnoReadMycase();
         
      })
    
      $(document).on("click",".label-left",function(){
        getMycase();
         
      })
      $(document).on("click",".msg-detail-btn",function(){
                
        msgDetail.showDataDetailDialog2($(this).attr("data-id"))
   
})
    }
  }
})()
msgSytem.init()
