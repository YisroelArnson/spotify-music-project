const mongoose = require("mongoose");
const Insight = require("../models/insights");

exports.fetch_insight = async (req, res) => {
  console.log("Insight requested");

  try {
    // Use await for findOne
    const insight = await Insight.findOne({}, {}, { sort: { created_at: -1 } });

    if (!insight) {
      return res.status(404).json({
        message: "No insights found",
      });
    }

    res.status(200).json(insight);
  } catch (err) {
    console.error("Error fetching insight:", err);
    res.status(400).json({
      error: err.message,
    });
  }
};
