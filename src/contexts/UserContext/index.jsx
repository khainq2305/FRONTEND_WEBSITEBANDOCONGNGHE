import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../../services/client/authService'; // Điều chỉnh đường dẫn
import { API_BASE_URL } from '../../constants/environment'; // Điều chỉnh đường dẫn

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const fetchUserData = async () => {
    setIsLoadingUser(true);
    try {
      const response = await authService.getUserInfo();
      const user = response.data.user;
      setCurrentUser(user);
      if (user.avatarUrl) {
        let fullAvatarPath = user.avatarUrl.startsWith('http')
          ? user.avatarUrl
          : `${API_BASE_URL}${user.avatarUrl}`;
        setAvatarPreview(`${fullAvatarPath}?_=${new Date().getTime()}`);
      } else {
        setAvatarPreview(null);
      }
    } catch (error) {
      console.error("Lỗi lấy thông tin người dùng trong Context:", error);
      setCurrentUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const updateUserAvatar = (newAvatarRelativePath) => {
    if (newAvatarRelativePath) {
      const cacheBuster = `?_=${new Date().getTime()}`;
      const newAvatarUrlWithTimestamp = `${API_BASE_URL}${newAvatarRelativePath}${cacheBuster}`;
      setAvatarPreview(newAvatarUrlWithTimestamp);
      if (currentUser) {
        setCurrentUser(prevUser => ({ ...prevUser, avatarUrl: newAvatarRelativePath }));
      }
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, avatarPreview, updateUserAvatar, isLoadingUser, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
