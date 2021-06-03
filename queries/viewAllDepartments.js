const mysql = require('mysql');
const conn = mysql.createConnection({
	host: 'localhost',

	port: 3306,

	user: 'root',

	password: 'password',
	database: 'company_roster',
});

class viewAllDepartments {
	constructor() {
		conn.query('SELECT * FROM department', (err, res) => {
			if (err) throw err;
			console.table(res);
		});
	}
}

module.exports = viewAllDepartments;
