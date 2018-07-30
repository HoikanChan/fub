var officeMemberDetailModal = (function() {
  var modal = $('#officeMemberDetailModal').remodal()
  console.log(modal)
  var id = ''
  /*拇指图弹出*/
  function showModal(id) {
    id = id
    console.log(id);
    if (id) {
      $({})._Ajax({
        url: 'lawyer/api/info?id=' + id,
        success: function(result) {
          id = ''
          if (result.code == 0) {
            toastr.success(result.msg)
            result.data.host = api.host
            $('#officeMemberDetailModal .remodal-content').html(template('detail-template',result.data))
          } else {
            toastr.warning(result.msg)
          }
        }
      })
    }
  }
  $(document).on('click',".license-img",function(){
    window.open($(this).attr('src'))
  })
  return {
    init: function() {},
    showModal: showModal,
    id: '',
    modal: modal
  }
})()
officeMemberDetailModal.init()
