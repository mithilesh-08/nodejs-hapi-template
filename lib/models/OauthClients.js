import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class OauthClients extends Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('OauthClients', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    clientId: {
      type: DataTypes.STRING(320),
      allowNull: false,
      unique: "oauth_clients_client_id",
      field: 'client_id'
    },
    clientSecret: {
      type: DataTypes.STRING(36),
      allowNull: false,
      field: 'client_secret'
    },
    grantType: {
      type: DataTypes.ENUM('CLIENT_CREDENTIALS'),
      allowNull: true,
      field: 'grant_type'
    }
  }, {
    tableName: 'oauth_clients',
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
        name: "oauth_clients_client_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "client_id" },
        ]
      },
      {
        name: "client_id",
        using: "BTREE",
        fields: [
          { name: "client_id" },
        ]
      },
      {
        name: "client_secret",
        using: "BTREE",
        fields: [
          { name: "client_secret" },
        ]
      },
    ]
  });
  }
}
