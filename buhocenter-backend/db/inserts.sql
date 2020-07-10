insert into statuses (name, description) VALUES ('Active', 'Indicates that the resource is available to the system');
insert into statuses (name, description) VALUES ('Inactive', 'Indicates that the resource is not available to the system');
insert into statuses (name, description) VALUES ('New','Indicates that a new order was create');
insert into statuses (name, description) VALUES ('Pending','Indicates that the order is pending to pay');
insert into statuses (name, description) VALUES ('Confirming','Indicates that the order is being confirming');
insert into statuses (name, description) VALUES ('Paid','Indicates that the order was paid');
insert into statuses (name, description) VALUES ('Invalid','Indicates that the order was invalid');
insert into statuses (name, description) VALUES ('Expired','Indicates that the order expired its time to pay');
insert into statuses (name, description) VALUES ('Canceled','Indicates that the order was canceled');
insert into statuses (name, description) VALUES ('Reserved', 'Indicates that the quantity of the product is reserved');

insert into roles (name, priority) values ('Customer', 1), ('Admin', 1);

insert into foreign_exchanges (name, symbol, exchange, iso) VALUES ('Dólar', '$', 1, 'USD'), ('Euro', '€', 0.89, 'EUR');

insert  into commissions (service_fee, processor_fee, status_id) values (0.01,0.01,1);

insert into cryptocurrencies(name, iso) values ('Bitcoin', 'BTC');
insert into cryptocurrencies(name, iso) values ('Litecoin', 'LTC');
insert into cryptocurrencies(name, iso) values ('Bitcoin Cash', 'BCH');

insert into users
    (name, last_name, birthdate, email, is_federate, uid, status_id, role_id, foreign_exchange_id) VALUES
    ('Andrea', 'Da Silva', '1999-01-25 00:00:00.000000','andrea@gmail.com', true,'UVvWC9yrxcjRqbNrEjb0w7BYlq2', 1, 2, 1);
insert into users
    (name, last_name, birthdate, email, is_federate, status_id, role_id, foreign_exchange_id) VALUES
    ('Gabriel', 'Ortega', '1998-10-19 00:00:00.000000','gabriel@gmail.com', true, 1, 2, 1);
insert into users
    (name, last_name, birthdate, email, is_federate, status_id, role_id, foreign_exchange_id) VALUES
    ('Angel', 'Sucasas', '1999-01-25 00:00:00.000000','angel@gmail.com', true, 1, 2, 1);
insert into users
    (name, last_name, birthdate, email, is_federate, status_id, role_id, uid, foreign_exchange_id) VALUES
    ('Admin', 'User', '1999-01-25 00:00:00.000000','admin@gmail.com', false, 1, 2, 'pWyqVNhoitTERopK70ZxD5g88h73', 1);

insert into providers (name) values ('Apple Products');
insert into providers (name) values ('HP C.A');
insert into providers (name) values ('CHIN IMPORTS');
insert into providers (name) values ('GENERAL IMPORT');
insert into providers (name) values ('COLUMBIA NATIONS');

insert into providers (name) values ('TOMMY HILFIGER');
insert into providers (name) values ('ClothXs');
insert into providers (name) values ('Xensis');
insert into providers (name) values ('TechnoSys');
insert into providers (name) values ('Buhocenter');




insert into brands (name) values ('Apple Computers');
insert into brands (name) values ('HP');
insert into brands (name) values ('ASUS');
insert into brands (name) values ('XIAOMI');
insert into brands (name) values ('COLUMBIA');
insert into brands (name) values ('VAN HEUSEN');
insert into brands (name) values ('BARRINGTON HARDWOODS');
insert into brands (name) values ('PANDORA');
insert into brands (name) values ('MATEL');
insert into brands (name) values ('VERSAGE');
insert into brands (name) values ('ISTIKBAL');
insert into brands (name) values ('MOOG');
insert into brands (name) values ('ADIDAS');
insert into brands (name) values ('KUPPET');
insert into brands (name) values ('FENDER');
insert into brands (name) values ('PLAYSTATION');

insert into brands (name) values ('TOMMY HILFIGER');
insert into brands (name) values ('Southpole');
insert into brands (name) values ('JUMPER');
insert into brands (name) values ('SAMSUNG');
insert into brands (name) values ('BUHOCENTER');




insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('2018 Newest HP Touchscreen 15.6 inch HD Laptop, Latest Intel Quad-Core i5-8250U Processor up to 3.40 GHz, 8GB DDR4, 1TB Hard Drive, DVD-RW, HDMI, Webcam, Bluetooth, Windows 10 Home',
     'Intel 8th Generation Quad-Core i5-8250U Processor Dual-Core, up to 3.4 GHz, Intel UHD Graphics 620',
     true, 599.99, true, 1, 2, 2,5);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('ASUS ZenBook 13 Ultra-Slim Laptop-Panoramic screen Full HD 13,3", 8.ªgeneration Intel Core I5-8265U',
     'panoramic screen, size: 13,3", bisel NanoEdge Full-HD/ Intel Core i5-8265u (Up to 3,9 GHz)/Fast storage and memory with SSD PCIe M.2 512 GB , 8GB RAM LPDDR3',
     false, 699.99, true, 1, 3, 5,5);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Xiaomi Redmi Note 8 128 GB 4GB RAM 48 MP Version Global Dual SIM Smartphone (Space Black)',
     'Touch screem IPS LCD, size 6,3", FHD+ 1080×2340 píxels, relation 19,5:9, Dual SIM (Nano-SIM, Dual Stand-by)/ Android 9.0 (Pie)/ MIUI 10 / 4 GB RAM + 128 GB ROM, Qualcomm SDM665 Snapdragon 665 (11 nm), Octa-Core.',
     false, 189.99, true, 1, 4, 4,5);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Columbia Bonehead short-sleeved shirt for men',
     '100 % Poliéster / Imported / Button closure', false, 13.99, false, 1, 5, 3,4);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Van Heusen - Straight cut trouser', '72% poliester/ Imported / Zipper closure', true, 29.99, false, 1, 6, 4,3);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Walnut wood 3/4" x 2"', 'Two sides sanded 3/4 inch thick.', false, 40.22, false, 1, 7, 3,4);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('PANDORA Silver Bracelet', 'PANDORA Reflexions bracelet in 18K gold plated PANDORA Shine silver.', true, 199.99, false, 1, 8, 4,5);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Power Rangers Ninja Steel Megazord Figura de acción, Megazord Ninja', 'The mighty Power Rangers Ninja Steel Megazords combine the power of the 5 zords to create one epic megazord, just like the TV show',
     false, 29.99, true, 1, 9, 3,2);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('BRIGHT CRYSTAL GIANNI VERSACE', 'A classic designer fragrance for men', true, 66.99, false, 1, 10, 4,3);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('ISTIKBAL - Multifunctional living room sofa, Troya collection, brown color', 'Extremely easy conversion and space saving design without compromising comfort.', true,
     309.99, false, 1, 11, 3,4);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('MOOG 513288 Wheel bearing', 'Innovative roll shape design that ensures optimal and uniform preload.', false, 59.99, false, 1, 12, 4,5);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('World Cup official ball , adidas ', 'Synthetic. Imported. Authentic Adidas football team guaranteed.', false, 51.22, false, 1, 13, 1,4);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Portable washing machine, Kuppet 16.5 pounds compact double tub washing', 'Great capacity. Features the tub s dual-function design that can save your priceus time by washing and spinning dry loads at the same time',
     true, 450.99, true, 1, 14, 1,3);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Fender Guitar, Jetty Black', 'Unique Fender Round Body Shape / Painted Solid Spruce Top; back and sides in painted mahogany.', false,
     150.99, true, 1, 15, 2,4);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('PlayStation 4 1TB',
     'New PS4, lighter and thinner All the best in games, TV music and more. This console can be operated in Spanish. 1TB hard drive',
     true, 349.99, true, 1, 16, 2,5);



insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Mens Short Sleeve Polo Shirt in Classic Fit',
     '100% Cotton. Imported. Button closure. Machine Wash. A classic in every sense of the word. This Tommy Hilfiger polo shirt is a casual wardrobe must-have',
     false, 18.62, false, 1, 17, 6,4);
     
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('COOFANDY Mens Casual Dress Shirt Button Down Shirts Long-Sleeve Denim Work Shirt',
     'Cotton Blend.Button closure.Hand Wash.【High Quality】Cotton Blend, Long sleeve denim shirt for men, perfect for casual, business, make you look great and handsome',
     false, 18.99, false, 1, 17, 6,3);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Buhocenter Essentials Mens Slim-Fit Long-Sleeve Pattern Pocket Oxford Shirt',
     '100% Cotton. Imported. Button closure. Machine Wash. A windowpane plaid highlights this clean and classic long-sleeve Oxford shirt',
     false, 6.99, false, 1, 17, 6,4);
     
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Southpole Mens NASA Collection Fleece Jogger Pants',
     'Elastic waistband. Nasa apollo design. Drawstring on waist',
     false,20.00, false, 1, 18, 7,5);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('GRACE KARIN Womens Cropped Paper Bag Waist Pants with Pockets',
     '95%Polyester+5%Spandex. Tie closure. Womens High waisted Slim Fit Office Casual Pants Trousers with Pockets',
     false, 21.24, false, 1, 18, 7,4);
 insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Quality Durables Co. Mens Straight',
     'Relaxed-fit chino featuring flat-front leg, zipper fly with button closure. Jetted rear pockets Welted coin pocket at hip. Model is 6, 178lbs and wearing a size 32W x 32L',
     false, 39.24, false, 1, 18, 7,3);    

insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Apple MacBook Pro 16-Inch 16GB RAM, 512GB store gray',
     'Ninth-generation 6-Core Intel Core i7 Processor. Stunning 16-inch Retina Display with True Tone technology. Touch Bar and Touch ID',
     true, 2149.00, true, 1, 1, 1,4);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('HP 21.5-Inch All-in-One Computer, AMD A4-9125, 4GB RAM, 1TB Hard Drive, Windows 10 (22-c0010, White)',
     'The essential home computer: With an AMD processor and 4 GB of RAM, your family can seamlessly go from sending work emails to uploading vacation photos with ease',
     true, 427.24, true, 1, 2, 2,5);
 insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Jumper EZbook X3 Windows 10 Laptop, Laptop computer 13.3'' HD PC Laptops Intel N3350 6GB DDR3L 64GB eMMC 2.4G/5G WiFi supports up to 128GB TF card expansion',
     'Windows 10 Home OS—Offers more powerful performance, brings you more smooth and wonderful user experience.Powered by N3350 Dual Core processor, offers you smooth operation and stable multitasking experience.',
     true, 249.24, true, 1, 19, 8,5); 

insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Samsung Galaxy A20s, A207M, 32GB, GSM, Unlocked Phone, Dual-SIM, Blue',
     'International Variant/US Compatible LTE. Memory: 32GB 3GB RAM - microSD, up to 512GB - Dual-SIM',
     true, 160.00, true, 1, 20, 9,4);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Telefield 2142 Shark Cordless Phone ITAD 3-Way Calling w/USB Charge',
     'Cordless Phone, USB charge, Hands free, Voicemail, Easy to charge, NO BATTERIES Required .',
     true, 10.24, true, 1, 2, 9,5);
 insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Apple iPhone 11 Pro (64GB, Midnight Green) [Carrier Locked] + Carrier Subscription [Cricket Wireless]',
     'This phone is locked and must be purchased with a monthly carrier subscription from Cricket Wireless available below.',
     true, 998.24, true, 1, 1, 1,5); 

insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Exotic Wood Pen Blanks 12-Pack: Bloodwood, Mexican Ebony, Jatoba, Hard Maple, 3 of Each Wood Type, 5 x 3/4 x 3/4 inches',
     'QUALITY: End and side finishes are tablesaw, planer or jointer surfaces. Guaranteed crack free.',
     true, 22.49, true, 1, 15, 8,4);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Unfinished Natural Wood Slices 20 Pcs 3.5-4 inch Craft Wood kit Circles Crafts Christmas Ornaments Rustic Wedding Decoration DIY Crafts with Bark for Crafts',
     'Diameter: approx 3.5-4inch(9-10cm,5);Thickness: approx 0.4inch(1cm). Package contains 20 pcs pine tree discs',
     true, 14.99, true, 1, 15, 8,3);
 insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Buhocenter Brand – Ravenna Home Traditional Solid Pine End Table, 28'' H, Oak Finish',
     '47'' W x 25.75'' D x 28'' H. Solid pine. Classic wood makes this piece work with either modern or transitional decor.',
     true, 74.75, true, 1, 21, 10,4); 

insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Fengshui Wealth Prosperity Jade 10mm Bead Bracelet with Pi Xiu/Pi Yao Attract Wealth and Good Luck',
     'The figure of Pi Xiu is as strong as Chi lin. In present time, the major banks, successful entrepreneurs’ offices and shops all have Pi Xiu’s. It is not only a guardian god, but also can bring in abundant source of monetary revenue and land-office business. ',
     false, 19.99, false, 1, 15, 8,4);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('RiptGear Mosquito Bracelet (15 Pack) for Children and Adults - Better Than Lotion or Spray Wipes - Travel Bracelets for Mosquitoes - Natural and Without deet',
     '100% NATURAL and NON-TOXIC - Made from 100% all-natural Citronella oil. Completely DEET free',
     false, 19.99, false, 1, 15, 8,4);
 insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('SWAROVSKI Womens Ginger Crystal Jewelry Collection',
     'This chic, feminine piece features a rigid metal bangle attached to a delicate chain with a disc of sparkling crystal pave, creating a trendy stacked look',
     true, 76.75, true, 1, 21, 10,5); 


insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('ArtCreativity Bendable Robot Figures, Set of 12 Flexible Men, Birthday Party Favors for Boys and Girls, Stress Relief Fidget Toys for Kids and Adults, Goody Bag Stuffers, Piñata Fillers',
     'TENDLESS FUN: Bendable Robots your munchkin will love! These 3.75” tall plastic toy figures will twist, contort and curl whichever way you like and will still come up smiling. ',
     false, 13.99, false, 1, 15, 8,3);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Auney Robot Toys for Kids, Smart Programmable Remote Control Robots, Infrared Sensing RC Robot Intelligent Toy for Boys (Green)',
     'TENDLESS FUN: Bendable Robots your munchkin will love! These 3.75” tall plastic toy figures will twist, contort and curl whichever way you like and will still come up smiling. ',
     false, 29.99, false, 1, 15, 8,4);
 insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Suck UK ROBOT LUNCH BOX | TIN | TOY STORAGE | BEDROOM DECOR & ORGANIZATION |, 9.6 x 3.3 x 6.4 in, Multicolored',
     'Classic tin lunchbox designed like a retro robot',
     true,16.47, true, 1, 21, 10,5); 


insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('The Dreamer by Versace for Men 3.4 oz Eau de Toilette Spray',
     'Dreamer by Versace for Men 3.4 oz Eau de Toilette Spray: Buy Versace Colognes - Versace, the Dreamer, is an innovative clear and smooth blend between wild and aromatic plants including juniper, mugwort, and tarragon. ',
     false, 38.99, true, 1, 15, 8,3);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('212 Vip by Carolina Herrera Eau De Toilette Spray for Men, 3.4 Ounce',
     'Herrera was launched by the design house of Carolina Herrera',
     false, 51.89, true, 1, 15, 8,4);
 insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Lady Million by Paco Rabanne 2.7 oz Eau de Parfum Spray',
     'Item Condition: 100% authentic, new and unused. Lady Million by Paco Rabanne 2.7 oz Eau de Parfum Spray.',
     true,57.47, true, 1, 21, 10,5); 

insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Best Choice Products Modern Faux Leather Convertible Futon Sofa Bed Recliner Couch w/Metal Legs, 2 Cup Holders - Black',
     'COMFORTABLE FAUX LEATHER: Crafted with sleek faux leather and 4 chrome-metal legs, fuses comfort and style ',
     true, 214.99, false, 1, 15, 8,4);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Buhocenter Brand – Stone & Beam Lauren Down-Filled Oversized Sofa Couch with Hardwood Frame, 89"W, Pearl',
     'Soft down-filled cushions on a frame of solid hardwood mean this sofa offers plush support and security. Neutral pearl-colored upholstery allows this piece to blend into your existing color scheme with ease.',
     true, 900.89, true, 1, 15, 8,5);
 insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Best Choice Products 3-Seat L-Shape Tufted Faux Leather Sectional Sofa Couch Set w/Chaise Lounge, Ottoman Bench - Black',
     'MODERN STYLE: Stylish L-shaped sectional sofa is made with a modern-contemporary, faux leather design that will complement any living space',
     true,519.47, true, 1, 21, 10,4); 


insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('hansgrohe Hot Widespread Faucet Cartridge 1-inch Spare Part in 94009000',
     'REPLACEMENT CARTRIDGE: For use with hansgrohe branded widespread faucets on hot or left side',
     true, 34.99, false, 1, 15, 8,5);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Best Choice Products Heavy Duty Steel Garage Wall Mount Folding Tire Wheel Storage Rack',
     'Wall-mounted tire holder is easy to install and holds up to 4 tires for convenient space saving',
     true, 89.89, false, 1, 15, 8,3);
 insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Spare Hardware Parts Wheel Lock for IKEA MALM (IKEA Part #114670) (Pack of 4)',
     'These are 35mm (about 1 1/2") diameter. If the hole in your frame is larger, then these will not work.',
     true,8.00, false, 1, 21, 10,2); 



insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Edushape See-Me Sensory Ball, 7 Inch, Colors May Vary',
     'SENSORY ENGAGEMENT: Nubbly surface engages the senses and enhances tactile development',
     false, 13.29, false, 1, 15, 8,5);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Penn Championship Tennis Balls - Regular Felt Pressurized Tennis Balls - 1 Can, 3 Balls',
     'AMERICAS number 1 SELLING BALL, The product of 100 years worth of testing and perfecting; Penn Championship is the best selling tennis ball in America.',
     false, 4.89, false, 1, 15, 8,3);
 insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Rubber Bouncy Ball Baseball Training Balls (Pack of 4) by JA-RU 2.5" Hi Bounce Same Like Pinky Balls for Play or Massage Therapy. Plus 1 Small Ball. #987-4p',
     'Pack of 4 Real Rubber High Bounce Ball Baseball Style, Same Like Pink Pinky Pennsy Ball. With 1 small Exclusive collectible bouncy ball. Best Game Ball!',
     false,11.88, false, 1, 21, 10,4); 


insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('SUPER DEAL Portable Compact Washing Machine, Mini Twin Tub Washing Machine w/Washer&Spinner, Gravity Drain Pump and Drain Hose',
     'The smallest and lightest twin tub portable washing machine available, our highly popular Super Compact washing machine simply hooks up to your kitchen faucet, and it’s ready to go.',
     false, 125.29, true, 1, 15, 8,4);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('GE APPLIANCES GFW450SSMWW, White',
     'GE 4. 5CF FL Steam Washer ADA Wht',
     true, 893.89, false, 1, 15, 8,5);
 insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('WANAI Portable Washing Machine, Compact Mini Twin Tub Washer (13lbs) + Spinner (8lbs), Top-loading Washing Machine with Timer, Ideal for Dorms, Apartments',
     '[Compact twin-cylinder washing design]: You can operate the washing machine or spinner separately, or run both sides at the same time. The two bathtubs are designed to meet your different needs, making cleaning easier.',
     true,149.88, false, 1, 21, 10,5); 


insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Mylifestyle Piano Music Box with Bench and Black Case Musical Boxes Gift for Christmas/Birthday/Valentines Day, Melody Castle in The Sky',
    'Perfect Romantic Anniversary Birthday Christmas Wedding Valentines Day Gifts for Your lover .',
     true,50.29, true, 1, 15, 8,4);
insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('ZealMax Broche de flauta Mini pin de Forma de instrumento Musical Chapado en Plata Dorada con estuche',
     'GE 4. 5CF FL Wht',
     false, 7.89, false, 1, 15, 8,3);
 insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('9.5" Wooden Harp Musical Instrument Replica. For Decorative Purposes Only, does not play music',
     'Miniature harp replica',
     false,45.88, true, 1, 21, 10,2); 


insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Nintendo Switch - Gray Joy-Con - HAC 001 (Discontinued by Manufacturer)',
    'Play your way with the Nintendo Switch gaming system. Whether you’re at home or on the go, solo or with friends, the Nintendo Switch system is designed to fit your life. Dock your Nintendo Switch to enjoy HD gaming on your TV. Heading out. Just undock your console and keep playing in handheld mode',
     true,450.29, true, 1, 15, 8,3);

 insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('Xbox One S 1Tb Console - Starter Bundle (Discontinued)',
     'Bundle includes: Xbox One S 1TB Console, wireless Controller, 3 months of Xbox game Pass, 3 months of Xbox live Gold, HDMI cable (4K Capable), and AC power Cable',
     true,375.88, true, 1, 21, 10,4); 
	 
	 insert into products (name, description, can_accumulate_points, price, fragile, status_id, brand_id, provider_id,rating) VALUES
    ('AutumnFall Clearance Sale 🌻🌻Handheld Game Player for Children-Portable Retro Mini Handheld Video Game Console Gameboy Built-in 500 Classic Games USB Charge Birthday for Children (Black)',
     'Screen size : 3.0 inch HD screen',
     false, 19.89, false, 1, 15, 8,5);


insert into product_photos (content, product_id) VALUES ('macbook.jpg', 1);
insert into product_photos (content, product_id) VALUES ('asus1.jpg', 2);
insert into product_photos (content, product_id) VALUES ('asus2.jpg', 2);
insert into product_photos (content, product_id) VALUES ('redmi1.jpg', 3);
insert into product_photos (content, product_id) VALUES ('redmi2.jpg', 3);
insert into product_photos (content, product_id) VALUES ('columbia.jpg', 4);
insert into product_photos (content, product_id) VALUES ('columbia2.jpg', 4);
insert into product_photos (content, product_id) VALUES ('pants1.jpg', 5);
insert into product_photos (content, product_id) VALUES ('pants2.jpg', 5);
insert into product_photos (content, product_id) VALUES ('barr1.jpg', 6);
insert into product_photos (content, product_id) VALUES ('barr2.jpg', 6);
insert into product_photos (content, product_id) VALUES ('joyas.jpg', 7);
insert into product_photos (content, product_id) VALUES ('juguetes.jpg', 8);
insert into product_photos (content, product_id) VALUES ('belleza1.jpg', 9);
insert into product_photos (content, product_id) VALUES ('mueble1.jpg', 10);
insert into product_photos (content, product_id) VALUES ('cojinete.jpg', 11);
insert into product_photos (content, product_id) VALUES ('adidas.jpg', 12);
insert into product_photos (content, product_id) VALUES ('electrodomesticos.jpg', 13);
insert into product_photos (content, product_id) VALUES ('guitar.jpg', 14);
insert into product_photos (content, product_id) VALUES ('ps4.jpg', 15);

