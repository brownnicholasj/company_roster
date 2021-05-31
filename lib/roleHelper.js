const mysql = require('mysql');
const conn = mysql.createConnection({
	host: 'localhost',

	port: 3306,

	user: 'root',

	password: 'password',
	database: 'company_roster',
});

class Role {
	constructor(department) {
		let role = [];
		conn.query('SELECT * FROM role', function (err, res, fields) {
			if (err) throw err;
			if (res.length) {
				for (let i = 0; i < res.length; i++) {
					role.push(`${res[i].role_id} - ${res[i].title}`);
				}
			}
		});
		return role;
	}
}

module.exports = Role;
