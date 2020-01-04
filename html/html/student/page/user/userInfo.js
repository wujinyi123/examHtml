$.ajax({
    type: "POST",
    url: "/login/getStudentDetails",
    dataType: "json",
    success: function (data) {
        $('#collegeName').html(data.collegeName);
        $('#clazzName').html(data.clazzName);
        $('#clazzNumber').html(data.clazzNumber);
        $('#studentNumber').html(data.student.number);
        $('#studentName').html(data.student.name);
        $('#studentSex').html(data.student.sex);
        $('#studentTel').val(data.student.tel);
        $('#studentEmail').val(data.student.email);
        $('#studentImg').attr("src", data.student.img_path);
    },
    error: function (e) {
        console.log(e);
    }
});