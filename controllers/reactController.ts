import path from 'path';

const getIndex = (req, res) => {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
};

export default getIndex;
