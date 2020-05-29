/* STATUS INSERTS */
insert into status (name, description) VALUES ('Active', 'Indicates that the resource is available to the system');
insert into status (name, description) VALUES ('Inactive', 'Indicates that the resource is not available to the system');
insert into status (name, description) VALUES ('In process', 'Indicates that the order is waiting for payment confirmation');
insert into status (name, description) VALUES ('Processed', 'Indicates that the order has been confirmed and your payment has been approved.');
insert into status (name, description) VALUES ('Rejected', 'Indicates that the order cannot be processed');
insert into status (name, description) VALUES ('Reserved', 'Indicates that the quantity of the product is reserved');

/* ROL INSERTS */
insert into role (name, priority) values ('customer', 1);
insert into role (name, priority) values ('Admin', 1);

/* customer INSERTS */
insert into customer
    (name, last_name, birthdate,email,is_federate, uid, status_id, rol_id) VALUES
    ('Andrea', 'Da Silva', '1999-01-25 00:00:00.000000','andrea@gmail.com', true,'UVvWC9yrxcjRqbNrEjb0w7BYlq2', 1, 2);
insert into customer
    (name, last_name, birthdate,email,is_federate, status_id, rol_id) VALUES
    ('Gabriel', 'Ortega', '1998-10-19 00:00:00.000000','gabriel@gmail.com', true, 1, 2);
insert into customer
    (name, last_name, birthdate,email,is_federate, status_id, rol_id) VALUES
    ('Angel', 'Sucasas', '1999-01-25 00:00:00.000000','angel@gmail.com', true, 1, 2);
insert into customer
    (name, last_name, birthdate,email,is_federate, status_id, rol_id, uid) VALUES
    ('Admin', 'User', '1999-01-25 00:00:00.000000','admin@gmail.com', false, 1, 2, 'ppi0RqZ7RuTFdFSvIqf7cpuDppT2');

/* PROVIDERS INSERTS */
insert into provider (name) values ('Apple Products');
insert into provider (name) values ('HP C.A');
insert into provider (name) values ('CHIN IMPORTS');
insert into provider (name) values ('GENERAL IMPORT');
insert into provider (name) values ('COLUMBIA NATIONS');

/* BRAND INSERTS */
insert into brand (name) values ('Apple Computers');
insert into brand (name) values ('HP');
insert into brand (name) values ('ASUS');
insert into brand (name) values ('XIAOMI');
insert into brand (name) values ('COLUMBIA');
insert into brand (name) values ('VAN HEUSEN');
insert into brand (name) values ('BARRINGTON HARDWOODS');
insert into brand (name) values ('PANDORA');
insert into brand (name) values ('MATEL');
insert into brand (name) values ('VERSAGE');
insert into brand (name) values ('ISTIKBAL');
insert into brand (name) values ('MOOG');
insert into brand (name) values  ('ADIDAS');
insert into brand (name) values  ('KUPPET');
insert into brand (name) values  ('FENDER');
insert into brand (name) values  ('PLAYSTATION');


/* PRODUCTS INSERTS */
insert into product
    (name, description, price,minimum_quantity_available, shipping_price, status_id, brand_id) VALUES
    ('2018 Newest HP Touchscreen 15.6 inch HD Laptop, Latest Intel Quad-Core i5-8250U Processor up to 3.40 GHz, 8GB DDR4, 1TB Hard Drive, DVD-RW, HDMI, Webcam, Bluetooth, Windows 10 Home',
     'Intel 8th Generation Quad-Core i5-8250U Processor Dual-Core, up to 3.4 GHz, Intel UHD Graphics 620',
     599.99,10, 20.5, 1, 2);
insert into product (name, description, price,minimum_quantity_available, shipping_price, status_id, brand_id) VALUES
    ('ASUS ZenBook 13 Ultra-Slim Laptop-Panoramic screen Full HD 13,3", 8.ªgeneration Intel Core I5-8265U',
     'panoramic screen, size: 13,3", bisel NanoEdge Full-HD/ Intel Core i5-8265u (Up to 3,9 GHz)/Fast storage and memory with SSD PCIe M.2 512 GB , 8GB RAM LPDDR3',
     699.99,30, 22.9, 1, 3);
