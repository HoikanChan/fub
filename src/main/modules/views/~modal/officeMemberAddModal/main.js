var officeMemberAddModal = (function() {
  var modal = $('#officeMemberAddModal').remodal()

      $(document).on('click',"#upload-show-zhiyezheng",function(){
        window.open($(this).attr('src'))
      })
    function showModal() {
        $('#officeMemberAdd-form').html(template("officeMemberAdd-form-template"));
    }
    showModal()
    var validate = $("#officeMemberAdd-form").validate({
        rules: {
            realname: {
                required: true,
                trim:true,
            },
            nickname: {
                required: true,
                trim:true,
            },
            password: {
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
            education: {
                required: true,
                trim:true
            },
            school: {
                required: true,
                trim:true
            },
            isMarried: {
                required: true,
                trim:true
            },
            address: {
                required: true,
                trim:true
            },
            bankNo: {
                required: true,
                trim:true,
                bankNo:true
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
            licenseUrl: {
                required: true,
                trim:true,
            },
        },
        messages: {
            realname: {
                required: "请输入姓名",
                trim:"请输入姓名",
            },
            nickname: {
                required: "请输入昵称",
                trim:"请输入昵称",
            },
            password: {
                required: "请设置密码",
                trim:"请设置密码",
                password:"6-16位非数字开头的字母与数字组合"
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
            mobile: {
                required: "请输入手机号码",
                trim:"请输入手机号码",
                mobile:"请输入正确的手机号码"
            },
            email: {
                required: "请输入邮箱",
                trim:"请输入邮箱",
                email:"请输入正确的邮箱"
            },
            education: {
                required: "请选择最高学历",
                trim:"请选择最高学历"
            },
            school: {
                required: "请输入毕业院校",
                trim:"请输入毕业院校"
            },
            isMarried: {
                required: "请选择婚姻状况",
                trim:"请选择婚姻状况"
            },
            address: {
                required: "请输入居住地址",
                trim:"请输入居住地址"
            },
            bankNo: {
                required: "请输入银行账号",
                trim:"请输入银行账号",
                bankNo:"请输入正确的银行账号"
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
            licenseUrl: {
                required: "请上传执业证书正面照",
                trim:"请上传执业证书正面照",
            },
        },
        errorPlacement: function (error, element) {
            element.siblings('.error-div').html(error)
        },
        errorElement: 'div',
    });
    function queryAllOffice() {
        $({})._Ajax({
            url: 'office/queryAll',
            success: function(result) {
                if (result.code == 0) {
                    //officeMemberAddModal.Offices = result.list;
                    $('#selectOfficeId').html(template("lawyer-select-office-template",{list:result.list,officeId:officeId}));
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
                    //officeMemberAddModal.Language = result.data;
                    $('#selectLanguages').html(template("lawyer-select-languages-template",{list:result.data}));
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
                    //officeMemberAddModal.Professional = result.data;
                    $('#selectProfessions').html(template("lawyer-select-professions-template",{list:result.data}));
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
            $('#startTime').jeDate(start);
            queryAllOffice();
            queryLanguage();
            queryProfessional();
        })

        //上传执业证正
        $(document).on('click','#officeMemberAdd-form .upload-btn-zhiyezheng',function (e) {
            e.stopPropagation();
            $('#upload-file-zhiyezheng').click();
            $('#upload-file-zhiyezheng').change(function () {
                fileAjaxUpload($('#upload-file-zhiyezheng'),$('#upload-text-zhiyezheng'),1,$('#upload-show-zhiyezheng'),null,1)
            })
        })
        //提交认证
        $(document).on('click','#officeMemberAdd-form .primary-btn',function (e) {
            e.stopPropagation();
            if(validate.form()){
                var formData = $('#officeMemberAdd-form').serializeObject();
                formData.languages = formData['languages[]'].toString();
                formData.professions = formData['professions[]'].toString();
                $(formData)._Ajax({
                    url: "office/addLawyerByOffice",
                    type:"post",
                    dataType:"json",
                    success: function (result) {
                        if (result.code == '0') {
                            toastr.success(result.msg);
                            $('#officeMemberAddModal button[data-remodal-action="close"]').trigger('click');
                            userCenter.getList();
                        }else{
                            toastr.error(result.msg);
                        }

                    }
                })
            }else {
                toastr.warning("请填写完整资料");
            }
        })
    },
    showModal:showModal
    // Offices:[],//律所信息
    // Language:[],//掌握语言
    // Professional:[]//擅长领域
  }
})()
officeMemberAddModal.init()
