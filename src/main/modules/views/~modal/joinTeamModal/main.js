var joinTeamModal = (function() {
  var modal = $('#joinTeamModal').remodal()
  console.log(modal)
  var id = ''

  function getTeams(params) {
    $(params ? params : {})._Ajax({
      url: 'team/queryAllTeams',
      success: function(result) {
        if (result.code == 0) {
          if (result.data.length !== 0) {
            result.host = api.host
            $('.teams-wrapper').html(template('teams-template', result))
          } else {
            $('.teams-wrapper').html('<br><h3>无符合条件的团队</h3>')
          }
        } else {
          toastr.warning(result.msg)
        }
      }
    })
  }
  $(document).on('click', '#joinTeamModal #search-btn', function(e) {
    e.stopPropagation()
    var params = $('#search-form').serializeObject()
    params.cityId = $('#area-select').attr('area-id')
    console.log(params)
    getTeams(params)
  })
  $(document).on('click', '#joinTeamModal #join-btn', function(e) {
    e.stopPropagation()
    if ($(this).hasClass('joined')) {
      return false
    }
    var _this = this
    $({ teamId: $(this).attr('team-id'), lawyerId: lawyerId })._Ajax({
      url: 'team/joinTeam',
      success: function(result) {
        if (result.code == 0) {
          console.log($(_this))
          $(_this)
            .html('已加入')
            .removeClass('footer-btn')
            .addClass('joined')
        } else {
          toastr.warning(result.msg)
        }
      }
    })
  })
  /*拇指图弹出*/
  function showModal() {
    getTeams()
    init_city_select($('#area-select'))

    $({})._Ajax({
      url: 'professional/queryProfessional',
      success: function(result) {
        if (result.code == 0) {
          var options = result.data.reduce(function(result, item) {
            return result.concat(item.sub)
          }, [])
          console.log(options)
          options.forEach(function(option) {
            var optHtml =
              "<option value='" + option.id + "'>" + option.name + '</option>'
            $('#profession-select').append(optHtml)
          })
        } else {
          toastr.warning(result.msg)
        }
      }
    })
  }
  return {
    showModal: showModal,
    id: '',
    modal: modal
  }
})()
