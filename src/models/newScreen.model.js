const db = require("../config/dbConnection");

const newScreen = async (
  pairingCode,
  screenName,
  tags,
  location,
  city,
  state,
  country,
  pincode
) => {
  try {
    const videoUrls = [
      "https://res.cloudinary.com/dqfnwh89v/video/upload/v1733404032/bpyj9a168ev9tktcwcz9.mp4",
      "https://res.cloudinary.com/dqfnwh89v/video/upload/v1733404032/zbj75ghlerlkmmf7xjig.mp4",
      "https://res.cloudinary.com/dqfnwh89v/video/upload/v1733404030/mseqk7ykvjnj80kh5myd.mp4",
      "https://res.cloudinary.com/dqfnwh89v/video/upload/v1733404030/qapu5diuwpsf8uqxso9c.mp4"
    ];

    // Convert array to string format for PostgreSQL
    const formattedUrls = `[${videoUrls.map((url) => `"${url}"`).join(",")}]`;

    // Insert into 'screen_proposal'
    await db.query(
        `INSERT INTO screen_proposal (PairingCode, ScreenName, Tags, Location, City, State, Country, Pincode) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [pairingCode, screenName, tags, location, city, state, country, pincode]
    );

    // Insert into 'screens'
    const result = await db.query(
        `INSERT INTO screens (PairingCode, ScreenName, Tags, Location, City, State, Country, Pincode, slot1) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [pairingCode, screenName, tags, location, city, state, country, pincode, formattedUrls]
    );

    console.log("Inserted rows:", result.rows);
} catch (err) {
    console.error("Error occurred while adding new screen:", err);
    throw err;
}


};





const screenByPairingCode = async (pairingCode) => {
  try {
    const result = await db.query(
      "SELECT * FROM screens WHERE screenid=$1",
      [pairingCode]
    );
    return result.rows;
  } catch (err) {
    console.error("Error occurred at find SCREEN in SCREEN TABLE:", err);
    throw err;
  }
};
const screenByName = async (screenName) => {
  try {
    const result = await db.query(
      "SELECT * FROM screens WHERE screenname=$1",
      [screenName]
    );
    return result.rows;
  } catch (err) {
    console.error("Error occurred at find SCREEN name in SCREEN TABLE:", err);
    throw err;
  }
};
const getAllScreens = async () => {
  try {
    const result = await db.query("SELECT * FROM screens ORDER BY screenid DESC");
    return result.rows;
  } catch (err) {
    console.error("Error occurred at fetching all screens:", err);
    throw err;
  }
};
const getAllScreens2 = async () => {
  try {
    const result = await db.query("SELECT * FROM screens ORDER BY screenid DESC");
    return result.rows;
  } catch (err) {
    console.error("Error occurred at fetching all screens:", err);
    throw err;
  }
};
// const getNotdeletedScreen = async () => {
//   try {
//     const result = await db.query(
//       "SELECT * FROM screens WHERE  deleted = false ORDER BY screenid DESC"
//     );
//     return result.rows;
//   } catch (err) {
//     console.error("Error occurred at fetching all screens:", err);
//     throw err;
//   }
// };

// const updateDeleteScreen = async (screenid) => {
//   try {
//     const result = await db.query(
//       "UPDATE screens SET deleted = true WHERE screenid = $1",
//       [screenid]
//     );
 
//   } catch (err) {
//     console.error("Error updating screen:", err);
//     res.status(500).send("Error updating screen");
//   }
// };

// const restoreScreenInDB = async (screenid) => {
//   try {
//     const result = await db.query(
//       "UPDATE screens SET deleted = false WHERE screenid = $1",
//       [screenid]
//     );
//     return result.rows;
//   } catch (err) {
//     console.error("Error restoring  screen:", err);
//     res.status(500).send("Error restoring  screen");
//   }
// };



const getNotdeletedScreen = async () => {
  try {


	await db.query("SELECT * FROM screen_proposal WHERE  deleted = false ORDER BY screenid DESC");   


    const result = await db.query(
      "SELECT * FROM screens WHERE  deleted = false ORDER BY screenid DESC"
    );
    return result.rows;
  } catch (err) {
    console.error("Error occurred at fetching all screens:", err);
    throw err;
  }
};

const updateDeleteScreen = async (screenid) => {
  try {


	await db.query(
      "UPDATE screen_proposal SET deleted = true WHERE screenid = $1",
      [screenid]
    );


    const result = await db.query(
      "UPDATE screens SET deleted = true WHERE screenid = $1",
      [screenid]
    );
 
  } catch (err) {
    console.error("Error updating screen:", err);
    res.status(500).send("Error updating screen");
  }
};

