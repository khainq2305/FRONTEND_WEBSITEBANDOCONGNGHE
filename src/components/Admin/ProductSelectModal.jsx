import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Grid,
  Box,
  Stack,
  Typography,
  Checkbox,
  Chip,
  Divider,
  TextField,
  ListSubheader,
  MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { comboService } from '@/services/admin/comboService';
import { formatCurrencyVND } from '@/utils/formatCurrency';

/** Map 1 SKU (từ API) -> item cho panel 'Đã chọn' */
const mapSkuToSelected = (sku) => ({
  skuId: sku.id,
  productId: sku?.product?.id,
  productName: sku.name || sku?.product?.name || '',
  thumbnail: sku.thumbnail || sku.image || sku?.product?.thumbnail || '/no-image.png',
  price: Number(sku.price || 0),
  stock: sku.stock || 0,
  quantity: 1,
  variants:
    sku?.variantValues?.map((svv) => ({
      name: svv?.variantValue?.variant?.name || '',
      value: svv?.variantValue?.value || ''
    })) || []
});
const pickCategory = (sku) => ({
  id: sku?.product?.category?.id ?? null,
  name: sku?.product?.category?.name ?? 'Chưa phân loại'
});

const getCategoryName = (sku) => sku?.product?.category?.name || sku?.product?.mainCategory?.name || sku?.categoryName || 'Khác';

