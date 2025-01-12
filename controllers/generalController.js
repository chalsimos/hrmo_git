const ping = require("ping");
const devices = require('../models/devices');
const Time = require("../models/Time");
const ZKLib = require('node-zklib');
const zkConfig = {
  port: 4370, 
  timeout: 5000, 
  inport: 5200, 
};
const gen = {
    getAttendance: async(req, res) =>{
      const ip = req.params.id;
      const zkInstance = new ZKLib(ip, zkConfig.port, zkConfig.timeout);
      try {
        await zkInstance.createSocket();
        const logs = await zkInstance.getAttendances();
        console.log('Raw Attendance Logs:', logs);
        if (!Array.isArray(logs.data)) {
          throw new Error('Attendance logs are not in array format');
        }
        const processedLogs = logs.data.map((log) => {
        const recordTime = new Date(log.recordTime);
        const date = recordTime.toISOString().split('T')[0];
        const time = recordTime.toTimeString().split(' ')[0];
      return {
        sid: log.deviceUserId, 
        date: date,
        time: time,
      };
    });

    for (let log of processedLogs) {
      const { sid, date, time } = log;
      const existingRecord = await Time.findOne({ sid, date });

      if (existingRecord) {
        let updateData = {};
        if (!existingRecord.am_time_in) {
          updateData.am_time_in = time;
        } else if (!existingRecord.am_time_out) {
          updateData.am_time_out = time;
        } else if (!existingRecord.pm_time_in) {
          updateData.pm_time_in = time;
        } else if (!existingRecord.pm_time_out) {
          updateData.pm_time_out = time;
        } else if (!existingRecord.ot_time_in) {
          updateData.ot_time_in = time;
        } else if (!existingRecord.ot_time_out) {
          updateData.ot_time_out = time;
        }
        if (Object.keys(updateData).length > 0) {
          await Time.updateOne({ sid, date }, { $set: updateData });
        }
      } else {
        const newRecord = new Time({
          sid,
          date,
          am_time_in: time, 
        });
        await newRecord.save();
      }
    }

    // Handle incomplete records and set them to "-"
    const incompleteRecords = await Time.find({
      $or: [
        { am_time_out: null },
        { pm_time_in: null },
        { pm_time_out: null },
        { ot_time_in: null },
        { ot_time_out: null },
      ],
    });

    for (let record of incompleteRecords) {
      const updateData = {};

      if (!record.am_time_out) {
        updateData.am_time_out = "-";
      }
      if (!record.pm_time_in) {
        updateData.pm_time_in = "-";
      }
      if (!record.pm_time_out) {
        updateData.pm_time_out = "-";
      }
      if (!record.ot_time_in) {
        updateData.ot_time_in = "-";
      }
      if (!record.ot_time_out) {
        updateData.ot_time_out = "-";
      }

      if (Object.keys(updateData).length > 0) {
        await Time.updateOne({ _id: record._id }, { $set: updateData });
      }
    }

    // Optional: Handle any specific condition for deleting a record (e.g., half day condition)
    if (req.body.uptype === "half") {
      const latestRecord = await Time.findOne().sort({ date: -1 });
      if (latestRecord) {
        await Time.deleteOne({ _id: latestRecord._id });
      }
    }

    res.send(`Attendance logs processed successfully`);
  } catch (error) {
    console.error("Error processing attendance data:", error);
    res.status(500).send("There was an error processing the attendance data.");
  }
},
  updateDevice: async (req, res) => {
    const { ip, newIp, name } = req.body; 

    try {
        
        if (ip === newIp) {
            
            const result = await devices.findOneAndUpdate(
                { ipAddress: ip }, 
                { $set: { name: name } }, 
                { new: true } 
            );

            if (!result) {
                return res.status(404).send('Device not found');
            }

            return res.send({ ip, name });
        } else {
            
            const result = await devices.findOneAndUpdate(
                { ipAddress: ip }, 
                { $set: { ipAddress: newIp, name: name } }, 
                { new: true } 
            );

            if (!result) {
                return res.status(404).send('Device not found');
            }

            return res.send({ ip: newIp, name });
        }
    } catch (err) {
        console.error('Error updating device:', err);
        return res.status(500).send('Error updating device');
    }
},
    getDeviceInfo: async(req, res) =>{
        const ip = req.query.ip; 

        
        let responseData = {
            ip: ip || "",
            status: "Unknown",
            time: null,
            error: null
        };

        if (!ip) {
            responseData.error = "IP address is required";
            return res.json(responseData); 
        }

        try {
            
            const result = await ping.promise.probe(ip);

            
            responseData.status = result.alive ? "Online" : "Offline";
            if (result.alive) {
            responseData.time = result.time;
            }

            
            res.json(responseData);
        } catch (error) {
            responseData.error = "Error checking device status";
            responseData.details = error.message;
            res.status(500).json(responseData);
        }
    }
};
module.exports = gen;