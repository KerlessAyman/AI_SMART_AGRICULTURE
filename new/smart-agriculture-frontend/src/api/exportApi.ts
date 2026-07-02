import axiosInstance from './axiosInstance';

export interface ExportPredictPayload {
  crop_type: string;
  quality_grade: string;
  weight: number;
  region: string;
  // Real quality features — these are what actually drive the model's
  // decision. They are optional (backend will fall back to grade-based
  // estimates if omitted), but the UI should always send them now.
  moisture?: number;
  defect_rate?: number;
  pesticide_level?: number;
  sugar_content?: number;
  size_uniformity?: number;
  color_score?: number;
  shelf_life_days?: number;
  temperature_storage?: number;
  ph_level?: number;
  packaging_type?: string;
  certification?: string;
  season?: string;
}

export const predictExportApi = async (data: ExportPredictPayload) => {
  const response = await axiosInstance.post('/export/predict', {
    crop_type: data.crop_type,
    grade: data.quality_grade,
    weight_kg: data.weight,
    region: data.region,
    moisture: data.moisture,
    defect_rate: data.defect_rate,
    pesticide_level: data.pesticide_level,
    sugar_content: data.sugar_content,
    size_uniformity: data.size_uniformity,
    color_score: data.color_score,
    shelf_life_days: data.shelf_life_days,
    temperature_storage: data.temperature_storage,
    ph_level: data.ph_level,
    packaging_type: data.packaging_type,
    certification: data.certification,
    season: data.season,
  });
  return response.data;
};
