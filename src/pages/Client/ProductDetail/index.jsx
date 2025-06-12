import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

// Import các component con và service
import ProductImageSection from "./ProductImageSection";
import ProductOptions from "./ProductOptions";
import RelatedProductsSlider from "./RelatedProductsSlider";
import ProductReviewSection from "./ProductReviewSection";
import TechnicalSpec from "./TechnicalSpec";
import ProductQA from "./ProductQA";
import ProductInfoBox from "./ProductInfoBox";
import AddToCartSuccessToast from './AddToCartSuccessToast';
import { productService } from "../../../services/client/productService";
import { cartService } from "../../../services/client/cartService";
import { bannerService } from "../../../services/client/bannerService";
import { productViewService } from "../../../services/client/productViewService";

// ===================================================================
// CÁC COMPONENT PHỤ ĐƯỢC GIỮ NGUYÊN BÊN TRONG FILE
// ===================================================================

const HomeIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
);

const StarRating = ({ rating, totalStars = 5 }) => (
    <div className="flex items-center">
        {[...Array(totalStars)].map((_, index) => {
            const numRating = parseFloat(rating);
            const starKey = `star-${index}`;
            if (numRating >= index + 1) {
                return <svg key={starKey} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.293c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
            }
            return <svg key={starKey} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.293c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
        })}
    </div>
);

const Breadcrumb = ({ productName, productCategory }) => {
    const [isDocked, setIsDocked] = useState(false);
    const breadcrumbRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!breadcrumbRef.current) return;
            if (window.innerWidth >= 768) {
                setIsDocked(breadcrumbRef.current.getBoundingClientRect().top <= 0);
            } else {
                setIsDocked(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div ref={breadcrumbRef} className={` backdrop-blur-sm transition-shadow duration-200 ease-in-out ${isDocked ? "md:sticky md:top-0 md:z-20 md:shadow-md" : ""}`}>
            <div className="max-w-[1200px] mx-auto flex items-center flex-wrap gap-x-1.5 gap-y-1 px-4 py-2.5 text-sm text-gray-500">
                <Link to="/" className="hover:text-primary flex items-center"><HomeIcon className="w-4 h-4 mr-1" />Trang chủ</Link>
                <span className="text-gray-400">/</span>
                {productCategory && (
                    <>
                        <Link to={`/category/${productCategory.slug}`} className="hover:text-primary">{productCategory.name}</Link>
                        <span className="text-gray-400">/</span>
                    </>
                )}
                <span className="text-gray-700 font-medium">{productName}</span>
            </div>
        </div>
    );
};

const ProductTitleHeader = ({ productName, rating, reviewCount }) => (
    <div className="px-4 md:px-0 pt-2 md:pt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{productName}</h1>
        {reviewCount > 0 && (
            <div className="flex items-center space-x-1 text-sm text-gray-600 flex-shrink-0">
                <StarRating rating={rating} />
                <span>({reviewCount} đánh giá)</span>
            </div>
        )}
    </div>
);

const ProductDescription = ({ description }) => {
    if (!description) {
        return null;
    }
    return (
        <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Mô tả chi tiết sản phẩm</h2>
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: description }} />
        </div>
    );
};


