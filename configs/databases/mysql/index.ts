import { Sequelize } from "sequelize-typescript";
import { User } from "../../../src/modules/user/infra/schemas/user.schema";
import { Connection } from "mysql2/typings/mysql/lib/Connection";
import { Address } from "../../../src/modules/user/infra/schemas/address.schema";

// arquitetura master-slave (só pelo roleplay)
const sequelize = new Sequelize({
  dialect: "mysql",
  database: process.env.MYSQLDB_DATABASE,
  repositoryMode: true,
  replication: {
    read: [
      {
        host: process.env.MYSQLDB_SLAVE_HOST,
        port: process.env.MYSQLDB_SLAVE_PORT,
        username: process.env.MYSQLDB_SLAVE_USER,
        password: process.env.MYSQLDB_PASSWORD,
      },
    ],
    write: {
      host: process.env.MYSQLDB_HOST,
      port: process.env.MYSQLDB_PORT,
      username: process.env.MYSQLDB_USER,
      password: process.env.MYSQLDB_PASSWORD,
    },
  },
  sync: {
    force: true,
  },
  models: [User, Address],
});

// gambiarra pra simular um attach de uma slave pra master pois n temos uma cloud pra isso kk (sem tempo pra criar alguns container dockers pra simular uma infra top)
sequelize.addHook("afterConnect", (connection: Connection) => {
  if (connection.config.port == process.env.MYSQLDB_SLAVE_PORT) {
    connection.query("SHOW MASTER STATUS;", (err, [result]: any) => {
      connection.query("STOP SLAVE;");
      connection.query(
        `CHANGE MASTER TO MASTER_HOST='mysql_db_master', MASTER_USER='root', MASTER_PORT=3306, MASTER_PASSWORD='${process.env.MYSQLDB_PASSWORD}', MASTER_LOG_FILE='${result.File}', MASTER_LOG_POS=${result.Position};`
      );
      connection.query("START SLAVE;");
    });
  }
});

async function connectDatabase() {
  try {
    await sequelize.sync();
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

export { sequelize, connectDatabase };
