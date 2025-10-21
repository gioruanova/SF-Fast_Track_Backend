// BaseModels/SiteBanner.js
const BaseModel = require("../db/BaseModel");

class SiteBanner extends BaseModel {
  static get tableName() {
    return "site_banner";
  }

  static get idColumn() {
    return "baner_id";
  }

  $beforeUpdate() {
    this.updated_at = new Date();
  }
}

module.exports = SiteBanner;
