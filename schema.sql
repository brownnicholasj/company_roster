
DROP DATABASE IF EXISTS company_roster;
CREATE DATABASE company_roster;
USE company_roster;

CREATE TABLE department(
    department_id INT AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY (department_id)
);

CREATE TABLE role(
    role_id INT AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL(10,2),
    department_id INT,
    PRIMARY KEY (role_id),
    FOREIGN KEY (department_id) REFERENCES department(department_id)
 );

CREATE TABLE employee(
    id INT AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role(role_id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
 );