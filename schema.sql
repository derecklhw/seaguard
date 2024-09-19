-- Users Table
CREATE TABLE Users (
  Email NVARCHAR(50) PRIMARY KEY,
  UserPrincipalName NVARCHAR(100) NOT NULL,
  Surname NVARCHAR(50) NOT NULL,
  Id NVARCHAR(100) NOT NULL,
  GivenName NVARCHAR(50) NOT NULL,
  Role NVARCHAR(50) NOT NULL,
);
-- Mocks a test skipper to the Users table
INSERT INTO Users (
    Email,
    UserPrincipalName,
    Surname,
    Id,
    GivenName,
    Role
  )
VALUES (
    'john.doe@example.com',
    '8405b387-929b-460f-ac89-5387a1b287d0@digicupexternaltenant.onmicrosoft.com',
    'Doe',
    '8405b387-929b-460f-ac89-5357a1b288d0',
    'John',
    'Skipper'
  );
-- Documents Table
CREATE TABLE Documents (
  Id INT IDENTITY(1, 1) PRIMARY KEY,
  Title NVARCHAR(255) NOT NULL,
  Content NVARCHAR(MAX) NOT NULL,
  Type NVARCHAR(50) NOT NULL,
  UserEmail NVARCHAR(50) NOT NULL,
  CONSTRAINT FK_Documents_Users FOREIGN KEY (UserEmail) REFERENCES Users(Email)
);
-- Mocks a formation in document table
INSERT INTO Documents (
    Title,
    Content,
    Type,
    UserEmail
  )
