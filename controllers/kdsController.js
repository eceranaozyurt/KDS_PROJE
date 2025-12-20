const KdsModel = require('../models/kdsModel');

exports.getDashboard = async (req, res) => {
    try {
        const body = req.body || {};

        
        let dagitim = body.dagitim_maliyeti ? parseFloat(body.dagitim_maliyeti) : 0.05;
        let hammadde = body.hammadde_maliyeti ? parseFloat(body.hammadde_maliyeti) : 3.00;
        let pazarId = body.secilen_pazar || "";
        let buyume = body.buyume_orani ? parseInt(body.buyume_orani) : 0;
        
        let mesaj = (req.method === 'POST') ? `⚠️ SENARYO AKTİF: Büyüme %${buyume}` : null;

        
        const analizSonuc = await KdsModel.getDetayliAnaliz(dagitim, hammadde, pazarId, buyume);
        const hamPazarlar = await KdsModel.getTumPazarlar();
        const adaylar = await KdsModel.getAdaylar();
        const tedarikciler = await KdsModel.getTedarikciler();
        const mevcutTesisler = await KdsModel.getMevcutTesisler();
        const ideal = await KdsModel.getIdealKonum(pazarId, buyume);
        const doluluk = await KdsModel.getUretimKapasitesi();

        
        
        const guncelPazarlar = hamPazarlar.map(p => {
            let yeniTalep = parseFloat(p.yillik_talep_adet);
            if (pazarId === "" || p.id == pazarId) {
                yeniTalep = yeniTalep * (1 + (buyume / 100));
            }
            return { ...p, yillik_talep_adet: Math.round(yeniTalep) };
        });

        
        res.render('dashboard', {
            analiz: analizSonuc,
            pazarlar: guncelPazarlar, 
            adaylar: adaylar,
            tedarikciler: tedarikciler,
            mevcutTesisler: mevcutTesisler,
            ideal: ideal,             
            doluluk: doluluk,
            seciliDagitim: dagitim,
            seciliHammadde: hammadde, 
            seciliPazar: pazarId,
            seciliBuyume: buyume,
            mesaj: mesaj
        });

    } catch (err) {
        console.error(err);
        res.send("Hata: " + err.message);
    }
};