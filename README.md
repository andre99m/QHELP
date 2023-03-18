<h1 align="center">QHelp</h1>
Progetto corso reti di calcolatori

<h2 align="center">Scopo del progetto</h2>
<p>QHelp nasce in un contensto di pandemia per aiutare la gente bisognosa, chiusa in casa per quarantena domiciliare, al fine di mettersi in contatto con soggetti volontari ai quali richiedere beni di prima necessità. </p>

<h2 align="center">Architetture di riferimento</h2>
<p align="center">
  <img width="50%" src="https://raw.githubusercontent.com/StudentsHUBProject/StudentsHUB/master/assets/img/FinalHomeW.png" alt="StudentsHUB: logo">
</p>
<h2 align="center">Soddisfacimento dei requisiti</h2>

1. __Il servizio REST che implementate (lo chiameremo SERV) deve offrire a terze parti delle API documentate.__ 
    - QHelp offre API documentate tramite apiDoc, in particolare è possibile effettuare la GET sui prodotti, utenti, ordini del database, ottenendone tutta la lista o solo uno di essi con un particolare ID.
    -  /QHELP/QH/routes/docs/index.html

 2. __SERV si deve interfacciare con almeno due servizi REST di terze parti.__ 
    - QHelp utilizza le seguenti API esterne:
        - Google Maps: Per geolocalizzare gli assistiti e trovare gli assistenti più vicini a loro.
        - Google Calendar: Per inserire una richiesta in calendario alla data odierna.
        - Google: Per l'accesso degli utenti (passport)
        - Facebook: Per l'accesso degli utenti (passport)

3. __La soluzione deve prevedere l'uso di protocolli asincroni. Per esempio Websocket e/o AMQP.__ 
    - QHelp implementa le Websocket, ne fa utilizzo per permettere agli utenti di inviarsi messaggi istantanei quando entrambi sono online.
    
4. __Il progetto deve prevedere l'uso di Docker e l'automazione del processo di lancio, configurazione e test.__ 
    - Attraverso una docker compose viene costruita l'intera infrastruttura del progetto, compresa web app e database locale (il quale viene popolato con alcuni prodotti a scopo illustrativo).

5. __Deve essere implementata una forma di CI/CD per esempio con le Github Actions__ 
    - Vengono implentate Github Actions per:
        - Testing automatico delle funzionalità e della creazione dell'immagine docker.
        - Testing automatico dei servizi API offerti (realizzato tramite mocha-chai).

6. __Requisiti minimi di sicurezza devono essere considerati e documentati. Self-signed certificate sono più che sufficienti per gli scopi del progetto.__ 
    - Le uniche richieeste accettate sono quelle via https.

<h2 align="center">Tecnologie utilizzate</h2>

1. __Node.js__ 

 2. __Express.js__ 

3. __Handlebars Template Engine__ 

4. __Docker__ 

6. __PostgresSQL con Sequelize__ 

7. __Bootstrap 4.0__ 

8. __OpenSSL__ 

<h2 align="center">Istruzioni per l'installazione</h2>

  1) Tramite git clonare il repository utilizzando il comando 
  ```
  git clone https://github.com/andre99m/QHELP.git
  ```
  2) Installare docker
  3) Avviare docker
  4) Porsi nella cartella QHelp scaricata da git ed eseguire il comando 
  ```
  docker-compose up
  ```  
  5) Aprire il browser e andare su [localhost](https://localhost:3000/);

<h2 align="center">Come funziona</h2>

Un assistito può accedere direttamente all'eshop, aggiungengere al carrello prodotti di cui necessita e inviare la sua richiesta a un volontario. La richiesta verrà inviata al volontario più vicino (un algoritmo basato sulla posizione degli utenti determinerà l'assistente più vicino in base agli utenti registrati come volontari nella città dell'assistito). 

Un assistente che riceve richieste le potrà vedere nel suo profilo, accettare o rifiutare. Una volta accettata potrà aggiungere al suo calendar l'evento i cui dettagli sono: mittente della richiesta e beni richiesti, con timestamp della richiesta.
Se un assistente rifiuta una richiesta, questa viene inoltrata al secondo assisstene più vicino all'assistito, così fino a quando non finiscono i volontari
all'interno della città di domicilio dell'assistito.

Una richiesta inoltre può essere accettata e completata (una volta che il volontario ha soddisfatto la richiesta del proprio assistito).

<h2 align="center">Istruzioni per il test</h2>


Eseguire i test digitando nella cartella QHELP/QH:
```
npm install 
```
Per installare le dipendenze e i pacchetti usati.

```
npm test
```
Per eseguire il test.

<h2 align="center">Autore</h2>
Andrea Mason (1862553)
