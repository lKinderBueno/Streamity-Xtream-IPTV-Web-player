-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Creato il: Mag 20, 2020 alle 17:25
-- Versione del server: 10.4.12-MariaDB
-- Versione PHP: 7.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `admin_epg`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `epg_data`
--

CREATE TABLE `epg_data` (
  `epg_id` varchar(70) NOT NULL,
  `start` bigint(20) UNSIGNED NOT NULL,
  `stop` bigint(20) UNSIGNED NOT NULL,
  `title` text NOT NULL,
  `descr` longtext NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `epg_data`
--
ALTER TABLE `epg_data`
  ADD PRIMARY KEY (`epg_id`,`id`),
  ADD UNIQUE KEY `epg_id` (`epg_id`,`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
