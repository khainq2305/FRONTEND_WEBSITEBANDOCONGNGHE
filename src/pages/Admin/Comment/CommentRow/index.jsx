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
        <Avatar src={item.avatar} alt={item.user} />
      </TableCell>
      <TableCell>{item.user}</TableCell>
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
          {item.date}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography fontWeight={600} color={item.reply ? "green" : "orange"}>
          {item.reply ? "Đã phản hồi" : "Chưa phản hồi"}
        </Typography>
      </TableCell>
      <TableCell>
        {item.reply ? (
          <>
            <Typography>{item.reply}</Typography>
            <Typography fontSize={12} color="text.secondary">
              ({item.replyDate} - bởi {item.repliedBy || "?"})
            </Typography>
          </>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            fontStyle="italic"
          >
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
