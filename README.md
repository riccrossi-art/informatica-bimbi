# 🚀 Giochi educativi di Livia e Pietro

Piccola raccolta di giochi educativi in **HTML, CSS e JavaScript puro**: nessun framework, nessuna dipendenza, nessun server. Pubblicata con **GitHub Pages**.

## 👉 Provalo online

**[Accademia Informatica Bimbi - Pietro & Livia](https://riccrossi-art.github.io/informatica-bimbi/index.html)**

- 🚒 [Il Mondo di Pietro](https://riccrossi-art.github.io/informatica-bimbi/pietro.html) (3 anni e mezzo)
- 🚀 [Il Lab di Livia](https://riccrossi-art.github.io/informatica-bimbi/livia.html) (7 anni)

Funziona direttamente nel browser, senza installare nulla, anche su iPad.

## 🎮 Contenuti

Ogni pagina si apre con un **menù di aree**: si sceglie l'area (carte grandi) e poi uno dei giochi dell'area. Il pulsante **🏠 Menu** riporta alla scelta delle aree.

| Pagina | Area | Giochi |
|---|---|---|
| [`index.html`](https://riccrossi-art.github.io/informatica-bimbi/index.html) | Home | Collegamenti a Pietro e Livia, nota per i genitori |
| [`pietro.html`](https://riccrossi-art.github.io/informatica-bimbi/pietro.html) | 🚒 Pompieri e Treni | Spegni il Fuoco, Il Treno di Pietro |
| | 🧮 Numeri e Logica | Conta e Completa |
| | 🔤 Inglese | Inglese con Pietro |
| | ⌨️ Lettere | Tastiera Pompieri & Treni |
| [`livia.html`](https://riccrossi-art.github.io/informatica-bimbi/livia.html) | 💻 Coding | Lab Coding (12 livelli), Trova l'errore |
| | 🧮 Logica e Matematica | Calcoli e tabelline, Numeri, Orologio ed Euro, Figure e Misure, Logica |
| | 🔤 Inglese | Parole, Frasi |
| | 📚 Italiano | Ortografia, Grammatica, Parole e Lettura |

## 🗂️ Struttura del progetto

Ogni gioco ha il suo file JavaScript; le pagine HTML contengono solo la struttura e collegano i file che servono.

```
index.html              home (collegamenti ai giochi)
pietro.html             pagina di Pietro
livia.html              pagina di Livia
css/
  common.css            stili comuni (reset, pulsanti, iPad)
  menu.css              menù delle aree
  quiz.css              stili dei quiz a livelli
  pietro/               base, fuoco, treno, tastiera
  livia/                base, coding, inglese (binario.css non collegato)
js/
  common.js             voce, schede, menù delle aree, funzioni condivise
  quiz.js               motore dei quiz a livelli (stelle, livelli, riavvio)
  pietro/               fuoco, treno, matematica, inglese, tastiera
  livia/                robot, coding, debug, matematica, numeri, orologio,
                        geometria, logica, inglese-parole, inglese-frasi, italiano
                        (binario.js e password.js: nascosti, non collegati)
```

**Aggiungere un quiz**: crea `js/livia/nuovo.js` con `Quiz.mount({ el, key, tab, levels })` (vedi un file esistente), aggiungi la sezione e il pulsante (con `data-area`) nella pagina HTML e collega lo script. **Aggiungere un'area**: aggiungi una carta `.area-card` con `data-area` nel menù e usa lo stesso `data-area` sui pulsanti dei giochi.

> I nomi dei file devono coincidere con i link nella home. GitHub Pages distingue maiuscole e minuscole.

## ✨ Funzionalità principali

- **Coding a blocchi**: 12 livelli in 3 mondi (🌳 Bosco, 🏙️ Città, 🚀 Spazio). Dal mondo Città c'è il blocco **🔁 Ripeti**, e il limite di blocchi obbliga a usarlo. Da 1 a 3 stelle in base ai blocchi usati (3 stelle = il minimo), i livelli si sbloccano uno dopo l'altro e i progressi restano salvati sul dispositivo.
- **Trova l'errore**: 7 programmi di Byte sbagliati da correggere (cambiando o togliendo un blocco, oppure il numero di ripetizioni).
- **Spegni il Fuoco**: si parte da 3 casette e 30 secondi. Se le spegni tutte in tempo passi al livello successivo (4 casette, poi 5 e così via, fino a 12).
- **English Words a livelli**: 5 livelli che salgono dopo 5 risposte giuste al primo tentativo. Si parte da 3 scelte con disegno (Beginner), poi 4 scelte (Explorer), senza disegno (Reader), ascoltando la parola (Listener) e infine scrivendola con le lettere (Spelling Star). Il livello raggiunto resta salvato sul dispositivo. Il vocabolario ha oltre 120 parole in 3 fasce di difficoltà: le parole escono a caso, mai quelle appena viste, e il gioco ricorda quelle già incontrate (anche nelle partite successive) per variare sempre. Tra un livello e l'altro compare una schermata che spiega la novità, e un pulsante **🔄 Dal livello 1** (con doppio tocco di conferma) permette di ricominciare.
- **Logica e Matematica (Livia)**, pensata per la seconda elementare, in 5 giochi a 5 livelli ciascuno (stelle e livello salvati sul dispositivo):
  - *Calcoli e tabelline*: addizioni e sottrazioni, serie, tabelline, segni mancanti, problemi.
  - *Numeri*: valore delle cifre, prima e dopo, confronti fino a 999, pari/dispari, doppio e metà, composizione.
  - *Orologio ed Euro*: leggere l'ora su un orologio disegnato (ore, mezze, quarti, minuti), somma di monete e resto.
  - *Figure e Misure*: lati delle figure, riconoscere le figure, metri/centimetri, chili/grammi/litri, perimetro.
  - *Logica*: serie di figure, gruppi che crescono, indovinelli numerici, chi è il più veloce, ordini.
- **Inglese (Livia)**: *Parole* a 5 livelli con 128 parole, e *Frasi* (saluti, completa la frase, domande e risposte, traduzioni, ascolto di frasi intere).
- **Italiano (Livia)**, per la seconda elementare: *Ortografia* (gn/gl/sc, parole scritte bene, è/e, ho/hai/ha/hanno, punteggiatura), *Grammatica* (plurali, articoli, nomi/aggettivi/verbi, tempi dei verbi, accordo), *Parole e Lettura* (contrari, sinonimi, intruso, sillabe, comprensione del testo).
- **Conta e Completa (Pietro)**: contare i mezzi dei pompieri e dei treni, completare serie di disegni e capire dove ce n'è di più o di meno. Nessuna lettura richiesta, con la voce.
- **Inglese con Pietro**: si ascolta una parola in inglese e si tocca l'immagine giusta: colori, animali, pompieri e treni, numeri.
- **Il Treno di Pietro**: il capostazione chiede un treno con vagoni in un certo ordine (8 missioni); in alternativa si costruisce liberamente. Alla partenza il treno viaggia per circa 5 secondi tra alberi e case, sbuffa e arriva in stazione con una pioggia di stelle.
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