insert into product (name, description, price,minimum_quantity_available, shipping_price, status_id, brand_id) VALUES
    ('Xiaomi Redmi Note 8 128 GB 4GB RAM 48 MP Version Global Dual SIM Smartphone (Space Black)',
     'Touch screem IPS LCD, size 6,3", FHD+ 1080×2340 píxels, relation 19,5:9, Dual SIM (Nano-SIM, Dual Stand-by)/ Android 9.0 (Pie)/ MIUI 10 / 4 GB RAM + 128 GB ROM, Qualcomm SDM665 Snapdragon 665 (11 nm), Octa-Core.',
     189.99,10, 5.5, 1, 4);
insert into product (name, description, price,minimum_quantity_available, shipping_price, status_id, brand_id) VALUES
    ('Columbia Bonehead short-sleeved shirt for men',
     '100 % Poliéster / Imported / Button closure',
     13.99,5, 2.5, 1, 5);
insert into product (name, description, price,minimum_quantity_available, shipping_price, status_id, brand_id) VALUES
    ('Van Heusen - Straight cut trouser',
     '72% poliester/ Imported / Zipper closure',
     29.99,10, 4.5, 1, 6);
insert into product (name, description, price,minimum_quantity_available, shipping_price, status_id, brand_id) VALUES
    ('Walnut wood 3/4" x 2"',
     'Two sides sanded 3/4 inch thick.',
     40.22,5, 6.5, 1, 7);
insert into product (name, description, price,minimum_quantity_available, shipping_price, status_id, brand_id) VALUES
    ('PANDORA Silver Bracelet',
     'PANDORA Reflexions bracelet in 18K gold plated PANDORA Shine silver.',
     199.99,10, 8.5, 1, 8);
insert into product (name, description, price,minimum_quantity_available, shipping_price, status_id, brand_id) VALUES
    ('Power Rangers Ninja Steel Megazord Figura de acción, Megazord Ninja',
     'The mighty Power Rangers Ninja Steel Megazords combine the power of the 5 zords to create one epic megazord, just like the TV show',
     29.99,5, 8.5, 1, 9);
insert into product (name, description, price,minimum_quantity_available, shipping_price, status_id, brand_id) VALUES
    ('BRIGHT CRYSTAL GIANNI VERSACE',
     'A classic designer fragrance for men',
     66.99,10, 8.5, 1, 10);
insert into product (name, description, price,minimum_quantity_available, shipping_price, status_id, brand_id) VALUES
    ('ISTIKBAL - Multifunctional living room sofa, Troya collection, brown color',
     'Extremely easy conversion and space saving design without compromising comfort.',
     309.99,15, 8.5, 1, 11);
insert into product (name, description, price,minimum_quantity_available, shipping_price, status_id, brand_id) VALUES
    ('MOOG 513288 Wheel bearing',
     'Innovative roll shape design that ensures optimal and uniform preload.',
     59.99,15, 8.5, 1, 12);
insert into product (name, description, price,minimum_quantity_available, shipping_price, status_id, brand_id) VALUES
    ('World Cup official ball , adidas ',
     'Synthetic. Imported. Authentic Adidas football team guaranteed.',
     51.22,10, 18.5, 1, 13);
insert into product (name, description, price,minimum_quantity_available, shipping_price, status_id, brand_id) VALUES
    ('Portable washing machine, Kuppet 16.5 pounds compact double tub washing',
     'Great capacity. Features the tub s dual-function design that can save your priceus time by washing and spinning dry loads at the same time',
     450.99,5, 88.5, 1, 14);
insert into product (name, description, price,minimum_quantity_available, shipping_price, status_id, brand_id) VALUES
    ('Fender Guitar, Jetty Black',
     'Unique Fender Round Body Shape / Painted Solid Spruce Top; back and sides in painted mahogany.',
     150.99,8, 35, 1, 15);
insert into product (name, description, price,minimum_quantity_available, shipping_price, status_id, brand_id) VALUES
    ('PlayStation 4 1TB',
     'New PS4, lighter and thinner All the best in games, TV music and more. This console can be operated in Spanish. 1TB hard drive',
     349.99,10, 15, 1, 16);

