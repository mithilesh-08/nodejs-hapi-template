import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class OauthAccessTokens extends Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('OauthAccessTokens', {
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
      field: 'oauth_client_id'
    },
    accessToken: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: "oauth_access_tokens_access_token_uindex",
      field: 'access_token'
    },
    expiresIn: {
      type: DataTypes.MEDIUMINT.UNSIGNED,
      allowNull: false,
      field: 'expires_in'
    },
    expiresOn: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_on'
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: false
    }
  }, {
    tableName: 'oauth_access_tokens',
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
        name: "oauth_access_tokens_access_token_uindex",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "access_token" },
        ]
      },
      {
        name: "oauth_access_tokens_oauth_clients_id_fk",
        using: "BTREE",
        fields: [
          { name: "oauth_client_id" },
        ]
      },
    ]
  });
  }
}