const restoreScreenInDB = async (screenid) => {
  try {

	await db.query(
      "UPDATE screen_proposal SET deleted = false WHERE screenid = $1",
      [screenid]
    );


    const result = await db.query(
      "UPDATE screens SET deleted = false WHERE screenid = $1",
      [screenid]
    );
    return result.rows;
  } catch (err) {
    console.error("Error restoring  screen:", err);
    res.status(500).send("Error restoring  screen");
  }
};
const editScreen = async (
  screenid,
  pairingCode,
  screenName,
  tags,
  location,
  city,
  state,
  country,
  pincode,
  reach,
  latitude,
  longitude
) => {
  try {

    await db.query(
      "UPDATE screen_proposal SET screenname = $2, tags = $3, location = $4, city = $5, state = $6, country = $7, pincode = $8,pairingcode = $9, reach = $10,latitude=$11,longitude=$12 WHERE screenid = $1",
      [
        screenid,
        screenName,
        tags,
        location,
        city,
        state,
        country,
        pincode,
        pairingCode,
        reach || null,
        latitude || null,
        longitude || null,
      ]
    );




    const result = await db.query(
      "UPDATE screens SET screenname = $2, tags = $3, location = $4, city = $5, state = $6, country = $7, pincode = $8,pairingcode = $9, reach = $10,latitude=$11,longitude=$12 WHERE screenid = $1",
      [
        screenid,
        screenName,
        tags,
        location,
        city,
        state,
        country,
        pincode,
        pairingCode,
        reach || null,
        latitude || null,
        longitude || null,
      ]
    );
    console.log("screen edit in  db  screen model");

    return result.rows;
  } catch (err) {
    console.error("Error updating screen:", err);
    throw err;
  }
};

const getTotalScreenCount = async () => {
  try {
    const result = await db.query("SELECT COUNT(*) AS count FROM screens");
    return result.rows[0].count;
  } catch (error) {
    console.error("Error fetching screen count:", error);
    throw error;
  }
};

const getNotDeletedScreenCount = async () => {
  try {
    const result = await db.query(
      "SELECT COUNT(*) AS count FROM screens WHERE deleted=false"
    );
    return result.rows[0].count;
  } catch (error) {
    console.error("Error fetching not deleted screen count:", error);
    throw error;
  }
};
const getOnlineCountByClientTable = async () => {
  try {
    const result = await db.query(
      "SELECT COUNT(*) AS count FROM client_statuses WHERE status='online'"
    );
    return result.rows[0].count;
  } catch (error) {
    console.error("Error fetching not deleted screen count:", error);
    throw error;
  }
};

const getOfflineCountByClientTable = async () => {
  try {
    const result = await db.query(
      "SELECT COUNT(*) AS count FROM client_statuses WHERE status='offline'"
    );
    return result.rows[0].count;
  } catch (error) {
    console.error("Error fetching not deleted screen count:", error);
    throw error;
  }
};
const getDeletedScreenCount = async () => {
  try {
    const result = await db.query(
      "SELECT COUNT(*) AS count FROM screens WHERE deleted=true"
    );
    return result.rows[0].count;
  } catch (error) {
    console.error("Error fetching  deleted screen count:", error);
    throw error;
  }
};

const getDeletedScreen = async () => {
  try {
    const result = await db.query(
      "SELECT * FROM screens WHERE deleted = true ORDER BY screenid DESC"
    );
    return result.rows;
  } catch (err) {
    console.error("Error fetching deleted screens:", err);
    throw err;
  }
};


const getScreenById = async (id) => {
  try {
    const result = await db.query("SELECT * FROM screens WHERE screenid = $1", [id]);
    return result.rows[0]; // Assuming only one row is returned
  } catch (err) {
    console.error("Error fetching screen by ID:", err);
    throw err;
  }
};


const getGroupScreen=async () => {
try {
  const result = await db.query(
    "SELECT * FROM  groupscreen WHERE deleted=false"
  );
  return result.rows;
} catch (err) {
  console.error("Error occurred at fetching group screens:", err);
  throw err;
}}

const deletePlaylist = async (screenid) => {

  try {
    // Construct the SQL query to update fields to NULL
    const query = `
      UPDATE screens
      SET playlistname = NULL,
          playlistdescription = NULL,
          slot1 = NULL,
          slot2 = NULL,
          slot3 = NULL,
          slot4 = NULL,
          slot5 = NULL,
          slot6 = NULL,
          slot7 = NULL,
          slot8 = NULL,
          slot9 = NULL,
          slot10 = NULL
      WHERE screenid = $1
      RETURNING *
    `;
    
    // Execute the query with the screenId parameter
    const rows  = await db.query(query, [screenid]);

    return rows[0];

    
  } catch (error) {
    console.error("Error deleting playlist:", error);
    // res.status(500).json({ error: "Failed to delete playlist" });
  }
};

