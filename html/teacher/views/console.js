function newStuScore() {
    $('#newScoreTbodys').html('');
    $.ajax({
        type: "POST",
        url: "/back/exam/newStuScore",
        dataType: "json",
        success: function(data){
            $.each(data.data,function(index,value){
                newTr = $('<tr>');
                newTr.append('<td onclick="stuInfo(\''+value.stuNumber+'\')">'+value.stuNumber+'</td>');
                newTr.append('<td onclick="stuInfo(\''+value.stuNumber+'\')">'+value.stuName+'</td>');
                newTr.append('<td onclick="stuInfo(\''+value.stuNumber+'\')">'+value.clazz+'</td>');
                newTr.append('<td>'+value.examCode+'</td>');
                newTr.append('<td>'+value.examName+'</td>');
                newTr.append('<td>'+value.examScore+'</td>');
                newTr.append('<td>'+value.stuScore+'</td>');
                newTr.append('<td>'+value.useTime+'</td>');
                newTr.append('<td><a class="layui-btn layui-btn-blue layui-btn-mini links_edit" href="#" onclick="stuExam(\''+value.stuNumber+'\',\''+value.examCode+'\',\'1\')"><i class="iconfont icon-edit"></i>答题情况</a>'
                +'<a class="layui-btn layui-btn-mini links_edit" href="#" onclick="stuInfo(\''+value.stuNumber+'\')"><i class="iconfont icon-edit"></i>个人信息</a></td>');
                $('#newScoreTbodys').append(newTr);
            });
        },
        error:function(e){
            console.log(e);
        }
    });
}

function stuInfo(stuNumber) {
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

function stuExam(stuNumber,examCode,code) {
    if (code=='0' || code==0) {
        layui.use('layer', function () {
            layui.layer.alert('<span style="font-size:16px;">未参加小测</span>', {icon: 2});
        });
    } else {
        layui = window.parent.layui;
        layui.use('layer', function () {
            layui.layer.open({
                type: 2,
                title: '小测情况',
                shadeClose: true,
                shade: false,
                //maxmin: true, //开启最大化最小化按钮
                area: ['100%', '100%'],
                content: '/html/exam/index.html?number=' + examCode + '&seeExamResult=1&stuNumber='+stuNumber
            });
        });
    }
}

newStuScore();