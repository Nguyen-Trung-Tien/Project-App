"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "resetToken", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Users", "resetTokenExpiresAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("Users", "refreshTokenHash", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Users", "refreshTokenExpiresAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "resetTokenExpiresAt");
    await queryInterface.removeColumn("Users", "refreshTokenHash");
    await queryInterface.removeColumn("Users", "refreshTokenExpiresAt");

    await queryInterface.changeColumn("Users", "resetToken", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