const deleteScreenById = async (screenid) => {
  const query1 = 'DELETE FROM screen_proposal WHERE screenid = $1';
  const query2 = 'DELETE FROM screens WHERE screenid = $1';
  const values = [screenid];
  try {
      // Delete from screen_proposal first to handle foreign key dependencies
      await db.query(query1, values);

      // Then delete from screens
      const result = await db.query(query2, values);
      return result.rowCount > 0; // Returns true if a row was deleted from 'screens'
  } catch (error) {
      throw error; // Rethrow the error for the caller to handle
  }
};




const getStatus = async () => {
  try {
    const result = await db.query("SELECT * FROM client_statuses ORDER BY status DESC");
    return result.rows;
  } catch (err) {
    console.error("Error fetching client statuses:", err);
    throw err;
  }
};

const getClientStatuses = async () => {                                           
  try {
    const result = await db.query("SELECT * FROM client_statuses ORDER BY client_id DESC");
    console.log("Fetched client statuses:", result.rows); // Debugging
    return result.rows;
  } catch (err) {
    console.error("Error occurred at fetching all screens:", err);
    throw err;
  }
};


// Function to fetch device config by client_name
const deviceConfig = async (client_name) => {                                           
  try {
    const result = await db.query("SELECT client_name, ram_total, ram_used, storage_total, storage_used, resolution, downstream_bandwidth, upstream_bandwidth, date_time, manufacturer, model, os_version, wifi_enabled, wifi_mac_address, wifi_network_ssid, wifi_signal_strength_dbm, android_id, updated_at, ifsecondscreenispresentondevice FROM device_configs WHERE client_name = $1", [client_name]); 
    return result.rows[0]; // Return the first matching result
  } catch (err) {
    console.error("Error occurred at fetching device config:", err);
    throw err;
  }
};


const AllOnlineScreens = async () => {
  try {
    // Query to get all online clients
    const clientStatuses = await db.query("SELECT * FROM client_statuses WHERE status='online'");
    // console.log("clientStatuses",clientStatuses.rows);
    
    // Query to get all screens
    const screens = await db.query("SELECT * FROM Screens");

    // Filter screens where screen.screenid matches client_statuses.client_name
    const onlineScreens = screens.rows.map(screen => {
      const status = clientStatuses.rows.find(client => client.client_name == screen.screenid);
      return {
        ...screen,
        status: status ? status.status : 'offline',
        lastResponse: status ? status.updated_at : null
      };
    }).filter(screen => screen.status === 'online');
// console.log("onlineScreens",onlineScreens);

    // Return the filtered screens and total online count
    return {
      onlineScreens,
      totalOnlineCount: onlineScreens.length
    };
  } catch (err) {
    console.error("Error fetching client statuses:", err);
    throw err;
  }
};


const AllOfflineScreens = async () => {
  try {
    // Query to get all online clients
    const clientStatuses = await db.query("SELECT * FROM client_statuses WHERE status='offline'");
    // console.log("clientStatuses",clientStatuses.rows);
    
    // Query to get all screens
    const screens = await db.query("SELECT * FROM Screens");

// Filter screens where screen.screenid matches client_statuses.client_name
const offlineScreens = screens.rows.map(screen => {
  const status = clientStatuses.rows.find(client => client.client_name == screen.screenid);
  return {
    ...screen,
    status: status ? status.status : 'online',
    lastResponse: status ? status.updated_at : null
  };
}).filter(screen => screen.status === 'offline');
// console.log("onlineScreens",onlineScreens);

    // Return the filtered screens and total online count
    return {
      offlineScreens,
      totalOfflineCount: offlineScreens.length
    };
  } catch (err) {
    console.error("Error fetching client statuses:", err);
    throw err;
  }
};



// Function to get screen slot data with filled and empty slots
// const getScreenSlotData = async () => {
//   try {
//     const result = await db.query(`
//       SELECT screenid, 
//              pairingcode, 
//              screenname, 
//              status, 
//              tags, 
//              location, 
//              city, 
//              area, 
//              state, 
//              pincode, 
//              country, 
//              deleted, 
//              playlistname, 
//              playlistdescription,
//              name, 
//              description,
//              live1, live2, live3, live4, live5, live6, live7, live8, live9, live10,

//              -- Count of filled slots
//              (CASE WHEN slot1 IS NOT NULL THEN 1 ELSE 0 END +
//               CASE WHEN slot2 IS NOT NULL THEN 1 ELSE 0 END +
//               CASE WHEN slot3 IS NOT NULL THEN 1 ELSE 0 END +
//               CASE WHEN slot4 IS NOT NULL THEN 1 ELSE 0 END +
//               CASE WHEN slot5 IS NOT NULL THEN 1 ELSE 0 END +
//               CASE WHEN slot6 IS NOT NULL THEN 1 ELSE 0 END +
//               CASE WHEN slot7 IS NOT NULL THEN 1 ELSE 0 END +
//               CASE WHEN slot8 IS NOT NULL THEN 1 ELSE 0 END +
//               CASE WHEN slot9 IS NOT NULL THEN 1 ELSE 0 END +
//               CASE WHEN slot10 IS NOT NULL THEN 1 ELSE 0 END) AS filled_slots,
             
