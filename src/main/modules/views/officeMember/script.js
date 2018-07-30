var userCenter = (function() {
  var page = 1
  var inquery_validate

  function getMycase() {
    var params = {
      clientId: clientId,
      sidx: 'createTime',
      order: 'desc'
    }

    $('#my-cases .pager').tablePager({
      url: 'order/queryOrderList',
      searchParam: params,
      success: function(result) {
        if (result.code == 0) {
          if (result) {
            var html = template('case-result-templete', result.data)

            $('.my-case-box').html(html)
          }
        }
      }
    })

   
  }
  $(function() {
    $("#my-member").addClass("active");
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
      $('#member-manage .member-manage-content').html(
        template('member-manage-template', {
          delegations: [
            {
              account: '126551453',
              name: '张三',
              sex: '男',
              state: '有效',
              joinTime: '2015-06-05 15:33:30'
            },
            {
              account: '126551453',
              name: '张三',
              sex: '男',
              state: '有效',
              joinTime: '2015-06-05 15:33:30'
            },
            {
              account: '126551453',
              name: '张三',
              sex: '男',
              state: '有效',
              joinTime: '2015-06-05 15:33:30'
            },
            {
              account: '126551453',
              name: '张三',
              sex: '男',
              state: '有效',
              joinTime: '2015-06-05 15:33:30'
            }
          ]
        })
      )
    }
  }
})()
userCenter.init()