insert into product_photos (content, product_id) VALUES ('shirt1.png', 16);
insert into product_photos (content, product_id) VALUES ('shirt2.png', 17);
insert into product_photos (content, product_id) VALUES ('shirt3.png', 17);
insert into product_photos (content, product_id) VALUES ('shirt4.png', 18);
insert into product_photos (content, product_id) VALUES ('shirt5.png', 18);
insert into product_photos (content, product_id) VALUES ('pants3.png', 19);
insert into product_photos (content, product_id) VALUES ('pants4.png', 19);
insert into product_photos (content, product_id) VALUES ('pants5.png', 20);
insert into product_photos (content, product_id) VALUES ('pants6.png', 20);
insert into product_photos (content, product_id) VALUES ('pants7.png', 21);
insert into product_photos (content, product_id) VALUES ('pants8.png', 21);
insert into product_photos (content, product_id) VALUES ('computer1.png', 22);
insert into product_photos (content, product_id) VALUES ('computer2.png', 22);
insert into product_photos (content, product_id) VALUES ('computer3.png', 23);
insert into product_photos (content, product_id) VALUES ('computer4.png', 23);
insert into product_photos (content, product_id) VALUES ('computer5.png', 24);
insert into product_photos (content, product_id) VALUES ('computer6.png', 24);
insert into product_photos (content, product_id) VALUES ('phone1.png', 25);
insert into product_photos (content, product_id) VALUES ('phone2.png', 25);
insert into product_photos (content, product_id) VALUES ('phone3.png', 26);
insert into product_photos (content, product_id) VALUES ('phone4.png', 27);
insert into product_photos (content, product_id) VALUES ('phone5.png', 27);
insert into product_photos (content, product_id) VALUES ('wood1.png', 28);
insert into product_photos (content, product_id) VALUES ('wood2.png', 28);
insert into product_photos (content, product_id) VALUES ('wood3.png', 29);
insert into product_photos (content, product_id) VALUES ('wood4.png', 29);
insert into product_photos (content, product_id) VALUES ('wood5.png', 30);
insert into product_photos (content, product_id) VALUES ('wood6.png', 30);

insert into product_photos (content, product_id) VALUES ('bracelet1.png', 31);
insert into product_photos (content, product_id) VALUES ('bracelet2.png', 31);
insert into product_photos (content, product_id) VALUES ('bracelet3.png', 32);
insert into product_photos (content, product_id) VALUES ('bracelet4.png', 32);
insert into product_photos (content, product_id) VALUES ('bracelet5.png', 33);
insert into product_photos (content, product_id) VALUES ('bracelet6.png', 33);
insert into product_photos (content, product_id) VALUES ('robot1.png', 34);
insert into product_photos (content, product_id) VALUES ('robot2.png', 34);
insert into product_photos (content, product_id) VALUES ('robot3.png', 35);
insert into product_photos (content, product_id) VALUES ('robot4.png', 35);
insert into product_photos (content, product_id) VALUES ('robot5.png', 36);
insert into product_photos (content, product_id) VALUES ('robot6.png', 36);

insert into product_photos (content, product_id) VALUES ('perfume1.png', 37);
insert into product_photos (content, product_id) VALUES ('perfume2.png', 38);
insert into product_photos (content, product_id) VALUES ('perfume3.png', 38);
insert into product_photos (content, product_id) VALUES ('perfume4.png', 39);

insert into product_photos (content, product_id) VALUES ('sofa1.png', 40);
insert into product_photos (content, product_id) VALUES ('sofa2.png', 40);
insert into product_photos (content, product_id) VALUES ('sofa3.png', 41);
insert into product_photos (content, product_id) VALUES ('sofa4.png', 41);
insert into product_photos (content, product_id) VALUES ('sofa5.png', 42);
insert into product_photos (content, product_id) VALUES ('sofa6.png', 42);

insert into product_photos (content, product_id) VALUES ('sparep1.png', 43);
insert into product_photos (content, product_id) VALUES ('sparep2.png', 44);
insert into product_photos (content, product_id) VALUES ('sparep3.png', 45);

insert into product_photos (content, product_id) VALUES ('balls1.png', 46);
insert into product_photos (content, product_id) VALUES ('balls2.png', 46);
insert into product_photos (content, product_id) VALUES ('balls3.png', 47);
insert into product_photos (content, product_id) VALUES ('balls4.png', 48);
insert into product_photos (content, product_id) VALUES ('balls5.png', 48);


insert into product_photos (content, product_id) VALUES ('washm1.png', 49);
insert into product_photos (content, product_id) VALUES ('washm2.png', 49);
insert into product_photos (content, product_id) VALUES ('washm3.png', 50);
insert into product_photos (content, product_id) VALUES ('washm4.png', 50);
insert into product_photos (content, product_id) VALUES ('washm5.png', 51);
insert into product_photos (content, product_id) VALUES ('washm6.png', 51);


insert into product_photos (content, product_id) VALUES ('music1.png', 52);
insert into product_photos (content, product_id) VALUES ('music2.png', 52);
insert into product_photos (content, product_id) VALUES ('music3.png', 53);
insert into product_photos (content, product_id) VALUES ('music4.png', 53);
insert into product_photos (content, product_id) VALUES ('music5.png', 54);
insert into product_photos (content, product_id) VALUES ('music6.png', 54);

insert into product_photos (content, product_id) VALUES ('console1.png', 55);
insert into product_photos (content, product_id) VALUES ('console2.png', 55);
insert into product_photos (content, product_id) VALUES ('console3.png', 56);
insert into product_photos (content, product_id) VALUES ('console4.png', 56);
insert into product_photos (content, product_id) VALUES ('console5.png', 57);
insert into product_photos (content, product_id) VALUES ('console6.png', 57);



insert into product_dimensions (product_id, width, height, long, weight) VALUES (1, 7.66, 5, 6, 12);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (2, 17.12, 5, 9, 72);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (3, 16, 19.2, 21.44, 12);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (4, 16, 12, 21, 87);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (5, 7, 5, 6, 12);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (6, 17, 5, 9, 21);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (7, 16.23, 4, 21, 34);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (8, 5, 12, 17, 9);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (9, 7, 5, 6, 12);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (10, 17.12, 5, 9, 76);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (11, 16, 3, 21, 12);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (12, 7.54, 15, 14, 56);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (13, 7.90, 5, 6, 87);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (14, 17, 5.12, 9.09, 33);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (15, 16.54, 8.54, 21, 12);

insert into product_dimensions (product_id, width, height, long, weight) VALUES (16, 16.54, 8.54, 21, 12);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (17, 16.54, 8.54, 21, 12);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (18, 16.54, 8.54, 21, 12);

insert into product_dimensions (product_id, width, height, long, weight) VALUES (19, 16.54, 8.54, 21, 6);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (20, 16.54, 8.54, 21, 8);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (21, 16.54, 8.54, 21, 7);


