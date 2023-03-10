const Resource = require("../models/resourceModel.js");

// Get all reasources
module.exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.status(200).json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Create Resource
module.exports.createResource = async (req, res) => {
  const { name, type, cost } = req.body;
  try {
    const newResource = new Resource({ name, type, cost });
    const savedResource = await newResource.save();
    res.status(201).json(savedResource);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Update a resource
module.exports.updateResource = async (req, res) => {
  const resourceId = req.params.id;
  const { name, type, cost } = req.body;
  try {
    const updatedResource = await Resource.findByIdAndUpdate(
      resourceId,
      { name, type, cost },
      { new: true }
    );
    res.status(200).json(updatedResource);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a resource
module.exports.deleteResource = async (req, res) => {
  const resourceId = req.params.id;
  try {
    await Resource.findByIdAndDelete(resourceId);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
