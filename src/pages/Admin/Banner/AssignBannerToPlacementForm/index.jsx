import React, { useEffect, useState } from 'react';
import { sliderService } from '../../../services/admin/sliderService';

const AssignBannerToPlacementForm = () => {
  const [banners, setBanners] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [selected, setSelected] = useState({ bannerId: '', placementId: '' });

  useEffect(() => {
    sliderService.getBanners().then(res => setBanners(res.data || []));
    sliderService.getPlacements().then(res => setPlacements(res.data || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sliderService.assignBanner(selected);
    alert('Gán thành công');
  };

  return (
    <form onSubmit={handleSubmit}>
      <select onChange={e => setSelected({ ...selected, bannerId: e.target.value })}>
        <option>Chọn Banner</option>
        {banners.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
      </select>
      <select onChange={e => setSelected({ ...selected, placementId: e.target.value })}>
        <option>Chọn Khối</option>
        {placements.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <button type="submit">Gán</button>
    </form>
  );
};

export default AssignBannerToPlacementForm;
