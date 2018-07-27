
var lawyerCertification = (function() {
  var validate = $("#addMapServiceModal form").validate({
      rules: {
          name: {
              required: true,
              trim:true,
          },
          starttimeTemp: {
              required: true,
              trim:true
          },
          endtimeTemp: {
              required: true,
              trim:true,
          },
          srs: {
              required: true,
              trim:true,
          },
          type: {
              required: true,
              trim:true,
          },
          service_url: {
              required: true,
              trim:true,
          },
          format: {
              required: true,
              trim:true,
          },
          layers: {
              required: true,
              trim:true,
          },
          bounds: {
              required: true,
              trim:true,
          },
          resnums: {
              required: true,
              trim:true,
          },
          mservice_type: {
              required: true,
              trim:true,
          },
          legend: {
              required: true,
              trim:true,
          },
          tiff_url: {
              required: false,
              trim:false,
          },
      },
      messages: {
          name: {
              required: "请输入地图服务名称",
              trim:"请输入地图服务名称",
          },
          starttimeTemp: {
              required: "请输入开始时间和结束时间",
              trim:"请输入开始时间和结束时间"
          },
          endtimeTemp: {
              required: "请输入开始时间和结束时间",
              trim:"请输入开始时间和结束时间",
          },
          srs: {
              required: "请输入坐标系",
              trim:"请输入坐标系",
          },
          type: {
              required: "请输入地图服务类型",
              trim:"请输入地图服务类型",
          },
          service_url: {
              required: "请输入地图服务地址",
              trim:"请输入地图服务地址",
          },
          format: {
              required: "请输入图片格式",
              trim:"请输入图片格式",
          },
          layers: {
              required: "请输入图层资源",
              trim:"请输入图层资源",
          },
          bounds: {
              required: "请输入地理范围",
              trim:"请输入地理范围",
          },
          resnums: {
              required: "请输入层级范围",
              trim:"请输入层级范围",
          },
          mservice_type: {
              required: "请输入地图服务类型",
              trim:"请输入地图服务类型",
          },
          legend: {
              required: "请输入图例",
              trim:"请输入图例",
          },
      },
      errorPlacement: function (error, element) {
          element.siblings('.error-msg').html(error)
      },
      errorElement: 'span',
  });
  function queryTeams() {
      $({})._Ajax({
          url: 'team/queryTeams',
          success: function(result) {
              if (result.code == 0) {
                  lawyerCertification.Teams = result.data
                  $('#lawyer-team').html(template("lawyer-select-template",lawyerCertification.Teams));
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
                    $('#lawyer-language').html(template("lawyer-select-template",lawyerCertification.Language));
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
                    $('#lawyer-professional').html(template("lawyer-select-template",lawyerCertification.Professional));
                }else{
                    toastr.warning(result.msg)
                }
            }
        })
    }

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
          $(document).on('click','#my-certification .upload-btn-shenfenzheng',function (e) {
              e.stopPropagation();
              $('#upload-file-shenfenzheng').click();
              $('#upload-file-shenfenzheng').change(function () {
                  fileAjaxUpload($('#upload-file-shenfenzheng'),$('#upload-text-shenfenzheng'),1,$('#upload-show-shenfenzheng'))
              })
          })
          $(document).on('click','#my-certification .upload-btn-zhiyezheng',function (e) {
              e.stopPropagation();
              $('#upload-file-zhiyezheng').click();
              $('#upload-file-zhiyezheng').change(function () {
                  fileAjaxUpload($('#upload-file-zhiyezheng'),$('#upload-text-zhiyezheng'),1,$('#upload-show-zhiyezheng'))
              })
          })

          $(document).on('click','#my-certification .primary-btn',function (e) {
              e.stopPropagation();
              $('#my-certification .recommend-form')._Ajax({
                  url: "lawyer/saveLawyerInformation",
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
          })
      },
      Teams:[],//团队信息
      Language:[],//掌握语言
      Professional:[]//擅长领域
  }
})()
lawyerCertification.init()
