import express from 'express';
import multer from 'multer';
import cors from 'cors';

const app = express();
const upload = multer();

// Enable CORS
app.use(cors());

app.post('/api/vehicle', upload.single('logbook'), (req, res) => {
  const { make, model, badge } = req.body;
  const logbookContent = req.file?.buffer.toString('utf-8');

  res.status(200).json({
    make,
    model,
    badge,
    logbookContent,
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});