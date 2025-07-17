import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useCompareStore = create(
    persist(
        (set, get) => ({
            compareItems: [null, null, null], // Khởi tạo luôn với 3 ô trống để dễ quản lý
            openCompareBar: false, // Cờ này sẽ được dùng để kích hoạt việc mở thanh
            isCompareBarCollapsed: true, // <-- MẶC ĐỊNH LUÔN THU GỌN VÀ ĐƯỢC LƯU TRỮ

            setOpenCompareBar: (value) => set({ openCompareBar: value }), // Giữ setter này

            addToCompare: (product) => {
                set((state) => {
                    const currentItems = state.compareItems.filter(Boolean);
                    const existingProduct = currentItems.find((item) => item && item.id === product.id);

                    if (existingProduct) {
                        console.log("Sản phẩm đã có trong danh sách so sánh. Không thêm lại.");
                        return state;
                    }

                    if (currentItems.length >= 3) {
                        console.warn("Bạn chỉ có thể so sánh tối đa 3 sản phẩm. Vui lòng xóa bớt sản phẩm để thêm mới.");
                        return state;
                    }

                    let newItems = [...state.compareItems];
                    const firstNullIndex = newItems.findIndex(item => item === null);

                    if (firstNullIndex !== -1) {
                        newItems[firstNullIndex] = product;
                    } else {
                        // Logic này có thể không cần thiết nếu compareItems luôn có 3 phần tử (null hoặc item)
                        // và bạn luôn tìm firstNullIndex.
                        if (newItems.length < 3) {
                            newItems.push(product);
                        }
                    }

                    const finalItems = newItems.filter(Boolean);
                    while (finalItems.length < 3) {
                        finalItems.push(null);
                    }

                    return {
                        compareItems: finalItems,
                        openCompareBar: true, // Vẫn set cờ này để ProductCard biết đã thêm thành công (nếu cần cho thông báo)
                        isCompareBarCollapsed: false, // <--- **TỰ ĐỘNG MỞ RỘNG** THANH KHI THÊM SẢN PHẨM
                    };
                });
            },

            removeFromCompare: (id) => {
                set((state) => {
                    let newItems = state.compareItems.map(item =>
                        item && item.id === id ? null : item
                    );
                    const filteredItems = newItems.filter(Boolean);
                    while (filteredItems.length < 3) { // Đảm bảo luôn có 3 phần tử
                        filteredItems.push(null);
                    }

                    // Nếu sau khi xóa mà không còn sản phẩm nào, buộc thanh phải thu gọn
                    const newIsCollapsed = filteredItems.length === 0 ? true : state.isCompareBarCollapsed;

                    return {
                        compareItems: filteredItems,
                        isCompareBarCollapsed: newIsCollapsed, // Cập nhật nếu không còn sản phẩm
                    };
                });
            },

            clearCompare: () => {
                set({
                    compareItems: [null, null, null], // Reset về 3 ô trống
                    isCompareBarCollapsed: true, // <-- Bắt buộc thu gọn khi xóa hết
                });
            },

            setCompareItems: (items) => {
                set((state) => {
                    const finalItems = items.filter(Boolean).slice(0, 3);
                    while (finalItems.length < 3) {
                        finalItems.push(null);
                    }
                    return {
                        compareItems: finalItems,
                        openCompareBar: true, // Vẫn set cờ
                        isCompareBarCollapsed: false, // <--- **TỰ ĐỘNG MỞ RỘNG** THANH KHI SET LẠI SẢN PHẨM
                    };
                });
            },

            // Setter để CompareBar có thể tự thay đổi trạng thái thu gọn/mở của nó
            setIsCompareBarCollapsed: (collapsed) => {
                set({ isCompareBarCollapsed: collapsed });
            },
        }),
        {
            name: 'compare-storage', // Tên key trong localStorage
            storage: createJSONStorage(() => localStorage), // Sử dụng localStorage
            partialize: (state) => ({ // Chỉ lưu những gì cần persisted
                compareItems: state.compareItems,
                isCompareBarCollapsed: state.isCompareBarCollapsed,
            }),
            // Custom deserializer để đảm bảo giá trị ban đầu là đúng (true)
            deserialize: (stateStr) => {
                const parsed = JSON.parse(stateStr);
                // Đảm bảo compareItems luôn là mảng 3 phần tử (null hoặc item)
                if (!Array.isArray(parsed.state.compareItems) || parsed.state.compareItems.length === 0) {
                    parsed.state.compareItems = [null, null, null];
                } else {
                    // Đảm bảo không có undefined và luôn đủ 3 phần tử
                    parsed.state.compareItems = parsed.state.compareItems.map(item => item === undefined ? null : item);
                    while(parsed.state.compareItems.length < 3) {
                        parsed.state.compareItems.push(null);
                    }
                    // Cắt bớt nếu có nhiều hơn 3 phần tử (chỉ giữ 3 cái đầu)
                    parsed.state.compareItems = parsed.state.compareItems.slice(0, 3);
                }
                // Đảm bảo isCompareBarCollapsed là boolean và mặc định là TRUE (thu gọn) nếu không tồn tại
                if (typeof parsed.state.isCompareBarCollapsed !== 'boolean') {
                    parsed.state.isCompareBarCollapsed = true; // Mặc định là THU GỌN
                }
                return parsed;
            },
        }
    )
);