$("#bookingBtn").click(function () {
    $("html, body").animate({ scrollTop: $(document).height() }, 1500);
});

//Kiểm tra các input của form request (ngoại trừ input note)
//Nếu có một input rỗng, disable button request
//ngược lại enable
function doCheck() {
    var allFilled = true;
    $('.request:not(#note)').each(function () {
        if ($(this).val() == '') {
            allFilled = false;
        }
    });
    $('#requestBtn').prop('disabled', !allFilled);
    if (allFilled) {
        $('#requestBtn').removeAttr('disabled');
    }
}

//ready event
$(document).ready(function () {
    //check
    doCheck();
    //event key up request form
    $('.request').keyup(doCheck);
    //check login
    if (Cookies.get('auth') == "true") {
        //thêm tên user
        $("#userDropdown").append(Cookies.get('name'));
        //hidden login, signup dropdown item
        //show logout
        setDropDownItem(true);
    } else {
        //show login, signup dropdown item
        //hidden logout
        setDropDownItem(false);
    }
});

//Kiểm tra các input của form login
//Nếu có một input rỗng, disable button login
//ngược lại enable
$("#loginForm").keyup(function() {
    var allFilled = true;
    $('.login').each(function () {
        if ($(this).val() == '') {
            allFilled = false;
        }
    });

    $('#loginBtn').prop('disabled', !allFilled);
    if (allFilled) {
        $('#loginBtn').removeAttr('disabled');
    }
})

//Kiểm tra các input của form signup
//Nếu có một input rỗng, disable button signup
//ngược lại enable
$("#signupForm").keyup(function() {
    var allFilled = true;
    $('.signup').each(function () {
        if ($(this).val() == '') {
            allFilled = false;
        }
    });

    $('#signupBtn').prop('disabled', !allFilled);
    if (allFilled) {
        $('#signupBtn').removeAttr('disabled');
    }
})

//event click request button
$("#requestBtn").click(function (e) {
    //cancel submit form
    e.preventDefault();
    //get form data
    var data = $("#requestForm").serialize();
    //ajax request
    $.ajax({
        method: 'POST',
        url: '/data',
        data: data,
        success: (res) => {
            alert("Thành công");
        },
        error: (err) => {
            //bad login
            if (err.status == 403) {
                alert("Vui lòng đăng nhập trước khi đặt xe");
                $("#loginModal").modal('show');
            }
            else {
                alert("Có lỗi xảy ra, vui lòng thử lại sau");
            }
            console.log(err);
        }
    })
});

//event login button click
$("#loginBtn").click(function (e) {
    //cancel submit form
    e.preventDefault();
    //get data
    var data = $("#loginForm").serialize();
    //ajax
    $.ajax({
        method: 'POST',
        url: '/user/login',
        data: data,
        success: (res) => {
            alert("Thành công");
            setDropDownItem(true);
            //thêm tên user
            $("#userDropdown").append(Cookies.get('name'));
            $("#loginModal").modal('hide');
        },
        error: (err) => {
            alert("Đăng nhập không thành công, vui lòng thử lại");
            console.log(err);
        }
    })
});

//event signup button click
$("#signupBtn").click(function (e) {
    //cancel submit form
    e.preventDefault();
    //get data
    var data = $("#signupForm").serialize();
    //check confirm password
    if ($("#signupPassword").val() == $("#confirmPassword").val()) {
        //ajax
        $.ajax({
            method: 'POST',
            url: '/user/register',
            data: data,
            success: (res) => {
                alert("Thành công");
                $("#signupModal").modal('hide');
            },
            error: (err) => {
                alert("Đăng kí không thành công, vui lòng thử lại");
                console.log(err);
            }
        })
    } else {
        alert("Mật khẩu xác nhận không đúng");
    }
});

//logout
$("#logoutDropdown").click(function () {
    //remove token, name user trong cookie
    Cookies.remove('token');
    Cookies.remove('name');
    Cookies.set('auth', false);
    $("#userDropdown").text("");
    $("#userDropdown").append('\<i class="fa fa-user-circle fa-fw"></i>')
    setDropDownItem(false);
});

//set trạng thái cho các dropdown item
function setDropDownItem(isAuth) {
    if (isAuth) {
        $("#loginDropdown").attr("hidden", true);
        $("#signupDropdown").attr("hidden", true);
        $("#logoutDropdown").attr("hidden", false);
    } else {
        $("#loginDropdown").attr("hidden", false);
        $("#signupDropdown").attr("hidden", false);
        $("#logoutDropdown").attr("hidden", true);
    }
}