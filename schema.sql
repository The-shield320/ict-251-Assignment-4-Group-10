CREATE DATABASE campus_crud;
USE campus_crud;
DROP TABLE IF EXISTS campaigns;
create table campaigns (
id INT AUTO_INCREMENT PRIMARY KEY,
campaign_name VARCHAR(150) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO campaigns (campaign_name) VALUES
('Clean Water for All'),
('Tree Planting Drive'),
('Health Awareness Week'),
('Education for Girls'),
('Hunger Relief Program'),
('Mental Health Matters'),
('Plastic-Free Community'),
('Animal Welfare Campaign'),
('Youth Empowerment'),
('Climate Action Now');

