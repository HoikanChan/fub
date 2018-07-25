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
    var assetsChart = echarts.init(document.getElementById('my-assets-chart'))
    var assetsOption = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220]
        }
      ]
    }
    assetsChart.setOption(assetsOption)
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
      $('.assets-content').html(
        template('assets-template', {
          balance: 21,
          total: '1,200.00',
          personal: '1,200.00',
          team: '1,200.00',
          count: 12,
          info: {
            time: '2018-01 ~ 2018-10',
            total: '1,200.00',
            personal: '1,200.00',
            team: '1,200.00',
            count: 12
          },
          pages: 3,
          bills: [
            {
              no: '1123234256532',
              amount: '250.00',
              type: '事务贷',
              region: '个人',
              time: '2015-06-05 15:33:30'
            },
            {
              no: '1123234256532',
              amount: '250.00',
              type: '事务贷',
              region: '个人',
              time: '2015-06-05 15:33:30'
            },
            {
              no: '1123234256532',
              amount: '250.00',
              type: '事务贷',
              region: '个人',
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
      $('#affairs-delegation .my-delegation').html(
        template('my-delegation-template', {
          delegations: [
            {
              type: '时间',
              client: '杭州市西湖区古荡湾',
              validTime: '2015-06-05 15:33:30',
              invalidTime: '2015-06-05 15:33:30'
            },
            {
              type: '时间',
              client: '杭州市西湖区古荡湾',
              validTime: '2015-06-05 15:33:30',
              invalidTime: '2015-06-05 15:33:30'
            },
            {
              type: '时间',
              client: '杭州市西湖区古荡湾',
              validTime: '2015-06-05 15:33:30',
              invalidTime: '2015-06-05 15:33:30'
            }
          ]
        })
      )
      $('#affairs-delegation .delegation-to-me').html(
        template('delegation-to-me-template', {
          delegations: [
            {
              type: '时间',
              client: '张三',
              validTime: '2015-06-05 15:33:30',
              invalidTime: '2015-06-05 15:33:30'
            },
            {
              type: '时间',
              client: '张三',
              validTime: '2015-06-05 15:33:30',
              invalidTime: '2015-06-05 15:33:30'
            }
          ]
        })
      )
    }
  }
})()
userCenter.init()
