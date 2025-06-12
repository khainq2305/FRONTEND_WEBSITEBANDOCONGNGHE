import {
  TableRow,
  TableCell,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const CommentRow = ({ item, index, page, onMenuOpen }) => {
  return (
    <TableRow>
      <TableCell>{page * 5 + index + 1}</TableCell>
      <TableCell>
        <Avatar src={item.user?.avatarUrl || ''} alt={item.user?.fullName || ''} />
      </TableCell>
      <TableCell>{item.user?.fullName}</TableCell>
      <TableCell>
        {[1, 2, 3, 4, 5].map((star) =>
          star <= item.rating ? (
            <StarIcon key={star} fontSize="small" color="warning" />
          ) : (
            <StarBorderIcon key={star} fontSize="small" color="disabled" />
          )
        )}
      </TableCell>
      <TableCell>
        <Typography fontSize={14}>{item.content}</Typography>
        <Typography fontSize={12} color="text.secondary">
          {new Date(item.createdAt).toLocaleString("vi-VN")}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography fontWeight={600} color={item.replyContent ? "green" : "orange"}>
          {item.replyContent ? "Đã phản hồi" : "Chưa phản hồi"}
        </Typography>
      </TableCell>
      <TableCell>
        {item.replyContent ? (
          <>
            <Typography>{item.replyContent}</Typography>
            <Typography fontSize={12} color="text.secondary">
              ({new Date(item.replyDate).toLocaleString("vi-VN")} - bởi {item.repliedBy || "?"})
            </Typography>
          </>
        ) : (
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            Chưa có phản hồi
          </Typography>
        )}
      </TableCell>
      <TableCell align="right">
        <IconButton onClick={(e) => onMenuOpen(e, item)}>
          <MoreVertIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default CommentRow;
