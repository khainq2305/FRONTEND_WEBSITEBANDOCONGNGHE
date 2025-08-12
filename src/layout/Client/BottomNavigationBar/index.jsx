import React, { useState, useEffect } from 'react';
import { Home, LayoutGrid, ShoppingCart, User, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cartService } from '../../../services/client/cartService';
import { authService } from '../../../services/client/authService';
import { categoryService } from '../../../services/client/categoryService';
import MobileCategoryPanel from '../Header/MobileCategoryPanel';
import Overlay from '../Header/Overlay';

const BottomNavigationBar = () => {
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileCategoryPanelOpen, setIsMobileCategoryPanelOpen] = useState(false);
  const [mobileCategoryTree, setMobileCategoryTree] = useState([]);

  const fetchCartItemCount = async () => {
    try {
      const res = await cartService.getCart();
      const items = res.data?.cartItems || [];
      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemCount(totalQuantity);
    } catch (err) {
      console.error('Lỗi khi lấy giỏ hàng:', err);
      setCartItemCount(0);
    }
  };

  const buildCategoryTree = (categories, parentId = null) => {
    return categories
      .filter((category) => category.parent_id === parentId)
      .map((category) => ({
        ...category,
        children: buildCategoryTree(categories, category.id)
      }));
  };

  useEffect(() => {
    const checkLoginStatusAndFetchCategories = async () => {
      const status = await authService.isLoggedIn();
      setIsLoggedIn(status);

      try {
        const response = await categoryService.getCombinedMenu();
        const combinedNested = response.data || [];
        const flatList = combinedNested.flatMap((item) => {
          const flatten = (arr, parentId = null) => {
            return arr.flatMap((child) => {
              const standardizedItem = {
                id: child.id,
                name: child.name,
                slug: child.slug,
                parent_id: parentId,
                imageUrl: child.thumbnail,
                thumbnail: child.thumbnail,
                type: child.type
              };
              return [standardizedItem, ...(child.children ? flatten(child.children, child.id) : [])];
            });
          };
          return flatten([item]);
        });
        setMobileCategoryTree(buildCategoryTree(flatList));
      } catch (err) {
        console.error('Lỗi lấy danh mục tổng hợp:', err);
      }
    };

    checkLoginStatusAndFetchCategories();
    fetchCartItemCount();

    const handleCartUpdated = () => {
      fetchCartItemCount();
    };
    window.addEventListener('cartUpdated', handleCartUpdated);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated);
    };
  }, []);

  useEffect(() => {
    if (isMobileCategoryPanelOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileCategoryPanelOpen]);

  const toggleMobileCategoryPanel = () => {
    setIsMobileCategoryPanelOpen(!isMobileCategoryPanelOpen);
  };

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: Home, to: '/', active: true },
    { id: 'category', label: 'Danh mục', icon: LayoutGrid, onClick: toggleMobileCategoryPanel },
    { id: 'cart', label: 'Giỏ hàng', icon: ShoppingCart, to: '/cart' },
    { id: 'account', label: 'Tài khoản', icon: User, to: isLoggedIn ? '/user-profile' : '/dang-nhap' }
  ];

  return (
    <>
      <nav className="xl:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-top-nav z-40">
        <div className="max-w-[1200px] mx-auto flex justify-around items-center h-[56px] ">
          {navItems.map((item) => {
            const CommonContent = (
              <>
                <item.icon size={22} strokeWidth={item.active ? 2 : 1.8} className="mb-0.5" />
                <span className={`text-[10px] leading-tight font-medium ${item.active ? 'font-semibold' : ''}`}>{item.label}</span>
                {item.id === 'cart' && cartItemCount > 0 && (
                  <span className="absolute top-0.5 right-[calc(50%-18px)] transform translate-x-1/2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </>
            );

            if (item.onClick) {
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className={`flex flex-col items-center justify-center p-1 text-center flex-grow relative 
                                                ${item.active ? 'text-primary' : 'text-gray-500 hover:text-primary-focus'}
                                                transition-colors duration-200`}
                  aria-label={item.label}
                >
                  {CommonContent}
                </button>
              );
            } else {
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  className={`flex flex-col items-center justify-center p-1 text-center flex-grow relative 
                                                ${item.active ? 'text-primary' : 'text-gray-500 hover:text-primary-focus'}
                                                transition-colors duration-200`}
                  aria-label={item.label}
                >
                  {CommonContent}
                </Link>
              );
            }
          })}
        </div>
        <style jsx>{`
          .shadow-top-nav {
            box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.05);
          }
        `}</style>
      </nav>

      <Overlay isOpen={isMobileCategoryPanelOpen} onClick={toggleMobileCategoryPanel} />
      <MobileCategoryPanel isOpen={isMobileCategoryPanelOpen} onClose={toggleMobileCategoryPanel} categories={mobileCategoryTree} />
    </>
  );
};

export default BottomNavigationBar;
