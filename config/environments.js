module.exports = {
  "PORT": process.env.PORT || "3000",
  "LOG_LEVEL": process.env.LOG_LEVEL || "debug",
  "MONGODB_CONNECTION_STRING": process.env.MONGODB_CONNECTION_STRING || "mongodb://127.0.0.1:27017/LocalOnlineComicDB",
  "JWT":{
    "SECRET": process.env.JWT_SECRET || "123456",
    "EXPIRE_TIME": !isNaN(parseInt(process.env.TOKEN_EXPIRE_TIME)) ? parseInt(process.env.TOKEN_EXPIRE_TIME) : 24 * 60 * 60 // 86400
  },
  "DEFAULT_LANG" : process.env.DEFAULT_LANG || "EN" 
};
