var userCenter = (function() {
  function getParams(params) {
    var paramStr = ''
    for (var key in params) {
      if (params[key]) {
        paramStr += key + '=' + params[key] + '&'
      }
    }
    return paramStr.slice(0, -1)
  }
  function updateProfile() {
    var paramsObj = {}
    //遍历input
    $('.form-group input')
      .serializeArray()
      .forEach(input => {
        paramsObj[input.name] = input.value
      })
    //遍历select
    $('.form-group select')
      .serializeArray()
      .forEach(input => {
        paramsObj[input.name] = input.value
      })
    console.log(profile_validate.form())
    $({})._Ajax({
      url:
        '/client/updateClientAndCompany?clientId=' +
        clientId +
        '&' +
        getParams(paramsObj)
    })
  }
  function initForm() {
    if (!clientId) {
      console.error('该用户未完善信息没有clientId')
    }
    $({})._Ajax({
      url: '/client/queryClientAndCompany?clientId=' + clientId,
      success: function(result) {
        console.log(result)
        $('.my-profile-content').html(template('profile-template', result))
        //自定义正则表达示验证方法
        $.validator.addMethod('idcard', function(value, element, params) {
          // 身份证验证
          var idcard = regexs.idcard
          return idcard.test(value)
        })
        $.validator.addMethod('mobile', function(value, element, params) {
          var mobile = regexs.mobile // 密码验证
          return mobile.test(value)
        })
        //表单验证
        profile_validate = $('#profile-form').validate({
          rules: {
            mobile: {
              mobile: true
            },
            email: {
              email: true
            },
            idcard: {
              idcard: true
            }
          },
          messages: {
            mobile: {
              required: '请输入有效的手机号码',
              mobile: '请输入正确的手机号码以13X 15X 18X 14X 17X号段开头'
            },
            email: {
              email: '请输入正确的邮箱地址'
            },
            idcard: {
              idcard: '请输入正确的身份证号码'
            }
          },
          errorPlacement: function(error, element) {
            element.siblings('.error-div').html(error)
            element.focus()
          }
        })
        $('#submit-btn').click(function(e) {
          e.stopPropagation()
          if (profile_validate.form()) {
            updateProfile()
          }
        })
      }
    })
  }

  $(function() {})
  return {
    init: function() {
      initForm()
    }
  }
})()
userCenter.init()