/* SERVICES INSERTS */
insert into service (name, description, price, status_id)
    VALUES ('Reparación de Lavadoras y Neveras', 'Reparamos lavadoras y neveras. Contamos con certificados a nivel mundial y experiencia de más de 10 años.', 345.76, 1);
insert into service (name, description, price, status_id)
    VALUES ('Reparación de Computadoras', 'Reparamos CPU y monitores. Contamos con certificados a nivel mundial y experiencia de más de 10 años.', 789.76, 2);
insert into service (name, description, price, status_id)
    VALUES ('Reparación de Cocinas', 'Reparamos cocinas', 12.76, 1);
insert into service (name, description, price, status_id)
    VALUES ('Reparación de Teléfonos', 'Reparamos teléfonos', 100.21, 1);


/* PRODUCT_PROVIDER INSERTS */
insert into product_provider (product_id, provider_id) VALUES (1, 1);
insert into product_provider (product_id, provider_id) VALUES (2, 1);
insert into product_provider (product_id, provider_id) VALUES (3, 2);
insert into product_provider (product_id, provider_id) VALUES (4, 2);
insert into product_provider (product_id, provider_id) VALUES (5, 5);
insert into product_provider (product_id, provider_id) VALUES (6, 4);
insert into product_provider (product_id, provider_id) VALUES (7, 3);
insert into product_provider (product_id, provider_id) VALUES (8, 4);
insert into product_provider (product_id, provider_id) VALUES (9, 3);
insert into product_provider (product_id, provider_id) VALUES (10, 4);
insert into product_provider (product_id, provider_id) VALUES (11, 3);
insert into product_provider (product_id, provider_id) VALUES (12, 4);
insert into product_provider (product_id, provider_id) VALUES (13, 3);
insert into product_provider (product_id, provider_id) VALUES (14, 4);
insert into product_provider (product_id, provider_id) VALUES (15, 3);
insert into product_provider (product_id, provider_id) VALUES (1, 1);
insert into product_provider (product_id, provider_id) VALUES (2, 1);
insert into product_provider (product_id, provider_id) VALUES (3, 2);
insert into product_provider (product_id, provider_id) VALUES (4, 2);


/* SERVICE_PROVIDER INSERTS */
insert into service_provider (service_id, provider_id) VALUES (2, 1);
insert into service_provider (service_id, provider_id) VALUES (2, 2);
insert into service_provider (service_id, provider_id) VALUES (1, 1);
insert into service_provider (service_id, provider_id) VALUES (1, 2);

/* SERVICE_PHOTO INSERTS */
insert into service_photo (content, service_id) VALUES ('reparaciones.jpg', 1);
insert into service_photo (content, service_id) VALUES ('reparaciones.jpg', 2);
insert into service_photo (content, service_id) VALUES ('reparacion-tlfs.jpg', 3);
insert into service_photo (content, service_id) VALUES ('reparacion-tlfs.jpg', 4);

/* PRODUCT_PHOTO INSERTS */
insert into product_photo (content, product_id) VALUES ('macbook.jpg', 1);
insert into product_photo (content, product_id) VALUES ('asus1.jpg', 2);
insert into product_photo (content, product_id) VALUES ('asus2.jpg', 2);
insert into product_photo (content, product_id) VALUES ('redmi1.jpg', 3);
insert into product_photo (content, product_id) VALUES ('redmi2.jpg', 3);
insert into product_photo (content, product_id) VALUES ('columbia.jpg', 4);
insert into product_photo (content, product_id) VALUES ('columbia2.jpg', 4);
insert into product_photo (content, product_id) VALUES ('pants1.jpg', 5);
insert into product_photo (content, product_id) VALUES ('pants2.jpg', 5);
insert into product_photo (content, product_id) VALUES ('barr1.jpg', 6);
insert into product_photo (content, product_id) VALUES ('barr2.jpg', 6);
insert into product_photo (content, product_id) VALUES ('joyas.jpg', 7);
insert into product_photo (content, product_id) VALUES ('juguetes.jpg', 8);
insert into product_photo (content, product_id) VALUES ('belleza1.jpg', 9);
insert into product_photo (content, product_id) VALUES ('mueble1.jpg', 10);
insert into product_photo (content, product_id) VALUES ('cojinete.jpg', 11);
insert into product_photo (content, product_id) VALUES ('adidas.jpg', 12);
insert into product_photo (content, product_id) VALUES ('electrodomesticos.jpg', 13);
insert into product_photo (content, product_id) VALUES ('guitar.jpg', 14);
insert into product_photo (content, product_id) VALUES ('ps4.jpg', 15);

