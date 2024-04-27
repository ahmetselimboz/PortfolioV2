const BaseService = require("./BaseServices");
const BaseModel = require("../db/models/Footers");
class Footers extends BaseService {
  constructor() {
    super(BaseModel);
  }

  findOne(where){
    return BaseModel?.findOne(where || {});
  }
}

module.exports = new Footers();
