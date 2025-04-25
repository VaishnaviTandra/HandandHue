// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'] 
  },
  price: { 
    type: Number, 
    required: [true, 'Price is required'],
    min: [0.01, 'Price must be at least 0.01']
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'] 
  },
  images: [{ 
    type: String, 
    required: [true, 'At least one image is required'] 
  }],
  quantity: { 
    type: Number, 
    default: 1,
    min: [0, 'Quantity cannot be negative']
  },
  tags: [{ 
    type: String 
  }],
  shippingFee: { 
    type: Number, 
    default: 0 
  },
  reviews: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    rating: { 
      type: Number, 
      required: true,
      min: 1,
      max: 5 
    },
    comment: { 
      type: String 
    },
    date: { 
      type: Date, 
      default: Date.now 
    }
  }],
  averageRating: { 
    type: Number, 
    default: 0 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate average rating before saving
productSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    this.averageRating = this.reviews.reduce((acc, item) => item.rating + acc, 0) / this.reviews.length;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);

