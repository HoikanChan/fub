var userCenter = (function() {
  var page = 1
  var inquery_validate
  
  $(function() {
    $('#my-reports').addClass("active")
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

  })
  return {
    init: function() {
      //  satelliteApplication();
      $('.reports-content').html(
        template('report-template', {
          reports: {
            count: 21,
            cases: [
              {
                title: '志明等与春娇所有权确认纠纷二审民事判决书',

                content:
                  'Designed as Ant Design，提炼和服务企业级中后台产品的交互语言和视觉风格。React Component ',
                created: '2015-06-05 15:33:30'
              },
              {
                title: '志明等与春娇所有权确认纠纷二审民事判决书',

                content:
                  'Designed as Ant Design，提炼和服务企业级中后台产品的交互语言和视觉风格。React Component ',
                created: '2015-06-05 15:33:30'
              },
              {
                title: '志明等与春娇所有权确认纠纷二审民事判决书',

                content:
                  'Designed as Ant Design，提炼和服务企业级中后台产品的交互语言和视觉风格。React Component ',
                created: '2015-06-05 15:33:30'
              },
              {
                title: '志明等与春娇所有权确认纠纷二审民事判决书',

                content:
                  'Designed as Ant Design，提炼和服务企业级中后台产品的交互语言和视觉风格。React Component ',
                created: '2015-06-05 15:33:30'
              },
              {
                title: '志明等与春娇所有权确认纠纷二审民事判决书',

                content:
                  'Designed as Ant Design，提炼和服务企业级中后台产品的交互语言和视觉风格。React Component ',
                created: '2015-06-05 15:33:30'
              },
              {
                title: '志明等与春娇所有权确认纠纷二审民事判决书',

                content:
                  'Designed as Ant Design，提炼和服务企业级中后台产品的交互语言和视觉风格。React Component ',
                created: '2015-06-05 15:33:30'
              }
            ]
          }
        })
      )
    }
  }
})()
userCenter.init()