export default function ProductSelectModal({ open, onClose, onConfirm, selectedSkus = [] }) {
  const [loading, setLoading] = useState(false);
  const [skus, setSkus] = useState([]);
  const [checkedSkuIds, setCheckedSkuIds] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL'); // filter theo category

  // Đồng bộ preselect khi mở modal
  useEffect(() => {
    if (open) setCheckedSkuIds([...(selectedSkus || [])]);
  }, [open, selectedSkus]);

  // Fetch SKUs
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await comboService.getAllSkus();
        const list = res?.data?.data ?? res?.data?.rows ?? res?.data ?? res ?? [];
        if (!cancelled) setSkus(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error('[ProductSelectModal] fetch error', e);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  // Chuẩn hoá option
  const skuOptions = useMemo(
    () =>
      (skus || []).map((sku) => ({
        id: sku.id,
        productId: sku?.product?.id ?? sku.productId ?? `name:${sku?.product?.name || ''}`,
        name: sku.name || sku?.product?.name || '',
        skuCode: sku.skuCode || '',
        price: Number(sku.price || 0),
        productName: sku?.product?.name || 'Sản phẩm',
        thumbnail: sku.thumbnail || sku.image || sku?.product?.thumbnail || '/no-image.png',
        variantValues: sku?.variantValues || [],
        category: getCategoryName(sku),
        categoryId: sku?.product?.category?.id ?? null,
        raw: sku
      })),
    [skus]
  );

  // Danh sách category để filter
  const categoryOptions = useMemo(() => {
    const map = new Map();
    for (const o of skuOptions) {
      map.set(o.category, (map.get(o.category) || 0) + 1);
    }
    const arr = Array.from(map.entries()).map(([name, count]) => ({
      name,
      count
    }));
    arr.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    return [{ name: 'ALL', count: skuOptions.length }, ...arr];
  }, [skuOptions]);

  // Filter theo search + category
  const filtered = useMemo(() => {
    let list = skuOptions;
    if (category && category !== 'ALL') {
      list = list.filter((o) => o.category === category);
    }
    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        (o.skuCode || '').toLowerCase().includes(q) ||
        (o.productName || '').toLowerCase().includes(q) ||
        (o.category || '').toLowerCase().includes(q)
    );
  }, [skuOptions, search, category]);

  // Group theo Category -> Product -> SKU
  const groupedByCategory = useMemo(() => {
    const catMap = new Map(); // category => Map(productName => {name, items[]})
    for (const o of filtered) {
      const c = o.category || 'Khác';
      const byCat = catMap.get(c) || new Map();
      const prod = byCat.get(o.productName) || { name: o.productName, items: [] };
      prod.items.push(o);
      byCat.set(o.productName, prod);
      catMap.set(c, byCat);
    }
    return Array.from(catMap.entries()).map(([catName, prodMap]) => ({
      category: catName,
      products: Array.from(prodMap.values())
    }));
  }, [filtered]);

  // Đã chọn + tạm tính
  const selectedOptions = useMemo(() => skuOptions.filter((o) => checkedSkuIds.includes(o.id)), [skuOptions, checkedSkuIds]);
  const totalSelectedPrice = useMemo(() => selectedOptions.reduce((s, o) => s + (Number(o.price || 0) || 0), 0), [selectedOptions]);

  // Chọn/bỏ 1 SKU
  const toggleSku = (opt) => {
    setCheckedSkuIds((prev) => {
      const set = new Set(prev);
      if (set.has(opt.id)) set.delete(opt.id);
      else set.add(opt.id);
      return Array.from(set);
    });
  };

  // Chọn/bỏ cả 1 nhóm product
  const toggleGroup = (group) => {
    const ids = group.items.map((it) => it.id);
    const all = ids.every((id) => checkedSkuIds.includes(id));
    setCheckedSkuIds((prev) => {
      const set = new Set(prev);
      if (all) ids.forEach((id) => set.delete(id));
      else ids.forEach((id) => set.add(id));
      return Array.from(set);
    });
  };

  // Chọn/bỏ cả 1 Category
  const toggleCategory = (cat) => {
    const allIdsInCat = cat.products.flatMap((p) => p.items.map((it) => it.id));
    const allChecked = allIdsInCat.every((id) => checkedSkuIds.includes(id));
    setCheckedSkuIds((prev) => {
      const set = new Set(prev);
      if (allChecked) allIdsInCat.forEach((id) => set.delete(id));
      else allIdsInCat.forEach((id) => set.add(id));
      return Array.from(set);
    });
  };

  const handleConfirm = () => {
    const result = selectedOptions
      .map((o) => mapSkuToSelected(o.raw))
      .filter((it, i, self) => self.findIndex((x) => x.skuId === it.skuId) === i);
    onConfirm?.(result);
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight={700}>
            Chọn sản phẩm (Theo Category → Product → SKU)
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 1 }}>
        <Grid container spacing={2}>
          {/* Cột trái: filter + list */}
          <Grid item xs={12} md={8}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ mb: 1 }}>
              <TextField
                placeholder="Tìm theo tên sản phẩm hoặc mã SKU"
                size="small"
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Stack direction="row" alignItems="center" sx={{ color: 'text.secondary', mr: 1 }}>
                      <SearchIcon fontSize="small" />
                    </Stack>
                  )
                }}
              />
              <TextField
                select
                size="small"
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                sx={{ minWidth: 220 }}
              >
                {categoryOptions.map((c) => (
                  <MenuItem key={c.name} value={c.name}>
                    {c.name === 'ALL' ? `Tất cả (${c.count})` : `${c.name} (${c.count})`}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                p: 1,
                maxHeight: 520,
                overflowY: 'auto'
              }}
            >
              {loading && (
                <Typography variant="body2" color="text.secondary" sx={{ px: 1, py: 0.5 }}>
                  Đang tải...
                </Typography>
              )}

              {!loading && groupedByCategory.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ px: 1, py: 0.5 }}>
                  Không có kết quả phù hợp.
                </Typography>
              )}

              {!loading &&
                groupedByCategory.map((cat, ci) => {
                  const catIds = cat.products.flatMap((p) => p.items.map((it) => it.id));
                  const catAll = catIds.every((id) => checkedSkuIds.includes(id));
                  const catSome = !catAll && catIds.some((id) => checkedSkuIds.includes(id));

                  return (
                    <Box key={`cat-${ci}`} sx={{ mb: 1 }}>
                      {/* HEADER CATEGORY */}
                      <ListSubheader
                        disableSticky={false}
                        sx={{
                          position: 'sticky',
                          top: 0,
                          bgcolor: 'background.paper',
                          zIndex: 2,
                          display: 'flex',
                          alignItems: 'center',
                          py: 0.75,
                          borderBottom: '1px solid',
                          borderColor: 'divider'
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleCategory(cat);
                        }}
                      >
                        <Checkbox
                          checked={catAll}
                          indeterminate={catSome}
                          sx={{ mr: 1 }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleCategory(cat);
                          }}
                        />
                        <Typography variant="subtitle1" fontWeight={700}>
                          {cat.category}
                        </Typography>
                      </ListSubheader>

                      {/* NHÓM PRODUCT TRONG CATEGORY */}
                      {cat.products.map((g, gi) => {
                        const ids = g.items.map((it) => it.id);
                        const all = ids.every((id) => checkedSkuIds.includes(id));
                        const some = !all && ids.some((id) => checkedSkuIds.includes(id));

                        return (
                          <Box key={`g-${ci}-${gi}`} sx={{ mb: 0.5 }}>
                            <ListSubheader
                              disableSticky={false}
                              sx={{
                                position: 'sticky',
                                top: 32, // dưới header category
                                bgcolor: 'background.paper',
                                zIndex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                py: 0.75,
                                borderBottom: '1px solid',
                                borderColor: 'divider'
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleGroup(g);
                              }}
                            >
                              <Checkbox
                                checked={all}
                                indeterminate={some}
                                sx={{ mr: 1 }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleGroup(g);
                                }}
                              />
                              <Typography variant="subtitle2">{g.name}</Typography>
                            </ListSubheader>

                            {g.items.map((opt) => {
                              const selected = checkedSkuIds.includes(opt.id);
                              return (
                                <Stack
                                  key={opt.id}
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                  sx={{
                                    py: 0.75,
                                    pl: 5, // thụt vào so với tên product
                                    pr: 1,
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: 'action.hover' }
                                  }}
                                  onClick={() => toggleSku(opt)}
                                >
                                  <Checkbox checked={selected} sx={{ mr: 0.5 }} />
                                  <Box
                                    component="img"
                                    src={opt.thumbnail}
                                    alt={opt.name}
                                    sx={{
                                      width: 28,
                                      height: 28,
                                      borderRadius: 1,
                                      objectFit: 'cover'
                                    }}
                                  />
                                  <Box sx={{ minWidth: 0, flex: 1 }}>
                                    <Typography variant="body2" noWrap title={opt.name}>
                                      {opt.name} {opt.skuCode ? `(${opt.skuCode})` : ''}
                                    </Typography>
                                    {!!opt.variantValues?.length && (
                                      <Box sx={{ mt: 0.25 }}>
                                        {opt.variantValues.slice(0, 2).map((svv, i) => (
                                          <Chip
                                            key={i}
                                            size="small"
                                            label={`${svv?.variantValue?.variant?.name || ''}: ${svv?.variantValue?.value || ''}`}
                                            sx={{
                                              mr: 0.5,
                                              mb: 0.5,
                                              fontSize: '11px'
                                            }}
                                          />
                                        ))}
                                        {opt.variantValues.length > 2 && (
                                          <Chip size="small" label={`+${opt.variantValues.length - 2}`} sx={{ fontSize: '11px' }} />
                                        )}
                                      </Box>
                                    )}
                                  </Box>
                                  <Typography variant="body2" fontWeight={700}>
                                    {formatCurrencyVND(opt.price)}
                                  </Typography>
                                </Stack>
                              );
                            })}
                          </Box>
                        );
                      })}
                    </Box>
                  );
                })}
            </Box>
          </Grid>

          {/* Cột phải: Đã chọn */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 8 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="subtitle1" fontWeight={700}>
                  Đã chọn ({checkedSkuIds.length})
                </Typography>
                {!!checkedSkuIds.length && (
                  <Button size="small" color="inherit" startIcon={<DeleteOutlineIcon />} onClick={() => setCheckedSkuIds([])}>
                    Bỏ chọn hết
                  </Button>
                )}
              </Stack>
              <Divider />

              <Box sx={{ maxHeight: 360, overflowY: 'auto', pr: 1, mt: 1 }}>
                {!selectedOptions.length ? (
                  <Typography variant="body2" color="text.secondary">
                    Chưa chọn sản phẩm nào.
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {selectedOptions.map((opt) => (
                      <Stack
                        key={opt.id}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ border: '1px solid #eee', p: 1, borderRadius: 1 }}
                      >
                        <Box
                          component="img"
                          src={opt.thumbnail}
                          alt={opt.name}
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 1,
                            objectFit: 'cover'
                          }}
                        />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" noWrap title={opt.name}>
                            {opt.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            SKU: {opt.skuCode || opt.id}
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={700} color="error.main">
                          {formatCurrencyVND(opt.price || 0)}
                        </Typography>
                        <IconButton size="small" onClick={() => setCheckedSkuIds((prev) => prev.filter((x) => x !== opt.id))}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Box>

              <Divider sx={{ my: 1.5 }} />
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Tạm tính
                </Typography>
                <Typography variant="subtitle1" fontWeight={800}>
                  {formatCurrencyVND(totalSelectedPrice)}
                </Typography>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Huỷ</Button>
        <Button onClick={handleConfirm} variant="contained" disabled={!checkedSkuIds.length}>
          Xác nhận ({checkedSkuIds.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
}
