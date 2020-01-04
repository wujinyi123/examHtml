var test_message = ['网络出现问题', '考试码不存在', '可以考试', '您已参加过该考试', '该考试已经超过截止时间'];

function enterTest(number) {
    $.ajax({
        type: "POST",
        url: "/login/getStudentDetails",
        dataType: "json",
        success: function (data) {
            titleName = data.collegeName + "，" + data.clazzName + "专业，" + data.clazzNumber + "班，" + data.student.name + "，学号：" + data.student.number;
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
                    content: '/html/test/index.html?number=' + number
                });
            });
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function showTable(data) {
    $('#thisTbodys').children().remove();
    newTr = $('<tr>');
    td1 = $('<td>');
    td1.html(data.number);
    newTr.append(td1);

    td2 = $('<td>');
    td2.html(data.test_name);
    newTr.append(td2);

    td3 = $('<td>');
    td3.html(data.test_points);
    newTr.append(td3);

    td4 = $('<td>');
    td4.html(data.collgeName + '<br/>' + data.teacherName + '老师');
    newTr.append(td4);

    td5 = $('<td>');
    td5.html(data.time + '分钟');
    newTr.append(td5);

    td6 = $('<td>');
    td6.html(data.end_time);
    newTr.append(td6);

    td7 = $('<td>');
    if (data.code == 2) {
        //td7.html('<a class="layui-btn layui-btn-mini links_edit" href="/html/test/index.html?number='+data.number+'" target="_blank"><i class="iconfont icon-edit"></i>进入考试</a>');
        td7.html('<a class="layui-btn layui-btn-mini links_edit" href="#" onclick="enterTest(\'' + data.number + '\')"><i class="iconfont icon-edit"></i>进入考试</a>');
    } else if (data.code == 3) {
        td7.html('<span>你已参加过该考试，成绩：<span style="color:red;">' + data.stu_points + '分</span></span>&nbsp&nbsp<a class="layui-btn layui-btn-mini links_edit" href="#" target="_blank"><i class="iconfont icon-edit"></i>详情</a>');
    } else {
        td7.html('<span style="color:red;">该考试已经超过截止时间，您错过了考试</span>');
    }
    newTr.append(td7);

    $('#thisTbodys').append(newTr);
    $('#thisTable').css('display', 'block');

}

