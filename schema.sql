-- Users Table
CREATE TABLE Users (
    Email NVARCHAR(50) PRIMARY KEY,
    UserPrincipalName NVARCHAR(100) NOT NULL,
    Surname NVARCHAR(50) NOT NULL,
    Id NVARCHAR(100) NOT NULL,
    GivenName NVARCHAR(50) NOT NULL,
    LicenseNumber NVARCHAR(50) NOT NULL,
    Role NVARCHAR(50) NOT NULL,
);
-- Mocks test user to the Users table
INSERT INTO Users (
        Email,
        UserPrincipalName,
        Surname,
        Id,
        GivenName,
        LicenseNumber,
        Role
    )
VALUES (
        'john.doe@example.com',
        '8405b387-929b-460f-ac89-5387a1b287d0@digicupexternaltenant.onmicrosoft.com',
        'Doe',
        '8405b387-929b-460f-ac89-5357a1b288d0',
        'John',
        'PC 1234-OL-12',
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