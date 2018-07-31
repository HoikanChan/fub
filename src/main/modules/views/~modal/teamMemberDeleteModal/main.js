var teamMemberDeleteModal = (function() {
  var modal = $('#teamMemberDeleteModal').remodal()
  console.log(modal)
  var id = ''
  /*拇指图弹出*/
  function showModal(id) {
    id = id

    console.log(modal)
    $(document).on('click', '#teamMemberDeleteModal #confirm-btn', e => {
      e.stopPropagation()
      console.log(e);
      console.log(id);
      if (id) {
        $({})._Ajax({
          url: 'teamlawyer/api/delete?id=' + id,
          success: function(result) {
            modal.close()
            id = ''
            if (result.code == 0) {
              toastr.success(result.msg)
              console.log(userCenter)
              userCenter.fetchData()
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