//              -- Count of empty slots
//              (CASE WHEN slot1 IS NULL THEN 1 ELSE 0 END +
//               CASE WHEN slot2 IS NULL THEN 1 ELSE 0 END +
//               CASE WHEN slot3 IS NULL THEN 1 ELSE 0 END +
//               CASE WHEN slot4 IS NULL THEN 1 ELSE 0 END +
//               CASE WHEN slot5 IS NULL THEN 1 ELSE 0 END +
//               CASE WHEN slot6 IS NULL THEN 1 ELSE 0 END +
//               CASE WHEN slot7 IS NULL THEN 1 ELSE 0 END +
//               CASE WHEN slot8 IS NULL THEN 1 ELSE 0 END +
//               CASE WHEN slot9 IS NULL THEN 1 ELSE 0 END +
//               CASE WHEN slot10 IS NULL THEN 1 ELSE 0 END) AS empty_slots
             
//       FROM public.screens where deleted=false
//       ORDER BY screenid DESC
//     `);
//     return result.rows;
//   } catch (err) {
//     console.error("Error occurred at fetching screen slot data:", err);
//     throw err;
//   }
// };

const getScreenSlotData = async () => {
  try {
    const result = await db.query(`
      SELECT screenid, 
             pairingcode, 
             screenname, 
             status, 
             tags, 
             location, 
             city, 
             area, 
             state, 
             pincode, 
             country, 
             deleted, 
             playlistname, 
             playlistdescription,
             name, 
             description,
             live1, live2, live3, live4, live5, live6, live7, live8, live9, live10,

             -- Count of filled slots (up to slot50)
             (CASE WHEN slot1 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot2 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot3 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot4 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot5 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot6 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot7 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot8 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot9 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot10 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot11 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot12 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot13 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot14 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot15 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot16 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot17 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot18 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot19 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot20 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot21 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot22 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot23 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot24 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot25 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot26 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot27 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot28 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot29 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot30 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot31 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot32 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot33 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot34 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot35 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot36 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot37 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot38 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot39 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot40 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot41 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot42 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot43 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot44 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot45 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot46 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot47 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot48 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot49 IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN slot50 IS NOT NULL THEN 1 ELSE 0 END) AS filled_slots,
             
             -- Count of empty slots (up to slot50)
             (CASE WHEN slot1 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot2 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot3 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot4 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot5 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot6 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot7 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot8 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot9 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot10 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot11 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot12 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot13 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot14 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot15 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot16 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot17 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot18 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot19 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot20 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot21 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot22 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot23 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot24 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot25 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot26 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot27 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot28 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot29 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot30 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot31 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot32 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot33 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot34 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot35 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot36 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot37 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot38 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot39 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot40 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot41 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot42 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot43 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot44 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot45 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot46 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot47 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot48 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot49 IS NULL THEN 1 ELSE 0 END +
              CASE WHEN slot50 IS NULL THEN 1 ELSE 0 END) AS empty_slots
             
      FROM public.screens WHERE deleted=false
      ORDER BY screenid DESC
    `);
    return result.rows;
  } catch (err) {
    console.error("Error occurred at fetching screen slot data:", err);
    throw err;
  }
};


const screenDeviceConfig=async () => {                                           
  try {
    const result = await db.query("SELECT * FROM device_configs"); 
    return result.rows; // Return the first matching result
  } catch (err) {
    console.error("Error occurred at fetching device config:", err);
    throw err;
  }
};





module.exports = {
  restoreScreenInDB,
  newScreen,
  screenByPairingCode,
  getAllScreens,
  getNotdeletedScreen,
  updateDeleteScreen,
  editScreen,
  getTotalScreenCount,
  getNotDeletedScreenCount,
  getDeletedScreenCount,
  getDeletedScreen,
  getGroupScreen,
  deletePlaylist,
  deleteScreenById,
 screenByName,getStatus,getOnlineCountByClientTable,getOfflineCountByClientTable,getClientStatuses,getScreenById,deviceConfig,
 AllOnlineScreens,
 AllOfflineScreens,

 getScreenSlotData,
 screenDeviceConfig,
};

