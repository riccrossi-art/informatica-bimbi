# 🚀 Giochi educativi di Livia e Pietro

Piccola raccolta di giochi educativi in **HTML, CSS e JavaScript puro**: nessun framework, nessuna dipendenza, nessun server. Pubblicata con **GitHub Pages**.

## 🎮 Contenuti

| Pagina | Per chi | Cosa c'è dentro |
|---|---|---|
| `lab-programmazione.html` | Livia | Coding a blocchi con il robot Byte, codice binario con i pixel, test di sicurezza delle password |
| `lab-livia-english.html` | Livia | Coding a blocchi, English Words (12 parole) e Listen & Pick Colors |
| `mondo-di-pietro-v2.html` | Pietro | Spegni il Fuoco a livelli e a tempo, Il Treno di Pietro, Tastiera Pompieri & Treni con voce |
| `index.html` | Tutti | Home con i collegamenti ai giochi |

> I nomi dei file devono coincidere con i link nella home. GitHub Pages distingue maiuscole e minuscole.

## ✨ Funzionalità principali

- **Coding a blocchi**: 4 livelli, programma fino a 14 blocchi, robot con freccia di direzione e blocco in esecuzione evidenziato.
- **Spegni il Fuoco**: si parte da 3 casette e 30 secondi. Se le spegni tutte in tempo passi al livello successivo (4 casette, poi 5 e così via, fino a 12).
- **Inglese**: parole e colori con pronuncia tramite sintesi vocale del browser.
- **Tastiera di Pietro**: ogni lettera A-Z e ogni numero ha un'immagine a tema pompieri e treni, anche con tasti sullo schermo per tablet.
- **Pulsante 🔊/🔇** per silenziare la voce nel gioco di Pietro.

## 📱 Compatibilità: Safari su iPad 11 pollici

Le pagine sono pensate per i bambini e girano soprattutto su **iPad da 11" con Safari**, quindi ogni modifica deve rispettare queste regole:

- **Tocco, non mouse**: nessuna funzione solo con `hover` o con la tastiera fisica. Ogni azione deve essere possibile toccando.
- **Bersagli grandi**: pulsanti e aree toccabili di almeno 44 × 44 px.
- **Layout fluido**: provare in verticale (circa 834 px di larghezza) e in orizzontale (circa 1194 px), senza scroll orizzontale della pagina.
- **Voce**: su Safari iOS la sintesi vocale parte solo dopo un tocco dell'utente, quindi mai in automatico al caricamento.
- **Altezza schermo**: usare `100dvh` (con `100vh` come ripiego), perché la barra di Safari cambia l'altezza visibile.
- **Niente doppio tocco accidentale**: aggiungere `touch-action: manipulation` ai pulsanti, per evitare lo zoom al doppio tap e il ritardo nei giochi veloci.
- **Emoji**: usare solo emoji disponibili da iOS 15 in poi, per evitare quadratini vuoti sui dispositivi meno recenti.
- **Nessun `localStorage` indispensabile**: in navigazione privata Safari può bloccarlo.
- **Nessuna libreria esterna** né font scaricati: funziona anche offline una volta caricata la pagina.

## 🛠️ Sviluppo in locale

Non serve installare nulla. Apri `index.html` con il browser, oppure avvia un server locale:

```bash
python3 -m http.server 8000
```

poi vai su `http://localhost:8000`.

## 🌐 Deploy su GitHub Pages

1. Fai il push dei file sul ramo principale (`main`).
2. In **Settings → Pages** scegli *Deploy from a branch*, ramo `main`, cartella `/ (root)`.
3. Dopo 1-2 minuti la pagina è online su `https://<tuo-utente>.github.io/<nome-repository>/`.
4. Se vedi ancora la versione vecchia, forza il ricaricamento: Ctrl+Shift+R su computer. Su iPad, tieni premuto il pulsante di ricarica in Safari e scegli "Ricarica senza contenuti bloccati", oppure svuota la cache dalle impostazioni.

## ✅ Prima di ogni push

- [ ] I link tra le pagine funzionano (inclusi "🏠 Torna alla Home")
- [ ] Nomi dei file in minuscolo e senza spazi
- [ ] Provato in verticale e in orizzontale su iPad (o con la simulazione iPad di Safari)
- [ ] Voce e suoni partono solo dopo un tocco
- [ ] Nessun errore nella console del browser
