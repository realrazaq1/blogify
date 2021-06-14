class DefaultController {
  /**
   * GET request to /.
   * Responsible for displaying the homepage.
   */
  static showHomePage = (req, res) => {
    res.render("index", {
      title: "Blogify | create awesome blogs",
      cssfile: "index",
    });
  };

  /**
   * GET request to /dashboard.
   * Responsible for displaying the dashboard.
   */
  static showDashboard = (req, res) => {
    res.render("dashboard", { title: "Dashboard", cssfile: "dashboard" });
  };
}

module.exports = DefaultController;
