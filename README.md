# QHELP
Progetto corso reti di calcolatori

### Scopo del progetto: 
Il progetto nasce in un contensto di pandemia per aiutare la gente bisognosa, chiusa in casa per quarantena domiciliare, al fine di mettersi in contatto con soggetti volontari ai quali richiedere beni di prima necessità. 

# Tecnologie utilizzate:
## Sviluppo server (back-end):
- Node.js
- Express.js
- Handlebars Template Engine
- Bcrypt
- Sequelize
- PostgreSQL
- OAuth2
- OpenSSL

## Sviluppo client: 
- Bootstrap 4.0
- JQuery
- JavaScript
- HTML5


## API:
- documentati con API Doc, /QHELP/QH/routes/docs/index.html


### Servizi REST: 
- google maps
- google calendar

### Servizi REST commerciali
- google (passport)
- facebook (passport)

### Servizio REST eseterno con OAuth: 
- google calendar

### Protocolli asincroni: 

- Websocket per messaggisatica istantanea online e offline

## Istruzioni installazione:

Una volta scaricata la cartella sarà necessario, da terminale in /QHELP, digitare "docker-compose up" per installare tutte le dipendenze e avviare il server su docker.

# Istruzioni per l'installazione e il test :
0. Scaricare il progetto e avviare Docker.
1. Aprire un terminale nella directory principale (dove si trova il file docker-compose.yml) ed eseguire il comando: docker-compose up -d oppure (per visualizzare a schermo i log del server) docker-compose up.
2. Dal browser visitare questa pagina: https://localhost:3000/
3. Registrarsi localmente o attraverso google/facebook per la prima volta come assistente o assistito
4. Effettuare un ordine (il database contiene già alcuni prodotti per il test delle funzionalità)
5. Aggiungere ordine al calendario e completarlo successivamente
6. Per fermare il server eseguire il comando: docker-compose stop (questo fermerà i container di Postgres e NodeJS);
7. Per riavviare il server eseguire il comando: docker-compose start (questo avvierà i container di Postgres e NodeJS).

Un assistito può accedere direttamente all'eshop, aggiungengere al carrello prodotti di cui necessita e inviare la sua richiesta a un volontario. La richiesta
verrà inviata al volontario più vicino (un algoritmo determinerà l'assistente più vicino in base agli utenti registrati come volontari nella città dell'assistito). 

Un assistente che riceve richieste le potrà vedere nel suo profilo, accettare o rifiutare. Una volta accettata potrà aggiungere al suo calendar l'evento i cui
dettagli sono: mittente della richiesta e beni richiesti, con timestamp della richiesta.
Se un assistente rifiuta una richiesta, questa viene inoltrata al secondo assisstene più vicino all'assistito, così fino a quando non finiscono i volontari
all'interno della città di domicilio dell'assistito.

Una richiesta inoltre può essere accettata e completata (una volta che il volontario ha soddisfatto la richiesta del proprio assistito).

## Sono state implementate le github Actions