/* PRODUCT_DIMENSION INSERTS */
insert into product_dimension (product_id, width, height, long) VALUES (1, '7', '5', '6');
insert into product_dimension (product_id, width, height, long) VALUES (2, '17', '5', '9');
insert into product_dimension (product_id, width, height, long) VALUES (3, '16', '1', '21');
insert into product_dimension (product_id, width, height, long) VALUES (4, '11', '3', '14');
insert into product_dimension (product_id, width, height, long) VALUES (5, '7', '5', '6');
insert into product_dimension (product_id, width, height, long) VALUES (6, '17', '5', '9');
insert into product_dimension (product_id, width, height, long) VALUES (7, '16', '1', '21');
insert into product_dimension (product_id, width, height, long) VALUES (8, '11', '3', '14');
insert into product_dimension (product_id, width, height, long) VALUES (9, '7', '5', '6');
insert into product_dimension (product_id, width, height, long) VALUES (10, '17', '5', '9');
insert into product_dimension (product_id, width, height, long) VALUES (11, '16', '1', '21');
insert into product_dimension (product_id, width, height, long) VALUES (12, '11', '3', '14');
insert into product_dimension (product_id, width, height, long) VALUES (13, '7', '5', '6');
insert into product_dimension (product_id, width, height, long) VALUES (14, '17', '5', '9');
insert into product_dimension (product_id, width, height, long) VALUES (15, '16', '1', '21');

/* QUESTION_PRODUCT INSERTS */
insert into product_question (comment, product_id, customer_id)
VALUES ('Me encantó el product', 1, 1);
insert into product_question (comment, product_id, customer_id)
VALUES ('Buen product', 2, 2);
insert into product_question (comment, product_id, customer_id)
VALUES ('Me encantó el product', 4, 3);
insert into product_question (comment, product_id, customer_id)
VALUES ('Buen product', 2, 1);
insert into product_question (comment, product_id, customer_id)
VALUES ('Me encantó el product', 8, 2);
insert into product_question (comment, product_id, customer_id)
VALUES ('Me encantó el product', 10, 3);
insert into product_question (comment, product_id, customer_id)
VALUES ('Buen product', 12, 1);
insert into product_question (comment, product_id, customer_id)
VALUES ('Buen product', 14, 2);
insert into product_question (comment, product_id, customer_id)
VALUES ('Me encantó el product', 15, 3);
insert into product_question (comment, product_id, customer_id)
VALUES ('Buen product', 3, 1);
insert into product_question (comment, product_id, customer_id)
VALUES ('Me encantó el product', 11, 2);





/* CATEGORY INSERTS */
insert into category (name,icon,term) VALUES ('Electronics','fas fa-tv','ELECTRONICS');
insert into category (name,icon,term) VALUES ('Clothing and Fashion','fas fa-tshirt','CLOTHING_FASHION');
insert into category (name,icon,term) VALUES ('Carpentry','mdi-axe','CARPENTRY');
insert into category (name,icon,term) VALUES ('Jewelry','fas fa-gem','JEWELRY');
insert into category (name,icon,term) VALUES ('Toys','fas fa-bicycle','TOYS');
insert into category (name,icon,term) VALUES ('Makeup and beauty','fas fa-broom','MAKEUP_BEAUTY');
insert into category (name,icon,term) VALUES ('Furniture and home','fas fa-couch','FURNITURE_HOME');
insert into category (name,icon,term) VALUES ('Auto parts','mdi-car-door','AUTO_PARTS');
insert into category (name,icon,term) VALUES ('Sports','fas fa-futbol','SPORTS');
insert into category (name,icon,term) VALUES ('Home appliances','fas fa-utensils','HOME_APPLIANCES');
insert into category (name,icon,term) VALUES ('Music','fas fa-music','MUSIC');
insert into category (name,icon,term) VALUES ('Videogames','fas fa-gamepad','VIDEOGAMES');


