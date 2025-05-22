import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import CommentRow from "../CommentRow";

const CommentTable = ({ data, page, onMenuOpen }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>#</TableCell>
          <TableCell>Avatar</TableCell>
          <TableCell>Người dùng</TableCell>
          <TableCell>Đánh giá</TableCell>
          <TableCell>Nội dung</TableCell>
          <TableCell>Trạng thái</TableCell>
          <TableCell>Phản hồi</TableCell>
          <TableCell align="right">Hành động</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} align="center">
              Không tìm thấy bình luận
            </TableCell>
          </TableRow>
        ) : (
          data.map((item, index) => (
            <CommentRow
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

export default CommentTable;
