
var officeCertification = (function() {
  var validate = $("#certification-form").validate({
      rules: {
          realname: {
              required: true,
              trim:true,
          },
          principal: {
              required: true,
              trim:true
          },
          mobile: {
              required: true,
              trim:true,
              mobile:true
          },
          email: {
              required: true,
              trim:true,
              email:true
          },
          cityId: {
              required: true,
              trim:true,
          },
          address: {
              required: true,
              trim:true,
          },
          officeMobile: {
              required: true,
              trim:true,
              telephone:true
          },
          adminPrincipal: {
              required: true,
              trim:true,
          },
          adminMobile: {
              required: true,
              trim:true,
              mobile:true
          },
          licenseNo: {
              required: true,
              trim:true,
              licenseNo:true
          },
          introduction: {
              required: true,
              trim:true,
          },
          businessUrl: {
              required: true,
              trim:true,
          },
          licenseUrl: {
              required: true,
              trim:true,
          },
      },
      messages: {
          realname: {
              required: "请输入律所名称",
              trim:"请输入律所名称",
          },
          principal: {
              required: "请输入律所负责人",
              trim:"请输入律所负责人"
          },
          mobile: {
              required: "请输入负责人手机号",
              trim:"请输入负责人手机号",
              mobile:"请输入正确负责人手机号"
          },
          email: {
              required: "请输入邮箱",
              trim:"请输入邮箱",
              email:"请输入正确邮箱"
          },
          cityId: {
              required: "请选择省/市",
              trim:"请选择省/市",
          },
          address: {
              required: "请输入详细地址",
              trim:"请输入详细地址",
          },
          officeMobile: {
              required: "请输入律所联系电话",
              trim:"请输入律所联系电话",
              telephone:"请输入正确律所联系电话"
          },
          adminPrincipal: {
              required: "请输入行政负责人",
              trim:"请输入行政负责人",
          },
          adminMobile: {
              required: "请输入行政负责人电话",
              trim:"请输入行政负责人电话",
              mobile:"请输入正确行政负责人电话"
          },
          licenseNo: {
              required: "请输入营业执证号",
              trim:"请输入营业执证号",
              licenseNo:"请输入正确营业执证号"
          },
          introduction: {
              required: "请输入律所简介",
              trim:"请输入律所简介",
          },
          businessUrl: {
              required: "请上传营业执照",
              trim:"请上传营业执照",
          },
          licenseUrl: {
              required: "请上传律所执业许可证",
              trim:"请上传律所执业许可证",
          },
      },
      errorPlacement: function (error, element) {
          element.siblings('.error-div').html(error)
      },
      errorElement: 'div',
  });

  return {
      init: function() {

          $(document).ready(function () {
              if(/^[0-9]*[1-9][0-9]*$/.test(officeId)){
                  $({id:officeId})._Ajax({
                      url:'office/api/info',
                      success:function (result) {
                          if(result.code==0){
                              officeCertification.officeInfo = result.data;
                              if(result.data.status == -2){
                                  $('#certification-form').html(template("office-edit-template",result.data));
                              }else {
                                  $('#certification-form').html(template("office-read-template",result.data));
                              }
                              $('.auth-process').html(template("office-authprocess-template",result.data));
                              //地区选择
                              init_city_select($("#area-select"));
                          }else{
                              toastr.warning(result.msg)
                          }
                      }
                  })
              }else{
                  $('#certification-form').html(template("office-add-template"));
                  $('.auth-process').html(template("office-authprocess-template"));
                  //地区选择
                  init_city_select($("#area-select"));
              }
          })
          //图片预览
          $(document).on('click','#certification-form img',function (e) {
              e.stopPropagation();
              imagePreview.showDataDetailDialog2($(this).attr('src'));
          })
          //上传营业执照
          $(document).on('click','#my-certification .upload-btn-businessUrl',function (e) {
              e.stopPropagation();
              $('#upload-file-businessUrl').click();
              $('#upload-file-businessUrl').change(function () {
                  fileAjaxUpload($('#upload-file-businessUrl'),$('#upload-text-businessUrl'),1,$('#upload-show-businessUrl'),null,2)
              })
          })
          //上传执业执照
          $(document).on('click','#my-certification .upload-btn-zhiyezheng',function (e) {
              e.stopPropagation();
              $('#upload-file-zhiyezheng').click();
              $('#upload-file-zhiyezheng').change(function () {
                  fileAjaxUpload($('#upload-file-zhiyezheng'),$('#upload-text-zhiyezheng'),1,$('#upload-show-zhiyezheng'),null,2)
              })
          })
            //提交认证
          $(document).on('click','#my-certification .primary-btn',function (e) {
              e.stopPropagation();
              if($("#agreement-checkbox").is(':checked')){
                  if(validate.form()){
                      var formData = $('#certification-form').serializeObject();
                      formData.cityId = $('#certification-form input[name=cityId]').attr('area-id');
                      $(formData)._Ajax({
                          url: "office/saveOfficeInformation",
                          type:"post",
                          dataType:"json",
                          success: function (result) {
                              if (result.code == '0') {
                                  toastr.success('提交成功');
                              }else{
                                  toastr.error(result.msg);
                              }

                          }
                      })
                  }else {
                      toastr.warning("请填写完整资料");
                  }
              }else{
                  toastr.warning("先同意《用户须知》");
              }
          })
      },
      officeInfo:null
  }
})()
officeCertification.init()
