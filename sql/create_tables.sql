CREATE TABLE ussessions(
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp without time zone NOT NULL,
    CONSTRAINT usessions_pkey PRIMARY KEY (sid)
);
CREATE TABLE users(
    id serial NOT NULL,
    email character varying(100),
    password character varying(100),
    "createdAt" date,
    "updatedAt" date,
    name character varying,
    surname character varying,
    citta character varying,
    "long" real,
    lat real,
    role character varying,
    indirizzo character varying,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE TABLE products(
    "imagePath" character varying NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL,
    category character varying NOT NULL,
    "createdAt" date,
    "updatedAt" date,
    id serial NOT NULL,
    CONSTRAINT products_pkey PRIMARY KEY (id)
);
CREATE TABLE orders(
    emailuser character varying NOT NULL,
    "cartTitoli" character varying[] NOT NULL,
    "cartQuantita" character varying[] NOT NULL,
    "createdAt" date NOT NULL,
    "updatedAt" date NOT NULL,
    iduser character varying NOT NULL,
    stato character varying NOT NULL,
    emailassistente character varying NOT NULL,
    rifiuti character varying[] NOT NULL,
    id serial NOT NULL,
    indirizzo character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (id)
);
CREATE TABLE messages(
    id serial NOT NULL,
    "from" character varying,
    "to" character varying,
    message character varying,
    "createdAt" timestamp without time zone,
    "updatedAt" timestamp without time zone,
    CONSTRAINT messages_pkey PRIMARY KEY (id)
);
INSERT INTO products VALUES ('https://www.ilmiostore.eu/wp-content/uploads/2020/07/felceazzurra-bagnoschiuma-orchidea-nera.jpg', 'Bagnoschiuma Felce Azzurra', 'Bagnoschiuma al profumo di Orchidea Nera 650ml', 'Bagno'),
('https://d2f5fuie6vdmie.cloudfront.net/asset/ita/2020/25/bc50e472df83542ef4bcc48d62536d0c0014cd78.jpeg', 'Tortiglioni Barilla', 'Tortiglioni Integrali 500g', 'Alimentari'),
('https://www.spesasprint.it/img/prodotti/big/69585.jpg?v=2', 'FarmaMed Cerotti', 'Cerotti 2 formati 12pz antibatterici', 'Farmacia'),
('https://images-na.ssl-images-amazon.com/images/I/618v%2B7AhNoL._AC_SY879_.jpg', 'Mastro Lindo Lavapavimenti', 'Lavapavimenti Liquido Limone 950ml', 'Pulizia');