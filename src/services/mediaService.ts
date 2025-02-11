import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export class AudioProcessor {
  static async convertToFormats(inputPath: string): Promise<string[]> {
    const outputPaths = [];
    const formats = ['mp3', 'wav'];

    for (const format of formats) {
      const outputPath = path.join(
        path.dirname(inputPath),
        `${format}-${Date.now()}-${path.basename(inputPath, path.extname(inputPath))}.${format}`,
      );

      // Ne pas convertir si le format d'entrée est le même
      if (path.extname(inputPath).toLowerCase() === `.${format}`) {
        outputPaths.push(inputPath);
        continue;
      }

      await new Promise((resolve, reject) => {
        ffmpeg(inputPath)
          .toFormat(format)
          .audioCodec(format === 'mp3' ? 'libmp3lame' : 'pcm_s16le')
          .on('end', () => resolve(outputPath))
          .on('error', reject)
          .save(outputPath);
      });

      outputPaths.push(outputPath);
    }

    return outputPaths;
  }
}

export class ImageProcessor {
  private static readonly SIZES = [
    { width: 150, height: 150, name: 'thumbnail' },
    { width: 800, height: 800, name: 'medium' },
    { width: 1920, height: 1920, name: 'large' },
  ];

  private static readonly FORMATS = ['webp', 'jpeg', 'avif'];

  static async processImage(inputPath: string): Promise<Map<string, string>> {
    const results = new Map<string, string>();
    const inputBuffer = await fs.readFile(inputPath);
    const outputDir = path.dirname(inputPath);
    const baseName = path.basename(inputPath, path.extname(inputPath));

    for (const size of this.SIZES) {
      for (const format of this.FORMATS) {
        const outputPath = path.join(outputDir, `${size.name}-${baseName}.${format}`);
        const pipeline = sharp(inputBuffer).resize(size.width, size.height, {
          fit: 'inside',
          withoutEnlargement: true,
        });

        switch (format) {
          case 'webp':
            await pipeline.webp({ quality: 80 }).toFile(outputPath);
            break;
          case 'jpeg':
            await pipeline.jpeg({ quality: 85 }).toFile(outputPath);
            break;
          case 'avif':
            await pipeline.avif({ quality: 65 }).toFile(outputPath);
            break;
        }

        results.set(`${size.name}-${format}`, outputPath);
      }
    }

    return results;
  }
}
