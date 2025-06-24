import ProductCard from '../ProductCard';
import MUIPagination from '@/components/common/Pagination';

export default function ProductList({
    products = [],
    favorites = [],
    onToggleFavorite = () => { },
    loading = false,
    currentPage = 1,
    totalItems = 0,
    itemsPerPage = 20,
    onPageChange = () => { },
}) {
    return (
        <>
            {loading ? (
                <div className="text-center py-10 text-gray-500">Đang tải sản phẩm...</div>
            ) : products.length === 0 ? (
                <div className="text-center py-10 text-gray-500">Không tìm thấy sản phẩm nào.</div>
            ) : (
                <>
         
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {products.map((item) => (
                            <ProductCard
                                key={item.id}
                                {...item}
                                isFavorite={favorites.includes(item.id)}
                                onAddToFavorites={onToggleFavorite}
                            />
                        ))}
                    </div>

                    {totalItems > itemsPerPage && (
                        <div className="mt-8 flex justify-center">
                            <MUIPagination
                                currentPage={currentPage}
                                totalItems={totalItems}
                                itemsPerPage={itemsPerPage}
                                onPageChange={onPageChange}
                            />
                        </div>
                    )}
                </>
            )}
        </>
    );
}