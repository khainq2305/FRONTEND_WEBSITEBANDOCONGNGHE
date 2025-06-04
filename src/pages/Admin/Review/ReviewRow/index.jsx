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

          {Array.isArray(item.medias) && item.medias.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              {item.medias.map((media) => (
                <div key={media.id} style={{ width: 60, height: 60 }}>
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt="media"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 6,
                        cursor: 'pointer'
                      }}
                      onClick={() => window.open(media.url, '_blank')}
                    />
                  ) : (
                    <video
                      src={media.url}
                      controls
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 6
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          <br />
          <Typography
            variant="body2"
            sx={{
              color: '#333',
              whiteSpace: 'pre-line',
              wordBreak: 'break-word',
              maxWidth: '100%',
              fontSize: '14px'
            }}
          >
            {item.content}
          </Typography>



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
