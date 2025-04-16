const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return OauthClientScopes.init(sequelize, DataTypes);
}

class OauthClientScopes extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    oauthClientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'oauth_clients',
        key: 'id'
      },
      unique: "oauth_client_scopes_oauth_clients_id_fk",
      field: 'oauth_client_id'
    },
    scope: {
      type: DataTypes.STRING(36),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'oauth_client_scopes',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "oauth_client_scopes_uindex",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "oauth_client_id" },
        ]
      },
    ]
  });
  }
}
