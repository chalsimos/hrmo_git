const mongoose = require("mongoose")
const Schema = mongoose.Schema

const LateEntrySchema = new Schema(
  {
    empno: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
    },
    totalLateMinutes: {
      type: Number,
      default: 0,
    },
    
    status: {
      type: String,
      enum: ["late", "pending", "approved", "rejected"],
      default: "late",
    },
    campus:{
      type:String,
      required:true
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Create compound index for empno and date to ensure uniqueness
LateEntrySchema.index({ empno: 1, date: 1 }, { unique: true })

// Add a method to calculate deduction if needed
LateEntrySchema.methods.calculateDeduction = function (hourlyRate) {
  return (hourlyRate / 60) * this.totalLateMinutes
}

module.exports = mongoose.model("LateEntry", LateEntrySchema)

