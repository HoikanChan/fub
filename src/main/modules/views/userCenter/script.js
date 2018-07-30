var userCenter = (function() {
  var page = 1
  var inquery_validate

  $(function() {
  //  $('#calendar').fullCalendar({})
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

    }
  }
})()
userCenter.init()
