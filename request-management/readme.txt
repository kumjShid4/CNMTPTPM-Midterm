1. Chạy server: "npm start".
2. Chạy client: "http-server".
3. PUSH vào địa chỉ "localhost:3002/requests/management" với body (1 phần tử):
[
    {
        "Id": 1,
        "Name": "Lê Minh Ân",
        "Phone": "981864332",
        "Address": "Chung cư Nghĩa Phát, P6, Tân Bình, Hồ Chí Minh, Việt Nam",
        "Note": "",
        "Status": "Đã định vị",
        "CreatedTime": "13-11-2018 21:37:06",
        "CurCoordinates": "{\"lat\": \"10.7832208\", \"lng\": \"106.6548285\"}",
        "NewCoordinates": "{\"lat\": \"10.8184631\", \"lng\": \"106.6588245\"}",
        "NewAddress": "Tan Son Nhat International Airport, Trường Sơn, Phường 2, Tân Bình, Hồ Chí Minh, Vietnam",
        "DriverId": null
    }
]
để thay đổi trạng thái, hiện thông tin tài xế và thêm request.