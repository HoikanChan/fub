var userCenter = (function() {
  var page = 1
  
  $(function() {
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
      $('#office-member').addClass('active')
      this.getList()
      //窗口按钮初始化
      $(document).on('click', '#disable-btn', function() {
        officeMemberDisableModal.showModal($(this).attr('data-id'))
        return false
      })
      $(document).on('click', '#delete-btn', function() {
        officeMemberDeleteModal.showModal($(this).attr('data-id'))
        return false
      })
      $(document).on('click', '#detail-btn', function() {
        officeMemberDetailModal.showModal($(this).attr('data-id'))
        return false
      })
    },
    //获取成员列表
    getList: function() {
      //Todo: remove the fixed officeId
      officeId = 10
      //Todo: 分页
      // $('#my-cases .pager').tablePager({
      //   url: 'order/queryOrderList',
      //   searchParam: params,
      //   success: function(result) {
      //     if (result.code == 0) {
      //       if (result) {
      //         var html = template('case-result-templete', result.data)
  
      //         $('.my-case-box').html(html)
      //       }
      //     }
      //   }
      // })
      $({})._Ajax({
        url: 'lawyer/queryLawyerListByOffice?officeId=' + officeId,
        success: function(result) {
          $('.totalNum').html(result.page.totalCount)
          $('#member-manage .member-list').html(
            template('member-manage-template', result.page)
          )
        }
      })
    }
  }
})()
userCenter.init()
