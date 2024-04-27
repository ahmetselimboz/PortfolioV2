const BaseService = require("./BaseServices");
const BaseModel = require("../db/models/Contacts");
class Contacts extends BaseService {
  constructor() {
    super(BaseModel);
  }

  sortingList(where, sort){
    return BaseModel?.find(where || {}).sort(sort || {})
  }

}

module.exports = new Contacts();
