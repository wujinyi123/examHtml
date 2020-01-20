$.ajax({
    type: "POST",
    url: "/back/user/getUserMsg",
    dataType: "json",
    contentType: "application/json;charset=utf-8",
    data: JSON.stringify({userType:"student"}),
    success: function(data){
        if (data.data==null) {
            window.parent.location.href='/index.html?code=2';
        }
        $('input[name="stuNumber"]').val(data.data.number);
    },
    error:function(e){
        console.log(e);
    }
});

var allMin;
var sec = 1;
var min;
var type = ["single", "multiple"];
var input_type = ["radio", "checkbox"];
var examCode = window.location.href.split('=')[1].split('&')[0];
var seeExamResult = window.location.href.split('=')[2];
$.ajax({
    type: "POST",
    url: "/back/exam/enterExam",
    dataType: "json",
    contentType: "application/json;charset=utf-8",
    data: JSON.stringify({examCode:examCode}),
    success: function (data) {
        function forEach(questions, num) {
            $.each(questions, function (index, value) {
                liElement = $('<li>');
                liElement.html('<a href="#qu_' + num + '_' + index + '">' + (index + 1) + '</a>');
                $("#" + type[num] + "_tree").append(liElement);

                question_li = $('<li id="qu_' + num + '_' + index + '">');

                question_div = $('<div class="test_content_nr_tt">');
                question_content = '<div style="word-wrap:break-word; word-break:normal;"><i>' + (index + 1) + '</i><span>(' + value.score + '分)</span><font>' + value.question + '</font></div>';
                if (value.imgQuestion!=undefined && value.imgQuestion!=null && value.imgQuestion!='') {
                    question_content += '<div><img src="'+value.imgQuestion+'"/></div>';
                }
                question_div.html(question_content);

                answer_div = $('<div class="test_content_nr_main">');

                answer_ul = $('<ul>');
                var options = ["A", "B", "C", "D"];
                var answers = [value.optionA, value.optionB, value.optionC, value.optionD];
                var answerImgs = [value.imgA, value.imgB, value.imgC, value.imgD];
                for (i = 0; i < 4; i++) {
                    answer_li = $('<li class="option">');
                    option_content = '<div style="word-wrap:break-word; word-break:normal;"><input value="' + options[i] + '" onclick="changeClass(' + num + ',' + index + ')" type="' + input_type[num] + '" class="radioOrCheck" name="' + type[num] + '_answer_' + index + '" id="' + type[num] + '_answer_' + index + '_option_' + options[i] + '" /><label for="' + type[num] + '_answer_' + index + '_option_' + options[i] + '">&nbsp;&nbsp;' + options[i] + '.<p class="ue" style="display: inline;">' + answers[i] + '</p></label></div>'
                    if (answerImgs[i]!=undefined && answerImgs[i]!=null && answerImgs[i]!='') {
                        option_content += '<div><img src="'+answerImgs[i]+'"/></div>';
                    }
                    answer_li.html(option_content);
                    answer_ul.append(answer_li);
                }
                answer_div.append(answer_ul);
                question_li.append(question_div);
                question_li.append(answer_div);
                $("#" + type[num] + "_questions").append(question_li);

            });
        }

        $('input[name="examCode"]').val(data.data.examCode);
        $("#test_number").text("考试码：" + data.data.examCode);
        $("#test_name").text("考试名：" + data.data.examName);
        $("#test_points").text("总分：" + data.data.score);
        $("#single_num").text(data.data.singleList.length);
        $("#single_num2").text(data.data.singleList.length);
        $("#single_score").text(data.data.singleScore);
        $("#multiple_num").text(data.data.multipleList.length);
        $("#multiple_num2").text(data.data.multipleList.length);
        $("#multiple_score").text(data.data.multipleScore);

        forEach(data.data.singleList, 0);
        forEach(data.data.multipleList, 1);

        if (seeExamResult=='0') {
            allMin = data.data.time;
            min = data.data.time;
            //min = 1;
            setCountDown_time();
        } else {
            $('#test_submit').remove();
            getExamResult();
        }
    },
    error: function (e) {
        console.log(e);
    }
});

function changeClass(num, index) {
    the_answer = $('input[name="' + type[num] + '_answer_' + index + '"]:checked').val();
    cardLi = $('a[href="#qu_' + num + '_' + index + '"]'); // 根据题目ID找到对应答题卡
    // 设置已答题
    if (!cardLi.hasClass('hasBeenAnswer')) {
        cardLi.addClass('hasBeenAnswer');
    }
    if (the_answer == undefined || the_answer == null || the_answer == "") {
        cardLi.removeClass('hasBeenAnswer');
    }
}

var idt;
var format = function (str) {
    if (parseInt(str) < 10) {
        return "0" + str;
    }
    return str;
};

function setCountDown_time() {
    idt = window.setInterval("ls()", 1000);
}

function ls() {
    sec--;
    if (sec == 0) {
        min--;
        sec = 59;
    }

    if (min == 0 && sec == 1) {
        window.clearInterval(idt);
        $('#test_submit').remove();
        layui.use('layer', function () {
            layui.layer.alert('<span style="color: #FF0000; font-size:16px;">考试时间已到，试卷已被提交。正在计算成绩，请稍等。</span><br/><br/><span style="color: springgreen; font-size:18px;">感谢您的使用！</span>', {icon: 1});
        });
        submit_form();
    }
    $('#test_time').html("时间：" + format(min) + ":" + format(sec));
}

