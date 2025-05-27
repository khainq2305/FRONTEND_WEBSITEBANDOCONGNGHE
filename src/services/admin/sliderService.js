import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, patch, del } from '../common/crud';

const bannerBase = API_ENDPOINT.admin.slider.banner.base;
const placementBase = API_ENDPOINT.admin.slider.placement.base;
const assignmentBase = API_ENDPOINT.admin.slider.assignment.base;

export const sliderService = {
  // ==== BANNER ====
  getBanners: () => get(`${bannerBase}${API_ENDPOINT.admin.slider.banner.list}`),
  createBanner: (data) => post(`${bannerBase}${API_ENDPOINT.admin.slider.banner.create}`, data),
  updateBanner: (id, data) => patch(`${bannerBase}${API_ENDPOINT.admin.slider.banner.update(id)}`, data),
  deleteBanner: (id) => del(`${bannerBase}${API_ENDPOINT.admin.slider.banner.delete(id)}`),

  // ==== PLACEMENT ====
  getPlacements: () => get(`${placementBase}${API_ENDPOINT.admin.slider.placement.list}`),
  createPlacement: (data) => post(`${placementBase}${API_ENDPOINT.admin.slider.placement.create}`, data),
  updatePlacement: (id, data) => patch(`${placementBase}${API_ENDPOINT.admin.slider.placement.update(id)}`, data),
  deletePlacement: (id) => del(`${placementBase}${API_ENDPOINT.admin.slider.placement.delete(id)}`),

  // ==== ASSIGNMENT ====
  assignBanner: (data) => post(`${assignmentBase}${API_ENDPOINT.admin.slider.assignment.assign}`, data),
  getBannersByPlacement: (placementId) =>
    get(`${assignmentBase}${API_ENDPOINT.admin.slider.assignment.getByPlacement(placementId)}`),
  deleteAssignment: (id) => del(`${assignmentBase}${API_ENDPOINT.admin.slider.assignment.delete(id)}`)
};