// ===================================================================
// COMPONENT CHÍNH
// ===================================================================
export default function ProductDetail() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedOption, setSelectedOption] = useState("");
    const [mainImage, setMainImage] = useState("");
    const [imagesForSelectedVariant, setImagesForSelectedVariant] = useState([]);
    const [productOptionsData, setProductOptionsData] = useState([]);
    const [productDetailBanners, setProductDetailBanners] = useState([]);
    const [skuId, setSkuId] = useState(null);

    // `useEffect` chính: chỉ để tải dữ liệu sản phẩm lần đầu
    useEffect(() => {
        const fetchProductData = async () => {
            if (!slug) return;
            try {
                const response = await productService.getBySlug(slug);
                const fetchedProduct = response.data.product;

                if (!fetchedProduct) {
                    setProduct(null);
                    return;
                }
                setProduct(fetchedProduct);

                const options = (fetchedProduct.skus || [])
                    .filter((sku) => sku.skuCode && (sku.price || sku.originalPrice))
                    .map((sku) => {
                        const vals = (sku.variantValues || []).map((vv) => vv.variantValue?.value).filter(Boolean);
                        const label = vals.length > 0 ? vals.join(" - ") : sku.skuCode;
                        const colorVV = (sku.variantValues || []).find((vv) => vv.variantValue?.variant?.name.toLowerCase().includes("màu"));
                        
                        const numericSalePrice = parseFloat(sku.price ?? 0);
                        const numericOriginalPrice = parseFloat(sku.originalPrice ?? 0);
                        const finalPrice = numericSalePrice > 0 ? numericSalePrice : numericOriginalPrice;
                        const strikethroughPrice = (numericOriginalPrice > finalPrice) ? numericOriginalPrice : null;

                        return {
                            skuId: sku.id,
                            label: label,
                            price: finalPrice > 0 ? finalPrice.toLocaleString("vi-VN") + "₫" : "Liên hệ",
                            originalPrice: strikethroughPrice ? strikethroughPrice.toLocaleString("vi-VN") + "₫" : null,
                            numericPrice: finalPrice,
                            numericOriginalPrice: numericOriginalPrice,
                            variantImage: sku.ProductMedia?.[0]?.mediaUrl || null,
                            colorCode: colorVV ? colorVV.variantValue.colorCode : null,
                            imageUrl: colorVV ? colorVV.variantValue.imageUrl : null,
                              inStock: sku.stock > 0,
                        };
                    });
                
                setProductOptionsData(options);

                if (options.length > 0) {
                    setSelectedOption(options[0].label);
                }

                if (fetchedProduct.id) {
                    bannerService.getByProductId(fetchedProduct.id)
                        .then(bannerRes => setProductDetailBanners(bannerRes?.data?.data || []))
                        .catch(err => console.error("Lỗi lấy banner:", err));
                }

            } catch (error) {
                console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
                toast.error("Không thể tải thông tin sản phẩm.");
                setProduct(null);
            }
        };

        fetchProductData();
    }, [slug]);

    // `useEffect` thứ hai: Cập nhật hình ảnh khi phiên bản thay đổi
    useEffect(() => {
        if (!product || !selectedOption) return;

        const selectedSku = product.skus.find(sku => {
            const vals = (sku.variantValues || []).map(vv => vv.variantValue?.value).filter(Boolean);
            const label = vals.length > 0 ? vals.join(" - ") : sku.skuCode;
            return label === selectedOption;
        });
        
        if (selectedSku) {
            setSkuId(selectedSku.id);
            if (selectedSku.ProductMedia && selectedSku.ProductMedia.length > 0) {
                const skuImages = selectedSku.ProductMedia.map(m => ({
                    imageThumb: m.mediaUrl,
                    imageFull: m.mediaUrl,
                    label: selectedOption
                }));
                setImagesForSelectedVariant(skuImages);
                setMainImage(skuImages[0].imageFull);
            } else {
                const fallbackImage = product.thumbnail ? [{ imageThumb: product.thumbnail, imageFull: product.thumbnail, label: 'Ảnh đại diện' }] : [];
                setImagesForSelectedVariant(fallbackImage);
                setMainImage(product.thumbnail || "");
            }
        }
    }, [product, selectedOption]);

    // `useEffect` thứ ba: Ghi nhận lượt xem sản phẩm
    useEffect(() => {
        if (product && product.id) {
            productViewService.trackView(product.id).catch(err => console.error("Lỗi ghi nhận lượt xem:", err));
            
            const VIEWED_PRODUCTS_KEY = 'viewed_products';
            try {
                let viewedIds = JSON.parse(localStorage.getItem(VIEWED_PRODUCTS_KEY)) || [];
                viewedIds = viewedIds.filter(id => id !== product.id);
                viewedIds.unshift(product.id);
                const MAX_VIEWED_PRODUCTS = 20;
                if (viewedIds.length > MAX_VIEWED_PRODUCTS) {
                    viewedIds = viewedIds.slice(0, MAX_VIEWED_PRODUCTS);
                }
                localStorage.setItem(VIEWED_PRODUCTS_KEY, JSON.stringify(viewedIds));
            } catch (error) {
                console.error("Lỗi localStorage:", error);
            }
        }
    }, [product]);

    // Hàm xử lý thêm vào giỏ hàng
    const handleAddToCart = (selectedLabel) => {
        const matchedOption = productOptionsData.find((opt) => opt.label === selectedLabel);
        if (!matchedOption) {
            toast.error("Không tìm thấy biến thể tương ứng");
            return;
        }

        cartService
            .addToCart({ skuId: matchedOption.skuId, quantity: 1 })
            .then(() => {
                if (toast.isActive("add-to-cart-success-toast")) {
                    toast.dismiss("add-to-cart-success-toast");
                }
                toast(
                    ({ closeToast }) => (
                        <AddToCartSuccessToast
                            closeToast={closeToast}
                            productName={product.name}
                            productImage={matchedOption.variantImage || mainImage || product?.thumbnail}
                            productPrice={matchedOption.price}
                        />
                    ),
                     {
        toastId: "add-to-cart-success-toast",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        closeButton: false, 
          // inline style cho wrapper toast
    style: {
      background: 'transparent',
      boxShadow: 'none',
      padding: 0,
    },
    // inline style cho body toast
    bodyStyle: {
      padding: 0,
    },
    }
                );
            })
            .catch((err) => {
                const message = err.response?.data?.message || "Thêm vào giỏ hàng thất bại!";
                toast.warn(message);
                console.error("Lỗi addToCart:", err);
            });
    };

    // Màn hình chờ trong khi tải sản phẩm
    if (!product) {
        return <div className="flex items-center justify-center h-screen">Đang tải sản phẩm...</div>;
    }
    
    // Lấy các giá trị sau khi đã chắc chắn có product
    const productName = product.name;
    const productRating = product.averageRating || 0;
    const productReviewCount = product.reviews?.length || 0;

    return (
        <div className="bg-gray-50">
            <Breadcrumb productName={productName} productCategory={product.category}/>
            <div className="max-w-[1200px] mx-auto py-3 md:pt-1 md:pb-6 text-sm text-gray-800">
                <div className="px-4 md:px-0 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 items-start mb-6">
                    <ProductImageSection
                        mainImage={mainImage}
                        setMainImage={setMainImage}
                        allImages={imagesForSelectedVariant}
                        productName={productName}
                    />
                    <ProductOptions
                        productName={productName}
                        rating={productRating}
                        reviewCount={productReviewCount}
                        productOptionsData={productOptionsData}
                        selectedOption={selectedOption}
                        setSelectedOption={setSelectedOption}
                        onAddToCart={handleAddToCart}
                        banners={productDetailBanners}
                    />
                </div>
                
                <div className="px-4 md:px-0 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 items-start mb-6">
                    <div className="space-y-6">
                        {product.productInfo && <ProductInfoBox productInfo={product.productInfo} />}
                        <ProductDescription description={product.description} />
                    </div>
                    <div className="sticky top-16 h-fit">
                        {product.specs && <TechnicalSpec specs={product.specs} />}
                    </div>
                </div>

                <div className="px-4 md:px-0 mt-4 md:mt-6">
                    <RelatedProductsSlider categoryId={product.categoryId} currentProductId={product.id} />
                </div>

                <div className="px-4 md:px-0 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 items-start my-6">
                    <div>
                        <ProductReviewSection skuId={skuId} productName={productName} />
                        <ProductQA/>
                    </div>
                    <div />
                </div>
            </div>
        </div>
    );
}