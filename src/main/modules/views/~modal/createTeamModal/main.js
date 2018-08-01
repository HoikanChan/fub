var createTeamModal = (function() {
  var modal = $('#createTeamModal').remodal()
  var id = ''
  var step = 1
  var pickedOptions = []
  var pickedMembers = []
  //step2 收集的表单数据
  var step2Form

  /*拇指图弹出*/
  function showModal(id) {
    id = id
    step = 1
    pickedOptions = []
    pickedMembers = []
    $('#step1').addClass('stepNow')
    $('#step1').html('')
    $('#step2').html('')
    $('#step3').html('')
    $({})._Ajax({
      url: 'professional/queryProfessional',
      success: function(result) {
        if (result.code == 0) {
          $('#createTeamModal #step1').html(template('step1-template', result))
          var options = result.data.reduce(function(result, item) {
            return result.concat(item.sub)
          }, [])
        } else {
          toastr.warning(result.msg)
        }
      }
    })
  }
  //步骤1：选择专业
  $(document).on('click', '#createTeamModal .step-option', function(e) {
    e.stopPropagation()
    var pickedId = $(this).attr('data-id')
    if ($(this).hasClass('picked')) {
      $(this).removeClass('picked')
      pickedOptions = pickedOptions.filter(function(option) {
        return option !== pickedId
      })
    } else {
      if (pickedOptions.length < 5) {
        $(this).addClass('picked')
        pickedOptions.push(pickedId)
      } else {
        toastr.warning('专业类别限选五项')
      }
    }
  })
  //步骤二：上传图标
  $(document).on('click', '#createTeamModal .upload-btn-shenfenzheng', function(
    e
  ) {
    e.stopPropagation()
    $('#upload-file-shenfenzheng').click()
    $('#upload-file-shenfenzheng').change(function() {
      fileAjaxUpload(
        $('#upload-file-shenfenzheng'),
        $('#upload-text-shenfenzheng'),
        1,
        $('#upload-show-shenfenzheng'),
        null,
        1
      )
    })
  })
  //步骤三：选择成员 加成员
  $(document).on(
    'click',
    '#createTeamModal .members-wrapper .member',
    function() {
      pickedMembers.push($(this).attr('member-id'))
      $(this)
        .clone()
        .appendTo('.picked-member')
      $(this).remove()
      $('.member-count').html(pickedMembers.length)
    }
  )
  //步骤三：选择成员 去掉成员
  $(document).on(
    'click',
    '#createTeamModal .picked-member .member',
    function() {
      var pickedId = $(this).attr('member-id')
      pickedMembers = pickedMembers.filter(function(id) {
        return id !== pickedId
      })
      $(this)
        .clone()
        .appendTo('.members-wrapper')
      $(this).remove()
      $('.member-count').html(pickedMembers.length)
    }
  )
  //步骤切换
  $(document).on('click', '#createTeamModal #next-step-btn', e => {
    e.stopPropagation()
    step++
    if (step === 2) {
      $('.step-content').each(function(index) {
        if (index + 1 === 2) {
          $(this).addClass('stepNow')
        } else {
          $(this).removeClass('stepNow')
        }
      })
      $('#createTeamModal #step2').html(template('step2-template', {}))
      init_city_select($('#area-select'))
    }
    if (step === 3) {
      step2Form = $('#info-form').serializeObject()
      $('#createTeamModal #step3').html(template('step3-template', {}))
      $('.step-content').each(function(index) {
        if (index + 1 === 3) {
          $(this).addClass('stepNow')
        } else {
          $(this).removeClass('stepNow')
        }
      })
      $({})._Ajax({
        url: 'lawyer/queryAllLawyer?status=1',
        success: function(result) {
          if (result.code == 0) {
            console.log(result)
            $('#createTeamModal #step3').html(
              template('step3-template', result)
            )
          } else {
            toastr.warning(result.msg)
          }
        }
      })
    }
    if (step === 4) {
      var params = Object.assign({}, step2Form)
      if (step2Form.courtCityId && step2Form.courtCityId !== '全部') {
        geoArray = step2Form.courtCityId.split('-')
        params.provinceName = geoArray[0]
        params.cityName = geoArray[1]
      }
      delete params.courtCityId
      //如果图片路径有host就去掉
      if (params.avatar.includes(api.host)) {
        params.avatar = step2Form.avatar.split(api.host).join('')
      }
      params.profession = pickedOptions.join(',')
      params.lawyers = pickedMembers.join(',')
      params.owner = lawyerId
      for(var key in params){
        if(params[key] === undefined || params[key] === null){
          delete params[key]
        }
      }
      $(params)._Ajax({
        url: 'team/api/saveTeamInformation',
        success: function(result) {
          if (result.code == 0) {
            toastr.success('创建成功')
          } else {
            toastr.warning(result.msg)
          }
          modal.close()
        }
      })
    }
  })
  $(document).on('click', '#createTeamModal #step-back-btn', e => {
    $('.step-content').removeClass('stepNow')
    $('#step' + (step - 1)).addClass('stepNow')
    step--
    console.log(step)
  })

  return {
    showModal: showModal,
    id: '',
    modal: modal
  }
})()
