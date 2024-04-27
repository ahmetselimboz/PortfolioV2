BaseModel = null;

class BaseService {
  constructor(model) {
    this.BaseModel = model;
  }

  list(where) {
    return this.BaseModel?.find(where || {});
  }

  create(data) {
    return this.BaseModel(data).save();
  }

  updateWhere(where, data) {
    return this.BaseModel?.findOneAndUpdate(where, data, { new: true });
  }

  delete(id) {
    return this.BaseModel.findOneAndDelete(id);
  }
}

module.exports = BaseService;