VALUES (
    'WHALE UP! FORMATION OPERATEURS - Août 2022',
    'WHALE UP! FORMATION OPERATEURS - Août 2022
      Tourism Authority (Dolphin and Whale Watching) Regulations 2012
      GN No. 154 of 2012
      Government Gazette of Mauritius No. 87 of 1 September 2012
      THE TOURISM AUTHORITY ACT Regulations made by the Minister under section 129 of the Tourism Authority Act
      No waiting
      1
      1
      1 w speed from 300 m
      metres
      1
      1
      1
      Only
      1
      approach to
      100
      200 metres if calf is
      metres
      1
      if only
      1
      adult
      present. 1
      1
      1
      1
      100
      1
      1
      No approach 200 m
      10
      300 m
      
      WHALE UP!
      · Session 1 : observation durable des baleines à bosse
      - Bases de biologie des cétacés
      - Ecologie des baleines à bosse
      - Menaces et risques
      - Règles d approche et d observation :unselected: :unselected: :unselected: :unselected:
      WHALE UP! 1-Bases de biologie
      Evolution d un ancien mammifère Mesonyx 55 MA Mesyonx Ambulocetus 50 MA Basilosaurus 40 MA 9 Basilosaurus Delphinidae 25 MA Anatomie d une baleine
      Aileron dorsal
      Events
      Rostre
      Oreille
      Nageoire caudale
      Nageoire pectorale
      Sillons ventraux
      Oeil
      Fanons
      Nageoire pectorale
      LA BALEINE A BOSSE EST UN MAMMIFÈRE PARCE QUE ...
      ... il y a un accouchement d un bébé vivant •....elles allaitent leurs petits :selected:...elles n ont pas de branchies • et respirent avec des poumons :selected:
      Les dauphins & baleines = mammifères marins
      Physiologie externe: -Position des nageoires -Peau
      Physiologie interne: -Système respiratoire -Système de reproduction
      La reproduction des cétacés
      · Espérance d âge: variable selon les espèces (20ans à plus de 60 ans) · Maturité sexuelle tardive chez les femelles · Gestation longue (entre 11 et 12 mois) · Un petit par portée · Allaitement au moins 2 ans · Soins aux petits / éducation Les Cétacés Les Dugongs Les mammifères marins Les Siréniens FANONS Les Mysticètes EVENTS Les Odontocetes DENTS ® :unselected: Les baleines à bosse Baleines à bosse Humpback whale Megaptera novaeangliae Anatomie Évent double Nageoire dorsale Front Crête dorsale Rostre Pédoncule caudal Fanons Nombril Anus Glandes mammaires Aisselle Fente uro - génitale Sillons gulaires (uniquement chez les rorquals) Nageoire caudale Échancrure médiane Nageoires pectorales Adaptations à la nage (+ pression, froid...): réduire les frottements et augmenter la puissance musculaire > système circulatoire,
        peau,
        membres,
        La respiration · Les baleines respirent avec les poumons · L évent -> trachea -> poumons
      Apnée: elle plonge jusqu à 200 mètres de profondeur où elle reste en apnée pendant 10 à 40 minutes.Le souffle Ce n est pas un jet d eau ! Mais des gouttelettes d eau pulvérisées au moment de l expiration,
        quand l évent s ouvre.Rorqual commun Rorqual bleu Rorqual à bosse Cachalot Baleine noire Petit rorqual :unselected: La nutrition · Baleine adulte: 2T de plancton et krill par jour · Baleineau: 200 litres de lait par jour Filtration grâce aux fanons Fanons de Mégaptère Photo Brandon D.Cole 1 Ellis Nature Photography Photo Todtri Productions 1 2 L allaitement des petits
      Allaitement pendant 5 à 7 mois > plus de 200L/jour
      Fréquence de l allaitement: la baleine allaite entre 15 et 55 secondes,
        avec une moyenne proche de 30 secondes.Au cours de sa première année,
        le baleineau ne peut rester sous l eau que quelques minutes. Il doit souvent revenir à la surface pour respirer. C est pourquoi l allaitement se déroule généralement juste en dessous de la surface.
      Etudes de comportements mères/baleineaux:
      . https://youtu.be/EUcMuUBMYJc
      Les migrations :selected:
      les zones d alimentation :unselected: :selected: les zones de reproduction 0 Les menaces pendant les migrations: https: // youtu.be / 16NHXOtGEo :selected: Que font - elles à Maurice ? ? Etude des voies migratoires dans l océan indien:
      . https://youtu.be/ Ep6TfS1eWA?list=TLGGCtmapn_LNssyMDA4MjAyMg
      Période de reproduction: mise bas, accouplement, soin aux petits ...
      0 Haute vulnérabilité des mères! :unselected:
      - Les mères ne se nourrissent pas
      - Epuisement après 6000km de voyage, suivi d un voyage retour...- Allaitement: 500L de lait / jour,
        toutes les 15 / 20 min - Harcèlement des mâles 0 :unselected: Haute vulnérabilité des baleineaux: - Nouveaux - nés,
        difficultés de nage et de respiration,
        vulnérables aux prédateurs...:unselected: :unselected: :unselected: La communication - Les sauts: dispersion des sons à plus de 5 km - Frappes de nageoires (pectorales et caudales) - Les chants: production sonore par le larynx,
        avec un vibreur appelé U - folds homoloque aux cordes vocales · son chant de basse fréquence peut voyager jusqu à plus de 3.000 kilomètres
      · peuvent atteindre facilement les 190 db
      Le chant est émis uniquement par les mâles dans un but de reproduction; il est le plus structuré et complexe des chants des cétacés.
      Etudes acoustiques: pour étudier la connectivité
      (1) Analyse des chants des baleines à bosse dans l océan indien - YouTube Quand la communication est perturbée Dangers du bruit sous - marin: - Navires - Prospection pétrolières - Ondes sismiques :unselected: Désorientation,
        Echouages :unselected: Séparation des individus (mères / petits) Les règles d observation
      GOOD CODE OF CONDUCT
      100 m 100 m
      300 m
      Keep a slow pace and calm and constant progress from the moment cetaceans are spotted, particularly within the 300 m zone.
      No approach nearer than 100 m for any cetacean.
      Only one boat within the 300 m zone.
      The observation time is limited to 30 min or to 15 min if other boats are waiting.
      Never try to touch, feed or swim with a cetacean. :unselected:
      Area of vigilance :unselected: Forbidden area
      No waiting
      0
      /
      1
      1
      1 Only approach to 200 metres 1 if calf is present. 1
      1 1 1 I 1 1 N speed from 300 me
      1
      100 metres if only adult
      1 1
      100
      No approach 200 m
      300 m :selected: :selected:
      GUIDELINES - ce qu il faut faire · Gardez une distance d au moins 100m avec les baleines
      · L approche et le départ doivent se faire parallèlement au groupe des baleines,
        à vitesse réduite (5 knots) et constante · Arrêter toute activité une heure avant le coucher du soleil V :selected: GUIDELINES - ce qu il ne faut pas faire
      . Couper la route des baleines
      · Arriver de face ou par l arrière du groupe ou l encercler
      · Pousser les baleines vers les récifs
      · Séparer les mères de leur petit :selected: :selected: :selected:
      Les méthodes utilisées pour l étude des baleines: La photoidentification > Etude des populations Le suivi satellitaire > Les voies migratoires L étude acoustique > La connectivité
      Ressources
      5 C
      .
      https://iwc.int/fr/
      INTERNATIONAL WHALING COMMISSION
      COMMISSION
      BALEINES
      PRÉSERVATION & GESTION
      RECHERCHE SCIENTIFIQUE
      MEETINGS & EVENTS
      RESOURCES & MEDIA
      EN ES FR
      La Commission Baleinière Internationale (CBI)
      La Commission Baleinière Internationale est l organisme mondial chargé de la conservation des baleines et de la gestion de la chasse à la baleine.La CBI a actuellement 88 gouvernements de pays du monde entier.Outre le suivi des limites de capture de baleines,
        la Commission s efforce de promouvoir le rétablissement des populations de baleines épuisées en s attaquant à une série de problèmes spécifiques.Il s agit notamment des collisions avec des navires, des événements d enchevêtrement,
        des préoccupations environnementales et de l établissement de protocoles d observation des baleines.LATEST NEWS
        FROM THE IWC: < Scientific Committee Implementation Review workshop 25 mai 2022 Members of the IWC Scientific Committee are meeting to assess new information on specific whale...> read more > news archive > Dans la région: Consortium INDOCET IndoCet Le Consortium Les Membres La Recherche Les Collaborations Projets régionaux Ressources Actualités Accès membre En savoir + Recherche collaborative dans l océan indien sud-ouest
      Accès aux publications
      Boîte de Q globice :
      Espace E
      cycle-3-2
      commiss cycle-2.p Q
      CBI | Con :unselected: Home | V PDF
      IWC-Fact|
      Q indocet :
      IC
      http X
      Abundan + :selected: X
      5
      C
      https://indocet.org/la-recherche/publications/
      A"
      IndoCet
      Le Consortium
      Les Membres
      La Recherche
      Les Collaborations
      Projets régionaux
      Ressources
      Actualités
      described for the Arabian Sea and Western Indian Ocean
      D, Collins T, Minton G, Rasoloarijao T, Rogers T, Sarrouf Willson M. 2020. A new blue whale song-type described for the Arabian Sea and Western Indian Ocean. Endangered Species Research 43: 495-515. Link to the journal
      2020
      Peer-reviewed journal
      C scer Accès membre
      Abundance and site fidelity of bottlenose dolphins off a remote oceanic island (Reunion, southwest Indian Ocean).
      Estrade V, Dulau V. 2020. Abundance and site fidelity of bottlenose dolphins off a remote oceanic island (Reunion, southwest Indian Ocean). Marine Mammal Science, 2020:1-26. https://doi.org/10.1111/mms.12693 Link to the journal
      2020
      Peer-reviewed journal
      Vanessa Estrade vanessa.estrade@globice.org
      Abundance of the Indo-Pacific bottlenose dolphin Tursiops aduncus off south-west Mauritius
      Webster I, Cockcroft VG & Cadinouche A (2014): Abundance of the Indo- Pacific bottlenose dolphin Tursiops aduncus off south-west Mauritius, African Journal of Marine Science 36(3). DOI: 10.2989/1814232X.2014.946448 Link to the journal
      2014
      Peer-reviewed journal
      Imogen Webster jipperim.orca@gmail.com
      Aspects of habitat use of Stenella longirostris and Tursiops aduncus within the Dolphin Watching zone on the West Coast of Mauritius
      Cadinouche A, Webster I, & Cockcroft V. Aspects of habitat use of Stenella longirostris and Tursiops aduncus within the Dolphin Watching zone on the West Coast of Mauritius ._ x000D_ Link to the journal
      Imogen Webster jipperim.orca@gmail.com
      Assessment of the Conservation Status of the Indian Ocean Humpback Dolphin (Sousa plumbea) I lainathallIr Al Dad lint Pritaria
      Braulik, G. T., Findlay, K., Cerchio, S., & Baldwin, R. (2015). Chapter Five - Assessment of the Conservation Status of the Indian Ocean Humpback Dolphin (Sousa plumbea) Using the IUCN Red List Criteria. In T. A. Jefferson CD P. C.iva.ltda Aduanas in Marina Dialamo /Val 77 un 140 1411.
      2015
      Peer-reviewed journal
      Braulik, Gill .. :unselected: :selected: :selected:',
    'Formation',
    'john.doe@example.com'
  );
