import { useState, useEffect } from "react";
import { wishlistService } from "../services/client/wishlistService";
import { toast } from 'react-toastify';

const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await wishlistService.getAll();
        const favoriteIds = res.data.filter(i => i?.product?.id).map(i => i.product.id);
        setFavorites(favoriteIds);
      } catch (err) {
        console.error("Lỗi load danh sách yêu thích:", err);
      }
    };

    fetchFavorites();
  }, []);

const toggleFavorite = async (productId) => {
  const id = parseInt(productId);
  try {
    if (favorites.includes(id)) {
      await wishlistService.remove(id);
      setFavorites(prev => prev.filter(pid => pid !== id));
      toast.success("Đã xóa khỏi yêu thích!");
    } else {
      await wishlistService.add(id);
      setFavorites(prev => [...prev, id]);
      toast.success("Đã thêm vào yêu thích!");
    }
  } catch (err) {
    console.error("Toggle yêu thích lỗi:", err);
    toast.error("Có lỗi xảy ra khi cập nhật yêu thích!");
  }
};


  const isFavorite = (productId) => favorites.includes(parseInt(productId));

  return { favorites, toggleFavorite, isFavorite };
};

export default useFavorites;