/* PRODUCT_CATEGORY INSERTS */
insert into product_category (category_id, product_id) VALUES (1, 1);
insert into product_category (category_id, product_id) VALUES (1, 2);
insert into product_category (category_id, product_id) VALUES (1, 3);
insert into product_category (category_id, product_id) VALUES (2, 4);
insert into product_category (category_id, product_id) VALUES (2, 5);
insert into product_category (category_id, product_id) VALUES (3, 6);
insert into product_category (category_id, product_id) VALUES (4, 7);
insert into product_category (category_id, product_id) VALUES (5, 8);
insert into product_category (category_id, product_id) VALUES (6, 9);
insert into product_category (category_id, product_id) VALUES (7, 10);
insert into product_category (category_id, product_id) VALUES (8, 11);
insert into product_category (category_id, product_id) VALUES (9, 12);
insert into product_category (category_id, product_id) VALUES (10, 13);
insert into product_category (category_id, product_id) VALUES (11, 14);
insert into product_category (category_id, product_id) VALUES (12, 15);

/* SERVICE_CATEGORY INSERTS */
insert into service_category (category_id, service_id) VALUES (1, 1);
insert into service_category (category_id, service_id) VALUES (1, 3);
insert into service_category (category_id, service_id) VALUES (1, 2);
insert into service_category (category_id, service_id) VALUES (1, 4);

/* CATALOGUE / PRODUCT_CATELOGUE INSERTS */
insert into catalogue (name, description, term) VALUES ('Computers', 'Catálogo de Computadoras', 'COMPUTERS');
insert into product_catalogue (catalogue_id, product_category_id) VALUES (1, 1);
insert into product_catalogue (catalogue_id, product_category_id) VALUES (1, 2);
insert into catalogue (name, description, term) VALUES ('Smarthphones', 'Catálogo de smarthphones', 'SMARTHPHONES');
insert into product_catalogue (catalogue_id, product_category_id) VALUES (2, 3);
insert into catalogue (name, description, term) VALUES ('Shirt', 'Catálogo de camisas', 'SHIRT');
insert into product_catalogue (catalogue_id, product_category_id) VALUES (3, 4);
insert into catalogue (name, description, term) VALUES ('Pants', 'Catálogo de pantalones', 'PANTS');
insert into product_catalogue (catalogue_id, product_category_id) VALUES (4, 5);
insert into catalogue (name, description, term) VALUES ('Wood', 'Catálogo de maderas', 'WOOD');
insert into product_catalogue (catalogue_id, product_category_id) VALUES (5, 6);
insert into catalogue (name, description, term) VALUES ('Bracelects', 'Catálogo de pulseras', 'BRACELETS');
insert into product_catalogue (catalogue_id, product_category_id) VALUES (6, 7);
insert into catalogue (name, description, term) VALUES ('Robots', 'Catálogo de robots', 'ROBOTS');
insert into product_catalogue (catalogue_id, product_category_id) VALUES (7, 8);
insert into catalogue (name, description, term) VALUES ('Fragrance', 'Catálogo de perfumes', 'FRAGRANCE');
insert into product_catalogue (catalogue_id, product_category_id) VALUES (8, 9);
insert into catalogue (name, description, term) VALUES ('Sofas', 'Catálogo de sofas', 'SOFAS');
insert into product_catalogue (catalogue_id, product_category_id) VALUES (9, 10);
insert into catalogue (name, description, term) VALUES ('Spare parts', 'Catálogo de repuestos', 'SPARE_PARTS');
insert into product_catalogue (catalogue_id, product_category_id) VALUES (10, 11);
insert into catalogue (name, description, term) VALUES ('Balls', 'Catálogo de balones', 'BALLS');
insert into product_catalogue (catalogue_id, product_category_id) VALUES (11, 12);
insert into catalogue (name, description, term) VALUES ('Washing machine', 'Catálogo de lavadoras', 'WASHING_MACHINE');
insert into product_catalogue (catalogue_id, product_category_id) VALUES (12, 13);
insert into catalogue (name, description, term) VALUES ('Music instruments', 'Catálogo de instrumentos musicales', 'MUSIC_INSTRUMENTS');
insert into product_catalogue (catalogue_id, product_category_id) VALUES (13, 14);
insert into catalogue (name, description, term) VALUES ('Consoles', 'Catálogo de consolas', 'CONSOLES');
insert into product_catalogue (catalogue_id, product_category_id) VALUES (14, 15);

