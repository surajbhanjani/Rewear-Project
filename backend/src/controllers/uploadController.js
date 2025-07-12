import cloudinary from '../config/cloudinary.js';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const result = await cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
      if (error) return res.status(500).json({ message: 'Cloudinary upload failed', error });
      res.json({ url: result.secure_url });
    });
    result.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload image', error: err.message });
  }
};
