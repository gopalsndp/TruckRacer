/**
 * Global namespace for the project.
 */
var truckracer = {};

(function () {
  'use strict'

  $(document).ready(function () {
    $('#mainGameSetupSectionId').load('views/gameSetup.html', function () {
      truckracer.gameSetup.renderDataToHtml(this)
    })

    $('#mainGameSectionId').load('views/game.html', function () {
      truckracer.game.renderDataToHtml(this)
      $('#mainGameSectionId').hide()
    })
  })
})()
