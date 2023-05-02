const combineDuplicateDates = async (site) => {
  let hasDuplicates = false;
  const datesMap = {};

  site.traffic.forEach((entry, index) => {
    const entryDate = new Date(entry.date).setUTCHours(0, 0, 0, 0);
    if (datesMap[entryDate]) {
      hasDuplicates = true;
      const duplicateIndex = datesMap[entryDate];

      site.traffic[duplicateIndex].visits += entry.visits;
      site.traffic[duplicateIndex].deviceTypes.desktop +=
        entry.deviceTypes.desktop;
      site.traffic[duplicateIndex].deviceTypes.mobile +=
        entry.deviceTypes.mobile;
      site.traffic[duplicateIndex].deviceTypes.tablet +=
        entry.deviceTypes.tablet;

      entry.screenSizes.forEach((size) => {
        const screenSizeIndex = site.traffic[
          duplicateIndex
        ].screenSizes.findIndex(
          (existingSize) => existingSize.size === size.size,
        );

        if (screenSizeIndex !== -1) {
          site.traffic[duplicateIndex].screenSizes[screenSizeIndex].count +=
            size.count;
        } else {
          site.traffic[duplicateIndex].screenSizes.push(size);
        }
      });

      entry.ipAddresses.forEach((ip) => {
        const ipIndex = site.traffic[duplicateIndex].ipAddresses.findIndex(
          (existingIp) => existingIp.address === ip.address,
        );

        if (ipIndex !== -1) {
          site.traffic[duplicateIndex].ipAddresses[ipIndex].count += ip.count;
        } else {
          site.traffic[duplicateIndex].ipAddresses.push(ip);
        }
      });

      site.traffic.splice(index, 1);
    } else {
      datesMap[entryDate] = index;
    }
  });

  if (hasDuplicates) {
    await site.save();
  }
};
module.exports = { combineDuplicateDates };
