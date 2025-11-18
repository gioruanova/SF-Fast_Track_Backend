const BaseModel = require("../db/BaseModel");

class Feedback extends BaseModel {
  static get tableName() {
    return "feedbacks";
  }

  static get idColumn() {
    return "feedback_id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "user_id",
        "user_name",
        "company_id",
        "company_name",
        "feedback_message",
      ],
      properties: {
        feedback_id: { type: "integer" },
        user_id: { type: "integer" },
        user_name: { type: "string", maxLength: 255 },
        company_id: { type: "integer" },
        company_name: { type: "string", maxLength: 255 },
        feedback_message: { type: "string" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString().slice(0, 19).replace("T", " ");
  }

  static get relationMappings() {
    const User = require("./User");
    const Company = require("./Company");

    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "feedbacks.user_id",
          to: "users.user_id",
        },
      },
      company: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Company,
        join: {
          from: "feedbacks.company_id",
          to: "companies.company_id",
        },
      },
    };
  }
}

module.exports = Feedback;

