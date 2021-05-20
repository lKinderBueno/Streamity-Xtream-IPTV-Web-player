DROP TABLE IF EXISTS `epg_data`;

CREATE TABLE `epg_data` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `start_timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `stop_timestamp` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


ALTER TABLE `epg_data`
  ADD PRIMARY KEY (`id`,`start_timestamp`),
  ADD UNIQUE KEY `id` (`id`,`start_timestamp`),
  ADD UNIQUE KEY `id_2` (`id`,`stop_timestamp`);
COMMIT;
