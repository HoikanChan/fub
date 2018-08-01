var userCenter = (function() {
  var page = 1
  var inquery_validate

  $(function() {
  //  $('#calendar').fullCalendar({})
    $(".user-info-block h4 span").text(phone);
    $(".user-info-block span.count").text(userZH);
    $(".user-info-block span.regtime").text(registerTime);

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

  })

  return {
    init: function() {
      //  satelliteApplication();
      $("#indexpage").addClass("active");


      $({clientId:clientId})._Ajax({
        url: "client/latestOrder",
        success: function (result) {
                if (result.code==0) {
                    var html = template("application-template",result)
                    $(".applications").html(html);
                }
             }
    });




    }
  }
})()
userCenter.init()
