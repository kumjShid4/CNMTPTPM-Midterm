# CNMTPTPM-Midterm
Đồ án giữa kì môn CNMTPTPM

## Sinh viên thực hiện
- 1512016
- 1512007
- 1512138

## App #1 - *Request Reciever*
- [x] Nhận thông tin khách (request): họ tên, điện thoại, địa chỉ đón khách, ghi chú

## App #2 - *Location Identifier*
- [x] Thể hiện thông tin các request được ghi nhận bởi app #1
- [x] Sử dụng **geocoding** để xác định nhanh toạ độ dựa vào địa chỉ
- [x] Có thể di chuyển vị trí khách trên bản đồ 1 cách tự do, địa chỉ khách khi đó phải được cập nhật lại tương ứng (**reverse geocoding**)

## App #3 - *Request Management*
- [x] Thể hiện danh sách request cùng trạng thái tương ứng (chưa được định vị, đã định vị xong, đã có xe nhận, đang di chuyển, đã hoàn thành, …)
- [x] Danh sách được sắp xếp theo thứ tự giảm dần theo thời điểm đặt
- [x] Trong trường hợp request đã có xe nhận, nhân viên có thể chọn xem đường đi ngắn nhất từ xe đến khách trên bản đồ, thông tin tài xế cũng được thể hiện đầy đủ trên danh sách

## App #4 - *Driver*
- [x] Giao diện được thiết kế phù hợp với **màn hình điện thoại**
- [x] Cho phép cập nhật vị trí hiện tại thông qua hành vi click bản đồ. Nếu click xa quá 100m (theo công thức Harversine) thì thông báo lỗi
- [x] Cho phép tài xế đăng nhập vào hệ thống và sẵn sàng nhận thông tin request
- [x] Cho phép đổi trạng thái **READY** / **STANDBY**
- [x] Khi thông tin 1 request được gửi xuống, app thể hiện trong vòng 10s và yêu cầu tài xế phản hồi. Nếu tài xế **TỪ CHỐI** hoặc **KHÔNG PHẢN HỒI**, hệ thống tự động tìm xe khác cho khách.
  - [x] Khi tài xế đồng ý đón khách, app show đường đi ngắn nhất từ vị trí hiện tại đến vị trí khách trên bản đồ, giúp tài xế dễ dàng đi đến **ĐIỂM ĐÓN KHÁCH**
- [x] Tài xế khi đón được khách, chọn lệnh **BẮT ĐẦU**; và sau khi đến nơi, chọn lệnh **KẾT THÚC**
  - [x] Sau khi request kết thúc, tài xế được chuyển về trạng thái **READY** để có thể nhận được request khác
