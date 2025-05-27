// project imports
import Navigation from './Navigation';
import SimpleBar from 'components/Admin/third-party/SimpleBar'; // Your custom scrollbar component

// ==============================|| DRAWER CONTENT ||============================== //

export default function DrawerContent() {
  return (
    <SimpleBar
      sx={{
        flexGrow: 1, // Cho phép SimpleBar mở rộng theo chiều dọc
        overflowY: 'auto', // Đảm bảo hành vi cuộn được kích hoạt
        overflowX: 'hidden', // Ngăn cuộn ngang

        // Style có sẵn cho nội dung bên trong SimpleBar
        '& .simplebar-content': {
          display: 'flex',
          flexDirection: 'column'
        },

        // === CSS ĐỂ LÀM MỎNG THANH CUỘN ===
        // Áp dụng cho track (đường ray) của thanh cuộn dọc
        '& .simplebar-track.simplebar-vertical': {
          width: '6px', // Bạn có thể thay đổi giá trị này (ví dụ: '4px', '5px')
        },
        // Áp dụng cho thumb (con trượt) của thanh cuộn dọc
        '& .simplebar-track.simplebar-vertical .simplebar-scrollbar::before': {
          // Con trượt thường tự điều chỉnh chiều rộng theo track.
          // Nếu bạn muốn thay đổi màu của con trượt:
          // backgroundColor: 'rgba(0, 0, 0, 0.3)', // Ví dụ: màu xám nhạt hơn
        },

        // (Tùy chọn) Nếu bạn muốn làm mỏng cả thanh cuộn ngang (nếu có sử dụng)
        '& .simplebar-track.simplebar-horizontal': {
          height: '6px', // Điều chỉnh độ dày cho thanh cuộn ngang
        },
        // '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar::before': {
        //   // backgroundColor: 'rgba(0, 0, 0, 0.3)',
        // },
        // === KẾT THÚC CSS LÀM MỎNG THANH CUỘN ===

        // (Tùy chọn) Padding ở cuối nếu mục cuối cùng quá sát
        // paddingBottom: (theme) => theme.spacing(1),
      }}
    >
      <Navigation />
    </SimpleBar>
  );
}