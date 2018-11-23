var socket = null;

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
})

$(document).ready(function () {
    //check login
    if (Cookies.get('driver_auth') == "true") {
        //thêm tên user
        var user = JSON.parse(Cookies.get('driver').substring(2));
        $("#userDropdown").append(user["Name"]);
        setStatus(user["Status"] !== "Standby");
        //hidden login, signup dropdown item
        //show logout
        setDropDownItem(true);
        // socket = io('http://localhost:3000');
        // var data = { userId: user["Id"], userStatus: user["Status"], userCoords: user["Coordinates"] }
        // socket.on('connect', () => {
        //     socket.emit('join', data);
        //     socket.emit('news', 'hello');
        //     socket.on('news-response', function(data){
        //         console.log(data);   //should output 'hello world'
        //     });
        // })
        // socket.open();
    } else {
        //show login, signup dropdown item
        //hidden logout
        setDropDownItem(false);
    }
})

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
})

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
            initMap();
            setDropDownItem(true);
            var user = JSON.parse(Cookies.get('driver').substring(2));
            //thêm tên user
            $("#userDropdown").append(user["Name"]);
            $("#loginModal").modal('hide');
            setStatus(user["Status"] !== "Standby");
            // socket = io('http://localhost:3003');
            // var data = { userId: user["Id"], userStatus: user["Status"], userCoords: user["Coordinates"] }
            // socket.on('connect', () => {
            //     socket.emit('join', data);
            //     socket.emit('news', 'hello');
            //     socket.on('news-response', function(data){
            //         console.log(data);   //should output 'hello world'
            //         var confirmed = confirm("Nhận request?");
            //         socket.emit('response', confirmed);
            //     });
            // })
            // socket.open();
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
                if (err.status == 400) {
                    alert("Tài khoản đã tồn tại");
                } else {
                    alert("Đăng kí không thành công, vui lòng thử lại");                    
                }
            }
        })
    } else {
        alert("Mật khẩu xác nhận không đúng");
    }
});

//logout
$("#logoutDropdown").click(function () {
    //remove token, name user trong cookie
    Cookies.remove('driver_token');
    Cookies.remove('driver');
    Cookies.set('driver_auth', false);
    ajaxStatus(false);
    $("#userDropdown").text("");
    $("#userDropdown").append('\<i class="fa fa-user-circle fa-fw"></i>')
    setDropDownItem(false);
    socket.close();
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

//set status
function setStatus(ready) {
    if (ready) {
        $("#ready").addClass("active");
        $("#standby").removeClass("active");
    } else {
        $("#standby").addClass("active");
        $("#ready").removeClass("active");
    }
}

//status ready
$("#ready").click(function () {
    ajaxStatus(true, curpos);
})

//status standby
$("#standby").click(function () {
    ajaxStatus(false, curpos);
})

function ajaxStatus(ready, pos) {
    if (Cookies.get('driver_auth') == "true") {
        var user = JSON.parse(Cookies.get('driver').substring(2));
        $.ajax({
            method: 'POST',
            url: '/driver/status',
            data: {
                id: user.Id,
                status: ready === true ? "Ready" : "Standby",
                curpos: pos
            },
            success: (res) => {
                console.log("Thành công");
                setStatus(ready);
                console.log(user);
                // user = JSON.parse(Cookies.get('user').substring(2));
                // var data = { userId: user["Id"], userStatus: user["Status"], userCoords: user["Coordinates"] }
                // socket.emit('updateStatus', data);
            },
            error: (err) => {
                console.log("Không thành công, vui lòng thử lại");
                console.log(err);
            }
        })
    }
}

function ajaxCurpos(pos) {
    if (Cookies.get('driver_auth') == "true") {
        var user = JSON.parse(Cookies.get('driver').substring(2));
        $.ajax({
            method: 'POST',
            url: '/driver/curpos',
            data: {
                id: user.Id,
                curpos: pos
            },
            success: (res) => {
                // user = JSON.parse(Cookies.get('user').substring(2));
                // console.log(user)
                // var data = { userId: user["Id"], userStatus: user["Status"], userCoords: user["Coordinates"] }
                // socket.emit('updateCoords', data);
                console.log("Cập nhập địa chỉ thành công");
            },
            error: (err) => {
                console.log("Cập nhập địa chỉ không thành công, vui lòng thử lại");
                console.log(err);
            }
        })
    }
}

var map, infoWindow, geocoder, marker;
var pos = { lat: -34.397, lng: 150.644 };
var curpos = pos;
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

            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            curpos = pos;

            if (Cookies.get('driver_auth') == "true") {
                var user = JSON.parse(Cookies.get('driver').substring(2));
                $.ajax({
                    method: 'POST',
                    url: '/driver/curpos',
                    data: {
                        id: user.Id,
                        curpos: pos
                    },
                    success: (res) => {
                        // user = JSON.parse(Cookies.get('user').substring(2));
                        // var data = { userId: user["Id"], userStatus: user["Status"], userCoords: user["Coordinates"] }
                        // socket.emit('updateCoords', data);
                    },
                    error: (err) => {
                        console.log("Không thành công, vui lòng thử lại");
                        console.log(err);
                    }
                })
            }

            map.setCenter(pos);
            marker.setPosition(pos);
        });
    }
}

function toggleBounce() {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.DROP);
    }
}

function markerCoords(markerobject) {
    google.maps.event.addListener(markerobject, 'dragend', function (evt) {
        geocoder.geocode({ 'location': evt.latLng }, function (results, status) {
            if (calcCrow(curpos.lat, curpos.lng, marker.getPosition().lat(), marker.getPosition().lng()) <= 0.1) {
                curpos.lat = marker.getPosition().lat();
                curpos.lng = marker.getPosition().lng();
                ajaxCurpos(curpos);
            } else {
                alert("Không thể cập nhật quá 100 m, vui lòng thử lại sau");
                map.setCenter(curpos);
                marker.setPosition(curpos);
            }
        })

    });

    google.maps.event.addListener(markerobject, 'drag', function (evt) {
        console.log("marker is being dragged");
    });

}

function calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

// Converts numeric degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180;
}

var loadRequest = function () {
    //chỉ load request khi đã đăng nhập
    var user = JSON.parse(Cookies.get('driver').substring(2));
    if (Cookies.get('driver_auth') == "true" && user["Status"] == "Ready") {
        var instance = axios.create({
            baseURL: 'http://localhost:3000',
            timeout: 15000
        });
        instance.get('/data')
            .then(function (res) {
                if (res.status === 200) {
                    console.log(res.data)
                }
            }).catch(function (error) {
                if (!error.response) {
                    this.errorStatus = 'Error: Network Error';
                } else {
                    this.errorStatus = error.response.data.message;
                }
            }).then(function () {
                loadRequest();
            })
    }
}