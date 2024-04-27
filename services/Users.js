const BaseService = require("./BaseServices");
const BaseModel = require("../db/models/Users");
class Users extends BaseService {
  constructor() {
    super(BaseModel);
  }

  findOne(where){
    return BaseModel?.findOne(where || {});
  }
}

module.exports = new Users();
