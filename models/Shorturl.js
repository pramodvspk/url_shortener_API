module.exports = function (sequelize, DataTypes) {
	return sequelize.define('Shorturl', {
		longurl: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		}
	});
};