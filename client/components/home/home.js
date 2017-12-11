HomeController = AppController.extend({
  onAfterAction: function () {
    Meta.setTitle('');
  },
  data: {}
});