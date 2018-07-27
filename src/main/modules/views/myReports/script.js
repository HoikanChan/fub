var userCenter = (function() {
  var page = 1
  function getReports() {
    var params = {
      clientId: clientId
    }

    $('#my-cases .pager').tablePager({
      url: 'report/api/list',
      searchParam: params,
      success: function(result) {
        if (result.code == 0) {
          if (result) {
            $('.reports-content .reports-list').html(template('report-template', result.data))
            if (result.data.totalCount < 10) {
              $('.page-row').hide()
            } else {
              $('.page-row').show()
            }
            if (result.data.totalCount == 0) {
              $('.reports-content').html(
                "<p class='noresult'>抱歉，没有相关报告</p>"
              )
            }
          } else {
            toastr.warning(result.msg)
          }
        }
      }
    })
  }
  //查询报告详情

  function getCaseDetail(id) {
    $({})._Ajax({
      url: 'report/api/info/' + id,
      success: function(result) {
        $('.reports-list').hide()
        $('.reports-detail').show()
        $('.reports-content .reports-detail').html(template('report-detail-template', result.data))
      }
    })
  }
  $(function() {
    $('#my-reports').addClass('active')
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
      getReports()
      $(document).on('click', '.content-item a', function(e) {
        e.stopPropagation()
        //查询报告详情
        getCaseDetail($(this).attr('to'))
        return false
      })
    }
  }
})()
userCenter.init()
