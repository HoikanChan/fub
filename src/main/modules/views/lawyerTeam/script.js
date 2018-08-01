var userCenter = (function() {
  var page = 1
  var inquery_validate
  $(document).on('closing', '#joinTeamModal', function (e) {

    // Reason: 'confirmation', 'cancellation'
    fetchData()
    console.log('Modal is closing' + (e.reason ? ', reason: ' + e.reason : ''));
  });
  function fetchData() {
    getMyTeams()
    getParentTeam()
    getProfessionTeam()
  }
  function getMyTeams() {
    var params = {
      createLawyerId: lawyerId
    }
    // $('#my-team .my-team-pager').tablePagerThree ({
    $(params)._Ajax({
      url: 'team/queryTeamLawyerList',
      searchParam: params,
      success: function(result) {
        if (result.code == 0) {
          if (result) {
            var html = template('my-team-template', result.page)
            // listData = result.data.list
            // $('.totalNum').html(result.data.totalCount)
            console.log(html)
            $('#my-team-list').html(html)
            if (result.page.totalCount < 10) {
              $('.my-team-page-row').hide()
            } else {
              $('.my-team-page-row').show()
            }
            if (result.page.totalCount == 0) {
              $('.my-team-list').html(
                "<P class='noresult'>抱歉，没有相关成员</P>"
              )
            }
          } else {
            toastr.warning(result.msg)
          }
          // $('.my-loans-content .totalNum').text(result.data.totalCount)
        }
      }
    })
  }
  function getParentTeam() {
    var params = {
      lawyerId: lawyerId,
      memberType: 0
    }
    // $('#my-team .parent-team-pager').tablePagerThree ({
    $({params})._Ajax({
      url: 'team/queryTeamLawyerList',
      searchParam: params,
      success: function(result) {
        if (result.code == 0) {
          if (result) {
            var html = template('parent-team-template', result.page)
            // listData = result.data.list
            // $('.totalNum').html(result.data.totalCount)
            console.log("parent",html)
            $('#parent-team-list').html(html)
            if (result.page.totalCount < 10) {
              $('.parent-team-page-row').hide()
            } else {
              $('.parent-team-page-row').show()
            }
            if (result.page.totalCount == 0) {
              $('.parent-team-list').html(
                "<P class='noresult'>抱歉，没有相关成员</P>"
              )
            }
          } else {
            toastr.warning(result.msg)
          }
          // $('.my-loans-content .totalNum').text(result.data.totalCount)
        }
      }
    })
  }
  function getProfessionTeam() {
    var params = {
      lawyerId: lawyerId,
      memberType: 1
    }
    // $('#my-team .profession-team-pager').tablePagerThree ({
    $({params})._Ajax({
      url: 'team/queryTeamLawyerList',
      searchParam: params,
      success: function(result) {
        if (result.code == 0) {
          if (result) {
            var html = template('profession-team-template', result.page)
            // listData = result.data.list
            // $('.totalNum').html(result.data.totalCount)
            console.log("profession",html)
            $('#profession-team-list').html(html)
            if (result.page.totalCount < 10) {
              $('.profession-team-page-row').hide()
            } else {
              $('.profession-team-page-row').show()
            }
            if (result.page.totalCount == 0) {
              $('.profession-team-list').html(
                "<P class='noresult'>抱歉，没有相关成员</P>"
              )
            }
          } else {
            toastr.warning(result.msg)
          }
          // $('.my-loans-content .totalNum').text(result.data.totalCount)
        }
      }
    })
  }
  $(function() {
    $("#my-team").addClass("active");
    $(document).on('click','#create-team-btn',function(){
      createTeamModal.showModal()
    })
    $(document).on('click', '#join-team-btn', function() {
      joinTeamModal.showModal()
    })
    $(document).on('click', '#delete-btn', function() {
      console.log($(this).attr('data-id'))
      teamMemberDeleteModal.showModal($(this).attr('data-id'))
      return false
    })
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
      fetchData()
    },
    fetchData: fetchData
  }
})()
userCenter.init()
