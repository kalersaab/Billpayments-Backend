import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}, {timestamps: { createdAt: true, updatedAt: true }});

export default categorySchema;