import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Users extends Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('Users', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('uuid'),
      primaryKey: true
    },
    roleId: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'roles',
        key: 'id'
      },
      field: 'role_id'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'phone_number'
    }
  }, {
    tableName: 'users',
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
        name: "idx_users_phone_number",
        using: "BTREE",
        fields: [
          { name: "phone_number" },
        ]
      },
      {
        name: "fk_users_role_id",
        using: "BTREE",
        fields: [
          { name: "role_id" },
        ]
      },
    ]
  });
  }
}
