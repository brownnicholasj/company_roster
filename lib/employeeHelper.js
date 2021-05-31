const mysql = require('mysql');
const conn = mysql.createConnection({
	host: 'localhost',

	port: 3306,

	user: 'root',

	password: 'password',
	database: 'company_roster',
});

class Employee {
	constructor() {}

	getFirstName() {
		let employeeFirst = [];
		conn.query('SELECT * FROM employee', function (err, res, fields) {
			if (err) throw err;
			if (res.length) {
				for (let i = 0; i < res.length; i++) {
					employeeFirst.push(res[i].first_name);
				}
			}
		});
		return employeeFirst;
	}

	getLastName() {
		let employeeLast = [];
		conn.query('SELECT * FROM employee', function (err, res, fields) {
			if (err) throw err;
			if (res.length) {
				for (let i = 0; i < res.length; i++) {
					employeeLast.push(res[i].last_name);
				}
			}
		});
		return employeeLast;
	}

	getManagers() {
		let managers = ['none'];
		conn.query(
			'SELECT * FROM employee LEFT JOIN role AS role ON employee.role_id=role.role_id LEFT JOIN department AS department ON role.department_id=department.department_id',
			function (err, res, fields) {
				if (err) throw err;
				if (res.length) {
					for (let i = 0; i < res.length; i++) {
						managers.push(
							`${res[i].id} - ${res[i].first_name} ${res[i].last_name} - ${res[i].name} as a ${res[i].title}`
						);
					}
				}
			}
		);
		return managers;
	}
}

module.exports = Employee;
