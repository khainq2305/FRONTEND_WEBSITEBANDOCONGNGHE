// import useAuthStore from '@/stores/AuthStore'
// import { Button } from '@mui/material'
// import { useNavigate } from 'react-router-dom'

// const ButtonCustom = ({ label, to = null, action, onClick = null }) => {
//   const navigate = useNavigate()
//   const { user } = useAuthStore()

//   const checkPermissions = () => {
//     if (!user || !user.permissions) return false
//     if (!action) return false

//     // Lấy tất cả subjects
//     const availableSubjects = [...new Set(user.permissions.map(p => p.subject))]
//     const subject = availableSubjects[0]

//     if (!subject) return false

//     // Kiểm tra quyền
//     return user.permissions.some(
//       permission => permission.action === action && permission.subject === subject
//     )
//   }

//   const hasPermission = checkPermissions()

//   if (!hasPermission) return null

//   const handleClick = () => {
//     if (onClick) {
//       onClick()
//     } else if (to) {
//       navigate(to)
//     }
//   }

//   return (
//     <Button variant="contained" color="primary" onClick={handleClick}>
//       + {label}
//     </Button>
//   )
// }

// export default ButtonCustom

import useAuthStore from '@/stores/AuthStore';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { hasActionOnAnySubject } from '@/utils/disableAction';

const ButtonCustom = ({ label, to = null, action, subject = null, onClick = null }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Kiểm tra permission
  const checkPermission = () => {
    if (!user?.permissions || !action) return false;

    // Nếu có subject cụ thể
    if (subject) {
      return hasPermission(user.permissions, action, subject);
    }
    
    // Nếu không có subject, check action trên bất kỳ subject nào
    return hasActionOnAnySubject(user.permissions, action);
  };

  // Không có permission thì không render
  if (!checkPermission()) return null;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    }
  };

  return (
    <Button variant="contained" color="primary" onClick={handleClick}>
      + {label}
    </Button>
  );
};

export default ButtonCustom;