function checkNumber() {
    thisNumber = $('input[name="number"]').val();
    if (thisNumber == "") {
        layui.use('layer', function () {
            layui.layer.alert('<span style="color: #FF0000; font-size:16px;">考试码不能为空</span>', {icon: 2});
        });
        return;
    }

    $.ajax({
        type: "POST",
        url: "/test/checkNumber",
        data: {"number": thisNumber},
        dataType: "json",
        success: function (data) {
            if (data.code < 2) {
                layui.use('layer', function () {
                    layui.layer.alert('<span style="color: #FF0000; font-size:16px;">' + test_message[data.code] + '</span>', {icon: 2});
                });
            } else {
                showTable(data);
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}

var jsonDate = {
    userType: 'student',
    number: window.parent.$('#user_name').html()
}
$.ajax({
    type: "POST",
    url: "/message/getMessageCount",
    dataType: "json",
    contentType: "application/json;charset=utf-8",
    data: JSON.stringify(jsonDate),
    success: function (data) {
        data = data.data;
        $('#new_message').html(data.newSum);
        $('#send_message').html(data.sendSum);
        $('#receiver_message').html(data.receiverSum);
    },
    error: function (e) {
        console.log(e);
    }
});

function getSendMessageDetails(id, receiver_name) {
    titleName = '接收人：' + receiver_name;
    layui.use('layer', function () {
        layui.layer.open({
            type: 2,
            title: titleName,
            shadeClose: true,
            shade: false,
            maxmin: true,
            area: ['60%', 'auto'],
            content: '/html/send_message.html?id=' + id
        });
    });
}

function getMessageDetails(id, send_name, send_type, send_number) {
    titleName = send_name;
    $.ajax({
        type: "POST",
        url: "/message/getSendUserState",
        data: {"send_type": send_type, "send_number": send_number},
        dataType: "json",
        success: function (data) {
            if (data.state != 1) titleName = send_name + '<span style="color: red;">(该用户已被注销)</span>'
            layui.use('layer', function () {
                layui.layer.open({
                    type: 2,
                    title: titleName,
                    shadeClose: true,
                    shade: false,
                    maxmin: true,
                    area: ['60%', '80%'],
                    content: '/html/message.html?id=' + id + '&state=' + data.state
                });
            });
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function getNewMessage() {
    $('#sendMessageDiv').css('display', 'none');
    $('#receiverMessageDiv').css('display', 'none');
    layui.use('table', function () {
        var table = layui.table;
        table.render({
            elem: '#newMessageTable',
            url: '/message/pageNewMessage?userType=student&number=' + window.parent.$('#user_name').html(),
            page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
                layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'], //自定义分页布局
                limits: [5, 10, 15],
                limit: 5,
                curr: 1,
                groups: 1, //只显示 1 个连续页码
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
                {field: 'userType', title: '发送方类别', sort: true},
                {field: 'userName', title: '发送方姓名', sort: true},
                {field: 'collegeName', title: '所属学院', sort: true},
                {field: 'clazzNumber', title: '班级号', sort: true},
                {field: 'time', title: '发送时间', sort: true},
                {
                    field: 'id', title: '操作', sort: true, templet: function (data) {
                        id = data.id;
                        send_name = data.userName;
                        send_type = data.userType;
                        send_number = data.userNumber;
                        return '<button class="layui-btn layui-btn-mini links_edit" onclick="getMessageDetails(' + id + ',\'' + send_name + '\',' + send_type + ',\'' + send_number + '\')"><i class="iconfont icon-edit"></i>查看</button>';
                    }
                }
            ]]
        });
    });
    $('#newMessageDiv').css('display', 'block');
}

function getSendMessage() {
    $('#newMessageDiv').css('display', 'none');
    $('#receiverMessageDiv').css('display', 'none');
    layui.use('table', function () {
        var table = layui.table;
        table.render({
            elem: '#sendMessageTable',
            url: '/message/pageSendMessage?userType=student&number=' + window.parent.$('#user_name').html(),
            page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
                layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'], //自定义分页布局
                limits: [5, 10, 15],
                limit: 5,
                curr: 1,
                groups: 1, //只显示 1 个连续页码
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
                {field: 'userType', title: '接收方类别', sort: true},
                {field: 'userName', title: '接收方姓名', sort: true},
                {field: 'collegeName', title: '所属学院', sort: true},
                {field: 'clazzNumber', title: '班级号', sort: true},
                {field: 'time', title: '发送时间', sort: true},
                {
                    field: 'id', title: '操作', sort: true, templet: function (data) {
                        id = data.id;
                        receiver_name = data.userNumber;
                        return '<button class="layui-btn layui-btn-mini links_edit" onclick="getSendMessageDetails(' + id + ',\'' + receiver_name + '\')"><i class="iconfont icon-edit"></i>查看</button>';
                    }
                }
            ]]
        });
    });
    $('#sendMessageDiv').css('display', 'block');
}

function getReceiverMessage() {
    $('#newMessageDiv').css('display', 'none');
    $('#sendMessageDiv').css('display', 'none');
    layui.use('table', function () {
        var table = layui.table;
        table.render({
            elem: '#receiverMessageTable',
            url: '/message/pageReceiverMessage?userType=student&number=' + window.parent.$('#user_name').html(),
            page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
                layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'], //自定义分页布局
                limits: [5, 10, 15],
                limit: 5,
                curr: 1,
                groups: 1, //只显示 1 个连续页码
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
                {field: 'userType', title: '发送方类别', sort: true},
                {field: 'userName', title: '发送方姓名', sort: true},
                {field: 'collegeName', title: '所属学院', sort: true},
                {field: 'clazzNumber', title: '班级号', sort: true},
                {field: 'time', title: '发送时间', sort: true},
                {
                    field: 'id', title: '操作', sort: true, templet: function (data) {
                        id = data.id;
                        send_name = data.userName;
                        send_type = data.userType;
                        send_number = data.userNumber;
                        return '<button class="layui-btn layui-btn-mini links_edit" onclick="getMessageDetails(' + id + ',\'' + send_name + '\',' + send_type + ',\'' + send_number + '\')"><i class="iconfont icon-edit"></i>查看</button>';
                    }
                }
            ]]
        });
    });
    $('#receiverMessageDiv').css('display', 'block');
}