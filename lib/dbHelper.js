const conn = require('mysql');

const deptTypes = () => {
	console.log('we got here');
	conn.query('SELECT department.name FROM department', (err, res) => {
		if (err) throw err;
		return res;
	});
};

module.exports = deptTypes();
