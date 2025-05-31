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
import { Link } from 'react-router-dom';

const ReviewRow = ({ item, index, page, onMenuOpen }) => {
  return (
    <TableRow>
      <TableCell>{page * 5 + index + 1}</TableCell>

      <TableCell>
        <Avatar
          src={item.user?.avatarUrl}
          alt={item.user?.fullName}
          sx={{ width: 36, height: 36 }}
        />
      </TableCell>

      <TableCell>
        <Typography fontWeight={500}>{item.user?.fullName}</Typography>
      </TableCell>

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
        <TableCell
          sx={{
            maxWidth: 300,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          <Link
            to={`/admin/reviews/all/${item.id}`}
            style={{
              color: '#1976d2',
              textDecoration: 'none',
              display: 'inline-block',
              maxWidth: '100%'
            }}
            title={item.content} // Tooltip khi hover
          >
            {item.content}
          </Link>
          <div style={{ fontSize: '12px', color: '#888' }}>
            {new Date(item.createdAt).toLocaleString('vi-VN')}
          </div>
        </TableCell>
        <Typography fontSize={12} color="text.secondary">
          {new Date(item.createdAt).toLocaleString("vi-VN")}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography
          fontWeight={600}
          color={item.isReplied ? "green" : "orange"}
        >
          {item.isReplied ? "Đã phản hồi" : "Chưa phản hồi"}
        </Typography>
      </TableCell>

      <TableCell>
        {item.isReplied ? (
          <>
            <Typography>{item.replyContent}</Typography>
            <Typography fontSize={12} color="text.secondary">
              ({new Date(item.updatedAt).toLocaleString("vi-VN")} - bởi{" "}
              {item.responder?.fullName || "Admin"})
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

export default ReviewRow;