-- BoatTracker Table
CREATE TABLE BoatTracker (
  Id INT IDENTITY(1, 1) PRIMARY KEY,
  userEmail NVARCHAR(50) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  startTime TEXT NOT NULL,
  endTime TEXT NOT NULL,
  markerId INT NOT NULL CONSTRAINT FK_BoatTracker_Users FOREIGN KEY (userEmail) REFERENCES Users(Email)
);
-- Licensee Table
CREATE TABLE Licensee (
  RegistrationNo NVARCHAR(50) PRIMARY KEY,
  Licensee NVARCHAR(50) NOT NULL,
  Address NVARCHAR(255) NOT NULL,
  MooringPlace NVARCHAR(255) NOT NULL,
  ReceiptNo NVARCHAR(50) NOT NULL,
  DateIssued DATETIME NOT NULL,
  UserEmail NVARCHAR(50) NOT NULL,
  CONSTRAINT FK_Licensee_Users FOREIGN KEY (UserEmail) REFERENCES Users(Email)
);
-- Mocks a licensee in the Licensee table
INSERT INTO Licensee (
    RegistrationNo,
    Licensee,
    Address,
    MooringPlace,
    ReceiptNo,
    DateIssued,
    UserEmail
  )
VALUES (
    'PC 1234-OL-12',
    'John Doe',
    '123, Main Street, Port Louis',
    'Grand Baie',
    '123456789',
    '2024-09-16',
    'john.doe@example.com'
  );
