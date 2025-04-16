const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return OauthClientResources.init(sequelize, DataTypes);
}

class OauthClientResources extends Sequelize.Model {
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
      field: 'oauth_client_id'
    },
    resourceType: {
      type: DataTypes.STRING(36),
      allowNull: false,
      field: 'resource_type'
    },
    resourceId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      field: 'resource_id'
    }
  }, {
    sequelize,
    tableName: 'oauth_client_resources',
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
        name: "oauth_client_resources_oauth_client_id_resource_uindex",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "oauth_client_id" },
          { name: "resource_type" },
          { name: "resource_id" },
        ]
      },
      {
        name: "resource_type",
        using: "BTREE",
        fields: [
          { name: "resource_type" },
        ]
      },
      {
        name: "resource_id",
        using: "BTREE",
        fields: [
          { name: "resource_id" },
        ]
      },
    ]
  });
  }
}
