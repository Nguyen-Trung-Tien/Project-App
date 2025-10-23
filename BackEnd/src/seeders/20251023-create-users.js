"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "john_doe",
          email: "admin5@gmail.com",
          password: "$10$NLHdvTEaR.F.V1klgPJdtuFARFpsaKRZ0808FSfqfvZIORlViB5bq",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "jane_smith",
          email: "user5@gmail.com",
          password: "$10$NLHdvTEaR.F.V1klgPJdtuFARFpsaKRZ0808FSfqfvZIORlViB5bq",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
