-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 25, 2022 at 12:06 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `asset-mgt`
--

-- --------------------------------------------------------

--
-- Table structure for table `asset_connection_type_tbl`
--

CREATE TABLE `asset_connection_type_tbl` (
  `PID` int(255) NOT NULL,
  `NAME` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `asset_connection_type_tbl`
--

INSERT INTO `asset_connection_type_tbl` (`PID`, `NAME`) VALUES
(1, 'Low Power Wide Area Networks (LPWANs)'),
(2, 'Cellular (3G/4G/5G)'),
(3, 'Protocols'),
(4, 'Bluetooth and BLE'),
(5, 'Wi-Fi'),
(6, 'Radio Frequency Identification (RFID)');

-- --------------------------------------------------------

--
-- Table structure for table `asset_tbl`
--

CREATE TABLE `asset_tbl` (
  `PID` int(255) NOT NULL,
  `ASSET_NAME` varchar(255) NOT NULL,
  `ASSET_TYPE` varchar(255) NOT NULL,
  `INDUSTRIAL_TYPE` varchar(255) NOT NULL,
  `INDUSTRIAL_DATA_SOURCE` varchar(255) NOT NULL,
  `CONNECTION_TYPE` varchar(255) NOT NULL,
  `TRACKING_DEVICE` varchar(255) NOT NULL,
  `SENSOR` varchar(255) NOT NULL,
  `SENSOR_CATEGORY` varchar(255) NOT NULL,
  `SENSOR_DATA_TYPE` varchar(255) NOT NULL,
  `MAC_ADDRESS` varchar(255) NOT NULL,
  `COMPANY_ID` int(255) NOT NULL,
  `CREATED_BY` int(255) NOT NULL,
  `CREATED_DATE` varchar(255) NOT NULL DEFAULT current_timestamp(),
  `MODIFY_BY` int(255) DEFAULT NULL,
  `MODIFY_DATE` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `asset_tbl`
--

INSERT INTO `asset_tbl` (`PID`, `ASSET_NAME`, `ASSET_TYPE`, `INDUSTRIAL_TYPE`, `INDUSTRIAL_DATA_SOURCE`, `CONNECTION_TYPE`, `TRACKING_DEVICE`, `SENSOR`, `SENSOR_CATEGORY`, `SENSOR_DATA_TYPE`, `MAC_ADDRESS`, `COMPANY_ID`, `CREATED_BY`, `CREATED_DATE`, `MODIFY_BY`, `MODIFY_DATE`) VALUES
(2, 'Agriculture', '	Security', 'Agriculture', 'Sensors & Devices', 'Protocols', 'Automatic lighting controls', 'Chemical Sensor', 'Hydrogen sulfide sensor', 'Status data', '167.11.10.100', 1, 1, '24-05-2022T11.20', NULL, NULL),
(3, 'Agriculture', '	Security', 'Agriculture', 'Sensors & Devices', 'Protocols', 'Automatic lighting controls', 'Chemical Sensor', 'Hydrogen sulfide sensor', 'Status data', '167.11.10.100', 1, 1, '24-05-2022T11.20', NULL, NULL),
(4, 'Agriculture', '	Security', 'Agriculture', 'Sensors & Devices', 'Protocols', 'Automatic lighting controls', 'Chemical Sensor', 'Hydrogen sulfide sensor', 'Status data', '167.11.10.100', 1, 1, '24-05-2022T11.20', NULL, NULL),
(5, 'Agriculture', '	Security', 'Agriculture', 'Sensors & Devices', 'Protocols', 'Automatic lighting controls', 'Chemical Sensor', 'Hydrogen sulfide sensor', 'Status data', '167.11.10.100', 1, 1, '2022-05-25 12:32:01', NULL, NULL),
(6, 'yiuyiuyuIUYIUYUiuyi', 'uiyiuyuyiu', 'iyiyiy', 'iyi', 'jgj', 'jjhj', 'kjjk', 'khkjh', 'kjhjk', '1212', 1, 1, '2022-05-25 13:13:46.506', NULL, '2022-05-25 13:13:46'),
(7, 'yiuyiuyuIUYIUYUiuyi', 'uiyiuyuyiu', 'iyiyiy', 'iyi', 'jgj', 'jjhj', 'kjjk', 'khkjh', 'kjhjk', '1212', 1, 1, '2022-05-25 13:15:26.418', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `company_tbl`
--

CREATE TABLE `company_tbl` (
  `PID` int(255) NOT NULL,
  `COMPANY_NAME` varchar(255) NOT NULL,
  `COMPANY_ADDRESS_LINE1` varchar(255) NOT NULL,
  `COMPANY_ADDRESS_LINE2` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `company_tbl`
--

INSERT INTO `company_tbl` (`PID`, `COMPANY_NAME`, `COMPANY_ADDRESS_LINE1`, `COMPANY_ADDRESS_LINE2`) VALUES
(1, 'INSPIRISYS SOLUTIONS', 'OMR', 'CHENNAI');

-- --------------------------------------------------------

--
-- Table structure for table `user_tbl`
--

CREATE TABLE `user_tbl` (
  `PID` int(255) NOT NULL,
  `FIRST_NAME` varchar(255) NOT NULL,
  `LAST_NAME` varchar(255) NOT NULL,
  `LOGIN_NAME` varchar(255) NOT NULL,
  `PASSWORD` varchar(255) NOT NULL,
  `ROLE` varchar(255) NOT NULL,
  `COMPANY_ID` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_tbl`
--

INSERT INTO `user_tbl` (`PID`, `FIRST_NAME`, `LAST_NAME`, `LOGIN_NAME`, `PASSWORD`, `ROLE`, `COMPANY_ID`) VALUES
(1, 'Raj', 'kumar', 'kumar', 'kumar123', 'admin', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `asset_connection_type_tbl`
--
ALTER TABLE `asset_connection_type_tbl`
  ADD PRIMARY KEY (`PID`);

--
-- Indexes for table `asset_tbl`
--
ALTER TABLE `asset_tbl`
  ADD PRIMARY KEY (`PID`);

--
-- Indexes for table `company_tbl`
--
ALTER TABLE `company_tbl`
  ADD PRIMARY KEY (`PID`);

--
-- Indexes for table `user_tbl`
--
ALTER TABLE `user_tbl`
  ADD PRIMARY KEY (`PID`),
  ADD UNIQUE KEY `LOGIN_NAME` (`LOGIN_NAME`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `asset_connection_type_tbl`
--
ALTER TABLE `asset_connection_type_tbl`
  MODIFY `PID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `asset_tbl`
--
ALTER TABLE `asset_tbl`
  MODIFY `PID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `company_tbl`
--
ALTER TABLE `company_tbl`
  MODIFY `PID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_tbl`
--
ALTER TABLE `user_tbl`
  MODIFY `PID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
