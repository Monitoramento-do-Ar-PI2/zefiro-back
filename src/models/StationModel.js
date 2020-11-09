const mongoose = require('mongoose');

const StationSchema = require('../schemas/stationSchema');

const StationModel = mongoose.model('StationModel', StationSchema);

module.exports = class Station {
  constructor(station) {
    this.station = new StationModel({
      clientId: station.clientId,
      name: station.name,
      longitude: station.longitude,
      latitude: station.latitude,
      pm25: station.pm25 ? station.pm25 : 0,
      pm10: station.pm10 ? station.pm10 : 0,
      so2: station.so2 ? station.so2 : 0,
      no2: station.no2 ? station.no2 : 0,
      co: station.co ? station.co : 0,
      o3: station.o3 ? station.o3 : 0,
      smoke: station.smoke ? station.smoke : 0,
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
      this.findMe().then((isFound) => {
        if (!isFound) {
          StationModel.create(this.station).then(() => {
            resolve(this.station);
          });
        } else {
          resolve({});
        }
      });
    });
  }

  update() {
    this.station.save();
  }

  findMe() {
    return new Promise((resolve) => {
      StationModel.findOne({ name: this.station.name })
        .then((station) => {
          if (station !== null && Object.entries(station).length !== 0) {
            this.station = station;
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  }

  findMeWithClientId() {
    return new Promise((resolve) => {
      StationModel.find({ clientId: this.station.clientId },
        (err) => {
          if (err) {
            resolve(false);
          }
        }).then((station) => {
        if (station.length !== 0) {
          // eslint-disable-next-line prefer-destructuring
          this.station = station[0];
          resolve(true);
        } else {
          resolve(false);
        }
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
