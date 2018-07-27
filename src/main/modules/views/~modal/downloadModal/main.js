var downloadModal = (function() {
  $('#getcaseDeatil-modal').remodal()
  /*拇指图弹出*/
  function showModal(loanId) {
    console.log(loanId)
    $('.getcaseDeatil-form').html('')
    $({})._Ajax({
      url: 'loan/queryLoanDeatilAndFiles?loanId=' + loanId,
      success: function(result) {
        if (result.code == 0) {
          if (result) {
            result.data.host = api.host
            $('.file-table').html(template('file-table-template', result.data))

            if (result.data.files.length < 10) {
              $('#download-modal .page-row').hide()
            } else {
              $('#download-modal .page-row').show()
            }
            if (result.data.files.length == 0) {
              $('.file-table').html(
                "<p class='noresult' style='text-align:center;padding:24px 0'>抱歉，该订单没有文件</p>"
              )
            }
          } else {
            toastr.warning(result.msg)
          }
        }
      }
    })
  }
  return {
    init: function() {
      $(document).on('click', '#preview', function(e) {
        e.stopPropagation()
        window.open(api.host + $(this).attr('data-path'))
        return false
      })
    },
    showModal: showModal
  }
})()
downloadModal.init()