insert into product_dimensions (product_id, width, height, long, weight) VALUES (22, 16.54, 8.54, 21, 10);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (23, 16.54, 8.54, 21, 11);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (24, 16.54, 8.54, 21, 9);


insert into product_dimensions (product_id, width, height, long, weight) VALUES (25, 4.54, 3.54, 21, 3);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (26, 4.54, 3.54, 21, 4);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (27, 4.54, 3.54, 21, 6);

insert into product_dimensions (product_id, width, height, long, weight) VALUES (28, 4.54, 10.54, 4, 10);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (29, 4.54, 11.54, 6, 9);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (30, 4.54, 14.54, 20, 10);


insert into product_dimensions (product_id, width, height, long, weight) VALUES (31, 1.54, 1.54, 1, 4);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (32, 1.54, 4.54, 2, 3);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (33, 1.54, 2.54, 2, 2);

insert into product_dimensions (product_id, width, height, long, weight) VALUES (34, 4.54, 1.54, 1, 4);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (35, 3.54, 4.54, 2, 3);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (36, 2.54, 6.54, 2, 2);

insert into product_dimensions (product_id, width, height, long, weight) VALUES (37, 5.54, 1.54, 1, 5);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (38, 6.54, 4.54, 2, 4);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (39, 2.54, 6.54, 2, 3);

insert into product_dimensions (product_id, width, height, long, weight) VALUES (40, 183.54, 76.54, 91, 50);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (41, 126.54, 84.54, 62, 40);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (42, 200.54, 83.54, 92.43, 30);


insert into product_dimensions (product_id, width, height, long, weight) VALUES (43, 18.54, 7.54, 10, 20);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (44, 12.54, 4.54, 20, 10);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (45, 20.54, 3.54, 14.43, 10);

insert into product_dimensions (product_id, width, height, long, weight) VALUES (46, 4.54, 7.54, 5, 3);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (47, 2.54, 4.54, 4, 4);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (48, 6.54, 3.54, 6.43, 6);



insert into product_dimensions (product_id, width, height, long, weight) VALUES (49, 24.54, 27.54, 15, 3);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (50, 22.54, 14.54, 24, 4);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (51, 26.54, 23.54, 26.43, 6);

insert into product_dimensions (product_id, width, height, long, weight) VALUES (52, 44.54, 57.54, 25, 43);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (53, 13.54, 14.54, 15, 4);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (54, 6.54, 13.54, 14.43, 6);

insert into product_dimensions (product_id, width, height, long, weight) VALUES (55, 8.54, 6.54, 9, 43);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (56, 6.54, 8.54, 8, 4);
insert into product_dimensions (product_id, width, height, long, weight) VALUES (57, 6.54, 13.54, 11.43, 6);

insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',5,'Me ecanto el producto, maravilloso!','2020-01-25 00:00:00.000000',1,1);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Excelente! Recomendado 100%','2020-01-25 00:00:00.000000',2,2);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',5,'Me ecanto el producto, maravilloso!','2020-01-25 00:00:00.000000',3,3);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Excelente! Recomendado 100%','2020-01-25 00:00:00.000000',4,4);

insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',5,'Me ecanto el producto, maravilloso!','2020-01-25 00:00:00.000000',5,1);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Excelente! Recomendado 100%','2020-01-25 00:00:00.000000',6,2);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',4,'Muy buena la atención! El producto increíble','2020-01-25 00:00:00.000000',7,3);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Just amazing. This product is incredible','2020-01-25 00:00:00.000000',8,4);

insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',5,'Me ecanto el producto, maravilloso!','2020-01-25 00:00:00.000000',9,1);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Excelente! Recomendado 100%','2020-01-25 00:00:00.000000',10,2);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',4,'Muy buena la atención! El producto increíble','2020-01-25 00:00:00.000000',11,3);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Just amazing. This product is incredible','2020-01-25 00:00:00.000000',12,4);

insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',5,'Me ecanto el producto, maravilloso!','2020-01-25 00:00:00.000000',13,1);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Excelente! Recomendado 100%','2020-01-25 00:00:00.000000',14,2);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',4,'Muy buena la atención! El producto increíble','2020-01-25 00:00:00.000000',15,3);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Just amazing. This product is incredible','2020-01-25 00:00:00.000000',16,4);

insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',5,'Me ecanto el producto, maravilloso!','2020-01-25 00:00:00.000000',17,1);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Excelente! Recomendado 100%','2020-01-25 00:00:00.000000',18,2);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',4,'Muy buena la atención! El producto increíble','2020-01-25 00:00:00.000000',19,3);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Just amazing. This product is incredible','2020-01-25 00:00:00.000000',20,4);

insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',5,'Me ecanto el producto, maravilloso!','2020-01-25 00:00:00.000000',21,1);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Excelente! Recomendado 100%','2020-01-25 00:00:00.000000',22,2);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',4,'Muy buena la atención! El producto increíble','2020-01-25 00:00:00.000000',23,3);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Just amazing. This product is incredible','2020-01-25 00:00:00.000000',24,4);

insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',5,'Me ecanto el producto, maravilloso!','2020-01-25 00:00:00.000000',25,1);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Excelente! Recomendado 100%','2020-01-25 00:00:00.000000',26,2);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',4,'Muy buena la atención! El producto increíble','2020-01-25 00:00:00.000000',27,3);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Just amazing. This product is incredible','2020-01-25 00:00:00.000000',28,4);

insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',5,'Me ecanto el producto, maravilloso!','2020-01-25 00:00:00.000000',29,1);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Excelente! Recomendado 100%','2020-01-25 00:00:00.000000',30,2);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',4,'Muy buena la atención! El producto increíble','2020-01-25 00:00:00.000000',31,3);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Just amazing. This product is incredible','2020-01-25 00:00:00.000000',32,4);

insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',5,'Me ecanto el producto, maravilloso!','2020-01-25 00:00:00.000000',33,1);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Excelente! Recomendado 100%','2020-01-25 00:00:00.000000',34,2);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',4,'Muy buena la atención! El producto increíble','2020-01-25 00:00:00.000000',35,3);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Just amazing. This product is incredible','2020-01-25 00:00:00.000000',36,4);

insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',5,'Me ecanto el producto, maravilloso!','2020-01-25 00:00:00.000000',37,1);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Excelente! Recomendado 100%','2020-01-25 00:00:00.000000',38,2);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',4,'Muy buena la atención! El producto increíble','2020-01-25 00:00:00.000000',39,3);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Just amazing. This product is incredible','2020-01-25 00:00:00.000000',40,4);

insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',5,'Me ecanto el producto, maravilloso!','2020-01-25 00:00:00.000000',41,1);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Excelente! Recomendado 100%','2020-01-25 00:00:00.000000',42,2);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',4,'Muy buena la atención! El producto increíble','2020-01-25 00:00:00.000000',43,3);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Just amazing. This product is incredible','2020-01-25 00:00:00.000000',44,4);

insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',5,'Me ecanto el producto, maravilloso!','2020-01-25 00:00:00.000000',45,1);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Excelente! Recomendado 100%','2020-01-25 00:00:00.000000',46,2);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',4,'Muy buena la atención! El producto increíble','2020-01-25 00:00:00.000000',47,3);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Just amazing. This product is incredible','2020-01-25 00:00:00.000000',48,4);

insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',5,'Me ecanto el producto, maravilloso!','2020-01-25 00:00:00.000000',49,1);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Excelente! Recomendado 100%','2020-01-25 00:00:00.000000',50,2);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',4,'Muy buena la atención! El producto increíble','2020-01-25 00:00:00.000000',51,3);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Just amazing. This product is incredible','2020-01-25 00:00:00.000000',52,4);

insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',5,'Me ecanto el producto, maravilloso!','2020-01-25 00:00:00.000000',53,1);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Excelente! Recomendado 100%','2020-01-25 00:00:00.000000',54,2);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-01-25 00:00:00.000000','2020-01-25 00:00:00.000000',4,'Muy buena la atención! El producto increíble','2020-01-25 00:00:00.000000',55,3);
insert into product_ratings(date_creacion,date_modificacion,rating,comment,date,product_id,user_id) values
('2020-02-25 00:00:00.000000','2020-02-25 00:00:00.000000',5,'Just amazing. This product is incredible','2020-01-25 00:00:00.000000',56,4);



insert into categories (name, icon, term) VALUES ('Electronics','fas fa-tv','ELECTRONICS');
insert into categories (name, icon, term) VALUES ('Clothing and Fashion','fas fa-tshirt','CLOTHING_FASHION');
insert into categories (name, icon, term) VALUES ('Carpentry','mdi-axe','CARPENTRY');
insert into categories (name, icon, term) VALUES ('Jewelry','fas fa-gem','JEWELRY');
insert into categories (name, icon, term) VALUES ('Toys','fas fa-bicycle','TOYS');
insert into categories (name, icon, term) VALUES ('Makeup and beauty','fas fa-broom','MAKEUP_BEAUTY');
insert into categories (name, icon, term) VALUES ('Furniture and home','fas fa-couch','FURNITURE_HOME');
insert into categories (name, icon, term) VALUES ('Auto parts','mdi-car-door','AUTO_PARTS');
insert into categories (name, icon, term) VALUES ('Sports','fas fa-futbol','SPORTS');
insert into categories (name, icon, term) VALUES ('Home appliances','fas fa-utensils','HOME_APPLIANCES');
insert into categories (name, icon, term) VALUES ('Music','fas fa-music','MUSIC');
insert into categories (name, icon, term) VALUES ('Videogames','fas fa-gamepad','VIDEOGAMES');
insert into categories (name, icon, term) VALUES ('Others...','mdi-contain','OTHERS');


insert into catalogues (name, description, term, category_id, status_id) VALUES ('Computers', 'Catálogo de Computadoras', 'COMPUTERS', 1,1);
insert into catalogues (name, description, term, category_id, status_id) VALUES ('Smarthphones', 'Catálogo de smarthphones', 'SMARTHPHONES', 1,1);
insert into catalogues (name, description, term, category_id, status_id) VALUES ('Shirt', 'Catálogo de camisas', 'SHIRT', 2,1);
insert into catalogues (name, description, term, category_id, status_id) VALUES ('Pants', 'Catálogo de pantalones', 'PANTS', 2,1);
insert into catalogues (name, description, term, category_id, status_id) VALUES ('Wood', 'Catálogo de maderas', 'WOOD', 3,1);
insert into catalogues (name, description, term, category_id, status_id) VALUES ('Bracelects', 'Catálogo de pulseras', 'BRACELETS', 4,1);
insert into catalogues (name, description, term, category_id, status_id) VALUES ('Robots', 'Catálogo de robots', 'ROBOTS', 5,1);
insert into catalogues (name, description, term, category_id, status_id) VALUES ('Fragrance', 'Catálogo de perfumes', 'FRAGRANCE', 6,1);
insert into catalogues (name, description, term, category_id, status_id) VALUES ('Sofas', 'Catálogo de sofas', 'SOFAS', 7,1);
insert into catalogues (name, description, term, category_id, status_id) VALUES ('Spare parts', 'Catálogo de repuestos', 'SPARE_PARTS', 8,1);
insert into catalogues (name, description, term, category_id, status_id) VALUES ('Balls', 'Catálogo de balones', 'BALLS', 9,1);
insert into catalogues (name, description, term, category_id, status_id) VALUES ('Washing machine', 'Catálogo de lavadoras', 'WASHING_MACHINE', 10,1);
insert into catalogues (name, description, term, category_id, status_id) VALUES ('Music instruments', 'Catálogo de instrumentos musicales', 'MUSIC_INSTRUMENTS', 11,1);
insert into catalogues (name, description, term, category_id, status_id) VALUES ('Consoles', 'Catálogo de consolas', 'CONSOLES', 12,1);

