import React, { useState, useEffect } from 'react';
import FeatureSlider from '../FeatureSlider';
import { wishlistService } from '@/services/client/wishlistService';
import { toast } from 'react-toastify';
import PopupModal from '@/layout/Client/Header/PopupModal';
import FavoriteLoader from '@/components/common/FavoriteLoader';
import { useCompareStore } from '@/stores/useCompareStore';
import compareIcon from '@/assets/Client/images/swap.png';

const AnimationStyles = () => (
    <style>
        {`
      @keyframes animate-pop {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
      }
      .animate-pop { animation: animate-pop 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }

      .particle {
        position: absolute; top: 50%; left: 50%;
        width: 6px; height: 6px; border-radius: 50%; background-color: #ef4444;
        transform-origin: center center; animation: particle-burst var(--duration) ease-out forwards;
      }
      @keyframes particle-burst {
        0% { transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0) scale(1); opacity: 1; }
        100% { transform: translate(-50%, -50%) rotate(var(--angle)) translateY(var(--distance)) scale(0); opacity: 0; }
      }

      @keyframes heart-break-left {
        0% { transform: translateX(0) translateY(0) rotate(0deg) scale(1); opacity: 1; }
        100% { transform: translateX(-15px) translateY(-10px) rotate(-25deg) scale(0.8); opacity: 0; }
      }
      @keyframes heart-break-right {
        0% { transform: translateX(0) translateY(0) rotate(0deg) scale(1); opacity: 1; }
        100% { transform: translateX(15px) translateY(-10px) rotate(25deg) scale(0.8); opacity: 0; }
      }
      .animate-heart-break-left { animation: heart-break-left 0.6s ease-out forwards; }
      .animate-heart-break-right { animation: heart-break-right 0.6s ease-out forwards; }
    `}
    </style>
);

const ParticleBurst = () => (
    <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
            <div
                key={i}
                className="particle"
                style={{
                    '--angle': `${i * 45}deg`,
                    '--distance': `${Math.random() * 20 + 40}px`,
                    '--duration': `${Math.random() * 0.4 + 0.4}s`,
                }}
            />
        ))}
    </div>
);

const AnimatedHeartIcon = ({ isFavorited, isLiking, isUnliking, ...props }) => {
    const heartPath =
        'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

    return (
        <div className={`relative w-8 h-8 ${isLiking ? 'animate-pop' : ''}`} {...props}>
            {isLiking && <ParticleBurst />}
            {isUnliking ? (
                <>
                    <svg
                        viewBox="0 0 24 24"
                        className="absolute w-full h-full animate-heart-break-left"
                        style={{ clipPath: 'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)' }}
                    >
                        <path d={heartPath} fill="currentColor" />
                    </svg>
                    <svg
                        viewBox="0 0 24 24"
                        className="absolute w-full h-full animate-heart-break-right"
                        style={{ clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)' }}
                    >
                        <path d={heartPath} fill="currentColor" />
                    </svg>
                </>
            ) : (
                <svg viewBox="0 0 24 24" className="w-full h-full">
                    <path
                        d={heartPath}
                        fill={isFavorited ? 'currentColor' : 'white'}
                        stroke="currentColor"
                        strokeWidth={isFavorited ? '0' : '2'}
                    />
                </svg>
            )}
        </div>
    );
};

const ChevronLeftIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);

const ChevronRightIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);

