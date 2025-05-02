import { AWSError, S3 } from 'aws-sdk';
import fs from 'fs';

export class S3Service {
  private getS3Client() {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error('AWS credentials are not configured');
    }
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'eu-west-3',
    });
  }

  async uploadFile(filePath: string, contentType: string): Promise<string> {
    const fileStream = fs.createReadStream(filePath);
    const folder = contentType.startsWith('audio/') ? 'audio' : 'images';
    const key = `${folder}/${Date.now()}-${filePath.split('/').pop()}`;
    const s3 = this.getS3Client();

    try {
      console.log('Début upload S3:', {
        filePath,
        contentType,
        bucket: process.env.S3_BUCKET_NAME,
      });

      const result = await s3
        .upload({
          Bucket: process.env.S3_BUCKET_NAME || '',
          Key: key,
          Body: fileStream,
          ContentType: contentType,
        })
        .promise();

      console.log('Upload S3 réussi:', result.Location);
      await fs.promises.unlink(filePath);
      return result.Location;
    } catch (error) {
      console.error('Erreur upload S3:', error);
      throw error;
    }
  }

  async deleteFiles(fileUrls: string[]): Promise<{ success: string[]; errors: string[] }> {
    const s3 = this.getS3Client();
    const results = {
      success: [] as string[],
      errors: [] as string[],
    };

    await Promise.all(
      fileUrls.map(async fileUrl => {
        try {
          const urlParts = fileUrl.split('/');
          const key = decodeURIComponent(urlParts.slice(3).join('/'));

          console.log('Tentative de suppression:', {
            url: fileUrl,
            key: key,
            bucket: process.env.S3_BUCKET_NAME,
          });

          const deleteParams = {
            Bucket: process.env.S3_BUCKET_NAME || '',
            Key: key,
          };

          console.log('Paramètres de suppression:', deleteParams);

          await s3.deleteObject(deleteParams).promise();
          console.log('Fichier supprimé avec succès:', key);

          results.success.push(fileUrl);
        } catch (error) {
          console.error('Erreur détaillée:', {
            url: fileUrl,
            error: error instanceof Error ? error.message : 'Erreur inconnue',
            code: (error as AWSError).code || 'Erreur inconnue',
          });
          results.errors.push(fileUrl);
        }
      }),
    );

    return results;
  }
}

export const s3Service = new S3Service();
