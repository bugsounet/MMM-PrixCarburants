/* Magic Mirror
 * Node Helper: MMM-PrixCarburants
 *
 * By bugsounet ©2022
 * MIT Licensed.
 */

var NodeHelper = require("node_helper")
var AdmZip = require('adm-zip')
var request = require('request')
var convert = require('xml-js');

log = (...args) => { /* do nothing ! */ }

module.exports = NodeHelper.create({
  start: function () {
    this.carburants = []
    this.stationsDB = {}
    this.departement = []
  },

  socketNotificationReceived: function (noti, payload) {
    switch (noti) {
      case "INIT":
        console.log("[CARBURANTS] MMM-PrixCarburants Version:", require('./package.json').version)
        this.initialize(payload)
      break
    }
  },

  initialize: function (config) {
    this.config = config
    if (this.config.debug) log = (...args) => { console.log("[CARBURANTS]", ...args) }
    if (!this.config.CodePostaux.length) return console.error("[CARBURANTS] Manque CodePostaux !")
    else console.log("[CARBURANTS] Recherche avec Code Postaux:", this.config.CodePostaux.toString())
    this.createStationsDB()
    log("Création de la base de données...")
    this.DownloadXML()
    setInterval(()=> {
      log("Mise à jour de la base de données...")
      this.carburants = [] 
      this.DownloadXML()
    }, 1000 * 60 * 60)
  },

  createDB: function(data) {
    var result = convert.xml2json(data, {compact: false, spaces: 2})
    const obj = JSON.parse(result)
    obj.elements[0].elements.forEach(pdv => {
      this.config.CodePostaux.forEach(code => {
        if (pdv.attributes.cp == code) {
          var ids = {
            id: pdv.attributes.id,
            nom: null,
            ville: null,
            marque: null,
            logo: "AUCUNE.png",
            prix: [],
          }
          log("Found id:", pdv.attributes.id)
          this.stationDB.stations.forEach(info => {
            if (pdv.attributes.id == info.id) {
              log("Ville:", info.commune)
              ids.ville = info.commune
              log("Marque:", info.marque)
              ids.marque = info.marque
              log("Nom", info.nom)
              ids.nom = info.nom
              ids.logo = info.marque.replace(' ', '').toUpperCase()+".png"
            }
          })
          pdv.elements.forEach(info => {
            if (info.name == "prix") {
              log("Prix:", info.attributes)
              ids.prix.push(info.attributes)
            }
          })
          this.carburants.push(ids)
          log("---")
        }
      })
    })
  },
  
  createStationsDB: function() {
    var tempDB= {
      stations: []
    }
    this.config.CodePostaux.forEach(code => {
      if (code.startsWith('0')) {
        let departement = code.substring(2,1)
        if (this.departement.indexOf(departement) > -1) return
        log("Chargement des stations du département 0" + departement)
        let temp = require('./data/listestations/stations'+departement+'.json').stations
        tempDB.stations = tempDB.stations.concat(temp)
        this.departement.push(departement)
      }
      else if (code.substring(0,2) == "20") {
        let departement = 20
        if (this.departement.indexOf(departement) > -1) return
        log("Chargement des stations de la Corsica!")
        let temp1 = require('./data/listestations/stations2A.json').stations
        let temp2 = require('./data/listestations/stations2B.json').stations
        let temp = temp1.concat(temp2)
        tempDB.stations = tempDB.stations.concat(temp)
        this.departement.push(departement)
      }
      else {
        let departement = code.substring(0,2)
        if (this.departement.indexOf(departement) > -1) return
        log("Chargement des stations du département " + departement)
        let temp = require('./data/listestations/stations'+departement+'.json').stations
        tempDB.stations = tempDB.stations.concat(temp)
        this.departement.push(departement)
      }
    })
    this.stationDB = tempDB
  },

  DownloadXML: function() {
    this.downloadAndUnzip('https://donnees.roulez-eco.fr/opendata/instantane', 'PrixCarburants_instantane.xml')
    .then(data => {
      this.createDB(data)
      log("DataBase:", this.carburants)
      if (this.carburants.length) this.sendSocketNotification("DATA", this.carburants)
    })
    .catch(function (err) {
      console.error(err)
    })
  },

  downloadAndUnzip: function (url, fileName) {
    /**
     * Download a file
     * 
     * @param url
     */
    var download = function (url) {
      return new Promise(function (resolve, reject) {
        request({
          url: url,
          method: 'GET',
          encoding: null
        }, function (err, response, body) {
          if (err) return reject(err)
          resolve(body)
        })
      })
    }

    /**
     * Unzip a Buffer
     * 
     * @param buffer
     * @returns {Promise}
     */
     var unzip = function (buffer) {
       return new Promise(function (resolve, reject) {
         var resolved = false;
         var zip = new AdmZip(buffer);
         var zipEntries = zip.getEntries(); // an array of ZipEntry records

         zipEntries.forEach(function (zipEntry) {
           if (zipEntry.entryName == fileName) {
             resolved = true
             resolve(zipEntry.getData().toString('utf8'))
           }
         })

         if (!resolved) reject(new Error('No file found in archive: ' + fileName))

       })
     }
     return download(url)
       .then(unzip);
  }

});