function update_index(data) {
    $('#test_time').html("成绩：" + data.score);
    if (seeExamResult=='0') {
        layui.use('layer', function () {
            layui.layer.alert('<span style="font-size:16px;">考试成绩：<span style="color: #FF0000; font-size:18px;">' + data.score + '</span></span>', {icon: 1});
        });
    }

    function resultEach(checkAnswer, num) {
        $.each(checkAnswer, function (index, value) {
            var ans = value.answer;
            var stuAns = value.stuAnswer;
            var result_div = $('<div class="test_content_nr_tt">');
            if (ans!=null && ans!='' && ans==stuAns) {
                result_div.html('<span style="width: 200px; display:inline-block; font-size:16px;">本题结果：<span style="color: springgreen; font-size:18px;">正确</span></span><span style="width: 200px; display:inline-block; font-size:16px;">正确答案：<span style="color: springgreen; font-size:18px;">' + ans + '</span></span>');
                $('a[href="#qu_' + num + '_' + index + '"]').css("background-color", "rgba(0,238,0,0.5)");
            } else {
                if (stuAns==null && stuAns=="") {
                    stuAns='';
                    result_div.html('<span style="width: 200px; display:inline-block; font-size:16px;">本题结果：<span style="color: #FF0000; font-size:18px;">错误</span></span><span style="width: 200px; display:inline-block; font-size:16px;">正确答案：<span style="color: springgreen; font-size:18px;">' + ans + '</span></span><span style="width: 200px; display:inline-block; font-size:16px;">你的答案：<span style="color: #FF0000; font-size:18px;">无</span></span>');
                } else {
                    result_div.html('<span style="width: 200px; display:inline-block; font-size:16px;">本题结果：<span style="color: #FF0000; font-size:18px;">错误</span></span><span style="width: 200px; display:inline-block; font-size:16px;">正确答案：<span style="color: springgreen; font-size:18px;">' + ans + '</span></span><span style="width: 200px; display:inline-block; font-size:16px;">你的答案：<span style="color: #FF0000; font-size:18px;">' + stuAns + '</span></span>');
                }
                $('a[href="#qu_' + num + '_' + index + '"]').css("background-color", "rgba(238,0,0,0.5)");
                for (i = 0; i < stuAns.length; i++) {
                    $('label[for="' + type[num] + '_answer_' + index + '_option_' + stuAns[i] + '"]').css("background-color", "rgba(238,0,0,0.3)");
                }
            }
            for (i = 0; i < ans.length; i++) {
                $('label[for="' + type[num] + '_answer_' + index + '_option_' + ans[i] + '"]').css("background-color", "rgba(0,238,0,0.3)");
            }

            var analysis_div = $('<div class="test_content_nr_tt" style="font-size:16px; word-wrap:break-word; word-break:normal;">');
            if (value.answerAnalysis==undefined || value.answerAnalysis==null || value.answerAnalysis=='') {
                analysis_div.html('答案解析：略');
            } else {
                analysis_div.html('答案解析：'+value.answerAnalysis);
            }

            var thisQues = $('#qu_' + num + '_' + index);
            thisQues.append(result_div);
            thisQues.append(analysis_div);
            if (value.imgAnalysis!=undefined && value.imgAnalysis!=null && value.imgAnalysis!='') { 
                img_analysis_div = $('<div class="test_content_nr_tt">');
                img_analysis_div.html('<img src="'+ value.imgAnalysis +'"/>');
                thisQues.append(img_analysis_div);
            }
        });
    }

    resultEach(data.singleAnswerList, 0);
    resultEach(data.multipleAnswerList, 1);
}

function pad(num, n) {
    var numStr = num + '';
    if (numStr.length<n) {
        len = n - numStr.length;
        for (i=0; i<len; i++) {
            numStr = '0' + numStr;
        }
    }
    return numStr;
}
   
function getDateTime() {
    date = new Date();
    //外国的月份都是从0开始的，所以+1
    month = pad(date.getMonth()+1, 2);
    strDate = pad(date.getDate(), 2);
    hours = pad(date.getHours(), 2);
    minutes = pad(date.getMinutes(), 2);
    seconds = pad(date.getSeconds(), 2);
    //获取当前时间 yyyy-MM-dd HH:mm:ss
    return date.getFullYear() + month + strDate + hours + minutes + seconds;
}

function submit_form() {
    useTime = '';
    if (sec=='0' || sec==0) {
        useTime = pad(allMin-min,2) + '分';
    } else {
        useTime = pad(allMin-min-1,2) + '分' + pad(60-sec,2) + '秒';
    }
    $('input[name="useTime"]').val(useTime);
    $('input[name="submitTime"]').val(getDateTime());
    $.ajax({
        type: "POST",
        url: "/back/exam/submitAnswer",
        data: $('#test_form').serialize(),
        success: function (data) {
            var ti = 0;
            wait_time = window.setInterval(function () {
                ti++;
                if (ti == 5) update_index(data.data);
            }, 1000);
        },
        error: function (e) {
            console.log(e);
        },
    });
}

$('#test_submit').click(function () {
    window.clearInterval(idt);
    $('#test_submit').remove();
    layui.use('layer', function () {
        layui.layer.alert('<span style="color: #FF0000; font-size:16px;">试卷已被提交。正在计算成绩，请稍等。</span><br/><br/><span style="color: springgreen; font-size:18px;">感谢您的使用！</span>', {icon: 1});
    });
    submit_form();
});

function getExamResult() {
    $.ajax({
        type: "POST",
        url: "/back/exam/getExamResult",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({examCode:examCode}),
        success: function(data){
            update_index(data.data);
        },
        error:function(e){
            console.log(e);
        }
    });
}