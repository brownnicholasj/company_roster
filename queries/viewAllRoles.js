const mysql = require('mysql');
const conn = mysql.createConnection({
	host: 'localhost',

	port: 3306,

	user: 'root',

	password: 'password',
	database: 'company_roster',
});

class ViewAllRoles {
	constructor() {
		conn.query('SELECT * FROM role', (err, res) => {
			if (err) throw err;
			console.table(res);
		});
	}
}

module.exports = ViewAllRoles;
