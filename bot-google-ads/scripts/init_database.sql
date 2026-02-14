-- =============================================
-- Script de Inicialização do Banco de Dados
-- Bot Google Ads - Flávia Capacia Corretora
-- =============================================

USE flaviacapacia;
GO

-- =============================================
-- Tabela: Imoveis (se não existir)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Imoveis')
BEGIN
    CREATE TABLE Imoveis (
        id INT PRIMARY KEY IDENTITY(1,1),
        titulo NVARCHAR(255) NOT NULL,
        tipo NVARCHAR(50) NOT NULL,
        preco DECIMAL(18,2) NOT NULL,
        localizacao NVARCHAR(500),
        bairro NVARCHAR(100),
        cidade NVARCHAR(100),
        estado NVARCHAR(2),
        cep NVARCHAR(10),
        quartos INT,
        banheiros INT,
        suites INT,
        area DECIMAL(10,2),
        area_construida DECIMAL(10,2),
        vagas INT,
        descricao NVARCHAR(MAX),
        caracteristicas NVARCHAR(MAX),
        diferenciais NVARCHAR(MAX),
        condominio DECIMAL(10,2),
        iptu DECIMAL(10,2),
        status NVARCHAR(20) DEFAULT 'ativo',
        imagem_principal NVARCHAR(500),
        imagens NVARCHAR(MAX),
        video_url NVARCHAR(500),
        tour_virtual_url NVARCHAR(500),
        criado_em DATETIME DEFAULT GETDATE(),
        atualizado_em DATETIME DEFAULT GETDATE()
    );
    
    PRINT '✅ Tabela Imoveis criada com sucesso';
END
ELSE
BEGIN
    PRINT 'ℹ️ Tabela Imoveis já existe';
END
GO

-- =============================================
-- Tabela: Ads (Anúncios)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Ads')
BEGIN
    CREATE TABLE Ads (
        id INT PRIMARY KEY IDENTITY(1,1),
        imovel_id INT NOT NULL,
        campaign_type NVARCHAR(50) NOT NULL DEFAULT 'search',
        headlines NVARCHAR(MAX) NOT NULL,
        descriptions NVARCHAR(MAX) NOT NULL,
        keywords NVARCHAR(MAX) NOT NULL,
        audience NVARCHAR(MAX),
        budget DECIMAL(10,2),
        status NVARCHAR(20) DEFAULT 'draft',
        google_ads_id NVARCHAR(100),
        criado_em DATETIME DEFAULT GETDATE(),
        atualizado_em DATETIME DEFAULT GETDATE(),
        publicado_em DATETIME,
        
        CONSTRAINT FK_Ads_Imoveis FOREIGN KEY (imovel_id) 
            REFERENCES Imoveis(id) ON DELETE CASCADE
    );
    
    -- Índices para performance
    CREATE INDEX IX_Ads_ImovelId ON Ads(imovel_id);
    CREATE INDEX IX_Ads_Status ON Ads(status);
    CREATE INDEX IX_Ads_CriadoEm ON Ads(criado_em DESC);
    
    PRINT '✅ Tabela Ads criada com sucesso';
END
ELSE
BEGIN
    PRINT 'ℹ️ Tabela Ads já existe';
END
GO

-- =============================================
-- Tabela: AdPerformance (Métricas de Performance)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AdPerformance')
BEGIN
    CREATE TABLE AdPerformance (
        id INT PRIMARY KEY IDENTITY(1,1),
        ad_id INT NOT NULL,
        data DATE NOT NULL,
        impressoes INT DEFAULT 0,
        cliques INT DEFAULT 0,
        ctr DECIMAL(5,2) DEFAULT 0,
        custo DECIMAL(10,2) DEFAULT 0,
        conversoes INT DEFAULT 0,
        custo_por_conversao DECIMAL(10,2) DEFAULT 0,
        criado_em DATETIME DEFAULT GETDATE(),
        
        CONSTRAINT FK_AdPerformance_Ads FOREIGN KEY (ad_id) 
            REFERENCES Ads(id) ON DELETE CASCADE,
        CONSTRAINT UQ_AdPerformance_AdData UNIQUE (ad_id, data)
    );
    
    -- Índices para performance
    CREATE INDEX IX_AdPerformance_AdId ON AdPerformance(ad_id);
    CREATE INDEX IX_AdPerformance_Data ON AdPerformance(data DESC);
    
    PRINT '✅ Tabela AdPerformance criada com sucesso';
