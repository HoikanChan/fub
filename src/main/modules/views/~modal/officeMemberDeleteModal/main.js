var officeMemberDeleteModal = (function() {
  var modal = $('#officeMemberDeleteModal').remodal()
  console.log(modal)
  var id = ''
  /*拇指图弹出*/
  function showModal(id) {
    id = id

    console.log(modal)
    $(document).on('click', '#officeMemberDeleteModal #confirm-btn', e => {
      e.stopPropagation()
      if (id) {
        $({})._Ajax({
          url: 'lawyer/api/removeOffice?lawyerId=' + id,
          success: function(result) {
            modal.close()
            id = ''
            if (result.code == 0) {
              toastr.success(result.msg)
              console.log(userCenter)
              userCenter.getList()
            } else {
              toastr.warning(result.msg)
            }
          }
        })
      }
    })
  }

  return {
    showModal: showModal,
    id: '',
    modal: modal
  }
})()
