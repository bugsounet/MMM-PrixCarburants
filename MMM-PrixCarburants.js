/* global Module */

/* Magic Mirror
 * Module: MMM-PrixCarburants
 *
 * By bugsounet ©2022
 * MIT Licensed.
 */
log = (...args) => { /* do nothing */ }

Module.register("MMM-PrixCarburants", {
  defaults: {
    debug: false,
    CodePostaux: [
      "08320",
      "59610"
    ],
    Carburants: [
      1, // Gazole
      2, // SP95
      3, // E85
      4, // GPLc
      5, // E10
      6  // SP98
    ],
    Affiche: 5, // nombre de station a afficher
    width: "450px" // largeur du module
  },
  requiresVersion: "2.18.0",

  start: function() {
    this.carburants = []
  },

  getDom: function() {
    var updated = new Date().toLocaleDateString(config.language, {year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
    var wrapper = document.createElement("div")
    wrapper.id = "CARBURANTS"
    if (!this.carburants.length) {
      wrapper.innerHTML = this.translate("LOADING")
    }
    else {
      wrapper.innerHTML = ""
      this.carburants.forEach((carburant,nb) => {
        if (!carburant.nom || (nb > this.config.Affiche)) return
        var id = document.createElement("div")
        id.id = "CARBURANTS_ID"
        id.className = carburant.id
        id.style.width= this.config.width
        var logo = document.createElement("IMG")
        logo.id = "CARBURANTS_LOGO"
        logo.src = "/modules/MMM-PrixCarburants/data/logo/"+ carburant.logo
        var info = document.createElement("div")
        info.id = "CARBURANTS_INFO"
        info.textContent = carburant.marque + " ("+carburant.ville+")"
        var prix = document.createElement("div")
        prix.id= "CARBURANTS_PRIX"

        var gazole = document.createElement("div")
        gazole.id = "CARBURANTS_GAZOLE"
        gazole.className= "CARBURANTS_hidden"
        gazole.textContent= "Gazole: "
        var gazoleValue = document.createElement("div")
        gazoleValue.id = "CARBURANTS_GAZOLE_VALUE"
        gazoleValue.textContent = "-.---"
        gazole.appendChild(gazoleValue)
        var gazolePrix = document.createElement("div")
        gazolePrix.textContent = "€/l"
        gazole.appendChild(gazolePrix)
        var gazoleDot = document.createElement("div")
        gazoleDot.id = "CARBURANTS_GAZOLE_DOT"
        gazoleDot.className = "fa fa-circle"
        gazole.appendChild(gazoleDot)
        prix.appendChild(gazole)

        var SP95 = document.createElement("div")
        SP95.id = "CARBURANTS_SP95"
        SP95.className= "CARBURANTS_hidden"
        SP95.textContent= "SP95: "
        var SP95Value = document.createElement("div")
        SP95Value.id = "CARBURANTS_SP95_VALUE"
        SP95Value.textContent = "-.---"
        SP95.appendChild(SP95Value)
        var SP95Prix = document.createElement("div")
        SP95Prix.textContent = "€/l"
        SP95.appendChild(SP95Prix)
        var SP95Dot = document.createElement("div")
        SP95Dot.id = "CARBURANTS_SP95_DOT"
        SP95Dot.className = "fa fa-circle"
        SP95.appendChild(SP95Dot)
        prix.appendChild(SP95)

        var E85 = document.createElement("div")
        E85.id = "CARBURANTS_E85"
        E85.className= "CARBURANTS_hidden"
        E85.textContent= "E85:"
        var E85Value = document.createElement("div")
        E85Value.id = "CARBURANTS_E85_VALUE"
        E85Value.textContent = "-.---"
        E85.appendChild(E85Value)
        var E85Prix = document.createElement("div")
        E85Prix.textContent = "€/l"
        E85.appendChild(E85Prix)
        var E85Dot = document.createElement("div")
        E85Dot.id = "CARBURANTS_E85_DOT"
        E85Dot.className = "fa fa-circle"
        E85.appendChild(E85Dot)
        prix.appendChild(E85)

        var GPL = document.createElement("div")
        GPL.id = "CARBURANTS_GPL"
        GPL.className= "CARBURANTS_hidden"
        GPL.textContent= "GPLc:"
        var GPLValue = document.createElement("div")
        GPLValue.id = "CARBURANTS_GPL_VALUE"
        GPLValue.textContent = "-.---"
        GPL.appendChild(GPLValue)
        var GPLPrix = document.createElement("div")
        GPLPrix.textContent = "€/l"
        GPL.appendChild(GPLPrix)
        var GPLDot = document.createElement("div")
        GPLDot.id = "CARBURANTS_GPL_DOT"
        GPLDot.className = "fa fa-circle"
        GPL.appendChild(GPLDot)
        prix.appendChild(GPL)

        var E10 = document.createElement("div")
        E10.id = "CARBURANTS_E10"
        E10.className= "CARBURANTS_hidden"
        E10.textContent= "E10:"
        var E10Value = document.createElement("div")
        E10Value.id = "CARBURANTS_E10_VALUE"
        E10Value.textContent = "-.---"
        E10.appendChild(E10Value)
        var E10Prix = document.createElement("div")
        E10Prix.textContent = "€/l"
        E10.appendChild(E10Prix)
        var E10Dot = document.createElement("div")
        E10Dot.id = "CARBURANTS_E10_DOT"
        E10Dot.className = "fa fa-circle"
        E10.appendChild(E10Dot)
        prix.appendChild(E10)

        var SP98 = document.createElement("div")
        SP98.id = "CARBURANTS_SP98"
        SP98.className= "CARBURANTS_hidden"
        SP98.textContent= "SP98:"
        var SP98Value = document.createElement("div")
        SP98Value.id = "CARBURANTS_SP98_VALUE"
        SP98Value.textContent = "-.---"
        SP98.appendChild(SP98Value)
        var SP98Prix = document.createElement("div")
        SP98Prix.textContent = "€/l"
        SP98.appendChild(SP98Prix)
        var SP98Dot = document.createElement("div")
        SP98Dot.id = "CARBURANTS_SP98_DOT"
        SP98Dot.className = "fa fa-circle"
        SP98.appendChild(SP98Dot)
        prix.appendChild(SP98)

        if (carburant.prix.length) {
          carburant.prix.forEach(type => {
            if (this.config.Carburants.indexOf(+type.id) > -1) {
              if (type.id == 1) {
                gazoleDot.classList.add(this.fiability(type.maj))
                gazoleValue.textContent = type.valeur
                gazole.classList.remove("CARBURANTS_hidden")
              }
              if (type.id == 2) {
                SP95Dot.classList.add(this.fiability(type.maj))
                SP95Value.textContent = type.valeur
                SP95.classList.remove("CARBURANTS_hidden")
              }
              if (type.id == 3) {
                E85Dot.classList.add(this.fiability(type.maj))
                E85Value.textContent = type.valeur
                E85.classList.remove("CARBURANTS_hidden")
              }
              if (type.id == 4) {
                GPLDot.classList.add(this.fiability(type.maj))
                GPLValue.textContent = type.valeur
                GPL.classList.remove("CARBURANTS_hidden")
              }
              if (type.id == 5) {
                E10Dot.classList.add(this.fiability(type.maj))
                E10Value.textContent = type.valeur
                E10.classList.remove("CARBURANTS_hidden")
              }
              if (type.id == 6) {
                SP98Dot.classList.add(this.fiability(type.maj))
                SP98Value.textContent = type.valeur
                SP98.classList.remove("CARBURANTS_hidden")
              }
            }
          })
        }
        id.appendChild(logo)
        id.appendChild(info)
        id.appendChild(prix)
        wrapper.appendChild(id)
      })
      var lastUpdate = document.createElement("div")
      lastUpdate.id = "CARBURANTS_UPDATE"
      lastUpdate.textContent = "Mise à jour le " + updated
      wrapper.appendChild(lastUpdate)
    }

    return wrapper
  },

  getStyles: function () {
    return [
      "MMM-PrixCarburants.css",
      "font-awesome.css"
    ]
  },

  socketNotificationReceived: function (noti, payload) {
    switch(noti) {
      case "DATA":
        if (payload.length) {
          this.carburants = payload
          this.updateDom(500)
        }
        break
    }
  },

  notificationReceived: function(noti, payload) {
    switch(noti) {
      case "DOM_OBJECTS_CREATED":
        if (this.config.debug) log = (...args) => { console.log("[CARBURANTS]", ...args) }
        setTimeout(() => this.sendSocketNotification("INIT", this.config), 0)// 1000*30)
        break
    }
  },

  fiability: function (date) {
    var from = new Date(moment(date))
    var now = new Date()
    var diff = (now.getTime() - from.getTime()) / (1000*3600*24)
    console.log(diff)
    if (diff <= 2) return "Green"
    else if (diff > 2 && diff <= 5) return "Yellow"
    else if (diff > 5 && diff <= 10) return "Red"
    else return "Black"
  }

});
