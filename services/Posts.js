const BaseService = require("./BaseServices");
const BaseModel = require("../db/models/Posts");
const client = require("../db/redis");
class Posts extends BaseService {
  constructor() {
    super(BaseModel);
  }

  findOne(where) {
    return BaseModel?.findOne(where || {});
  }

  async saveRedisAllPosts() {
    try {
      const check = await client.exists("Posts");

      if (!check) {
        const values = await BaseModel?.find();
        var save;
        for (let index = 0; index < values.length; index++) {
          save = await client.hSet("Posts", values[index].id, JSON.stringify(values[index]));
          console.log(save);
        } 
        if (save) {
          console.log("Successfully save Redis!");
        }else{
          console.log("Error save Redis!");
        }
  
  
      }else{
        console.log("Already exist Redis!");
      }
    } catch (error) {
      console.error("Redis hgetall error:", error);
    }
  }

  listPostsWithDetails(where) {
    return BaseModel?.find(where || {})
      .select("title desc click mainImg createdAt")
      .populate([
        {
          path: "userId",
          select: "username photo",
        },
        { path: "categoryId", select: "name" },
      ]);
  }

  listSortingPostswithDetails(where, sort) {
    return BaseModel?.find(where || {})
      .select("title desc click mainImg createdAt")
      .populate([
        {
          path: "userId",
          select: "username photo",
        },
        { path: "categoryId", select: "name" },
      ])
      .sort(sort);
  }

  listPostsSortAndLimit(where, sort, limit) {
    return BaseModel?.find(where || {})
      .select("title desc click mainImg createdAt")
      .sort(sort || {})
      .limit(limit || {})
      .populate([
        {
          path: "userId",
          select: "username photo",
        },
        { path: "categoryId", select: "name" },
      ]);
  }
}

module.exports = new Posts();
