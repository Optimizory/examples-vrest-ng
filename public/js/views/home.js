window.HomeView = Backbone.View.extend({

  initialize: function () {
    this.render();
  },

  render: function () {
    $(this.el).html(this.template({
      instanceType: instanceType
    }));
    return this;
  }

});