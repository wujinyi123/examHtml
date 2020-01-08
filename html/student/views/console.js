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
            data: JSON.stringify({userType:"student", examCode:$('#examCode').val()}),
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