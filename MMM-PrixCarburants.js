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
    debug: true,
    CodePostaux: [
      "08320",
      "59610",
      "02500"
    ],
    Carburants: [
      1, // Gazole
      2, // SP95
      3, // E85
      4, // GPLc
      5, // E10
      6  // SP98
    ]
  },
  requiresVersion: "2.18.0",

  start: function() {

  },

  getDom: function() {
    var wrapper = document.createElement("div")
    wrapper.id = "CARBURANTS"

    return wrapper
  },

  getStyles: function () {
    return [
      "MMM-PrixCarburants.css"
    ]
  },

  socketNotificationReceived: function (noti, payload) {
    switch(noti) {
      case "DATA":
        this.updateData(payload)
        break
    }
  },

  notificationReceived: function(noti, payload) {
    switch(noti) {
      case "DOM_OBJECTS_CREATED":
        if (this.config.debug) log = (...args) => { console.log("[CARBURANTS]", ...args) }
        this.prepareDisplay()
        this.sendSocketNotification("INIT", this.config)
        break
    }
  },

  updateData: function(data) {

  },

  prepareDisplay: function() {

  }
});
