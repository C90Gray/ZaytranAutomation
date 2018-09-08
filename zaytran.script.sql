USE [master]
GO
/****** Object:  Database [ZaytranAutomation]    Script Date: 9/8/2018 9:30:26 AM ******/
CREATE DATABASE [ZaytranAutomation]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'ZaytranAutomation', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\ZaytranAutomation.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'ZaytranAutomation_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\ZaytranAutomation_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [ZaytranAutomation] SET COMPATIBILITY_LEVEL = 140
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [ZaytranAutomation].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [ZaytranAutomation] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [ZaytranAutomation] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [ZaytranAutomation] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [ZaytranAutomation] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [ZaytranAutomation] SET ARITHABORT OFF 
GO
ALTER DATABASE [ZaytranAutomation] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [ZaytranAutomation] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [ZaytranAutomation] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [ZaytranAutomation] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [ZaytranAutomation] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [ZaytranAutomation] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [ZaytranAutomation] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [ZaytranAutomation] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [ZaytranAutomation] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [ZaytranAutomation] SET  DISABLE_BROKER 
GO
ALTER DATABASE [ZaytranAutomation] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [ZaytranAutomation] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [ZaytranAutomation] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [ZaytranAutomation] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [ZaytranAutomation] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [ZaytranAutomation] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [ZaytranAutomation] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [ZaytranAutomation] SET RECOVERY FULL 
GO
ALTER DATABASE [ZaytranAutomation] SET  MULTI_USER 
GO
ALTER DATABASE [ZaytranAutomation] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [ZaytranAutomation] SET DB_CHAINING OFF 
GO
ALTER DATABASE [ZaytranAutomation] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [ZaytranAutomation] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [ZaytranAutomation] SET DELAYED_DURABILITY = DISABLED 
GO
EXEC sys.sp_db_vardecimal_storage_format N'ZaytranAutomation', N'ON'
GO
ALTER DATABASE [ZaytranAutomation] SET QUERY_STORE = OFF
GO
USE [ZaytranAutomation]
GO
ALTER DATABASE SCOPED CONFIGURATION SET IDENTITY_CACHE = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION SET LEGACY_CARDINALITY_ESTIMATION = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET LEGACY_CARDINALITY_ESTIMATION = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 0;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET MAXDOP = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET PARAMETER_SNIFFING = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET QUERY_OPTIMIZER_HOTFIXES = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET QUERY_OPTIMIZER_HOTFIXES = PRIMARY;
GO
USE [ZaytranAutomation]
GO
/****** Object:  Table [dbo].[Grippers]    Script Date: 9/8/2018 9:30:26 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Grippers](
	[GripperID] [int] IDENTITY(1,1) NOT NULL,
	[GripperName] [nvarchar](50) NOT NULL,
	[Stroke (in)] [nvarchar](50) NOT NULL,
	[Force ID] [float] NOT NULL,
	[Force OD] [float] NOT NULL,
	[Ma] [int] NOT NULL,
	[Mb/Mc] [int] NOT NULL,
	[Price] [int] NOT NULL,
 CONSTRAINT [PK_Grippers] PRIMARY KEY CLUSTERED 
(
	[GripperID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Grippers] ON 

INSERT [dbo].[Grippers] ([GripperID], [GripperName], [Stroke (in)], [Force ID], [Force OD], [Ma], [Mb/Mc], [Price]) VALUES (1, N'MAGNUM-PET-130', N'.5 to 1.0 inches', 29, 29, 88, 88, 500)
INSERT [dbo].[Grippers] ([GripperID], [GripperName], [Stroke (in)], [Force ID], [Force OD], [Ma], [Mb/Mc], [Price]) VALUES (2, N'MAGNUM-AL-130', N'.5 to 1.0 inches', 29, 29, 212, 141, 400)
INSERT [dbo].[Grippers] ([GripperID], [GripperName], [Stroke (in)], [Force ID], [Force OD], [Ma], [Mb/Mc], [Price]) VALUES (3, N'MAGNUM-AL-450-26', N'1.02 inches', 100, 100, 840, 530, 630)
INSERT [dbo].[Grippers] ([GripperID], [GripperName], [Stroke (in)], [Force ID], [Force OD], [Ma], [Mb/Mc], [Price]) VALUES (4, N'GPAL-40', N'2 inches', 132, 176, 295, 302, 599)
INSERT [dbo].[Grippers] ([GripperID], [GripperName], [Stroke (in)], [Force ID], [Force OD], [Ma], [Mb/Mc], [Price]) VALUES (5, N'GPAL-100', N'3 inches', 196, 230, 648, 1080, 849)
INSERT [dbo].[Grippers] ([GripperID], [GripperName], [Stroke (in)], [Force ID], [Force OD], [Ma], [Mb/Mc], [Price]) VALUES (6, N'GPAL-200', N'4 inches', 364, 443, 1095, 1825, 1499)
INSERT [dbo].[Grippers] ([GripperID], [GripperName], [Stroke (in)], [Force ID], [Force OD], [Ma], [Mb/Mc], [Price]) VALUES (7, N'XRAY-S-2200', N'7.87 to 13.77 inches', 495, 590, 5712, 5400, 2700)
INSERT [dbo].[Grippers] ([GripperID], [GripperName], [Stroke (in)], [Force ID], [Force OD], [Ma], [Mb/Mc], [Price]) VALUES (8, N'GP or GPL-400', N'2.5 to 6 inches', 503.5, 636.2, 1743, 2905, 1947)
INSERT [dbo].[Grippers] ([GripperID], [GripperName], [Stroke (in)], [Force ID], [Force OD], [Ma], [Mb/Mc], [Price]) VALUES (9, N'XRAY-S-5800', N'7.87 inches', 1300, 1300, 11400, 7200, 5700)
INSERT [dbo].[Grippers] ([GripperID], [GripperName], [Stroke (in)], [Force ID], [Force OD], [Ma], [Mb/Mc], [Price]) VALUES (10, N'Req Force Too High', N'100000', 100000, 100000, 100000, 100000, 100000)
INSERT [dbo].[Grippers] ([GripperID], [GripperName], [Stroke (in)], [Force ID], [Force OD], [Ma], [Mb/Mc], [Price]) VALUES (11, N'Req Torque Too High', N'100000', 100000, 100000, 100000, 100000, 100000)
SET IDENTITY_INSERT [dbo].[Grippers] OFF
USE [master]
GO
ALTER DATABASE [ZaytranAutomation] SET  READ_WRITE 
GO
