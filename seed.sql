INSERT INTO department (name) VALUES ("Executive");
INSERT INTO department (name) VALUES ("Sales");
INSERT INTO department (name) VALUES ("Finance");
INSERT INTO department (name) VALUES ("Operations");

INSERT INTO role (title, salary, department_id) VALUES ("CEO", 150000.00, 1);
INSERT INTO role (title, salary, department_id) VALUES ("CFO", 130000.00, 1);
INSERT INTO role (title, salary, department_id) VALUES ("EVP Sales", 140000.00, 1);
INSERT INTO role (title, salary, department_id) VALUES ("EVP Operations", 125000.00, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Director of Sales", 80000.00, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Customer Service Rep", 50000.00, 4);
INSERT INTO role (title, salary, department_id) VALUES ("Accountant", 80000.00, 3);


INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Aaron","Anderson", 1, NULL);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Bobby","Bruiser", 2, 1);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Caitlyn","Carson", 3, 1);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Delilah","Douglas", 4, 1);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Ernie","Ewing", 5, 2);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Frank","Fletcher", 5, 2);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Gary","Greenwood", 6, 3);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Heather","Hewitt", 6, 3);


SELECT title, first_name, last_name, salary, manager_id
FROM employee
INNER JOIN role ON employee.role_id = role.role_id;