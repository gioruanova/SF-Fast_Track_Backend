const { Model } = require("objection");

class PublicMessageCategory extends Model {
  static get tableName() {
    return "public_messages_categories";
  }

  static get idColumn() {
    return "category_id";
  }

  static get relationMappings() {
    const PublicMessage = require("./PublicMessage");

    return {
      messages: {
        relation: Model.HasManyRelation,
        modelClass: PublicMessage,
        join: {
          from: "public_messages_categories.category_id",
          to: "public_messages.category_id",
        },
      },
    };
  }
}

module.exports = PublicMessageCategory;
