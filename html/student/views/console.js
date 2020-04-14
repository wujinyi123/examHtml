function showTable(data) {
    $('#thisTbodys').html('');
    index = '';
    if (data.myScore!='无') {
        index = 1;
    } else if (data.remark=='1') {
        index = 0;
    } else {
        index = 2;
    }

    remark = ['<a class="layui-btn layui-btn-radius layui-btn-sm" href="#" onclick="enterExam(\''+data.examCode+'\')">进入考试</a>',
    '<span>你已参加过该考试，成绩：<span style="color:red;">'+data.myScore+'分</span></span><a class="layui-btn layui-btn-radius layui-btn-sm layui-btn-warm" href="#" onclick="seeExamResult(\''+data.examCode+'\')">详情</a>',
    '<span style="color:red;">该考试已经超过截止时间，您错过了考试</span>'];
    newTr = $('<tr>');

    newTr.append('<td>'+data.examCode+'</td>');
    newTr.append('<td>'+data.examName+'</td>');
    newTr.append('<td>'+data.time+'</td>');
    newTr.append('<td>'+data.score+'</td>');
    newTr.append('<td><a href="#" class="layui-btn layui-btn-radius layui-btn-sm layui-btn-normal" onclick="seeInfo(\''+data.teacherNumber+'\')">'+data.teacherName+'</a></td>');
    newTr.append('<td>'+data.expDate+'</td>');
    newTr.append('<td>'+remark[index]+'</td>');

    $('#thisTbodys').append(newTr);
    $('#thisTable').css('display','block');

}

layui.use(['form','layer'], function(){   
    layui.form.on('submit(queryExam)', function(dataForm){
        $.ajax({
            type: "POST",
            url: "/back/exam/getExamByCode",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({examCode:$('#examCode').val()}),
            success: function(data){
                if (data.data.isFlag=='no') {
                    $("#examMsg").html(data.data.msg);
                } else {
                    $("#examMsg").html("");
                    showTable(data.data);
                }
            },
            error:function(e){
                console.log(e);
            }
        });
        return false;
    });
});

function seeExamResult(examCode) {
    $.ajax({
        type: "POST",
        url: "/back/user/getUserInfo",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({userType:"student"}),
        success: function (data) {
            titleName = data.data.college + "，" + data.data.major + "专业，" + data.data.clazz + "班，" + data.data.name + "，学号：" + data.data.number;
            titleName = '<span style="color: red;font-size: 20px">' + titleName + '</span>';
            layui = window.parent.layui;
            layui.use('layer', function () {
                layui.layer.open({
                    type: 2,
                    title: titleName,
                    shadeClose: true,
                    shade: false,
                    //maxmin: true, //开启最大化最小化按钮
                    area: ['100%', '100%'],
                    content: '/html/exam/index.html?number=' + examCode + '&seeExamResult=1&stuNumber=0'
                });
            });
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function enterExam(examCode) {
    $.ajax({
        type: "POST",
        url: "/back/exam/checkExam",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({examCode:examCode}),
        success: function(data){
            if (data.data=='enterExam') {
                stuEnterExam(examCode);
            } else {
                layui.use('layer', function () {
                    layui.layer.alert('<span style="color: #FF0000; font-size:16px;">您已参加过该考试</span>', {icon: 2});
                });
            }
        },
        error:function(e){
            console.log(e);
        }
    });
}

function stuEnterExam(examCode) {
    $.ajax({
        type: "POST",
        url: "/back/user/getUserInfo",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({userType:"student"}),
        success: function (data) {
            titleName = data.data.college + "，" + data.data.major + "专业，" + data.data.clazz + "班，" + data.data.name + "，学号：" + data.data.number;
            titleName = '<span style="color: red;font-size: 20px">' + titleName + '</span>';
            layui = window.parent.layui;
            layui.use('layer', function () {
                layui.layer.open({
                    type: 2,
                    title: titleName,
                    shadeClose: true,
                    shade: false,
                    //maxmin: true, //开启最大化最小化按钮
                    area: ['100%', '100%'],
                    content: '/html/exam/index.html?number=' + examCode + '&seeExamResult=0&stuNumber=0'
                });
            });
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function cleanExamMsg() {
    $("#examMsg").html("");
}

function seeInfo(number) {
    layui = window.parent.layui;
    layui.use('layer', function () {
        layui.layer.open({
            type: 2,
            title: '教师信息',
            // shadeClose: false,
            // shade: false,
            //maxmin: true, //开启最大化最小化按钮
            area: ['90%', '90%'],
            content: '/html/common/teacherInfo.html?number='+number
        });
    });
}

function pageNewExam() {
    $('#pageNewExam').html("");
    layui.use('table', function () {
        var table = layui.table;
        table.render({
            elem: '#pageNewExam',
            url: '/back/exam/pageNewExam?term='+$('#examTerm').val(),
            page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
                layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'], //自定义分页布局
                limits: [5, 10, 15],
                limit: 5,
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
                {field: 'examCode',width:140, title: '考试码', sort: true},
                {field: 'examName',width:150, title: '小测名称', sort: true},
                {field: 'time',width:75, title: '时间', sort: true},
                {field: 'score',width:75, title: '总分', sort: true},
                {
                    field: 'teacher', title: '出题教师', sort: true,templet: function (data) {
                        return '<a href="#" class="layui-btn layui-btn-radius layui-btn-sm layui-btn-normal" onclick="seeInfo(\''+data.teacherNumber+'\')">'+data.teacherName+'</a>';
                    }
                },
                {field: 'expDate',width:160, title: '截止时间', sort: true},
                {
                    field: 'id',width:100, title: '操作', sort: true, templet: function (data) {
                        return '<a href="#" class="layui-btn layui-btn-radius layui-btn-sm" onclick="enterExam(\''+data.examCode+'\')">进入考试</a>';
                    }
                }
            ]]
        });
    });
}

pageNewExam();

function listNewScore() {
    $.ajax({
        type: "POST",
        url: "/back/exam/listNewScore",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({}),
        success: function(data){
            $('#newScoreTbodys').html('');
            $.each(data.data, function (index, value) {
                newTr = $('<tr onclick="seeExamResult(\''+value.examCode+'\')">');

                newTr.append('<td>'+value.examCode+'</td>');
                newTr.append('<td>'+value.examName+'</td>');
                newTr.append('<td>'+value.score+'</td>');
                newTr.append('<td>'+value.teacherName+'</td>');
                newTr.append('<td>'+value.time+'</td>');
                newTr.append('<td>'+value.myScore+'</td>');

                $('#newScoreTbodys').append(newTr);
            });
        },
        error:function(e){
            console.log(e);
        }
    });
}