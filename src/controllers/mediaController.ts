import { S3 } from 'aws-sdk';
import { Request, Response } from 'express';
import fs from 'fs';
import { AudioProcessor, ImageProcessor } from '../services/mediaService';
import { s3Service } from '../services/s3Service';

const getS3Client = () => {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('AWS credentials are not configured');
  }
  return new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
};

export const processMedia = async (req: Request, res: Response) => {
  const s3 = getS3Client();
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }

    const mimeType = req.file.mimetype;
    console.log('Type de fichier:', mimeType);
    console.log('Chemin du fichier:', req.file.path);

    if (mimeType.startsWith('audio/')) {
      try {
        const convertedPaths = await AudioProcessor.convertToFormats(req.file.path);
        console.log('Chemins convertis:', convertedPaths);

        // Upload des fichiers convertis vers S3
        const s3Urls = await Promise.all(
          convertedPaths.map(async path => {
            if (!process.env.S3_BUCKET_NAME) {
              throw new Error('S3_BUCKET_NAME is not defined');
            }

            const key = `audio/${Date.now()}-${path.split('/').pop()}`;
            const uploadResult = await s3
              .putObject({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: key,
                Body: fs.createReadStream(path),
                ContentType: path.endsWith('.mp3') ? 'audio/mpeg' : 'audio/ogg',
              })
              .promise();

            // Suppression du fichier local après l'upload
            await fs.promises.unlink(path);

            return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
          }),
        );

        return res.json({
          success: true,
          urls: {
            mp3: s3Urls[0],
            wav: s3Urls[1],
          },
        });
      } catch (audioError) {
        console.error('Erreur de conversion audio:', audioError);
        throw audioError;
      }
    } else if (mimeType.startsWith('image/')) {
      try {
        const processedImages = await ImageProcessor.processImage(req.file.path);

        // Upload des images vers S3
        const s3UrlsMap = new Map();
        for (const [variant, imagePath] of processedImages.entries()) {
          const s3Url = await s3Service.uploadFile(imagePath, 'image/jpeg');
          s3UrlsMap.set(variant, s3Url);
        }

        // Conversion de la Map en objet pour la réponse
        const urls = Object.fromEntries(s3UrlsMap);

        res.json({
          success: true,
          urls: urls,
        });
      } catch (error) {
        console.error('Erreur traitement image:', error);
        throw error;
      }
    } else {
      res.status(400).json({ message: 'Type de média non supporté' });
    }
  } catch (error) {
    console.error('Erreur complète:', error);
    res.status(500).json({
      message: 'Erreur lors du traitement du média',
      details: error instanceof Error ? error.message : 'Erreur inconnue',
    });
  }
};

export const deleteMedia = async (req: Request, res: Response) => {
  try {
    const { fileUrls } = req.body;

    if (!fileUrls || !Array.isArray(fileUrls) || fileUrls.length === 0) {
      return res.status(400).json({ error: "Liste d'URLs requise" });
    }

    const results = await s3Service.deleteFiles(fileUrls);

    res.json({
      success: true,
      deleted: results.success,
      failed: results.errors,
    });
  } catch (error) {
    console.error('Erreur suppression:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};
