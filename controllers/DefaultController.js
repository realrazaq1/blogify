module.exports = {
  showHomePage: (req, res) => {
    res.render("index", {
      title: "Blogify | create awesome blogs",
      cssfile: "index",
    });
  },

  showDashboard: (req, res) => {
    res.render("dashboard", { title: "Dashboard", cssfile: "dashboard" });
  },

  showProfile: (req, res) => {
    const { user } = req.params;
    res.render("profile", { title: "Profile", cssfile: "profile", name: user });
  },
};