END
ELSE
BEGIN
    PRINT 'ℹ️ Tabela AdPerformance já existe';
END
GO

-- =============================================
-- Tabela: BlogPosts (Cache de Posts do Blog)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'BlogPosts')
BEGIN
    CREATE TABLE BlogPosts (
        id INT PRIMARY KEY IDENTITY(1,1),
        titulo NVARCHAR(500) NOT NULL,
        url NVARCHAR(500) NOT NULL,
        conteudo NVARCHAR(MAX),
        keywords NVARCHAR(MAX),
        scraped_at DATETIME DEFAULT GETDATE(),
        
        CONSTRAINT UQ_BlogPosts_Url UNIQUE (url)
    );
    
    -- Índice para performance
    CREATE INDEX IX_BlogPosts_ScrapedAt ON BlogPosts(scraped_at DESC);
    
    PRINT '✅ Tabela BlogPosts criada com sucesso';
END
ELSE
BEGIN
    PRINT 'ℹ️ Tabela BlogPosts já existe';
END
GO

-- =============================================
-- Dados de Exemplo (Opcional)
-- =============================================
-- Insere alguns imóveis de exemplo se a tabela estiver vazia
IF NOT EXISTS (SELECT * FROM Imoveis)
BEGIN
    INSERT INTO Imoveis (titulo, tipo, preco, bairro, cidade, estado, quartos, banheiros, area, descricao, status)
    VALUES 
    ('Apartamento Moderno na Agronômica', 'Apartamento', 850000.00, 'Agronômica', 'Florianópolis', 'SC', 3, 2, 120.00, 
     'Excelente apartamento em uma das regiões mais valorizadas de Florianópolis. Próximo a tudo: comércio, serviços, escolas e praias.',
     'ativo'),
    ('Cobertura Duplex no Centro', 'Cobertura', 1200000.00, 'Centro', 'Florianópolis', 'SC', 4, 3, 200.00,
     'Cobertura duplex com vista panorâmica para o mar. Acabamento de alto padrão, piscina privativa.',
     'ativo'),
    ('Casa em Condomínio Fechado', 'Casa', 750000.00, 'Kobrasol', 'São José', 'SC', 3, 2, 180.00,
     'Casa em condomínio fechado com toda segurança e infraestrutura. Área de lazer completa.',
     'ativo');
    
    PRINT '✅ Dados de exemplo inseridos';
END
GO

-- =============================================
-- Views Úteis
-- =============================================

-- View: Resumo de Anúncios
IF OBJECT_ID('vw_AdsResumo', 'V') IS NOT NULL
    DROP VIEW vw_AdsResumo;
GO

CREATE VIEW vw_AdsResumo AS
SELECT 
    a.id as ad_id,
    a.imovel_id,
    i.titulo as imovel_titulo,
    i.tipo as imovel_tipo,
    i.bairro,
    i.cidade,
    a.campaign_type,
    a.status,
    a.budget,
    a.google_ads_id,
    a.criado_em,
    a.publicado_em,
    ISNULL(SUM(p.impressoes), 0) as total_impressoes,
    ISNULL(SUM(p.cliques), 0) as total_cliques,
    ISNULL(SUM(p.custo), 0) as total_custo,
    ISNULL(SUM(p.conversoes), 0) as total_conversoes
FROM Ads a
JOIN Imoveis i ON a.imovel_id = i.id
LEFT JOIN AdPerformance p ON a.id = p.ad_id
GROUP BY 
    a.id, a.imovel_id, i.titulo, i.tipo, i.bairro, i.cidade,
    a.campaign_type, a.status, a.budget, a.google_ads_id,
    a.criado_em, a.publicado_em;
