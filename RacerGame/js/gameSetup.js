/**
 * A singleton game set up object with model, view model and render function for binding to the gameSetup.html
 */
truckracer.gameSetup = new function () {

  /**
   * @private ViewModel for game setup that binds to the html elements
   */
  var gameSetupViewModel = function () {
    var self = this
    self.playerName = ko.observable().extend({required: {message: '*Enter your name.'}})
    self.noOfTruckers = ko.observableArray([2, 3, 4, 5, 6])
    self.selectedNoOfTruckers = ko.observable(4)
    self.initialFund = ko.observable().extend({required: {message: '*Need cash to play.'}, minCheck: 1})

    self.startGame = function () {
      // check if valid
      if (self.errors().length > 0) {
        self.errors.showAllMessages()
        return
      }
      $('#mainGameSetupSectionId').hide()
      //publish the changes
      ko.postbox.publish('startGameInitialDetails',
        {playerName: self.playerName(), noOfTruckers: self.selectedNoOfTruckers(), initialFund: self.initialFund()})
    }
    //subscribe to updates from the game
    ko.postbox.subscribe('resetInitialDetails', function (updateInitialFund) {
      self.initialFund(updateInitialFund)
    }, self)

    self.errors = ko.validation.group(this, {deep: true, observable: false})
  }

  /**
   * @public Method to apply data bindings to game setup html.
   * @param gameSetupTag
   *        The div tag Id to bind the data.
   */
  this.renderDataToHtml = function (gameSetupTag) {
    var self = this
    var viewModel = new gameSetupViewModel()
    ko.applyBindings(viewModel, gameSetupTag)
  }
}


