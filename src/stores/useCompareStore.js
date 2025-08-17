import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useCompareStore = create(
    persist(
        (set, get) => ({
            compareItems: [null, null, null], 
            openCompareBar: false, 
            isCompareBarCollapsed: true, 

            setOpenCompareBar: (value) => set({ openCompareBar: value }), 

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
                        openCompareBar: true,
                        isCompareBarCollapsed: false,
                    };
                });
            },

            removeFromCompare: (id) => {
                set((state) => {
                    let newItems = state.compareItems.map(item =>
                        item && item.id === id ? null : item
                    );
                    const filteredItems = newItems.filter(Boolean);
                    while (filteredItems.length < 3) { 
                        filteredItems.push(null);
                    }

                    
                    const newIsCollapsed = filteredItems.length === 0 ? true : state.isCompareBarCollapsed;

                    return {
                        compareItems: filteredItems,
                        isCompareBarCollapsed: newIsCollapsed, 
                    };
                });
            },

            clearCompare: () => {
                set({
                    compareItems: [null, null, null],
                    isCompareBarCollapsed: true,
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
                        openCompareBar: true, 
                        isCompareBarCollapsed: false, 
                    };
                });
            },

            
            setIsCompareBarCollapsed: (collapsed) => {
                set({ isCompareBarCollapsed: collapsed });
            },
        }),
        {
            name: 'compare-storage',
            storage: createJSONStorage(() => localStorage), 
            partialize: (state) => ({ 
                compareItems: state.compareItems,
                isCompareBarCollapsed: state.isCompareBarCollapsed,
            }),
           
            deserialize: (stateStr) => {
                const parsed = JSON.parse(stateStr);
                
                if (!Array.isArray(parsed.state.compareItems) || parsed.state.compareItems.length === 0) {
                    parsed.state.compareItems = [null, null, null];
                } else {
                   
                    parsed.state.compareItems = parsed.state.compareItems.map(item => item === undefined ? null : item);
                    while(parsed.state.compareItems.length < 3) {
                        parsed.state.compareItems.push(null);
                    }
                   
                    parsed.state.compareItems = parsed.state.compareItems.slice(0, 3);
                }
               
                if (typeof parsed.state.isCompareBarCollapsed !== 'boolean') {
                    parsed.state.isCompareBarCollapsed = true; 
                }
                return parsed;
            },
        }
    )
);