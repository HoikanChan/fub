var officeMemberDisableModal = (function() {
  var modal = $('#officeMemberDisableModal').remodal()
  console.log(modal)
  var id = ''
  /*拇指图弹出*/
  function showModal(id) {
    id = id
    console.log(modal)
    $(document).on('click', '#officeMemberDisableModal #confirm-btn', e => {
      e.stopPropagation()
      $({})._Ajax({
        url: 'lawyer/api/disable?lawyerId=' + id,
        success: function(result) {
          modal.close()
          if (result.code == 0) {
            toastr.success(result.msg)
          } else {
            toastr.warning(result.msg)
          }
        }
      })
    })
  }

  return {
    showModal: showModal,
    id: '',
    modal: modal
  }
})()
