const mysql = require('mysql');
const conn = mysql.createConnection({
	host: 'localhost',

	port: 3306,

	user: 'root',

	password: 'password',
	database: 'company_roster',
});

class viewEmployeeManager {
	constructor(selection, mgrArr) {
		const getIdIndex = mgrArr.findIndex((e) => e.Manager === selection);
		const getId = mgrArr[getIdIndex].id;
		conn.query(
			`SELECT e.id, CONCAT(e.first_name, ' ',e.last_name) AS Employee, r.title AS Title, CONCAT(m.first_name, ' ',m.last_name) AS Manager, d.name AS Dept FROM employee AS e INNER JOIN role AS r ON e.role_id=r.role_id INNER JOIN department AS d ON r.department_id=d.department_id LEFT JOIN employee AS m ON e.manager_id=m.id WHERE m.id = '${getId}'`,
			(err, res) => {
				if (err) throw err;
				console.table(res);
			}
		);
	}
}

module.exports = viewEmployeeManager;