export default function ProductImageSection({
    mainImage,
    setMainImage,
    allImages = [],
    productName,
    stickyTopOffset = 'xl:top-6',
    infoBoxContent,
    productId,
    skuId,

    compareData,
}) {
    const [isFavorited, setIsFavorited] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [isUnliking, setIsUnliking] = useState(false);
    const setOpenCompareBar = useCompareStore((s) => s.setOpenCompareBar);

    // Compare store
    const compareItems = useCompareStore((s) => s.compareItems);
    const addToCompare = useCompareStore((s) => s.addToCompare);
    const removeFromCompare = useCompareStore((s) => s.removeFromCompare);
    const clearCompare = useCompareStore((s) => s.clearCompare);
    const setIsCompareBarCollapsed = useCompareStore((s) => s.setIsCompareBarCollapsed);

    const inCompare = !!compareItems.find((it) => it && compareData && it.id === compareData.id);

    const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');
    const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());

    useEffect(() => {
        const checkLogin = () => setIsLoggedIn(!!getToken());
        window.addEventListener('storage', checkLogin);
        window.addEventListener('focus', checkLogin);
        checkLogin();
        return () => {
            window.removeEventListener('storage', checkLogin);
            window.removeEventListener('focus', checkLogin);
        };
    }, []);

    useEffect(() => {
        const checkFavorite = async () => {
            try {
                const res = await wishlistService.getAll();
                const matched = res.data?.find((item) => item.productId === productId && item.skuId === skuId);
                setIsFavorited(!!matched);
            } catch (err) {
                console.error('Lỗi kiểm tra yêu thích:', err);
            }
        };
        if (productId && skuId && isLoggedIn) checkFavorite();
    }, [productId, skuId, isLoggedIn]);

    const handleFavoriteToggle = async () => {
        if (!productId || !skuId || loading || isLiking || isUnliking) return;
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }
        setLoading(true);
        if (isFavorited) {
            setIsUnliking(true);
            setTimeout(async () => {
                try {
                    await wishlistService.remove(productId, skuId);
                    toast.success('Đã xoá khỏi danh sách yêu thích!');
                    setIsFavorited(false);
                } catch (err) {
                    console.error('Lỗi thao tác yêu thích:', err);
                    toast.error('Lỗi khi xử lý yêu thích');
                } finally {
                    setIsUnliking(false);
                    setLoading(false);
                }
            }, 600);
        } else {
            setIsLiking(true);
            setTimeout(() => setIsLiking(false), 800);
            try {
                await wishlistService.add(productId, { skuId });
                toast.success('Đã thêm vào danh sách yêu thích!');
                setIsFavorited(true);
            } catch (err) {
                console.error('Lỗi thao tác yêu thích:', err);
                toast.error('Lỗi khi xử lý yêu thích');
            } finally {
                setLoading(false);
            }
        }
    };


    const handleCompareToggle = () => {
        if (!compareData) {
            toast.info('Không đủ dữ liệu để so sánh.');
            return;
        }


        if (inCompare) {
            removeFromCompare(compareData.id);
            toast.success('Đã bỏ khỏi danh sách so sánh.');
            return;
        }

        const items = compareItems.filter(Boolean);
        const first = items[0];


        const prodTop =
            compareData?.category?.topLevelId ?? compareData?.category?.id ?? null;
        const firstTop =
            first?.category?.topLevelId ?? first?.category?.id ?? null;

        if (items.length > 0 && prodTop && firstTop && prodTop !== firstTop) {
            clearCompare();
            addToCompare(compareData);
            setOpenCompareBar(true);

            toast.success(`Đã xóa sản phẩm cũ và thêm "${compareData.name}" vào so sánh (khác danh mục cấp 1).`);
            return;
        }

        if (items.length >= 3) {
            toast.warn('Bạn chỉ có thể so sánh tối đa 3 sản phẩm.');
            return;
        }

        addToCompare(compareData);
        setOpenCompareBar(true);

        toast.success('Đã thêm vào danh sách so sánh.');
    };
    // ===================================

    const currentIndex = allImages.findIndex((imgObj) => imgObj.imageFull === mainImage);

    const handlePreviousImage = () => {
        if (allImages.length <= 1) return;
        const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
        setMainImage(allImages[prevIndex].imageFull);
    };

    const handleNextImage = () => {
        if (allImages.length <= 1) return;
        const nextIndex = (currentIndex + 1) % allImages.length;
        setMainImage(allImages[nextIndex].imageFull);
    };

    const showArrows = allImages.length > 1;
    const arrowButtonClasses =
        'absolute top-1/2 transform -translate-y-1/2 p-2.5 rounded-full shadow-lg z-10 transition-opacity duration-200 opacity-60 group-hover:opacity-100 bg-white/70 backdrop-blur-sm hover:bg-white';


    const compareCount = compareItems.filter(Boolean).length;

    return (
        <>
            <AnimationStyles />

            {loading && <FavoriteLoader fullscreen />}

            <div className={`relative xl:sticky ${stickyTopOffset} xl:z-10 min-w-0`}>
                <div className="bg-white md:shadow-xl md:rounded-lg md:p-4 space-y-4">
                    <div className="group w-full aspect-[4/3] overflow-hidden relative p-4">
                        <img
                            src={mainImage}
                            alt={productName || 'Product image'}
                            className="w-full h-full object-contain"
                        />


                        <button
                            onClick={handleFavoriteToggle}
                            className="absolute top-3 left-3 sm:top-5 sm:left-5 p-1 text-red-600 z-20 hover:scale-110 active:scale-95 transition-transform"
                            aria-label={isFavorited ? 'Xóa khỏi Yêu thích' : 'Thêm vào Yêu thích'}
                            disabled={loading}
                            title={isFavorited ? 'Đã yêu thích' : 'Thêm vào yêu thích'}
                        >
                            <AnimatedHeartIcon
                                isFavorited={isFavorited}
                                isLiking={isLiking}
                                isUnliking={isUnliking}
                            />
                        </button>


                        <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-20 flex items-center gap-2">

                            <button
                                onClick={handleFavoriteToggle}
                                className="p-1 text-red-600 hover:scale-110 active:scale-95 transition-transform"
                                aria-label={isFavorited ? 'Xóa khỏi Yêu thích' : 'Thêm vào Yêu thích'}
                                disabled={loading}
                                title={isFavorited ? 'Đã yêu thích' : 'Thêm vào yêu thích'}
                            >
                                <AnimatedHeartIcon
                                    isFavorited={isFavorited}
                                    isLiking={isLiking}
                                    isUnliking={isUnliking}
                                />
                            </button>


                            <button
                                onClick={handleCompareToggle}
                                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition
      ${inCompare
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'}`}
                                aria-label={inCompare ? 'Bỏ khỏi so sánh' : 'Thêm vào so sánh'}
                                title={inCompare ? 'Bỏ khỏi so sánh' : 'Thêm vào so sánh'}
                            >

                                <img
                                    src={compareIcon}
                                    alt="So sánh"
                                    className="w-7 h-7"
                                />
                            </button>
                        </div>

                    </div>

                    {FeatureSlider && (
                        <div className="px-4 py-2 md:px-0">
                            <FeatureSlider
                                images={allImages}
                                currentImage={mainImage}
                                onSelect={(imgFullUrl) => setMainImage(imgFullUrl)}
                            />
                        </div>
                    )}

                    {infoBoxContent && <div className="mt-4">{infoBoxContent}</div>}
                </div>

                <PopupModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            </div>
        </>
    );
}
