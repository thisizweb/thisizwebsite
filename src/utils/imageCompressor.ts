/**
 * Check if browser supports WebP format
 */
const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const dataUrl = canvas.toDataURL('image/webp');
    resolve(dataUrl.startsWith('data:image/webp'));
  });
};

/**
 * Compress and convert image to WebP format (with JPEG fallback)
 * - Uses WebP for ~25-35% smaller file sizes
 * - Optimized dimensions and quality for web display
 * - Progressive quality reduction to meet target size
 * 
 * @param file - The image file to compress
 * @param maxSizeKB - Target maximum size in KB (default: 60KB for better DB performance)
 * @returns Base64-encoded image string
 */
export const compressImage = async (file: File, maxSizeKB: number = 60): Promise<string> => {
  // Check WebP support once
  const useWebP = await supportsWebP();
  const mimeType = useWebP ? 'image/webp' : 'image/jpeg';

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Reduced max dimension for better compression (640px is sufficient for web thumbnails)
        const maxDimension = 640;
        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Enable image smoothing for better quality downscaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Start with 60% quality (good balance for WebP)
        let quality = 0.6;
        const minQuality = 0.15;
        const qualityStep = 0.05;

        const tryCompress = (): void => {
          const base64 = canvas.toDataURL(mimeType, quality);
          // Calculate actual size (Base64 is ~33% larger than binary)
          const sizeKB = (base64.length * 3) / 4 / 1024;

          if (sizeKB > maxSizeKB && quality > minQuality) {
            quality -= qualityStep;
            tryCompress();
          } else {
            // Verify the output is valid
            if (base64 && base64.startsWith('data:image/')) {
              resolve(base64);
            } else {
              // Fallback to JPEG if something went wrong
              const fallback = canvas.toDataURL('image/jpeg', 0.5);
              resolve(fallback);
            }
          }
        };

        tryCompress();
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Compress and convert image to WebP Blob for storage upload
 */
export const compressImageToBlob = async (file: File, maxSizeKB: number = 60): Promise<Blob> => {
  const useWebP = await supportsWebP();
  const mimeType = useWebP ? 'image/webp' : 'image/jpeg';

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const maxDimension = 640;
        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.6;
        const minQuality = 0.15;
        const qualityStep = 0.05;

        const tryCompress = (): void => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to create blob'));
                return;
              }

              const sizeKB = blob.size / 1024;

              if (sizeKB > maxSizeKB && quality > minQuality) {
                quality -= qualityStep;
                tryCompress();
              } else {
                resolve(blob);
              }
            },
            mimeType,
            quality
          );
        };

        tryCompress();
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};