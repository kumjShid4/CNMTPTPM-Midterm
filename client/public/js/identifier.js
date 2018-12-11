var id = 0;
var loadRequest = function () {
    //chỉ load request khi đã đăng nhập
    if (Cookies.get('identifier_auth') == "true") {
        var instance = axios.create({
            baseURL: 'http://localhost:3000',
            timeout: 15000
        });
        instance.get('/identifier?id=' + id)
            .then(function (res) {
                if (res.status === 200) {
                    id = res.data.max_id;
                    var source = document.getElementById('template').innerHTML;
                    var template = Handlebars.compile(source);
                    var html = template(res.data.requests);
                    document.getElementById('list').innerHTML += html;
                } else if (res.status === 204) {
                    $.ajax({
                        method: 'GET',
                        url: '/identifier/getExistDataChanged',
                        data: {
                            id: id
                        },
                        success: (response) => {
                            response.newData.forEach(request => {
                                if ($("#status" + request.Id).text() !== request.Status) {
                                    $("#status" + request.Id).text(request.Status);
                                }
                            });
                        },
                        error: (err) => {
                            console.log(err);
                        }
                    });
                }
            }).catch(function (err) {
                console.log(err);
                if (err.response.status === 401) {
                    alert('Phiên đã hết hạn, vui lòng đăng nhập lại');
                    logout();
                    $("#loginModal").modal('show');
                }
            }).then(function () {
                loadRequest();
            });
    }
};

$(document).ready(function () {
    //check login
    if (Cookies.get('identifier_auth') == "true") {
        loadRequest();
        //thêm tên user
        var user = JSON.parse(Cookies.get('identifier').substring(2));
        $("#userDropdown").append(user.Name);
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
$("#loginForm").keyup(function () {
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
});

//Kiểm tra các input của form signup
//Nếu có một input rỗng, disable button signup
//ngược lại enable
$("#signupForm").keyup(function () {
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
            var user = JSON.parse(Cookies.get('identifier').substring(2));
            $("#userDropdown").append(user.Name);
            $("#loginModal").modal('hide');
            loadRequest();
            setTimeout(function () {
                alert('Phiên đã hết hạn, vui lòng đăng nhập lại');
                logout();
                $("#loginModal").modal('show');
            }, 600000);
        },
        error: (err) => {
            alert("Đăng nhập không thành công, vui lòng thử lại");
            console.log(err);
        }
    });
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
                if (err.status == 400) {
                    alert("Tài khoản đã tồn tại");
                } else {
                    alert("Đăng kí không thành công, vui lòng thử lại");
                }
            }
        });
    } else {
        alert("Mật khẩu xác nhận không đúng");
    }
});

//logout
function logout() {
    //remove token, name user trong cookie
    Cookies.remove('identifier_token');
    Cookies.remove('identifier');
    Cookies.set('identifier_auth', false);
    $("#userDropdown").text("");
    $("#userDropdown").append('\<i class="fa fa-user-circle fa-fw"></i>');
    setDropDownItem(false);
    //clear table data
    $("#dataTable tbody").empty();
    //set id request = 0
    id = 0;
}

$("#logoutDropdown").click(function () {
    logout();
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

//Định vị địa chỉ gốc của người dùng
$(document).on("click", ".dinhvi", function () {
    var id = $(this).parent().attr('class'); //id request 
    var address = $("#addr" + id).children().text();
    var newAddr = $("#newAddr" + id).text(); //địa chỉ mới
    var status = $("#status" + id).text();
    //set normat text cho tất cả các dòng
    $('tr').css({
        "color": "#000",
        "font-weight": "normal"
    });
    //highlight dòng được click (active)
    $('#' + id).css({
        "color": "#00B140",
        "font-weight": "bold"
    });
    //kiểm tra địa chỉ mới đã cập nhật chưa
    //nếu chưa cập nhật địa chỉ mới thì định vị địa chỉ cũ
    //ngược lại định vị địa chỉ mới
    if (status == "Chưa định vị") {
        $.ajax({
            method: 'POST',
            url: '/identifier/update',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                "id": id,
                "address": address
            }),
            statusCode: {
                401: function () {
                    alert('Phiên đã hết hạn, vui lòng đăng nhập lại');
                    logout();
                    $("#loginModal").modal('show');
                },
            },
            success: (res) => {
                $("#status" + id).text("Đã định vị");
                //định vị địa chỉ gốc trên map
                codeAddress(address);
            },
            error: (err) => {
                console.log(err);
            }
        });
    } else if (newAddr != "") {
        //định vị địa chỉ mới trên map
        codeAddress(newAddr);
    } else {
        //định vị địa chỉ gốc trên map
        codeAddress(address);
    }
});

//map, geocoder, marker
var map, geocoder, marker;
var pos = {
    lat: -34.397,
    lng: 150.644
};
//initMap
function initMap() {
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: 17
    });
    marker = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: pos
    });
    marker.addListener('click', toggleBounce);
    markerCoords(marker);

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
            marker.setPosition(pos);
        });
    }
}

//event drag marker
function toggleBounce() {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.DROP);
    }
}

//gecoding
function codeAddress(address) {
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status == 'OK') {
            map.setCenter(results[0].geometry.location);
            marker.setPosition(results[0].geometry.location);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

//reverse gecoding
function markerCoords(markerobject) {
    google.maps.event.addListener(markerobject, 'dragend', function (evt) {
        geocoder.geocode({
            'location': evt.latLng
        }, function (results, status) {
            //check OK
            if (status == 'OK') {
                if (results[0]) {
                    //check dòng nào đang được chọn (actived)
                    $.each($('tr'), function (index, val) {
                        //check bởi css (dòng actived sẽ được highlight)
                        if ($(val).css("font-weight") == 700) {
                            //cập nhật địa chỉ mới với request chưa/đã định vị
                            var status = $("#status" + $(val).attr('id')).text();
                            if (status == "Đã định vị" || status == "Chưa định vị") {
                                $("#newAddr" + $(val).attr('id')).text(results[0].formatted_address);
                                $.ajax({
                                    method: 'POST',
                                    url: '/identifier/update',
                                    dataType: 'json',
                                    contentType: 'application/json',
                                    data: JSON.stringify({
                                        "id": $(val).attr('id'),
                                        "newAddress": results[0].formatted_address
                                    }),
                                    statusCode: {
                                        401: function () {
                                            alert('Phiên đã hết hạn, vui lòng đăng nhập lại');
                                            logout();
                                            $("#loginModal").modal('show');
                                        },
                                    },
                                    success: (res) => {
                                        $("#status" + id).text("Đã định vị");
                                        //định vị địa chỉ mới trên map
                                        codeAddress(results[0].formatted_address);
                                    },
                                    error: (err) => {
                                        console.log(err);
                                    }
                                });
                            }
                        }
                    });
                } else {
                    console.log('No results found');
                }
            } else {
                console.log('Geocoder failed due to: ' + status);
            }
        });
    });

    google.maps.event.addListener(markerobject, 'drag', function (evt) {
        console.log("marker is being dragged");
    });
}