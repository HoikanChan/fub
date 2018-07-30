
var lawyerCertification = (function() {
    $("#my-certification").addClass("active");
  var validate = $("#certification-form").validate({
      rules: {
          realname: {
              required: true,
              trim:true,
          },
          idcard: {
              required: true,
              trim:true,
              idcard:true
          },
          sex: {
              required: true,
              trim:true,
          },
          email: {
              required: true,
              trim:true,
              email:true
          },
          officeId: {
              required: true,
              trim:true,
          },
          licenseNo: {
              required: true,
              trim:true,
              licenseNo:true
          },
          workBaginDate: {
              required: true,
              trim:true,
          },
          recommendMobile: {
              required: true,
              trim:true,
              mobile:true
          },
          recommendId: {
              required: true,
              trim:true,
          },
          teamId: {
              required: true,
              trim:true,
          },
          languages: {
              required: true,
              trim:true,
          },
          professions: {
              required: true,
              trim:true,
          },
          introduction: {
              required: true,
              trim:true,
          },
          idcardUrl: {
              required: true,
              trim:true,
          },
          licenseUrl: {
              required: true,
              trim:true,
          },
          idcardUrlBack: {
              required: true,
              trim:true,
          },
          licenseUrlBack: {
              required: true,
              trim:true,
          },
      },
      messages: {
          realname: {
              required: "请输入姓名",
              trim:"请输入姓名",
          },
          idcard: {
              required: "请输入身份证号码",
              trim:"请输入身份证号码",
              idcard:"请输入正确的身份证号码"
          },
          sex: {
              required: "请选择性别",
              trim:"请选择性别",
          },
          email: {
              required: "请输入邮箱",
              trim:"请输入邮箱",
              email:"请输入正确的邮箱"
          },
          officeId: {
              required: "请选择所属律所",
              trim:"请选择所属律所",
          },
          licenseNo: {
              required: "请输入律师证号",
              trim:"请输入律师证号",
              licenseNo:"请输入正确的律师证号"
          },
          workBaginDate: {
              required: "请选择起始时间",
              trim:"请输入姓名",
          },
          recommendMobile: {
              required: "请输入引荐人手机号",
              trim:"请输入引荐人手机号",
              mobile:"请输入正确的手机号"
          },
          recommendId: {
              required: "请输入引荐人姓名",
              trim:"请输入引荐人姓名",
          },
          teamId: {
              required: "请选择引荐人所属团队",
              trim:"请选择引荐人所属团队",
          },
          languages: {
              required: "请选择掌握语言",
              trim:"请选择掌握语言",
          },
          professions: {
              required: "请选择擅长领域",
              trim:"请选择擅长领域",
          },
          introduction: {
              required: "请输入个人简介",
              trim:"请输入个人简介",
          },
          idcardUrl: {
              required: "请上传身份证正面照",
              trim:"请上传身份证正面照",
          },
          licenseUrl: {
              required: "请上传执业证书正面照",
              trim:"请上传执业证书正面照",
          },
          idcardUrlBack: {
              required: "请上传身份证背面照",
              trim:"请上传身份证背面照",
          },
          licenseUrlBack: {
              required: "请上传执业证书背面照",
              trim:"请上传执业证书背面照",
          },
      },
      errorPlacement: function (error, element) {
          element.siblings('.error-div').html(error)
      },
      errorElement: 'div',
  });
  function queryTeams() {
      $({})._Ajax({
          url: 'team/queryTeams',
          success: function(result) {
              if (result.code == 0) {
                  lawyerCertification.Teams = result.data
                  $('#selectOfficeId').html(template("lawyer-select-template",lawyerCertification.Teams));
              }else{
                toastr.warning(result.msg)
              }

          }
      })
  }
    function queryLanguage() {
        $({})._Ajax({
            url: 'language/queryLanguage',
            success: function(result) {
                if (result.code == 0) {
                    lawyerCertification.Language = result.data
                    $('#selectLanguages').html(template("lawyer-select-template",lawyerCertification.Language));
                }else{
                    toastr.warning(result.msg)
                }
            }
        })
    }
    function queryProfessional() {
        $({})._Ajax({
            url: 'professional/queryProfessional',
            success: function(result) {
                if (result.code == 0) {
                    lawyerCertification.Professional = result.data
                    $('#selectProfessions').html(template("lawyer-select-template",lawyerCertification.Professional));
                }else{
                    toastr.warning(result.msg)
                }
            }
        })
    }
    //http://120.24.181.248:8080/lvswbao-admin/client/queryByMobile?mobile=15920683372

    //http://120.24.181.248:8080/lvswbao-admin/lawyer/queryMyTeam?mobile=13537086079

  return {
      init: function() {
       
          var start = {
              isinitVal: true,
              //initDate:[{DD:"0"},true],
              format: "YYYY-MM-DD",
              zIndex: 99999,
              isok:false,
              okfun: function (elem) {
                  console.log(elem.val)
              },
          };

          $(document).ready(function () {
              queryTeams();
              queryLanguage();
              queryProfessional();
              $('#startTime').jeDate(start);
          })
          //上传执业证
          $(document).on('blur','#inputMobile',function (e) {
              e.stopPropagation();
              if(regexs.mobile.test($(this).val())){
                  $({mobile:$(this).val()})._Ajax({
                      url: 'client/queryByMobile',
                      success: function(result) {
                          if (result.code == 0) {
                              $('#selectRecommendId').html('<option value="'+result.client.clientId+'">'+result.client.realname+'</option>');
                          }else{
                              toastr.warning(result.msg)
                          }
                      }
                  })
                  $({mobile:$(this).val()})._Ajax({
                      url: 'lawyer/queryMyTeam',
                      success: function(result) {
                          if (result.code == 0) {
                              var html = '';
                              result.data.forEach(function (t) {
                                  html += '<option value="'+t.teamId+'">'+t.teamName+'</option>';
                              })
                              $('#selectTeamId').html(html);
                          }else{
                              toastr.warning(result.msg)
                          }
                      }
                  })
              }else{
                  toastr.warning("请输入正确的手机号")
              }

          })
          //上传身份证正
          $(document).on('click','#my-certification .upload-btn-shenfenzheng',function (e) {
              e.stopPropagation();
              $('#upload-file-shenfenzheng').click();
              $('#upload-file-shenfenzheng').change(function () {
                  fileAjaxUpload($('#upload-file-shenfenzheng'),$('#upload-text-shenfenzheng'),1,$('#upload-show-shenfenzheng'))
              })
          })
          //上传身份证背
          $(document).on('click','#my-certification .upload-btn-shenfenzhengBack',function (e) {
              e.stopPropagation();
              $('#upload-file-shenfenzhengBack').click();
              $('#upload-file-shenfenzhengBack').change(function () {
                  fileAjaxUpload($('#upload-file-shenfenzhengBack'),$('#upload-text-shenfenzhengBack'),1,$('#upload-show-shenfenzhengBack'))
              })
          })
          //上传执业证正
          $(document).on('click','#my-certification .upload-btn-zhiyezheng',function (e) {
              e.stopPropagation();
              $('#upload-file-zhiyezheng').click();
              $('#upload-file-zhiyezheng').change(function () {
                  fileAjaxUpload($('#upload-file-zhiyezheng'),$('#upload-text-zhiyezheng'),1,$('#upload-show-zhiyezheng'))
              })
          })
          //上传执业证背
          $(document).on('click','#my-certification .upload-btn-zhiyezhengBack',function (e) {
              e.stopPropagation();
              $('#upload-file-zhiyezhengBack').click();
              $('#upload-file-zhiyezhengBack').change(function () {
                  fileAjaxUpload($('#upload-file-zhiyezhengBack'),$('#upload-text-zhiyezhengBack'),1,$('#upload-show-zhiyezhengBack'))
              })
          })
            //提交认证
          $(document).on('click','#my-certification .primary-btn',function (e) {
              e.stopPropagation();
              if(validate.form()){
                  $('#certification-form')._Ajax({
                      url: "lawyer/saveLawyerInformationBySite",
                      type:"post",
                      dataType:"json",
                      success: function (result) {
                          if (result.code == '0') {
                              toastr.success(result.msg);
                          }else{
                              toastr.error(result.msg);
                          }

                      }
                  })
              }
          })
      },
      Teams:[],//团队信息
      Language:[],//掌握语言
      Professional:[]//擅长领域
  }
})()
lawyerCertification.init()
