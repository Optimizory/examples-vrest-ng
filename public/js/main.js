var AppRouter = Backbone.Router.extend({

  routes: {
    "": "home",
    "contacts": "list",
    "contacts/page/:page": "list",
    "contacts/add": "addcontact",
    "contacts/:id": "contactDetails",
    "about": "about"
  },

  initialize: function () {
    this.headerView = new HeaderView();
    $('.header').html(this.headerView.el);
  },

  home: function (id) {
    if (!this.homeView) {
      this.homeView = new HomeView();
    }
    $('#content').html(this.homeView.el);
    this.headerView.selectMenuItem('home-menu');
  },

  list: function (page) {
    var p = page ? parseInt(page, 10) : 1;
    var contactList = new ContactCollection();
    contactList.fetch({
      success: function () {
        $("#content").html(new ContactListView({
          model: contactList,
          page: p
        }).el);
      }
    });
    this.headerView.selectMenuItem('home-menu');
  },

  contactDetails: function (id) {
    var contact = new Contact({
      _id: id
    });
    contact.fetch({
      success: function () {
        $("#content").html(new ContactView({
          model: contact
        }).el);
      }
    });
    this.headerView.selectMenuItem();
  },

  addcontact: function () {
    var contact = new Contact();
    $('#content').html(new ContactView({
      model: contact
    }).el);
    this.headerView.selectMenuItem('add-menu');
  },

  about: function () {
    if (!this.aboutView) {
      this.aboutView = new AboutView();
    }
    $('#content').html(this.aboutView.el);
    this.headerView.selectMenuItem('about-menu');
  }
});

utils.loadTemplate(['HomeView', 'HeaderView', 'ContactView', 'ContactListItemView', 'AboutView'], function () {
  app = new AppRouter();
  Backbone.history.start();
});