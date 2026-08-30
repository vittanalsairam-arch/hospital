const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'admin', 'doctor', 'hospital_desk'], default: 'patient' },
  age: { type: Number, default: 28 },
  gender: { type: String, default: 'Male' },
  phone: { type: String, default: '+91 98765 43210' },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1594824813571-638f026361a1?auto=format&fit=crop&w=180&h=180&q=80' },
  abhaId: { type: String, default: '9821-4412-8820' },
  city: { type: String, default: 'Visakhapatnam' },
  state: { type: String, default: 'Andhra Pradesh' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
