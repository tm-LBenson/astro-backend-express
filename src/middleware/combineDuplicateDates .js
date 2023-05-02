const combineTrafficData = (entry1, entry2) => {
  const combinedScreenSizes = entry1.screenSizes.concat(entry2.screenSizes);
  const combinedIpAddresses = entry1.ipAddresses.concat(entry2.ipAddresses);

  return {
    date: entry1.date,
    visits: entry1.visits + entry2.visits,
    deviceTypes: {
      desktop: entry1.deviceTypes.desktop + entry2.deviceTypes.desktop,
      mobile: entry1.deviceTypes.mobile + entry2.deviceTypes.mobile,
      tablet: entry1.deviceTypes.tablet + entry2.deviceTypes.tablet,
    },
    screenSizes: combinedScreenSizes,
    ipAddresses: combinedIpAddresses,
  };
};

const combineDuplicateDates = async (site) => {
  try {
    const datesMap = {};

    site.traffic.forEach((entry, index) => {
      const entryDate = new Date(entry.date).setUTCHours(0, 0, 0, 0);

      if (datesMap[entryDate] !== undefined) {
        const duplicateIndex = datesMap[entryDate];
        const combinedEntry = combineTrafficData(
          site.traffic[duplicateIndex],
          entry,
        );

        site.traffic.pull({ _id: site.traffic[duplicateIndex]._id });

        site.traffic.push(combinedEntry);

        delete datesMap[entryDate];
        site.traffic.pull({ _id: entry._id });
      } else {
        datesMap[entryDate] = index;
      }
    });

    return site.save();
  } catch (err) {
    console.error(
      `Error while combining duplicate dates for site ${site._id}: ${err.message}`,
    );
    throw err;
  }
};

module.exports = { combineDuplicateDates };
