const BaseService = require("./BaseServices");
const BaseModel = require("../db/models/Categories");
class Categories extends BaseService {
  constructor() {
    super(BaseModel);
  }

  findOne(where){
    return BaseModel?.findOne(where || {})
  }
}



module.exports = new Categories();
