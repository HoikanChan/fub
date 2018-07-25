var userCenter = (function() {
  var page = 1
  var inquery_validate

  $(function() {
    $('#calendar').fullCalendar({})
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
      $('.lawyer-loan-content').html(
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
      $('.my-cases-content').html(
        template('my-cases-template', {
          loans: {},
          bills: [
            {
              no: '1123234256532',
              casename: '某某某抢劫案',
              amount: '250.00',
              lawyer: '仗义飞',
              phone: '12345671223',
              state: '平台审批中',
              time: '2015-06-05 15:33:30'
            },
            {
              no: '1123234256532',
              casename: '某某某抢劫案',
              amount: '250.00',
              lawyer: '仗义飞',
              phone: '12345671223',
              state: '平台审批中',
              time: '2015-06-05 15:33:30'
            },
            {
              no: '1123234256532',
              amount: '250.00',
              casename: '某某某抢劫案',
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
})()
userCenter.init()
