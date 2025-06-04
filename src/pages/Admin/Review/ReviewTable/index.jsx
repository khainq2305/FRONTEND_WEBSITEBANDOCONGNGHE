import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import ReviewRow from "../ReviewRow";


const ReviewTable = ({ data, page, onMenuOpen }) => {
  return (
    <Table>
      <TableHead>
        <TableRow >
          <TableCell align="center">STT</TableCell>
          <TableCell align="center">Avatar</TableCell>
          <TableCell align="center">Người dùng</TableCell>
          <TableCell align="center">Đánh giá</TableCell>
          <TableCell align="center">Nội dung</TableCell>
          <TableCell align="center">Trạng thái</TableCell>
          <TableCell align="center">Phản hồi</TableCell>
          <TableCell align="right">Hành động</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} align="center">
              Không tìm thấy đánh giá
            </TableCell>
          </TableRow>
        ) : (
          data.map((item, index) => (
            <ReviewRow
              key={item.id}
              item={item}
              index={index}
              page={page}
              onMenuOpen={onMenuOpen}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default ReviewTable;
