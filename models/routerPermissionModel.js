const mongoose = require("mongoose");

const routerPermissionSchema = new mongoose.Schema({
  router_endpoint: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    required: true,
  },
  permission_id:{
    type:mongoose.Schema.Types.ObjectId,
    required: true,
    ref:"Permission"
  },
  permission: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("RouterPermission", routerPermissionSchema);


