const express = require('express');
const mysql = require('mysql2/promise');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(express.static('public'));

const dbConfig = { host: 'localhost', user: 'root', password: '', database: 'tesis_yer_secimi' };

app.all('/', async (req, res) => {
    let connection;
    try {
        const body = req.body || {};
        
        let dagitimMaliyeti = body.dagitim_maliyeti ? parseFloat(body.dagitim_maliyeti) : 0.05;
        let hammaddeMaliyeti = body.hammadde_maliyeti ? parseFloat(body.hammadde_maliyeti) : 3.00;
        let secilenPazarId = body.secilen_pazar || "";
        let buyumeOrani = body.buyume_orani ? parseInt(body.buyume_orani) : 0;
        
        let senaryoMesaji = null;
        if(req.method === 'POST') senaryoMesaji = `⚠️ SENARYO AKTİF: Pazar Büyüme %${buyumeOrani}`;

        connection = await mysql.createConnection(dbConfig);

        
        const [analizSonuc] = await connection.execute('CALL sp_detayli_analiz_master(?, ?, ?, ?)', [dagitimMaliyeti, hammaddeMaliyeti, secilenPazarId, buyumeOrani]);
        const detayliAnaliz = analizSonuc[0];

        // Eğer bir pazar seçildiyse, onun talebini artırarak çekiyoruz
        let pazarQuery = 'SELECT * FROM pazarlar';
        const [pazarlar] = await connection.execute(pazarQuery);
        
        
        const guncelPazarlar = pazarlar.map(p => {
            let yeniTalep = p.yillik_talep_adet;
            if (secilenPazarId === "" || p.id === secilenPazarId) {
                yeniTalep = Math.round(p.yillik_talep_adet * (1 + buyumeOrani / 100));
            }
            return { ...p, yillik_talep_adet: yeniTalep };
        });

        
        const [adaylar] = await connection.execute('SELECT * FROM aday_arsalar');
        const [tedarikciler] = await connection.execute('SELECT * FROM tedarikciler');
        const [mevcutTesisler] = await connection.execute('SELECT * FROM mevcut_tesisler');
        const [uretimGecmisi] = await connection.execute('SELECT * FROM uretim_gecmisi ORDER BY yil ASC');
        const [idealSonuc] = await connection.execute('CALL sp_ideal_konum_bul(?, ?)', [secilenPazarId, buyumeOrani]);
        
        let doluluk = 99;
        try { const [kap] = await connection.execute('SELECT SUM(uretilen_adet) as uretim FROM uretim_gecmisi WHERE yil = 2024'); if(kap[0].uretim) doluluk = 99; } catch(e) {}

        res.render('dashboard', {
            analiz: detayliAnaliz,
            uretimGecmisi: uretimGecmisi,
            pazarlar: guncelPazarlar, 
            adaylar: adaylar,
            tedarikciler: tedarikciler,
            mevcutTesisler: mevcutTesisler,
            ideal: idealSonuc[0][0],
            doluluk: doluluk,
            seciliDagitim: dagitimMaliyeti,
            seciliHammadde: hammaddeMaliyeti, 
            seciliPazar: secilenPazarId,
            seciliBuyume: buyumeOrani,
            mesaj: senaryoMesaji
        });

    } catch (err) { console.error(err); res.send(err.message); } finally { if (connection) await connection.end(); }
});

app.listen(3000, () => { console.log('🚀 http://localhost:3000'); });