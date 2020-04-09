var number=window.location.href.split("=")[1];
$('#number').html(number);

function bigger(imgSrc) {
    layui.use('layer', function () {
    layui.layer.alert('<img src="'+imgSrc+'" style="height: 200px;">');
    });
}

function makeSelect(sex,collegeCode) {
    $.ajax({
        type: "POST",
        url: "/back/mb/listCollege",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function(data){
            layui.use('form', function(){
                $.each(data.data,function(index,value){
                    $('#collegeCode').append('<option value="'+value.code+'">'+value.name+'</option>');
                });
                $('#sex').append('<option value="M">男</option>');
                $('#sex').append('<option value="G">女</option>');
                layui.form.render();
            });
            $('#sex').val(sex);
            $('#collegeCode').val(collegeCode);
        },
        error:function(e){
            console.log(e);
        }
    });
}

$.ajax({
    type: "POST",
    url: "/back/user/getUserInfo",
    dataType: "json",
    contentType: "application/json;charset=utf-8",
    data: JSON.stringify({userType:"teacher",number:number}),
    success: function(data){
        $('#img').append('<img id="img" src="'+data.data.img+'" onclick="bigger(\''+data.data.img+'\')" style="width: 100px;">')
        $('#name').val(data.data.name);
        $('#tel').val(data.data.tel);
        $('#email').val(data.data.email);
        makeSelect(data.data.sexCode,data.data.collegeCode);
    },
    error:function(e){
        console.log(e);
    }
});

layui.use(['form','layer'], function () {
    layui.form.on('submit(changeInfo)', function(dataForm){
        jsonData = {
            userType:"teacher",
            number:$('#number').html(),
            name:$('#name').val(),
            sex:$('#sex').val(),
            tel:$('#tel').val(),
            email:$('#email').val(),
            collegeCode:$('#collegeCode').val()
        };
        $.ajax({
            type: "POST",
            url: "/back/user/updateInfo",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(jsonData),
            success: function(data){
                if (data.data!=undefined && data.data!=null && data.data!='' && data.data!='0' && data.data!=0) {
                    layui.use('layer', function () {
                        layui.layer.alert('<span style="font-size:16px;">修改成功</span>', {icon: 1});
                    });
                } else {
                    layui.use('layer', function () {
                        layui.layer.alert('<span style="font-size:16px;">修改失败</span>', {icon: 2});
                    });
                }
            },
            error:function(e){
                console.log(e);
            }
        });
        return false;
    });

    layui.form.on('submit(changePassword)', function(dataForm){
        jsonData = {
            userType:"teacher",
            number:$('#number').html()
        };
        $.ajax({
            type: "POST",
            url: "/back/user/resetPassword",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(jsonData),
            success: function(data){
                if (data.data!=undefined && data.data!=null && data.data!='' && data.data!='0' && data.data!=0) {
                    layui.use('layer', function () {
                        layui.layer.alert('<span style="font-size:16px;">重置成功</span>', {icon: 1});
                    });
                } else {
                    layui.use('layer', function () {
                        layui.layer.alert('<span style="font-size:16px;">重置失败</span>', {icon: 2});
                    });
                }
            },
            error:function(e){
                console.log(e);
            }
        });
        return false;
    });
});