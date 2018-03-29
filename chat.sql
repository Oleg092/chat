-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Июл 21 2017 г., 15:39
-- Версия сервера: 5.7.19-0ubuntu0.16.04.1
-- Версия PHP: 7.0.18-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `chat`
--

-- --------------------------------------------------------

--
-- Структура таблицы `albom`
--

CREATE TABLE `albom` (
  `id_albom` int(15) NOT NULL,
  `name_albom` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `id_user_own` int(11) NOT NULL,
  `additional_data` varchar(200) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `black_list`
--

CREATE TABLE `black_list` (
  `id` int(15) NOT NULL,
  `id_own` int(11) NOT NULL,
  `id_block` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Дамп данных таблицы `black_list`
--

INSERT INTO `black_list` (`id`, `id_own`, `id_block`) VALUES
(1, 1, 5);

-- --------------------------------------------------------

--
-- Структура таблицы `community`
--

CREATE TABLE `community` (
  `id_com` int(14) NOT NULL,
  `com_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `additional_data` varchar(2000) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `community_members`
--

CREATE TABLE `community_members` (
  `id_cm` int(20) NOT NULL,
  `id` int(11) NOT NULL,
  `id_com` int(14) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `conversation`
--

CREATE TABLE `conversation` (
  `id_con` int(15) NOT NULL,
  `name_conversation` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` char(1) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `conversation_members`
--

CREATE TABLE `conversation_members` (
  `id_con_m` int(15) NOT NULL,
  `id` int(11) NOT NULL,
  `id_con` int(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `friend`
--

CREATE TABLE `friend` (
  `id` int(15) NOT NULL,
  `friend_1` int(11) NOT NULL,
  `friend_2` int(11) NOT NULL,
  `status` char(1) CHARACTER SET utf8 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Дамп данных таблицы `friend`
--

INSERT INTO `friend` (`id`, `friend_1`, `friend_2`, `status`) VALUES
(1, 2, 4, '1'),
(2, 1, 2, '1'),
(3, 1, 3, '1'),
(4, 1, 4, '1'),
(5, 1, 5, '1'),
(6, 2, 3, '1'),
(8, 2, 5, '1'),
(9, 7, 8, '0'),
(11, 7, 12, '1'),
(12, 7, 14, '0'),
(13, 8, 12, '1'),
(14, 8, 13, '1'),
(18, 10, 13, '1'),
(19, 10, 7, '1'),
(20, 11, 8, '1'),
(22, 11, 14, '1'),
(23, 12, 11, '0'),
(24, 13, 14, '0'),
(25, 13, 7, '0'),
(26, 14, 10, '1'),
(29, 1, 1, '0'),
(30, 1, 8, '0'),
(31, 1, 13, '0'),
(32, 1, 12, '0'),
(33, 18, 1, '0'),
(35, 17, 1, '0'),
(36, 1, 19, '0');

-- --------------------------------------------------------

--
-- Структура таблицы `message`
--

CREATE TABLE `message` (
  `id_message` int(20) NOT NULL,
  `text_message` varchar(2000) COLLATE utf8_unicode_ci NOT NULL,
  `id_dialogue` int(15) DEFAULT NULL,
  `date_time_msg` datetime NOT NULL,
  `sign` varchar(22) COLLATE utf8_unicode_ci NOT NULL,
  `id_con` int(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Дамп данных таблицы `message`
--

INSERT INTO `message` (`id_message`, `text_message`, `id_dialogue`, `date_time_msg`, `sign`, `id_con`) VALUES
(10, 'test 1', 16, '2017-11-06 22:55:36', '', NULL),
(11, 'test 2', 16, '2017-11-06 22:55:41', '', NULL),
(12, 'test 3', 17, '2017-11-06 22:55:49', '', NULL),
(13, 'test 4', 17, '2017-11-06 22:55:53', '', NULL),
(14, 'test 5', 18, '2017-11-06 22:56:04', '', NULL),
(15, 'test 6', 19, '2017-11-06 22:56:11', '', NULL),
(16, 'test 7', 16, '2017-11-06 22:56:16', '', NULL),
(17, 'аа если бы я писал на русском языке, то сообщение попало бы в таблицу?', 16, '2017-11-06 23:14:37', '', NULL),
(18, 'я нашел ошибку', 16, '2017-02-26 23:54:20', '', NULL),
(19, 'не getDay, а gedDate()\n', 16, '2017-02-26 23:54:42', '', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `news`
--

CREATE TABLE `news` (
  `id_news` int(14) NOT NULL,
  `text` varchar(2000) COLLATE utf8_unicode_ci NOT NULL,
  `id_com` int(14) DEFAULT NULL,
  `id` int(11) DEFAULT NULL,
  `location` char(1) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `photo`
--

CREATE TABLE `photo` (
  `id_photo` int(15) NOT NULL,
  `name_photo` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `id_albom` int(15) NOT NULL,
  `link` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `role`
--

CREATE TABLE `role` (
  `id_role` int(15) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_com` int(14) DEFAULT NULL,
  `id_con` int(15) DEFAULT NULL,
  `type_of_role` char(1) COLLATE utf8_unicode_ci NOT NULL,
  `role` char(1) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `login` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `pass` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `sex` char(1) COLLATE utf8_unicode_ci NOT NULL,
  `berd_date` date NOT NULL,
  `name` varchar(22) COLLATE utf8_unicode_ci NOT NULL,
  `sur_name` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `city` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `university` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `photo` varchar(250) COLLATE utf8_unicode_ci NOT NULL DEFAULT './avatars/avatar.jpg',
  `photo_mini` varchar(250) COLLATE utf8_unicode_ci NOT NULL DEFAULT './avatars/mini/avatar.jpg'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Дамп данных таблицы `user`
--

INSERT INTO `user` (`id`, `login`, `email`, `pass`, `sex`, `berd_date`, `name`, `sur_name`, `city`, `university`, `photo`, `photo_mini`) VALUES
(1, 'test', 'xxxx092@yandex.ru', '5Fktrctq', '1', '1995-08-01', 'Oleg', 'Chigarev', NULL, NULL, './avatars/avatar.jpg', './avatars/mini/avatar.jpg'),
(2, 'SiLence', 'alexwidman95@mail.com', '5Fktrctq', '1', '1995-10-17', 'Aleksey', 'Vidmanov', NULL, NULL, './avatars/user2.jpg', './avatars/mini/user2.jpg'),
(3, 'zolotaja_pupovina', 'BigDeeck@gmail.ru', 'BaBaika666', '1', '1995-05-10', 'Ingvar', 'Insatiable', NULL, NULL, './avatars/avatar.jpg', './avatars/mini/avatar.jpg'),
(4, 'Kukushka', 'kukushka092@yandex.ru', '5extybr123', '0', '1997-08-05', 'Katya', 'Ivanova', NULL, NULL, './avatars/avatar.jpg', './avatars/mini/avatar.jpg'),
(5, 'Lapulka', 'Queen@mail.ru', 'LunaKurit', '0', '1999-03-11', 'Vadiana', 'Jasnova', NULL, NULL, './avatars/avatar.jpg', './avatars/mini/avatar.jpg'),
(6, 'test_account', 'test@test.ru', 'test', '1', '1999-12-31', 'Tester', 'Testerskoy', NULL, NULL, './avatars/avatar.jpg', './avatars/mini/avatar.jpg'),
(8, 'Serega', 'serega_gansta2003@mail.com', '5Fktrctq', '1', '2003-10-19', 'Serega', 'Vsehporvu', NULL, NULL, './avatars/avatar.jpg', './avatars/mini/avatar.jpg'),
(11, 'Zahar', 'xxxxx95@mail.com', '5Fkedtrctq', '0', '1995-01-17', 'Nastya', 'Astahova', NULL, NULL, './avatars/avatar.jpg', './avatars/mini/avatar.jpg'),
(12, 'Klinskoe', 'boroda2000i++@yandex.ru', 'zakat', '0', '1994-01-15', 'Jana', 'Vidmanova', NULL, NULL, './avatars/avatar.jpg', './avatars/mini/avatar.jpg'),
(13, 'Semen', 'radost97@rambler.com', 'pripyat', '0', '1993-08-01', 'Irina', 'Servernaya', NULL, NULL, './avatars/avatar.jpg', './avatars/mini/avatar.jpg'),
(15, 'jjwoe', 'wedw@ef.ya', '214352', '1', '1996-08-01', 'jfef', 'if', NULL, NULL, './avatars/avatar.jpg', './avatars/mini/avatar.jpg'),
(16, 'ppq', 'wqdqed@dsu.frh', '7654312', '1', '1996-08-02', 'qwe', 'qwe', NULL, NULL, './avatars/avatar.jpg', './avatars/mini/avatar.jpg'),
(17, 'laguna', 'lena.laguna1978@mail.ru', '26241904', '1', '1978-09-30', 'Алена', 'Лагуна', NULL, NULL, './avatars/avatar.jpg', './avatars/mini/avatar.jpg'),
(18, 'Kot', 'sema_kot@kot.kot', 'sema2010', '1', '2010-08-01', 'Sema', 'Kot', NULL, NULL, './avatars/avatar.jpg', './avatars/mini/avatar.jpg'),
(19, 'oleg092', 'c.oleg2009@ya.ru', '01081995', '1', '1995-08-01', 'oleg', 'ne_oleg', NULL, NULL, './avatars/avatar.jpg', './avatars/mini/avatar.jpg');

-- --------------------------------------------------------

--
-- Структура таблицы `video`
--

CREATE TABLE `video` (
  `id_video` int(15) NOT NULL,
  `name_video` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `id_user_own` int(11) NOT NULL,
  `link` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `albom`
--
ALTER TABLE `albom`
  ADD PRIMARY KEY (`id_albom`);

--
-- Индексы таблицы `black_list`
--
ALTER TABLE `black_list`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `community`
--
ALTER TABLE `community`
  ADD PRIMARY KEY (`id_com`);

--
-- Индексы таблицы `community_members`
--
ALTER TABLE `community_members`
  ADD PRIMARY KEY (`id_cm`);

--
-- Индексы таблицы `conversation`
--
ALTER TABLE `conversation`
  ADD PRIMARY KEY (`id_con`);

--
-- Индексы таблицы `conversation_members`
--
ALTER TABLE `conversation_members`
  ADD PRIMARY KEY (`id_con_m`);

--
-- Индексы таблицы `friend`
--
ALTER TABLE `friend`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id_message`),
  ADD KEY `id_dialogue` (`id_dialogue`);

--
-- Индексы таблицы `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id_news`);

--
-- Индексы таблицы `photo`
--
ALTER TABLE `photo`
  ADD PRIMARY KEY (`id_photo`);

--
-- Индексы таблицы `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id_role`);

--
-- Индексы таблицы `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `video`
--
ALTER TABLE `video`
  ADD PRIMARY KEY (`id_video`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `albom`
--
ALTER TABLE `albom`
  MODIFY `id_albom` int(15) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `black_list`
--
ALTER TABLE `black_list`
  MODIFY `id` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT для таблицы `community`
--
ALTER TABLE `community`
  MODIFY `id_com` int(14) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `community_members`
--
ALTER TABLE `community_members`
  MODIFY `id_cm` int(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `conversation`
--
ALTER TABLE `conversation`
  MODIFY `id_con` int(15) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `conversation_members`
--
ALTER TABLE `conversation_members`
  MODIFY `id_con_m` int(15) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `friend`
--
ALTER TABLE `friend`
  MODIFY `id` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;
--
-- AUTO_INCREMENT для таблицы `message`
--
ALTER TABLE `message`
  MODIFY `id_message` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
--
-- AUTO_INCREMENT для таблицы `news`
--
ALTER TABLE `news`
  MODIFY `id_news` int(14) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `photo`
--
ALTER TABLE `photo`
  MODIFY `id_photo` int(15) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `role`
--
ALTER TABLE `role`
  MODIFY `id_role` int(15) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
--
-- AUTO_INCREMENT для таблицы `video`
--
ALTER TABLE `video`
  MODIFY `id_video` int(15) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
