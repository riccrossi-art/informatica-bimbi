# 🚀 Giochi educativi di Livia e Pietro

Piccola raccolta di giochi educativi in **HTML, CSS e JavaScript puro**: nessun framework, nessuna dipendenza, nessun server. Pubblicata con **GitHub Pages**.

## 👉 Provalo online

**[Accademia Informatica Bimbi - Pietro & Livia](https://riccrossi-art.github.io/informatica-bimbi/index.html)**

- 🚒 [Il Mondo di Pietro](https://riccrossi-art.github.io/informatica-bimbi/pietro.html) (3 anni e mezzo)
- 🚀 [Il Lab di Livia](https://riccrossi-art.github.io/informatica-bimbi/livia.html) (7 anni)

Funziona direttamente nel browser, senza installare nulla, anche su iPad.

## 🎮 Contenuti

| Pagina | Per chi | Sezioni |
|---|---|---|
| [`index.html`](https://riccrossi-art.github.io/informatica-bimbi/index.html) | Tutti | Home con i collegamenti ai giochi e la nota per i genitori |
| [`pietro.html`](https://riccrossi-art.github.io/informatica-bimbi/pietro.html) | Pietro | Spegni il Fuoco, Il Treno di Pietro (missioni), Conta e Completa, Inglese con Pietro, Tastiera Pompieri & Treni |
| [`livia.html`](https://riccrossi-art.github.io/informatica-bimbi/livia.html) | Livia | Coding a blocchi (12 livelli), Trova l'errore, Logica e Matematica, English Words |

## 🗂️ Struttura del progetto

Ogni gioco ha il suo file JavaScript e il suo file CSS. Le pagine HTML contengono solo la struttura e collegano i file che servono.

```
index.html              home (collegamenti ai giochi)
pietro.html             pagina di Pietro
livia.html              pagina di Livia
css/
  common.css            stili comuni (reset, pulsanti, iPad)
  quiz.css              stili dei quiz a livelli
  pietro/               base, fuoco, treno, tastiera
  livia/                base, coding, inglese (binario.css non collegato)
js/
  common.js             voce, schede, funzioni condivise
  quiz.js               motore dei quiz a livelli (stelle, livelli, riavvio)
  pietro/               fuoco.js, treno.js, matematica.js, inglese.js, tastiera.js
  livia/                robot.js (motore e livelli), coding.js, debug.js,
                        matematica.js, inglese-parole.js
                        (binario.js e password.js: nascosti, non collegati)
```

**Giochi nascosti**: Pixel & Codice Binario e Sicurezza Password sono ancora nel repository ma non compaiono in `livia.html`. Per riattivarli, ripristina nella pagina il pulsante della scheda, la sezione HTML (`id="binary"` e `id="cyber"`) e i collegamenti a `binario.css`, `binario.js` e `password.js`.

**Aggiungere o cambiare livelli**: i livelli di Byte sono nell'elenco `LEVELS` di `js/livia/robot.js`. Ogni livello ha una soluzione di riferimento (`sol`) che decide le 3 stelle e il massimo di blocchi (`max`). Gli errori da trovare sono in `PUZZLES` di `js/livia/debug.js`.

**Come aggiungere un gioco**: crea `js/<pagina>/nuovo.js` (e, se serve, `css/<pagina>/nuovo.css`), aggiungi la sezione e il pulsante della scheda nella pagina HTML e collega i due file. I giochi si accorgono del cambio scheda con l'evento `tabchange` (vedi `js/common.js`).

> I nomi dei file devono coincidere con i link nella home. GitHub Pages distingue maiuscole e minuscole.

## ✨ Funzionalità principali

- **Coding a blocchi**: 12 livelli in 3 mondi (🌳 Bosco, 🏙️ Città, 🚀 Spazio). Dal mondo Città c'è il blocco **🔁 Ripeti**, e il limite di blocchi obbliga a usarlo. Da 1 a 3 stelle in base ai blocchi usati (3 stelle = il minimo), i livelli si sbloccano uno dopo l'altro e i progressi restano salvati sul dispositivo.
- **Trova l'errore**: 7 programmi di Byte sbagliati da correggere (cambiando o togliendo un blocco, oppure il numero di ripetizioni).
- **Spegni il Fuoco**: si parte da 3 casette e 30 secondi. Se le spegni tutte in tempo passi al livello successivo (4 casette, poi 5 e così via, fino a 12).
- **English Words a livelli**: 5 livelli che salgono dopo 5 risposte giuste al primo tentativo. Si parte da 3 scelte con disegno (Beginner), poi 4 scelte (Explorer), senza disegno (Reader), ascoltando la parola (Listener) e infine scrivendola con le lettere (Spelling Star). Il livello raggiunto resta salvato sul dispositivo. Il vocabolario ha oltre 120 parole in 3 fasce di difficoltà: le parole escono a caso, mai quelle appena viste, e il gioco ricorda quelle già incontrate (anche nelle partite successive) per variare sempre. Tra un livello e l'altro compare una schermata che spiega la novità, e un pulsante **🔄 Dal livello 1** (con doppio tocco di conferma) permette di ricominciare.
- **Logica e Matematica (Livia)**: 5 livelli che salgono con le risposte giuste: addizioni e sottrazioni fino a 20, serie di numeri, tabelline, numeri e segni mancanti, e infine problemi, intrusi e confronti.
- **Conta e Completa (Pietro)**: contare i mezzi dei pompieri e dei treni, completare serie di disegni e capire dove ce n'è di più o di meno. Nessuna lettura richiesta, con la voce.
- **Inglese con Pietro**: si ascolta una parola in inglese e si tocca l'immagine giusta: colori, animali, pompieri e treni, numeri.
- **Il Treno di Pietro**: il capostazione chiede un treno con vagoni in un certo ordine (8 missioni); in alternativa si costruisce liberamente. Alla partenza il treno viaggia per circa 5 secondi attraverso un paesaggio a strati (nuvole, montagne, vulcano, campagna con mucche e pecore, ponte, fabbrica, caserma dei pompieri), sbuffa e arriva in stazione con una pioggia di stelle.
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
- [ ] Le cartelle `css/` e `js/` sono incluse nel commit
- [ ] Nomi dei file in minuscolo e senza spazi
- [ ] Provato in verticale e in orizzontale su iPad (o con la simulazione iPad di Safari)
- [ ] Voce e suoni partono solo dopo un tocco
- [ ] Nessun errore nella console del browser
