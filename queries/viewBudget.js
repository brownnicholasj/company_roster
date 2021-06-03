const mysql = require('mysql');
const conn = mysql.createConnection({
	host: 'localhost',

	port: 3306,

	user: 'root',

	password: 'password',
	database: 'company_roster',
});

class viewBudget {
	constructor() {
		conn.query(
			`SELECT department.name, SUM(salary) AS salaries FROM employee INNER JOIN role USING (role_id) INNER JOIN department USING (department_id) GROUP BY department.name`,
			(err, res) => {
				if (err) throw err;
				console.table(res);
			}
		);
	}
}

module.exports = viewBudget;
