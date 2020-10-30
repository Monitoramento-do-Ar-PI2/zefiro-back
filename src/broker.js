const mqemitter = require('mqemitter-mongodb');
const aedesPersistenceMongoDB = require('aedes-persistence-mongodb');
const net = require('net');
const Station = require('./models/StationModel');

const MONGO_URL = 'mongodb://mongo:27017/zefiro-back';

const port = 1883;

let instance = null;

class Broker {
  constructor() {
    // eslint-disable-next-line global-require
    this.aedes = require('aedes')({
      id: 'BROKER_1',
      mq: mqemitter({
        url: MONGO_URL,
      }),
      persistence: aedesPersistenceMongoDB({
        url: MONGO_URL,
        // Optional ttl settings
        ttl: {
          packets: 300, // Number of seconds
          subscriptions: 300,
        },
      }),
    });
    this.server = net.createServer(this.aedes.handle);
  }

  static getInstance() {
    if (instance == null) {
      instance = new Broker();
    }

    return instance;
  }

  init() {
    this.server.listen(port, () => {
      console.log('Aedes listening on port:', port);
    });

    this.aedes.on('subscribe', (subscriptions, client) => {
      console.log(`MQTT client \x1b[32m${client ? client.id : client
      }\x1b[0m subscribed to topics: ${subscriptions.map((s) => s.topic).join('\n')}`, 'from broker', this.aedes.id);
    });

    this.aedes.on('error', (error) => {
      console.log('ERROR: ', error);
    });

    this.aedes.on('unsubscribe', (subscriptions, client) => {
      console.log(`MQTT client \x1b[32m${client ? client.id : client
      }\x1b[0m unsubscribed to topics: ${subscriptions.join('\n')}`, 'from broker', this.aedes.id);
    });

    // fired when a client connects
    this.aedes.on('client', (client) => {
      console.log(`Client Connected: \x1b[33m${client ? client.id : client}\x1b[0m`, 'to broker', this.aedes.id);
    });

    // fired when a client disconnects
    this.aedes.on('clientDisconnect', (client) => {
      console.log(`Client Disconnected: \x1b[31m${client ? client.id : client}\x1b[0m`, 'to broker', this.aedes.id);
    });

    // fired when a message is published
    this.aedes.on('publish', async (packet, client) => {
      if (client !== undefined && client !== null) {
        if (packet.topic === 'Zefiro/Station') {
          const stationJSON = JSON.parse(packet.payload.toString());
          const station = new Station({ ...stationJSON, clientId: client.id });
          station.save();
        } else if (packet.topic.match('/').index === 2) {
          const station = new Station({ clientId: client.id });
          station.findMeWithClientId().then(() => {
          });
        }
      }
      console.log(`Client \x1b[31m${client ? client.id : `BROKER_${this.aedes.id}`}\x1b[0m has published`, packet.payload.toString(), 'on', packet.topic, 'to broker', this.aedes.id);
    });
  }
}

module.exports = Broker;