insert into product_catalogues (catalogue_id, product_id) VALUES (1, 1);
insert into product_catalogues (catalogue_id, product_id) VALUES (1, 2);
insert into product_catalogues (catalogue_id, product_id) VALUES (2, 3);
insert into product_catalogues (catalogue_id, product_id) VALUES (3, 4);
insert into product_catalogues (catalogue_id, product_id) VALUES (4, 5);
insert into product_catalogues (catalogue_id, product_id) VALUES (5, 6);
insert into product_catalogues (catalogue_id, product_id) VALUES (6, 7);
insert into product_catalogues (catalogue_id, product_id) VALUES (7, 8);
insert into product_catalogues (catalogue_id, product_id) VALUES (8, 9);
insert into product_catalogues (catalogue_id, product_id) VALUES (9, 10);
insert into product_catalogues (catalogue_id, product_id) VALUES (10, 11);
insert into product_catalogues (catalogue_id, product_id) VALUES (11, 12);
insert into product_catalogues (catalogue_id, product_id) VALUES (12, 13);
insert into product_catalogues (catalogue_id, product_id) VALUES (13, 14);
insert into product_catalogues (catalogue_id, product_id) VALUES (14, 15);

insert into product_catalogues (catalogue_id, product_id) VALUES (3,16);
insert into product_catalogues (catalogue_id, product_id) VALUES (3,17);
insert into product_catalogues (catalogue_id, product_id) VALUES (3,18);

insert into product_catalogues (catalogue_id, product_id) VALUES (4,19);
insert into product_catalogues (catalogue_id, product_id) VALUES (4,20);
insert into product_catalogues (catalogue_id, product_id) VALUES (4,21);

insert into product_catalogues (catalogue_id, product_id) VALUES (1,22);
insert into product_catalogues (catalogue_id, product_id) VALUES (1,23);
insert into product_catalogues (catalogue_id, product_id) VALUES (1,24);

insert into product_catalogues (catalogue_id, product_id) VALUES (2,25);
insert into product_catalogues (catalogue_id, product_id) VALUES (2,26);
insert into product_catalogues (catalogue_id, product_id) VALUES (2,27);

insert into product_catalogues (catalogue_id, product_id) VALUES (5,28);
insert into product_catalogues (catalogue_id, product_id) VALUES (5,29);
insert into product_catalogues (catalogue_id, product_id) VALUES (5,30);


insert into product_catalogues (catalogue_id, product_id) VALUES (6,31);
insert into product_catalogues (catalogue_id, product_id) VALUES (6,32);
insert into product_catalogues (catalogue_id, product_id) VALUES (6,33);

insert into product_catalogues (catalogue_id, product_id) VALUES (7,34);
insert into product_catalogues (catalogue_id, product_id) VALUES (7,35);
insert into product_catalogues (catalogue_id, product_id) VALUES (7,36);

insert into product_catalogues (catalogue_id, product_id) VALUES (8,37);
insert into product_catalogues (catalogue_id, product_id) VALUES (8,38);
insert into product_catalogues (catalogue_id, product_id) VALUES (8,39);

insert into product_catalogues (catalogue_id, product_id) VALUES (9,40);
insert into product_catalogues (catalogue_id, product_id) VALUES (9,41);
insert into product_catalogues (catalogue_id, product_id) VALUES (9,42);

insert into product_catalogues (catalogue_id, product_id) VALUES (10,43);
insert into product_catalogues (catalogue_id, product_id) VALUES (10,44);
insert into product_catalogues (catalogue_id, product_id) VALUES (10,45);
insert into product_catalogues (catalogue_id, product_id) VALUES (11,46);
insert into product_catalogues (catalogue_id, product_id) VALUES (11,47);
insert into product_catalogues (catalogue_id, product_id) VALUES (11,48);


insert into product_catalogues (catalogue_id, product_id) VALUES (12,49);
insert into product_catalogues (catalogue_id, product_id) VALUES (12,50);
insert into product_catalogues (catalogue_id, product_id) VALUES (12,51);

insert into product_catalogues (catalogue_id, product_id) VALUES (13,52);
insert into product_catalogues (catalogue_id, product_id) VALUES (13,53);
insert into product_catalogues (catalogue_id, product_id) VALUES (13,54);

insert into product_catalogues (catalogue_id, product_id) VALUES (14,55);
insert into product_catalogues (catalogue_id, product_id) VALUES (14,56);
insert into product_catalogues (catalogue_id, product_id) VALUES (14,57);



insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (60, 11, 1);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (58, 21, 2);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (50, 34, 3);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (40, 23, 4);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (45, 12, 5);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (63, 45, 6);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (150, 80, 7);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (70, 15, 8);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (95, 32, 9);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (59, 82, 10);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (80, 65, 11);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (90, 43, 12);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (40, 72, 13);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (50, 28, 14);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (70, 29, 15);

insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (40, 72, 16);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (50, 28, 17);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (70, 29, 18);

insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (40, 72, 19);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (50, 28, 20);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (70, 29, 21);


insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (10, 1, 22);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (8, 1, 23);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (6, 1, 24);

insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (10, 1, 25);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (8, 1, 26);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (6, 1, 27);

insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (10, 1, 28);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (8, 1, 29);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (6, 1, 30);



insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (10, 1, 31);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (8, 1, 32);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (6, 1, 33);

insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (10, 1, 34);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (8, 1, 35);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (6, 1, 36);

insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (10, 1, 37);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (8, 1, 38);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (6, 1, 39);

insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (10, 1, 40);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (8, 1, 41);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (6, 1, 42);


insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (10, 1, 43);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (8, 1, 44);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (6, 1, 45);

insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (10, 1, 46);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (8, 1, 47);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (6, 1, 48);



insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (10, 1, 49);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (8, 1, 50);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (6, 1, 51);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (10, 1, 52);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (8, 1, 53);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (6, 1, 54);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (10, 1, 55);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (8, 1, 56);
insert into product_inventories (quantity_available, minimum_quantity_available, product_id) VALUES (6, 1, 57);






insert into offers (name, description, percentage, status_id) VALUES
    ('Semester offer', 'Oferta para los estudiantes como parte del incio del semestre',10,1),
    ('Birth offer', 'Oferta para los estudiantes como parte del fin del semestre',20,1),
    ('Holliday offer', 'Oferta para los estudiantes como parte del mitad del semestre',30,1);
