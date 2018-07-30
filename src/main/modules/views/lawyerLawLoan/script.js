var userCenter = (function() {
  var page = 1
  var inquery_validate
  var listData
  var start = {
    isinitVal: true,
    initDate: [{ DD: '-7' }, true],
    format: 'YYYY-MM-DD',
    maxDate: $.nowDate({ DD: 0 }), //最大日期
    zIndex: 99999,
    isClear: false,
    isok: false,
    okfun: function(elem, date) {
      end.minDate = elem.val.replace(/\//g, '-') //开始日选好后，重置结束日的最小日期
      //   endDates();
    }
  }
  var end = {
    isinitVal: true,
    isok: false,
    isClear: false,
    zIndex: 99999,
    maxDate: $.nowDate({ DD: 0 }), //最大日期
    format: 'YYYY-MM-DD',
    okfun: function(elem, date) {
      start.maxDate = elem.val.replace(/\//g, '-') //将结束日的初始值设定为开始日的最大日期
    }
  }
  function getMyloan() {
    var params = {
      lawyerId: lawyerId,
      sidx: 'createTime',
      order: 'desc'
    }

    $('#my-loans .pager').tablePager({
      url: 'loan/queryLawyerLoanOrderList',
      searchParam: params,
      success: function(result) {
        if (result.code == 0) {
          if (result) {
            var html = template('loan-result-templete', result.data)
            listData = result.data.list
            $('.totalNum').html(result.data.totalCount)
            $('.my-loan-box').html(html)
            if (result.data.totalCount < 10) {
              $('.page-row').hide()
            } else {
              $('.page-row').show()
            }
            if (result.data.totalCount == 0) {
              $('.my-loans-box').html(
                "<P class='noresult'>抱歉，没有相关案件</P>"
              )
            }
          } else {
            toastr.warning(result.msg)
          }
          $('.my-loans-content .totalNum').text(result.data.totalCount)
        }
      }
    })
  }
  $(function() {

    $("#my-loan").addClass("active");

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
    //时间选择
    $('#start-date').jeDate(start)
    $('#end-date').jeDate(end)
    $('.all-status').on('change', function() {
      var select = $("select[name='status']")
        .find('option:selected')
        .val()
    })
  })
  return {
    init: function() {
      getMyloan()
      $(document).on('click', '.showmore', function() {
        var loanid = $(this).attr('data-id')
        // 根据loanid在loan列表查找loanStatus
        var loanStatus = listData.filter(function(loan) {
          return Number(loanid) === Number(loan.id)
        })[0].loanStatus
        $({ loanId: loanid })._Ajax({
          url: 'loanauditlog/AuditLogByLoanId',
          success: function(result) {
            var html = []
            if (result.code == 0) {
              var data = result.list
              for (var i = 0; i < data.length; i++) {
                html +=
                  "<div class='pro-tex'>" +
                  data[i].desc +
                  '<span>' +
                  data[i].createTime +
                  '</span></div>'
              }
              $('#tr' + loanid + ' .steps-box .step').each(function(index) {
                if (index < loanStatus + 1) {
                  $(this).addClass('active-step')
                }
              })
              $('#tr' + loanid + ' .process-text').html(html)
              $('#tr' + loanid).toggle()
            }
          }
        })
      })
      $(document).on('click', '.check-file-btn', function() {
        downloadModal.showModal($(this).attr('data-id'))
      })
    }
  }
})()
userCenter.init()