GO

PRINT '✅ View vw_AdsResumo criada com sucesso';
GO

-- =============================================
-- Stored Procedures
-- =============================================

-- SP: Atualizar Performance de Anúncio
IF OBJECT_ID('sp_AtualizarPerformance', 'P') IS NOT NULL
    DROP PROCEDURE sp_AtualizarPerformance;
GO

CREATE PROCEDURE sp_AtualizarPerformance
    @ad_id INT,
    @data DATE,
    @impressoes INT,
    @cliques INT,
    @custo DECIMAL(10,2),
    @conversoes INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @ctr DECIMAL(5,2);
    DECLARE @custo_por_conversao DECIMAL(10,2);
    
    -- Calcula CTR
    IF @impressoes > 0
        SET @ctr = (@cliques * 100.0) / @impressoes;
    ELSE
        SET @ctr = 0;
    
    -- Calcula custo por conversão
    IF @conversoes > 0
        SET @custo_por_conversao = @custo / @conversoes;
    ELSE
        SET @custo_por_conversao = 0;
    
    -- Insere ou atualiza
    MERGE AdPerformance AS target
    USING (SELECT @ad_id as ad_id, @data as data) AS source
    ON target.ad_id = source.ad_id AND target.data = source.data
    WHEN MATCHED THEN
        UPDATE SET 
            impressoes = @impressoes,
            cliques = @cliques,
            ctr = @ctr,
            custo = @custo,
            conversoes = @conversoes,
            custo_por_conversao = @custo_por_conversao
    WHEN NOT MATCHED THEN
        INSERT (ad_id, data, impressoes, cliques, ctr, custo, conversoes, custo_por_conversao)
        VALUES (@ad_id, @data, @impressoes, @cliques, @ctr, @custo, @conversoes, @custo_por_conversao);
END;
GO

PRINT '✅ Stored Procedure sp_AtualizarPerformance criada com sucesso';
GO

-- =============================================
-- Triggers
-- =============================================

-- Trigger: Atualizar data de modificação em Ads
IF OBJECT_ID('tr_Ads_Update', 'TR') IS NOT NULL
    DROP TRIGGER tr_Ads_Update;
GO

CREATE TRIGGER tr_Ads_Update
ON Ads
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Ads
    SET atualizado_em = GETDATE()
    FROM Ads a
    INNER JOIN inserted i ON a.id = i.id;
END;
GO

PRINT '✅ Trigger tr_Ads_Update criado com sucesso';
GO

-- Trigger: Atualizar data de modificação em Imoveis
IF OBJECT_ID('tr_Imoveis_Update', 'TR') IS NOT NULL
    DROP TRIGGER tr_Imoveis_Update;
GO

CREATE TRIGGER tr_Imoveis_Update
ON Imoveis
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Imoveis
    SET atualizado_em = GETDATE()
    FROM Imoveis i
    INNER JOIN inserted ins ON i.id = ins.id;
END;
GO

PRINT '✅ Trigger tr_Imoveis_Update criado com sucesso';
GO

-- =============================================
-- Resumo Final
-- =============================================
PRINT '';
PRINT '==============================================';
PRINT '✅ Script de inicialização concluído!';
PRINT '==============================================';
PRINT '';
PRINT 'Tabelas criadas:';
PRINT '  ✓ Imoveis';
PRINT '  ✓ Ads';
PRINT '  ✓ AdPerformance';
PRINT '  ✓ BlogPosts';
PRINT '';
PRINT 'Views criadas:';
PRINT '  ✓ vw_AdsResumo';
PRINT '';
PRINT 'Stored Procedures criadas:';
PRINT '  ✓ sp_AtualizarPerformance';
PRINT '';
PRINT 'Triggers criados:';
PRINT '  ✓ tr_Ads_Update';
PRINT '  ✓ tr_Imoveis_Update';
PRINT '';
PRINT '==============================================';
GO
