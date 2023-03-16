const trafficData = async (req, res) => {
  try {
    res.status(200).json({ message: 'Traffic data processed successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = trafficData;
