const mysql = require('mysql');
const conn = mysql.createConnection({
	host: 'localhost',

	port: 3306,

	user: 'root',

	password: 'password',
	database: 'company_roster',
});

class ViewEmployeeDepartment {
	constructor(selection) {
		conn.query(
			`SELECT d.name AS Dept, e.id,e.first_name,e.last_name,r.title FROM employee AS e LEFT JOIN role AS r ON e.role_id=r.role_id LEFT JOIN department AS d ON r.department_id=d.department_id WHERE d.name = '${selection}'`,
			(err, res) => {
				if (err) throw err;
				console.table(res);
			}
		);
	}
}

module.exports = ViewEmployeeDepartment;
