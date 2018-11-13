//Định vị địa chỉ gốc của người dùng
$(document).on("click", ".dinhvi", function () {
    var id = $(this).parent().attr('class'); //id request 
    var newAddr = $("#newAddr" + id).text(); //địa chỉ mới
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
    if (newAddr == "") {
        $.ajax({
            method: 'POST',
            url: '/data/update',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                "id": id,
            }),
            success: (res) => {
                $("#status" + id).text("Đã định vị");
                //định vị địa chỉ gốc trên map
                codeAddress($("#addr" + id).children().text());
            },
            error: (err) => {
                console.log(err);
            }
        })
    }
    else {
        //định vị địa chỉ mới trên map
        codeAddress(newAddr);
    }
})

//map, geocoder, marker
var map, geocoder, marker;
var pos = { lat: -34.397, lng: 150.644 };
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
    geocoder.geocode({ 'address': address }, function (results, status) {
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
        geocoder.geocode({'location': evt.latLng}, function(results, status){
            //check OK
            if (status == 'OK') {
                if (results[0]) {
                    //check dòng nào đang được chọn (actived)
                    $.each($('tr'), function(index, val){
                        //check bởi css (dòng actived sẽ được highlight)
                        if ($(val).css("font-weight") == 700) {
                            //cập nhật địa chỉ mới
                            $("#newAddr" + $(val).attr('id')).text(results[0].formatted_address);
                        }
                    })
                }
                else {
                    console.log('No results found');
                }
            }
            else {
                console.log('Geocoder failed due to: ' + status);
            }
        })
    });

    google.maps.event.addListener(markerobject, 'drag', function (evt) {
        console.log("marker is being dragged");
    });
}