-- Videos Table
CREATE TABLE Videos (
  VideoId INT PRIMARY KEY IDENTITY,
  Title NVARCHAR(255),
  BlobUrl NVARCHAR(2048),
  FilePath NVARCHAR(MAX),
  Captions NVARCHAR(MAX),
  Creole NVARCHAR(MAX),
  English NVARCHAR(MAX),
  French NVARCHAR(MAX),
  Summary NVARCHAR(MAX),
  UploadDate DATETIME DEFAULT GETDATE()
);
-- VideoAnalysisResults Table
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO CREATE TABLE [dbo].[VideoAnalysisResults](
    [Id] [nvarchar](50) NOT NULL,
    [AccountId] [nvarchar](50) NULL,
    [Name] [nvarchar](255) NULL,
    [UserName] [nvarchar](255) NULL,
    [Created] [datetimeoffset](7) NULL,
    [DurationInSeconds] [float] NULL,
    [Duration] [nvarchar](50) NULL,
    [PrivacyMode] [nvarchar](50) NULL,
    [State] [nvarchar](50) NULL,
    [VideoId] [nvarchar](50) NULL,
    [ThumbnailId] [nvarchar](50) NULL,
    [Insights] [nvarchar](max) NULL,
    [Keywords] [nvarchar](max) NULL,
    [Captions] [nvarchar](max) NULL,
    [SummarizedInsights] [nvarchar](max) NULL,
    [Creole] [nvarchar](max) NULL,
    [English] [nvarchar](max) NULL,
    [French] [nvarchar](max) NULL
  ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
ALTER TABLE [dbo].[VideoAnalysisResults]
ADD PRIMARY KEY CLUSTERED ([Id] ASC) WITH (
    STATISTICS_NORECOMPUTE = OFF,
    IGNORE_DUP_KEY = OFF,
    ONLINE = OFF,
    OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
  ) ON [PRIMARY]
GO