module.exports = function (sequelize, DataTypes) {
	return sequelize.define('Shorturl', {
		originalurl: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		}
	});
};