var stuNumber=window.location.href.split("=")[1];
$('#stuNumber').html(stuNumber);

function bigger(imgSrc) {
    layui.use('layer', function () {
    layui.layer.alert('<img src="'+imgSrc+'" style="height: 200px;">');
    });
}

function changeClazz(flag,clazz) {
    $('#clazz').html("");
    var collegeCode = $("#collegeCode").val();
    var year = $("#year").val();
    $.ajax({
        type: "POST",
        url: "/back/mb/listClazzByCY",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({collegeCode:collegeCode,year:year}),
        success: function(data){
            layui.use('form', function(){
                $.each(data.data,function(index,value){
                    $('#clazz').append('<option value="'+value.code+'">'+value.name+'</option>');
                });
                layui.form.render('select');
            });
            if (flag==1 || flag=='1') $('#clazz').val(clazz);
        },
        error:function(e){
            console.log(e);
        }
    });
}

function makeSelect(sex,collegeCode,year,clazz) {
    $.ajax({
        type: "POST",
        url: "/back/mb/collegeAndYear",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function(data){
            layui.use('form', function(){
                $.each(data.data.college,function(index,value){
                    $('#collegeCode').append('<option value="'+value.code+'">'+value.name+'</option>');
                });
                $.each(data.data.year,function(index,value){
                    $('#year').append('<option value="'+value.code+'">'+value.name+'</option>');
                });
                $('#sex').append('<option value="M">男</option>');
                $('#sex').append('<option value="G">女</option>');
                layui.form.render();
            });
            $('#sex').val(sex);
            $('#collegeCode').val(collegeCode);
            $('#year').val(year);
            changeClazz(1,clazz);
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
    data: JSON.stringify({userType:"student",number:stuNumber}),
    success: function(data){
        $('#img').append('<img id="img" src="'+data.data.img+'" onclick="bigger(\''+data.data.img+'\')" style="width: 100px;">')
        $('#stuName').val(data.data.name);
        $('#tel').val(data.data.tel);
        $('#email').val(data.data.email);
        makeSelect(data.data.sexCode,data.data.collegeCode,data.data.year,data.data.clazz);
    },
    error:function(e){
        console.log(e);
    }
});

layui.use(['form','layer'], function () {
    layui.form.on("select(collegeCode)",function () {
        changeClazz(0,"");
    });

    layui.form.on("select(year)",function () {
        changeClazz(0,"");
    });

    layui.form.on('submit(changeInfo)', function(dataForm){
        jsonData = {
            userType:"student",
            number:$('#stuNumber').html(),
            name:$('#stuName').val(),
            sex:$('#sex').val(),
            tel:$('#tel').val(),
            email:$('#email').val(),
            clazz:$('#clazz').val()
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
            userType:"student",
            number:$('#stuNumber').html()
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