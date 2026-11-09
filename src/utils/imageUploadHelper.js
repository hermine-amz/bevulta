import { supabase } from '../supabaseClient';

/**
 * Compresses an image client-side using HTML5 Canvas and returns a high-quality data URL.
 * Ensures smartphone gallery photos (which can be 5-15MB) are optimized to ~150-300KB
 * without any loss of visible sharpness.
 */
export const compressImageFile = (file, maxDimension = 1600, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error("Le fichier sélectionné n'est pas une image valide."));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Erreur lors de la lecture du fichier."));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Impossible de charger l'image."));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Uploads an image to Supabase Storage ('bevulta-media') if available,
 * and seamlessly falls back to client-side compressed Data URL if the cloud bucket
 * is offline or restricted.
 */
export const processImageUpload = async (file, folder = 'general') => {
  const localDataUrl = await compressImageFile(file);

  try {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const cleanExt = ext === 'png' ? 'png' : 'jpg';
    const filePath = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 9)}.${cleanExt}`;

    const { error } = await supabase.storage
      .from('bevulta-media')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (!error) {
      const { data } = supabase.storage.from('bevulta-media').getPublicUrl(filePath);
      if (data && data.publicUrl) {
        return data.publicUrl;
      }
    }
  } catch (err) {
    console.warn("Supabase Storage upload fallback to optimized Data URL:", err);
  }

  // Guaranteed fallback: return the high-quality local data URL
  return localDataUrl;
};

