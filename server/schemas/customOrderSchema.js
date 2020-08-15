const mongoose = require("mongoose");
const { string } = require("prop-types");
const Schema = mongoose.Schema;

const CustomOrderSchema = new Schema({
  employee: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  name: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  },
  standardPrice: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0
  },
  products: [
    {
      product: {
        type: String,
        ref: "product",
      },
      quantity: {
        type: Number,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true
  }
})

module.exports = Custom = mongoose.model("custom", CustomOrderSchema);
