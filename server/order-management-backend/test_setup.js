const mongoose = require('mongoose');
const { createCanvas } = require('canvas');
const path = require('path');
require('dotenv').config();

const runTest = async () => {
    console.log("1. Testing Canvas...");
    try {
        const canvas = createCanvas(200, 200);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 200, 200);
        console.log("   Canvas OK!");
    } catch (e) {
        console.error("   Canvas Failed:", e.message);
        process.exit(1);
    }

    console.log("2. Testing MongoDB Connection...");
    try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log("   MongoDB Connected!");
    } catch (e) {
        console.error("   MongoDB Failed:", e.message);
        process.exit(1);
    }

    console.log("3. Testing Order Model...");
    try {
        const Order = require('./models/Order');
        const tempOrder = new Order({
            customerId: "test",
            designType: "Test",
            size: "A4",
            colors: "Red",
            textContent: "Test",
            status: "Pending"
        });
        await tempOrder.validate();
        console.log("   Order Schema OK!");
    } catch (e) {
        console.error("   Order Schema Failed:", e.message);
    }

    console.log("All systems check passed.");
    process.exit(0);
};

runTest();
