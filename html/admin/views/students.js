function changeClazz() {
    $('#clazz').html("");
    $('#clazz').append('<option value="0">全部</option>');
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
        },
        error:function(e){
            console.log(e);
        }
    });
}

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
            layui.form.render();
        });
        changeClazz();
    },
    error:function(e){
        console.log(e);
    }
});

layui.use(['form','layer'], function () {
    layui.form.on("select(collegeCode)",function () {
        changeClazz();
    });

    layui.form.on("select(year)",function () {
        changeClazz();
    });

    layui.form.on('submit(formSubmit)', function(dataForm){
        pageStudent();
        return false;
    });
});

function seeInfo(stuNumber) {
    layui = window.parent.layui;
    layui.use('layer', function () {
        layui.layer.open({
            type: 2,
            title: '学生信息',
            // shadeClose: false,
            // shade: false,
            //maxmin: true, //开启最大化最小化按钮
            area: ['90%', '90%'],
            content: '/html/common/stuInfo.html?stuNumber='+stuNumber
        });
    });
}

function updateInfo(stuNumber) {
    layui = window.parent.layui;
    layui.use('layer', function () {
        layui.layer.open({
            type: 2,
            title: '修改学生信息',
            // shadeClose: false,
            // shade: false,
            //maxmin: true, //开启最大化最小化按钮
            area: ['90%', '90%'],
            content: '/html/common/stuUpdate.html?stuNumber='+stuNumber
        });
    });
}

function deleteInfo(number) {
    layer.confirm('确定要删除该学生吗？', {
        btn: ['确定','取消'], //按钮
    }, function(index){
        $.ajax({
            type: "POST",
            url: "/back/user/deleteUser",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({userType:"student",number:number}),
            success: function(data){
                if (data.data!=undefined && data.data!=null && data.data!='' && data.data!='0' && data.data!=0) {
                    layui.use('layer', function () {
                        layui.layer.alert('<span style="font-size:16px;">删除成功</span>', {icon: 1});
                    });
                } else {
                    layui.use('layer', function () {
                        layui.layer.alert('<span style="font-size:16px;">删除失败</span>', {icon: 2});
                    });
                }
            },
            error:function(e){
                console.log(e);
            }
        });
        layer.close(index);
    });
}

function pageStudent() {
    collegeCode = $('#collegeCode').val();
    year = $('#year').val();
    clazz = $('#clazz').val();
    sex = $('#sex').val();
    term = encodeURIComponent($('#term').val());
    $('#students').html("");
    layui.use('table', function () {
        var table = layui.table;
        table.render({
            elem: '#students',
            url: '/back/manage/pageStudent?collegeCode='+collegeCode+'&year='+year+'&clazz='+clazz+'&sex='+sex+'&term='+term,
            page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
                layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'], //自定义分页布局
                limits: [10, 15, 20],
                limit: 10,
                curr: 1,
                groups: 5, //只显示 1 个连续页码
                first: '首页',
                last: '尾页',
                skin: 'row',
                page: true,
                even: true,
                done: function (res) {
                    userPage.data = res.data;
                }
            },
            cols: [[
                {field: 'number', width:120, title: '学号', sort: true},
                {field: 'name', width:80, title: '姓名', sort: true},
                {field: 'sex', width:80, title: '性别', sort: true},
                {field: 'college', title: '学院', sort: true},
                {field: 'clazz',width:100, title: '班级号', sort: true},
                {
                    field: 'action', title: '操作', sort: true, templet:function(data) {
                        return '<a class="layui-btn layui-btn-radius layui-btn-sm layui-btn-normal" href="#" onclick="seeInfo(\''+data.number+'\')">查看</a>'
                            +'<a class="layui-btn layui-btn-radius layui-btn-sm" href="#" onclick="updateInfo(\''+data.number+'\')">修改</a>'
                            +'<a class="layui-btn layui-btn-radius layui-btn-sm layui-btn-danger" href="#" onclick="deleteInfo(\''+data.number+'\')">删除</a>';
                    }
                }
            ]]
        });
    });
}

layui.use('upload', function(){
    var upload = layui.upload;
     
    //执行实例
    var uploadInst = upload.render({
      elem: '#insert' //绑定元素
      ,url: '/back/manage/insert?type=student' //上传接口
      ,accept: 'file'
      ,done: function(res){
        //上传完毕回调
        if (res.data.msg!='ok') {
            layui.use('layer', function () {
                layui.layer.alert('<span style="color:red; font-size:16px;">'+res.data.msg+'</span>', {icon: 2});
            });
            return;
        }
        if (res.data.fail=='0') {
            layui.use('layer', function () {
                layui.layer.alert('<span style="font-size:16px;">全部数据上传成功，共'+res.data.success+'条</span>', {icon: 1});
            });
        } else {
            $('#errorTbodys').html('');
            $('#errorSpan').html("以下是导入出错的信息，共"+res.data.fail+"条  ");
            $.each(res.data.dataList, function (index, value) {
                newTr = $('<tr>');

                td1 = $('<td>');
                td1.html(value[0]);
                newTr.append(td1);
                
                td2 = $('<td>');
                td2.html(value[1]);
                newTr.append(td2);
                
                td3 = $('<td>');	
                td3.html(value[2]);
                newTr.append(td3);
                
                td4 = $('<td>');
                td4.html(value[3]);
                newTr.append(td4);

                td5 = $('<td>');
                td5.html(value[4]);
                newTr.append(td5);

                td6 = $('<td>');
                td6.html(value[5]);
                newTr.append(td6);

                td7 = $('<td>');
                td7.html(value[6]);
                newTr.append(td7);

                td8 = $('<td>');
                td8.html(value[7]);
                newTr.append(td8);

                $('#errorTbodys').append(newTr);
            });
            $('#errorExcel').attr("href","/back/manage/insertError?type=student&uuid="+res.data.uuid);
            $('#insertError').css('display','block');
            window.location.hash = "#insertError";
            layui.use('layer', function () {
                layui.layer.alert('<span style="color:red; font-size:16px;">部分数据上传失败，成功'+res.data.success+'条，失败'+res.data.fail+'条</span>', {icon: 2});
            });
        }
      }
      ,error: function(){
        //请求异常回调
      }
    });
  });