const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  title: { type: String, required: true, unique:true },
  description: { type: String, required: true },
  price: {
    type: Number,
    min: [0, "wrong min Price"],
    max: [100000, "Wrong max Price"],
  },
  discountPercentage: {
    type: Number,
    min: [0, "wrong min Discount"],
    max: [1000, "Wrong max Discount"],
  },
  rating: {
    type: Number,
    min: [0, "wrong min Rating"],
    max: [5, "Wrong max rating"],
    default: 0,
  },
  stock: { type: Number, min: [0, "wrong min Stock"] },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, required: true },
  images: { type: [String], required: true },
  deleted: { type: Boolean, default: false },
});

const virtual = productSchema.virtual('id');
virtual.get(function(){ 
    return this._id;
})

productSchema.set('toJSON',{
    virtuals: true,
    versionKey: false,
    transform: function(doc,ret){delete ret._id}
})

exports.Product = mongoose.model("Product", productSchema);
