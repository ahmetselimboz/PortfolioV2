const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    level: String,
    email: String,
    location: String,
    proc_type: String,
    log: String,
  },
  { versionKey: false, timestamps: true }
);

class AuditLogs extends mongoose.Model {}

schema.loadClass(AuditLogs);

module.exports = mongoose.model("Audit_logs", schema);
