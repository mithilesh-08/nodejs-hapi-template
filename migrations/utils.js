const fs = require('fs');
const shell = require('shelljs');

function getVersion(currentFileName) {
  let version;
  shell.ls('./migrations').forEach((item, index) => {
    if (item === currentFileName) {
      version = index + 1;
    }
  });
  return version;
}

module.exports = {
  up: async () => {},
  down: async () => {},
  async migrate(currentFileName, queryInterface) {
    const version = getVersion(
      currentFileName.split('/')[currentFileName.split('/').length - 1]
    );
    const directories = shell.ls(`./resources/v${version}`);
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < directories.length; index++) {
      const fileName = directories[index];
      const sqlContent = fs.readFileSync(`./resources/v${version}/${fileName}`, 'utf-8');
      console.log("fileName", fileName);
      // Split the SQL content into individual statements
      const statements = sqlContent
        .split(';')
        .map(statement => statement.trim())
        .filter(statement => statement.length > 0);

      // Execute each statement separately
      for (const statement of statements) {
        try {
          await queryInterface.sequelize.query(statement);
        } catch (e) {
          const error = e.original.sqlMessage;
          // Ignore errors for existing tables and duplicate indexes
          if (error.startsWith('Table') && error.endsWith('already exists') ||
              error.includes('Duplicate key name')) {
            continue;
          }
          throw e;
        }
      }
    }
  },
  getVersion,
};
