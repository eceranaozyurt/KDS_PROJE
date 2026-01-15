require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const webRoutes = require('./routes/web');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// CORS ayarları Vercel için
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'gizli_anahtar',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use('/', webRoutes);

// 404 middleware
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: { message: 'Endpoint bulunamadı' }
    });
});

// Merkezi hata yönetimi
app.use(errorHandler);

const port = process.env.PORT || 3000;

module.exports = app;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`✅ Sunucu ${port} portunda çalışıyor...`);
  });
}