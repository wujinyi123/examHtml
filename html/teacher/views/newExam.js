var laydate = layui.laydate;
//日期时间选择器
laydate.render({
    elem: '#expDate'
    ,type: 'datetime'
    ,trigger: 'click'
});

var thisNewExam = {};
var newExamData = {};

//转化正整数
function zhzs(value){
    value = value.replace(/[^\d]/g,'');
    if(''!=value){
     value = parseInt(value);
    }
    return value;
}

function imgUpload(imgName) {
    arr = imgName.split("_");
    titleName = '';
    if (arr[0]=='single') {
        titleName = '单选题-第' + (parseInt(arr[1]+1)) + '题-';
    } else {
        titleName = '多选题-第' + (parseInt(arr[1]+1)) + '题-';
    }

    if (arr[2]=='question') {
        titleName = titleName + '题目';
    } else if (arr[2]=='analysis') {
        titleName = titleName + '答案解析';
    } else {
        titleName = titleName + arr[2] + '选项';
    }

    layui.use('layer', function () {
        layui.layer.open({
            type: 2,
            title: titleName,
            // shadeClose: false,
            // shade: false,
            //maxmin: true, //开启最大化最小化按钮
            area: ['50%', '80%'],
            content: '/html/exam/img.html?examCode='+$('#examCode').val()+'&imgName=' + imgName
        });
    });
}

function enterQuestions(name,type,num,score) {
    questions = $('<div>');
    questions.html(name+"（共"+num+"题，共"+score+"分）");
    $("#examForm").append(questions);
    $("#examForm").append($('<hr class="layui-bg-red">'));
    for(i=0; i<num; i++) {
        questionScore = parseInt(score/num);
        getMod = score - num*questionScore;
        if (getMod+i>=num) {
            questionScore = questionScore+1;
        }

        labels = ['第'+(i+1)+'题,'+questionScore+'分','A选项','B选项','C选项','D选项','答案','答案解析'];
        idNames = ['question','A','B','C','D','ans','analysis'];
        $.each(labels, function (index, value) {
            thisDiv = $('<div class="layui-form-item">');
            thisLabel = $('<label class="layui-form-label">');
            thisLabel.html(value);

            thisIdName = type+'_'+i+'_'+idNames[index];
            thisInputDiv = $('<div class="layui-input-block">');
            if (index==5) {
                if (type=='single') {
                    thisInputDiv.append($('<input type="radio" name="'+thisIdName+'" value="A" title="A" checked>'));
                    thisInputDiv.append($('<input type="radio" name="'+thisIdName+'" value="B" title="B">'));
                    thisInputDiv.append($('<input type="radio" name="'+thisIdName+'" value="C" title="C">'));
                    thisInputDiv.append($('<input type="radio" name="'+thisIdName+'" value="D" title="D">'));
                } else {
                    thisInputDiv.append($('<input type="checkbox" name="'+thisIdName+'" lay-skin="primary" value="A" title="A">'));
                    thisInputDiv.append($('<input type="checkbox" name="'+thisIdName+'" lay-skin="primary" value="B" title="B">'));
                    thisInputDiv.append($('<input type="checkbox" name="'+thisIdName+'" lay-skin="primary" value="C" title="C">'));
                    thisInputDiv.append($('<input type="checkbox" name="'+thisIdName+'" lay-skin="primary" value="D" title="D">'));
                }
            } else {
                thisInputDiv.append($('<input type="text" id="'+thisIdName+'" name="'+thisIdName+'" required lay-verify="required" placeholder="请输入内容" autocomplete="off" class="layui-input">'));
                btn = $('<button class="layui-btn layui-btn-blue">上传/查看图片</button>');
                btn.attr('onclick', 'imgUpload("'+thisIdName+'")');
                thisInputDiv.append(btn);
                thisInputDiv.append($('<label id="'+thisIdName+'_img">'))
            }

            thisDiv.append(thisLabel);
            thisDiv.append(thisInputDiv);
            $("#examForm").append(thisDiv);
        });
        $("#examForm").append($('<hr class="layui-bg-blue">'));
    }
}

function theFormEnd(thisData) {
    $("#examForm").append('<input type="text" id="examCode" name="examCode" value="'+thisData.examCode+'" style="display:none;"/>');
    $("#examForm").append('<input type="text" id="examName" name="examName" value="'+thisData.examName+'" style="display:none;"/>');
    $("#examForm").append('<input type="text" id="teacherNumber" name="teacherNumber" value="'+thisData.teacherNumber+'" style="display:none;"/>');
    $("#examForm").append('<input type="text" id="score" name="score" value="'+thisData.score+'" style="display:none;"/>');
    $("#examForm").append('<input type="text" id="time" name="time" value="'+thisData.time+'" style="display:none;"/>');
    $("#examForm").append('<input type="text" id="expTime" name="expTime" value="'+thisData.expTime+'" style="display:none;"/>');
    $("#examForm").append('<input type="text" id="singles" name="singles" value="'+thisData.singles+'" style="display:none;"/>');
    $("#examForm").append('<input type="text" id="singleScore" name="singleScore" value="'+thisData.singleScore+'" style="display:none;"/>');
    $("#examForm").append('<input type="text" id="multiples" name="multiples" value="'+thisData.multiples+'" style="display:none;"/>');
    $("#examForm").append('<input type="text" id="multipleScore" name="multipleScore" value="'+thisData.multipleScore+'" style="display:none;"/>');

    formSubmit = $('<div class="layui-form-item">');
    formSubmitDiv = $('<div class="layui-input-block">');
    buttonSubmit = $('<button class="layui-btn layui-btn-blue" lay-submit lay-filter="formExam">');
    buttonSubmit.html("立即提交");
    buttonReset = $('<button type="reset" class="layui-btn layui-btn-primary">');
    buttonReset.html("重置");
    formSubmitDiv.append(buttonSubmit);
    formSubmitDiv.append(buttonReset);
    formSubmit.append(formSubmitDiv);
    $("#examForm").append(formSubmit);
}

