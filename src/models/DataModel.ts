import mongoose, { Schema, Document } from "mongoose";

export interface IData extends Document {
  listCategory: string;
  listSubCategory: string;
  [key: string]: any; // Allow dynamic fields
}

const dataSchema = new Schema<IData>(
  {
    listCategory: { type: String, required: true },
    listSubCategory: { type: String, required: true },
  },
  { strict: false } // Allow additional dynamic fields
);

const DataModel = mongoose.models.Data || mongoose.model<IData>("Data", dataSchema);

export default DataModel;