var userCenter = (function() {
  var page = 1
  var inquery_validate
  var searchOptions = [
    { name: '全文检索', value: 'global' },
    { name: '标题', value: 'title' },
    { name: '当事人', value: 'client' },
    { name: '代理律师', value: 'lawyer' },
    { name: '律师事务所', value: 'office' },
    { name: '法院名称', value: 'court' },
    { name: '法院层级', value: 'courtlevel' },
    { name: '裁判时间', value: 'judgingtime' },
    { name: '案由', value: 'route' },
    { name: '裁判人员', value: 'judger' },
    { name: '文书类型', value: 'documentType' },
    { name: '审判程序', value: 'judgingAoo' }
  ]
  var addedOptions = []

  $(function() {
   // $('#calendar').fullCalendar({})
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
      searchOptions = searchOptions.filter(function(option) {
        return option.value !== pickedValue
      })
      $('#lawyer-assistant .options-block').html(
        template('lawyer-assistant-template', {
          options: searchOptions,
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
      $('#lawyer-assistant .options-block').html(
        template('lawyer-assistant-template', {
          options: searchOptions,
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
      $('#lawyer-assistant .search-page').removeClass('pageNow')
      $('#lawyer-assistant .result-page').addClass('pageNow')
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

      $('#my-team .my-team-content').html(
        template('my-team-template', {
          myTeams: [
            {
              name: 'issac',
              office: '杭州市西湖区古荡湾',
              contribution: '692',
              lastOnlineTime: '2015-06-05 15:33:30'
            },
            {
              name: 'leon',
              office: '杭州市西湖区古荡湾',
              contribution: '692',
              lastOnlineTime: '2015-06-05 15:33:30'
            },
            {
              name: 'mei',
              office: '杭州市西湖区古荡湾',
              contribution: '125',
              lastOnlineTime: '2015-06-05 15:33:30'
            }
          ],
          ranking:[
            {rank:1,name:'张三',visit:789},
            {rank:2,name:'张三',visit:789},
            {rank:3,name:'张三',visit:789},
            {rank:4,name:'张三',visit:789},
            {rank:5,name:'张三',visit:789},
            {rank:6,name:'张三',visit:789}
          ],
          messages:{},
          pages:20
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
      $('#lawyer-assistant .options-block').html(
        template('lawyer-assistant-template', {
          options: searchOptions,
          addedOptions: addedOptions
        })
      )
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
