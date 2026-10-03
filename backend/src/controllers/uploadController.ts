import type { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';

export async function uploadImage(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'File gambar wajib diupload',
      });
    }

    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      resource_type: 'image',
    });

    res.status(200).json({
      message: 'Upload gambar berhasil',
      url: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal upload gambar',
    });
  }
}