/* CATALOGUE / PRODUCT_CATELOGUE INSERTS */
insert into catalogue (name, description, term) VALUES ('Cámaras', 'Catálogo de Cámaras', 'Camara');
insert into service_catalogue (catalogue_id, service_category_id) VALUES (3, 1);
insert into catalogue (name, description, term) VALUES ('Baterías', 'Catálogo de Baterías', 'Battery');
insert into service_catalogue (catalogue_id, service_category_id) VALUES (4, 1);


/* RATING_PRODUCT INSERTS */
insert into product_rating (rating, comment, product_id, customer_id) VALUES
        (5, 'Amazing product!', 1, 1),
        (4, 'Great quality', 1, 3),
        (4, 'I liked it, but I thought it would be better', 2, 2),
        (5, 'Amazing product!', 3, 1),
        (3, 'Great quality', 4, 3),
        (2, 'I liked it, but I thought it would be better', 5, 2),
        (4, 'Amazing product!',10, 1),
        (3, 'Great quality', 4, 3),
        (3, 'I liked it, but I thought it would be better', 5, 2),
        (5, 'Amazing product!', 8, 1),
        (4, 'Great quality', 7, 3),
        (4, 'I liked it, but I thought it would be better', 6, 2),
        (2, 'Amazing product!', 8, 1),
        (1, 'Bad quality', 10, 3),
        (3, 'I liked it, but I thought it would be better', 11, 2);

/* INVENTORY_PRODUCT INSERTS */
insert into product_inventory (quantity_disponible, product_id) VALUES (60, 1);
insert into product_inventory (quantity_disponible, product_id) VALUES (58, 2);
insert into product_inventory (quantity_disponible, product_id) VALUES (50, 3);
insert into product_inventory (quantity_disponible, product_id) VALUES (40, 4);
insert into product_inventory (quantity_disponible, product_id) VALUES (45, 5);
insert into product_inventory (quantity_disponible, product_id) VALUES (63, 6);
insert into product_inventory (quantity_disponible, product_id) VALUES (150, 7);
insert into product_inventory (quantity_disponible, product_id) VALUES (70, 8);
insert into product_inventory (quantity_disponible, product_id) VALUES (95, 9);
insert into product_inventory (quantity_disponible, product_id) VALUES (59, 10);
insert into product_inventory (quantity_disponible, product_id) VALUES (80, 11);
insert into product_inventory (quantity_disponible, product_id) VALUES (90, 12);
insert into product_inventory (quantity_disponible, product_id) VALUES (40, 13);
insert into product_inventory (quantity_disponible, product_id) VALUES (50, 14);
insert into product_inventory (quantity_disponible, product_id) VALUES (70, 15);


/* OFFER INSERTS */
insert into oferta (name, description, status_id) VALUES
    ('Semester offer',
     'Oferta para los estudiantes como parte del incio del semestre',
      1),
    ('Birth offer',
     'Oferta para los estudiantes como parte del fin del semestre',
     2),
    ('Holliday offer',
     'Oferta para los estudiantes como parte del mitad del semestre',
     2);

/* PRODUCT_OFFER INSERTS */
insert into product_offer (offer_id, product_id, discount_price, percentage) VALUES
    (1, 1, '10.78', 70),
    (1, 3, '14.54', 25),
    (1, 5, '4.54', 30),
    (1, 7, '6.54', 15),
    (1, 9, '7.54', 25),
    (1, 11, '0.54', 35),
    (1, 13, '2.34', 20),
    (1, 15, '6.15', 50);


/* PLATFORM_PARAMETER INSERTS */
insert into platform_parameter (name) VALUES ('Comisión Pasarela de Pagos'), ('Comisión de services'),
('quantity Mínima en el Inventario');

/* CURRENCY INSERTS */
insert into currency (name, iso) VALUES ('Dólar', 'USD'), ('Euro', 'EUR');

/* PLATFORM INSERTS */
insert into platform (content, customer_id, platform_parameter_id, status_id) VALUES
('0.75', 1, 1, 1), ('1.75', 1, 2, 1), ('10', 1, 3, 1);




