const mysql = require('mysql');
const conn = mysql.createConnection({
	host: 'localhost',

	port: 3306,

	user: 'root',

	password: 'password',
	database: 'company_roster',
});

class Dept {
	constructor() {
		let dept = [];
		conn.query(
			'SELECT department.name FROM department',
			function (err, res, fields) {
				if (err) throw err;
				if (res.length) {
					for (let i = 0; i < res.length; i++) {
						dept.push(res[i].name);
					}
				}
			}
		);
		return dept;
	}
}

module.exports = Dept;