function getList(examCode,typeCode,type,score,num) {
    dataList = [];
    for(i=0; i<num; i++) {
        questionScore = parseInt(score/num);
        getMod = score - num*questionScore;
        if (getMod+i>=num) {
            questionScore = questionScore+1;
        }

        answer = '';
        $('input[name="'+type+'_'+i+'_ans'+'"]:checked').each(function(){   
            answer = answer + $(this).val();  
        });
        if (answer=='' || (type=='multiple' && answer.length==1)) {
            return null;
        }

        data = {
            examCode:examCode,
            type:typeCode,
            score:questionScore,
            question:$('#'+type+'_'+i+'_question').val(),
            optionA:$('#'+type+'_'+i+'_A').val(),
            optionB:$('#'+type+'_'+i+'_B').val(),
            optionC:$('#'+type+'_'+i+'_C').val(),
            optionD:$('#'+type+'_'+i+'_D').val(),
            answer:answer,
            analysis:$('#'+type+'_'+i+'_analysis').val()
        };
        dataList.push(data);
    }
    return dataList;
}

layui.use(['form','layer'], function(){   
    layui.form.on('submit(newExam)', function(dataForm){
        examName = $('#examName').val();
        examScore = $('#examScore').val();
        examTime =  $('#examTime').val();
        expDate =  $('#expDate').val();
        singles =  $('#singles').val();
        singleScore =  $('#singleScore').val();
        multiples =  $('#multiples').val();
        multipleScore =  $('#multipleScore').val();
        if (parseInt(examScore)==NaN || parseInt(examTime)==NaN || parseInt(singles)==NaN
            || parseInt(singleScore)==NaN || parseInt(multiples)==NaN || parseInt(multipleScore)==NaN
            || parseInt(examScore)!=parseInt(singleScore)+parseInt(multipleScore)
            || parseInt(singles)>parseInt(singleScore)
            || parseInt(multiples)>parseInt(multipleScore)) {
                layui.use('layer', function () {
                    layui.layer.alert('<div style="color: #FF0000; font-size:16px;"><div>正整数输入有误，请重新检查数据，使之符合以下条件</div><div>总分=单选题总分+多选题总分</div><div>单选题总分>=单选题数</div><div>多选题数>=多选题数</div></div>', {icon: 2});
                });
                return false;
        }

        $.ajax({
            type: "POST",
            url: "/back/exam/getNewExamCode",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({}),
            success: function(data){
                thisNewExam = {
                    examCode:data.data.code,
                    examName:examName,
                    teacherNumber:data.data.number,
                    score:examScore,
                    time:examTime,
                    expTime:expDate,
                    singles:singles,
                    singleScore:singleScore,
                    multiples:multiples,
                    multipleScore:multipleScore
                };
                $("#examForm").html("");

                layui.use('form', function(){
                    var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功
                    enterQuestions("单选题","single",thisNewExam.singles,thisNewExam.singleScore);
                    enterQuestions("多选题","multiple",thisNewExam.multiples,thisNewExam.multipleScore);
                    theFormEnd(thisNewExam);
                    form.render();
                });
                
            },
            error:function(e){
                console.log(e);
            }
        });
        return false;
    });

    layui.form.on('submit(formExam)', function(dataForm){
        examCode =  $('#examCode').val();
        examName =  $('#examName').val();
        teacherNumber =  $('#teacherNumber').val();
        score =  $('#score').val();
        time =  $('#time').val();
        expTime =  $('#expTime').val();
        singles =  $('#singles').val();
        singleScore =  $('#singleScore').val();
        multiples =  $('#multiples').val();
        multipleScore =  $('#multipleScore').val();

        singleList = getList(examCode,'1','single',singleScore,singles);
        multipleList = getList(examCode,'2','multiple',multipleScore,multiples);

        if (singleList==null || multipleList==null) {
            layui.use('layer', function () {
                layui.layer.alert('<span style="color: #FF0000; font-size:16px;">部分多选题，答案未选或只选了一个，请重新检查</span>', {icon: 2});
            });
            return false;
        }

        newExamData = {
            examCode:examCode,
            examName:examName,
            teacherNumber:teacherNumber,
            score:score,
            time:time,
            expTime:expTime,
            singleList:singleList,
            multipleList:multipleList
        };
        $.ajax({
            type: "POST",
            url: "/back/exam/newBuiltExam",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(newExamData),
            success: function(data){
                
            },
            error:function(e){
                console.log(e);
            }
        });
        return false;
    });
});
