const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const API_URL = "http://localhost:5000/api";

const runWorkflowInfo = async () => {
    console.log("Starting Workflow Verification...");

    // 1. Create Request
    try {
        console.log("1. Creating Customer Request...");
        const reqRes = await axios.post(`${API_URL}/requests/create`, {
            customerId: "test_cust",
            productType: "Poster",
            size: "A4",
            textContent: "Verification Test",
            colorPreferences: "#ff0000"
        });
        const requestId = reqRes.data._id;
        console.log("   Request Created:", requestId);

        // 2. Create Order from Request
        console.log("2. Creating Order from Request...");
        const orderRes = await axios.post(`${API_URL}/orders/create-from-request`, {
            requestId: requestId,
            staffId: "staff_test"
        });
        const orderId = orderRes.data._id;
        console.log("   Order Created:", orderId);

        // 3. Get Templates
        console.log("3. Fetching Templates...");
        const tempRes = await axios.get(`${API_URL}/templates`);
        const templateId = tempRes.data[0]._id;
        console.log("   Template Selected:", templateId);

        // 4. Generate Design
        console.log("4. Generating Design...");
        const genRes = await axios.post(`${API_URL}/orders/generate`, {
            orderId: orderId,
            templateId: templateId,
            customData: {}
        });
        console.log("   Design Generated! Version:", genRes.data.versionNumber);
        console.log("   Image Path:", genRes.data.pngFilePath);

        console.log("SUCCESS: Workflow Verified!");
    } catch (e) {
        console.error("FAILURE:", e.response ? e.response.data : e.message);
    }
};

// Wait for server to be ready (manual check usually, but for script we assume it's running)
runWorkflowInfo();
