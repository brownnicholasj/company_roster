const mysql = require('mysql');
const conn = mysql.createConnection({
	host: 'localhost',

	port: 3306,

	user: 'root',

	password: 'password',
	database: 'company_roster',
});

class ViewAllEmployees {
	constructor() {
		conn.query(
			`SELECT e.id,e.first_name,e.last_name,r.title,r.salary,d.name AS department, CONCAT(m.first_name,' ', m.last_name) AS manager FROM employee AS e LEFT JOIN role AS r ON e.role_id=r.role_id LEFT JOIN department AS d ON r.department_id=d.department_id LEFT JOIN employee AS m ON e.manager_id=m.id`,
			(err, res) => {
				if (err) throw err;
				console.table(res);
			}
		);
	}
}

module.exports = ViewAllEmployees;
