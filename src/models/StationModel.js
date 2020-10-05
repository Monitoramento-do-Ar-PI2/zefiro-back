const mongoose = require('mongoose');

const StationSchema = require('../schemas/stationSchema');

const StationModel = mongoose.model('StationModel', StationSchema);

module.exports = class Station {
  constructor(station) {
    this.station = new StationModel({
      name: station.name,
      longitude: station.longitude,
      latitude: station.latitude,
      pts: station.pts,
      pm10: station.pm10,
      so2: station.so2,
      no2: station.no2,
      co: station.co,
      o3: station.o3,
      smoke: station.smoke,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  static calculateDistance(lat1, lat2, lon1, lon2) {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2)
          + Math.cos(φ1) * Math.cos(φ2)
          * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres

    return d;
  }

  static findNearbyStation(longitude, latitude) {
    // console.log(latitude, longitude);
    return new Promise((resolve) => {
      this.findAll().then((stations) => {
        let nearbyStation = {};
        let meterMin = 100000;
        stations.forEach((station) => {
          const meter = this.calculateDistance(latitude, station.latitude,
            longitude, station.longitude);
          if (meter <= meterMin) {
            meterMin = meter;
            nearbyStation = station;
          }
        });
        resolve(nearbyStation);
      });
    });
  }

  static findAll() {
    return new Promise((resolve) => {
      StationModel.find({},
        (err) => {
          if (err) {
            resolve({});
          }
        }).then((station) => {
        if (station) {
          this.station = station;
          resolve(station);
        }
        resolve({});
      });
    });
  }

  save() {
    return new Promise((resolve) => {
      this.station.save().then(() => {
        resolve(this.station);
      });
    });
  }

  findMe() {
    return new Promise((resolve) => {
      StationModel.find({ name: this.station.name },
        (err) => {
          if (err) {
            resolve({});
          }
        }).then((station) => {
        if (station) {
          this.station = station;
          resolve(station);
        }
        resolve({});
      });
    });
  }

  deleteMe() {
    return new Promise((resolve, reject) => {
      StationModel.deleteOne({ name: this.station.name }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({});
        }
      });
    });
  }
};
