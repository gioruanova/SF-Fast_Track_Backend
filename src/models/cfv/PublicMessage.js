const { Model } = require("objection");

class PublicMessage extends Model {
  static get tableName() {
    return "public_messages";
  }

  static get idColumn() {
    return "message_id";
  }

  static get relationMappings() {
    const PublicMessageCategory = require("./PublicMessageCategory");

    return {
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: PublicMessageCategory,
        join: {
          from: "public_messages.category_id",
          to: "public_messages_categories.category_id",
        },
      },
    };
  }
}

module.exports = PublicMessage;
