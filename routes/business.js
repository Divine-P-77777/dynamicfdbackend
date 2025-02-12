const express = require("express");
const router = express.Router();
const Business = require("../models/Business");

// ✅ Create Business
router.post("/", async (req, res) => {
  try {
    const business = new Business(req.body);
    await business.save();
    res.status(201).json(business);
  } catch (error) {
    console.error("Error creating business:", error);
    res.status(400).json({ error: error.message });
  }
});

// ✅ Read Businesses (with filters)
router.get("/", async (req, res) => {
  try {
    const filters = {};
    if (req.query.websiteStatus) filters.websiteStatus = req.query.websiteStatus === "true";
    if (req.query.businessCategory) filters.businessCategory = req.query.businessCategory;
    if (req.query.area) filters.area = req.query.area;
    if (req.query.contactInfo) filters.contactInfo = new RegExp(req.query.contactInfo, "i");
    if (req.query.completedstatus) filters.completedstatus = req.query.completedstatus;

    const businesses = await Business.find(filters);
    res.status(200).json(businesses);
  } catch (error) {
    console.error("Error fetching businesses:", error);
    res.status(500).json({ error: "Error fetching businesses" });
  }
});

// ✅ Update Business
router.put("/:id", async (req, res) => {
  try {
    const updatedBusiness = await Business.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedBusiness) return res.status(404).json({ error: "Business not found" });
    res.status(200).json(updatedBusiness);
  } catch (error) {
    console.error("Error updating business:", error);
    res.status(400).json({ error: error.message });
  }
});

// ✅ Delete Business
router.delete("/:id", async (req, res) => {
  try {
    const deletedBusiness = await Business.findByIdAndDelete(req.params.id);
    if (!deletedBusiness) return res.status(404).json({ error: "Business not found" });
    res.status(200).json({ message: "Business deleted successfully" });
  } catch (error) {
    console.error("Error deleting business:", error);
    res.status(500).json({ error: "Error deleting business" });
  }
});

// ✅ Bulk Delete Businesses
router.post("/bulk-delete", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) return res.status(400).json({ error: "Invalid request format" });

    await Business.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: "Businesses deleted successfully" });
  } catch (error) {
    console.error("Error deleting multiple businesses:", error);
    res.status(500).json({ error: "Error deleting businesses" });
  }
});


module.exports = router;
