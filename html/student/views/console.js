function showTable(data) {
    $('#thisTbodys').children().remove();
    newTr = $('<tr>');
    td1 = $('<td>');
    td1.html(data.examCode);
    newTr.append(td1);
    
    td2 = $('<td>');
    td2.html(data.examName);
    newTr.append(td2);
    
    td3 = $('<td>');	
    td3.html(data.score);
    newTr.append(td3);
    
    td4 = $('<td>');
    td4.html(data.teacherName);
    newTr.append(td4);

    td5 = $('<td>');
    td5.html(data.time);
    newTr.append(td5);

    td6 = $('<td>');
    td6.html(data.pdDate);
    newTr.append(td6);

    td7 = $('<td>');
    td7.html(data.expDate);
    newTr.append(td7);

    remark = ['<a class="layui-btn layui-btn-mini links_edit" href="#" onclick="enterTest(\''+data.examCode+'\')"><i class="iconfont icon-edit"></i>进入考试</a>',
        '<span>你已参加过该考试，成绩：<span style="color:red;">'+data.myScore+'分</span></span><a class="layui-btn layui-btn-mini links_edit" href="#" target="_blank"><i class="iconfont icon-edit"></i>详情</a>',
        '<span style="color:red;">该考试已经超过截止时间，您错过了考试</span>'];

    td8 = $('<td>');
    td8.html(remark[data.remark]);
    newTr.append(td8);

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

function cleanExamMsg() {
    $("#examMsg").html("");
}

function getNewExam() {
    layui.use(['laypage', 'layer'], function(){
        var laypage = layui.laypage
        ,layer = layui.layer;
    
        laypage.render({
            elem: 'pageList'
            ,count: 100
            ,layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip']
            ,jump: function(obj){
              console.log(obj)
            }
        });
    
    });
}

function pageNewExam() {
    layui.use('table', function () {
        var table = layui.table;
        table.render({
            elem: '#pageNewExam',
            url: '/back/exam/pageNewExam',
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
                {field: 'examCode', title: '考试码', sort: true},
                {field: 'examName', title: '考试名称', sort: true},
                {field: 'score', title: '试卷总分', sort: true},
                {field: 'teacherName', title: '出题教师', sort: true},
                {field: 'time', title: '考试时间', sort: true},
                {field: 'pdDate', title: '出题时间', sort: true},
                {field: 'expDate', title: '截止时间', sort: true},
                {
                    field: 'id', title: '操作', sort: true, templet: function (data) {
                        return '<a class="layui-btn layui-btn-mini links_edit" href="#" onclick="enterTest(\''+data.examCode+'\')"><i class="iconfont icon-edit"></i>进入考试</a>';
                    }
                }
            ]]
        });
    });
}