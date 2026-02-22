const express = require("express");
const router = express.Router();
const ProductionOrder = require("../models/ProductionOrder");
const CustomerRequest = require("../models/CustomerRequest");
const DesignTemplate = require("../models/DesignTemplate");
const DesignVersion = require("../models/DesignVersion");
const mongoose = require("mongoose");
const { generateDesign } = require("../utils/designGenerator");

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

// CREATE Order from Request
router.post("/create-from-request", async (req, res) => {
    try {
        const { requestId } = req.body;

        // Check if request exists
        const request = await CustomerRequest.findById(requestId);
        if (!request) return res.status(404).json({ error: "Request not found" });

        // Update Request Status
        request.status = "Approved"; // or "Processing"
        await request.save();

        // Create Order
        const newOrder = new ProductionOrder({
            requestId,
            customerId: request.customerId,
            orderId: `ORD-${Date.now()}`, // Simple ID generation
            printSpecs: {
                designType: request.productType,
                size: request.size,
                quantity: 1
            },
            staffId: "system",
            status: "Draft"
        });
        await newOrder.save();

        res.json(newOrder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET All Orders
router.get("/", async (req, res) => {
    try {
        const orders = await ProductionOrder.find()
            .populate("requestId")
            .populate("currentVersionId")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET Single Order
router.get("/:id", async (req, res) => {
    try {
        const order = await ProductionOrder.findById(req.params.id)
            .populate("requestId")
            .populate("currentVersionId");
        if (!order) return res.status(404).json({ error: "Order not found" });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GENERATE DESIGN (New Version)
router.post("/generate", async (req, res) => {
    try {
        const { orderId, templateId, customData } = req.body;

        const order = await ProductionOrder.findById(orderId).populate("requestId");
        if (!order) return res.status(404).json({ error: "Order not found" });

        const template = await DesignTemplate.findById(templateId);
        if (!template) return res.status(404).json({ error: "Template not found" });

        // Merge Data: Request Data + Custom Overrides
        const mergedData = {
            ...order.requestId.toObject(), // textContent, productType, etc
            ...customData // override color, specific text, etc
        };

        // Generate PNG
        const pngPath = await generateDesign(template, mergedData);

        // Calculate Version Number
        const lastVersion = await DesignVersion.findOne({ orderId }).sort({ versionNumber: -1 });
        const versionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;

        // Save Version
        const newVersion = new DesignVersion({
            orderId,
            templateId,
            versionNumber,
            pngFilePath: pngPath,
            designData: mergedData,
            createdBy: "system_auto" // Default as staffId is removed
        });
        await newVersion.save();

        // Update Order with Current Version
        order.currentVersionId = newVersion._id;
        // Map to new status naming
        order.status = "Sent to Customer";
        await order.save();

        res.json(newVersion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// SAVE CLIENT-SIDE GENERATED VERSION
router.post("/save-version", async (req, res) => {
    try {
        const { orderId, templateId, imageBase64, designData, nextStatus } = req.body;

        // 1. Save Base64 Image
        const fs = require('fs');
        const path = require('path');
        const buffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = `design-client-${uniqueSuffix}.png`;
        const uploadDir = path.join(__dirname, '../public/previews');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, buffer);

        const pngPath = `/previews/${fileName}`;

        // 2. Get Order & Version Number
        const lastVersion = await DesignVersion.findOne({ orderId }).sort({ versionNumber: -1 });
        const versionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;

        // 3. Save Version
        const newVersion = new DesignVersion({
            orderId,
            templateId: isValidObjectId(templateId) ? templateId : undefined,
            versionNumber,
            pngFilePath: pngPath,
            designData, // Capture fabric JSON or similar for re-editing
            createdBy: "client_editor"
        });
        await newVersion.save();

        // 4. Update Order
        const update = { currentVersionId: newVersion._id };
        if (typeof nextStatus === "string" && nextStatus.trim()) {
            update.status = nextStatus;
        }
        await ProductionOrder.findByIdAndUpdate(orderId, update);

        res.json(newVersion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Multer Setup for File Uploads
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


// CREATE MANUAL ORDER
router.post("/create-manual", async (req, res) => {
    try {
        const { customerName, customerId, printSpecs } = req.body;
        const newOrder = new ProductionOrder({
            customerName,
            customerId,
            orderId: `ORD-${Date.now()}`, // Simple ID generation
            printSpecs: printSpecs || {},
            staffId: "system",
            status: "Draft"
        });
        await newOrder.save();
        res.json(newOrder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPLOAD FILE to Order
router.post("/:id/upload", upload.single('file'), async (req, res) => {
    try {
        const order = await ProductionOrder.findById(req.params.id);
        if (!order) return res.status(404).json({ error: "Order not found" });

        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        order.uploadedFiles.push({
            fileName: req.file.originalname,
            filePath: `/uploads/${req.file.filename}`,
            fileType: req.file.mimetype
        });
        await order.save();
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE SPECS
router.put("/:id/specs", async (req, res) => {
    try {
        const { printSpecs } = req.body;
        const order = await ProductionOrder.findByIdAndUpdate(
            req.params.id,
            { printSpecs },
            { new: true }
        );
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE ORDER
router.delete("/:id", async (req, res) => {
    try {
        await ProductionOrder.findByIdAndDelete(req.params.id);
        res.json({ message: "Order deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// APPROVE DESIGN
router.post("/:id/approve", async (req, res) => {
    try {
        const order = await ProductionOrder.findByIdAndUpdate(
            req.params.id,
            { status: "Approved" },
            { new: true }
        );
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE STATUS
router.put("/:id/status", async (req, res) => {
    try {
        const { status } = req.body;
        const order = await ProductionOrder.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
