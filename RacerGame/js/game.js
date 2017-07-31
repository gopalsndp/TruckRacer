/**
 * A singleton game object with model, view model and render function for binding to the game.html
 */
truckracer.game = new function () {

  /**
   * @private Game view model for binding with the game.html elements.
   */
  var gameViewModel = function () {
    var self = this
    self.trucks = ko.observableArray([])
    self.reset = ko.observable()
    self.startRaceFlag = ko.observable(false)
    self.initialFund = ko.observable()
    self.winnerMsg = ko.observable()
    self.modalValidationMsg = ko.observable('')

    /**
     * Function called on click of start race to start the animation.
     * The winning amount will be update with the initial fund.
     */
    self.startRace = function () {
      self.isStartRaceDisabled(true)
      self.isPlaceBetDisabled(true)
      self.isResetMeDisabled(true)

      var trackDistance = document.getElementById('truckTableId').offsetWidth - 100
      var randomTruckWinBias = gameUtil.Helper.randomUniqueNumbers(self.trucks().length)

      for (var index = 0; index < self.trucks().length; index++) {
        var truckId = self.trucks()[index].id
        var betAmount = self.trucks()[index].betAmount()
        self.initialFund(parseInt(self.initialFund()) - parseInt(betAmount));
        //IIFE for the closure.
        (function (index, betAmount) {
          $('#' + truckId).animate({left: '+=' + trackDistance},
            {
              duration: 20000 + randomTruckWinBias[index] * 1000, complete: function () {
              $('.truck-animation').stop()
              var wonAmount = 2 * parseInt(betAmount)
              self.initialFund(parseInt(self.initialFund()) + wonAmount)
              if (wonAmount > 0) {
                self.winnerMsg('*** Congrats, you won $' + wonAmount + '!***')
              }
              else {
                self.winnerMsg('You have not won any amount.')
              }
              if (self.initialFund() == 0) {
                self.winnerMsg('You have 0 balance left. Please reset.')
              }
              self.isResetMeDisabled(false)
            }
            })
        })(index, betAmount)
      }

    }

    /**
     * The function called on click of place bet to open the modal dialog.
     * The bet amounts for all the trucks will be reset.
     */
    self.placeBet = function () {
      self.modalValidationMsg('')
      for (var index = 0; index < self.trucks().length; index++) {
        self.trucks()[index].betAmount(0)
      }
    }

    /**
     * The function called on click of bet truck in place bet modal dialog.
     */
    self.betTruck = function () {
      var totalBetAmount = 0
      for (var index = 0; index < self.trucks().length; index++) {
        totalBetAmount += parseInt(self.trucks()[index].betAmount())
      }
      if (totalBetAmount === 0) {
        self.modalValidationMsg('Atleast, One bet has to be there to start the game.')
        console.log(self.modalValidationMsg().length)
        return
      }
      if (totalBetAmount > self.initialFund()) {
        self.modalValidationMsg('The total bet amount exceed the available funds. Please reduce the amount.')
      }
      else {
        self.isPlaceBetDisabled(true)
        self.isStartRaceDisabled(false)
        $('#placeBetModalId').modal('toggle')
      }
    }

    self.isResetMeDisabled = ko.observable(false)
    self.isPlaceBetDisabled = ko.observable(false)
    self.isStartRaceDisabled = ko.observable(true)

    /**
     * Resets the game and moves to game set up.
     */
    self.reset = function () {
      $('#mainGameSectionId').hide()
      $('#mainGameSetupSectionId').show()
      self.trucks([])
      self.winnerMsg(null)
      self.isPlaceBetDisabled(false)
      self.isStartRaceDisabled(true)
      ko.postbox.publish('resetInitialDetails', self.initialFund())
    }

    /**
     * Subscription to <topic>startGameInitialDetails</topic> for starting game with the
     * passed <object>playerBetDetails</object>.
     *
     */
    ko.postbox.subscribe('startGameInitialDetails', function (playerBetDetails) {
      $('#mainGameSectionId').show()
      self.initialFund(playerBetDetails.initialFund)
      var randomUniqueTruckColors = gameUtil.Helper.randomUniqueNumbers(playerBetDetails.noOfTruckers)
      for (var i = 0; i < playerBetDetails.noOfTruckers; i++) {
        var colorName = Object.keys(gameUtil.Colors.Names[randomUniqueTruckColors[i]])[0]
        self.trucks.push(new truck('truck' + (i+1), 'trucker ' + (i+1), colorName, 0))
      }
    }, self)
  }

  /**
   * @public Method to apply data bindings to game setup html.
   * @param gameTag
   *        The div tag Id to bind the data.
   */
  this.renderDataToHtml = function (gameTag) {
    var self = this
    var viewModel = new gameViewModel()
    ko.applyBindings(viewModel, gameTag)
  }

  /**
   * @constructor model object truck.
   * @param id
   *         Truck id.
   * @param name
   *         Truck name.
   * @param color
   *         Color of the truck.
   * @param betAmount
   *          Bet amount on the truck.
   */
  var truck = function (id, name, color, betAmount) {
    var self = this
    self.id = id
    self.name = name
    self.color = color
    self.betAmount = ko.observable(betAmount)
    self.description = ko.computed(function () {
      return self.name + '( ' + self.color + ' )'
    }, this)
  }
}

