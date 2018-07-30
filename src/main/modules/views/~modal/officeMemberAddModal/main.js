var officeMemberAddModal = (function() {
  var modal = $('#officeMemberAddModal').remodal()
  /*拇指图弹出*/
  function showModal() {
      $('#officeMemberAddModal .remodal-content').html(template('officeMemberAdd-template'))
  }
  $(document).on('click',".license-img",function(){
    window.open($(this).attr('src'))
  })
  return {
    init: function() {
        showModal()
    },
    showModal: showModal,
    id: '',
    modal: modal
  }
})()
officeMemberAddModal.init()
