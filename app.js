const express = require('express');
const session = require('express-session');
const webRoutes = require('./routes/web');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


app.use(session({
    secret: 'gizli_anahtar',
    resave: false,
    saveUninitialized: false
}));


app.use('/', webRoutes);

app.listen(3000, () => {
    console.log('🚀: http://localhost:3000');
});