const db = require('../config/db');

exports.loginPage = (req, res) => {
    res.render('login', { error: null });
};

exports.loginPost = async (req, res) => {
    const { username, password } = req.body;

    try {
        
        const [users] = await db.execute('SELECT * FROM kullanicilar WHERE kullanici_adi = ? AND sifre = ?', [username, password]);

        if (users.length > 0) {
            
            req.session.isLoggedIn = true;
            req.session.user = users[0].kullanici_adi;
            res.redirect('/');
        } else {
            
            res.render('login', { error: 'Kullanıcı adı veya şifre yanlış!' });
        }
    } catch (err) {
        console.error(err);
        res.render('login', { error: 'Sistem hatası!' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
};