var userCenter = (function() {
  var page = 1
  var inquery_validate
  function getMycase(){
     
    var params = {
      clientId:clidentId,
      sidx : "createTime",
      order : "desc"
    }
    $('#my-cases .mycasepage .pager').tablePager({
      url: "order/queryOrderList",
      searchParam:params,
      success: function (result) {
         if(result.code == 0){
           console.log(result.data)
            // var html1 = template('my-cases-template', result.data); 
            // $(".my-cases-box").html(html1);
            var html = template('search-result-templete', result.data); 
            $("#my-cases .my-cases-box").html(html);

          if(result.data.totalCount<10){
              $(".page-row").hide()
          }else{
              $(".page-row").show()
          }
          if(result.data.totalCount==0){
              $(".my-cases-box").html("<P class='noresult'>抱歉，没有相关案件</P>")
          }
         }else{
              toastr.warning(result.msg);
         }
        $(".my-cases-content .totalNum").text(result.data.totalCount);
      }
  })
  }
  $(function() {
    $('#calendar').fullCalendar({})
    $('.fc-widget-header .fc-sun span').html('星期天')
    $('.fc-widget-header .fc-mon span').html('星期一')
    $('.fc-widget-header .fc-tue span').html('星期二')
    $('.fc-widget-header .fc-wed span').html('星期三')
    $('.fc-widget-header .fc-thu span').html('星期四')
    $('.fc-widget-header .fc-fri span').html('星期五')
    $('.fc-widget-header .fc-sat span').html('星期六')
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
      //  satelliteApplication();
    }
  }
})()
userCenter.init()
