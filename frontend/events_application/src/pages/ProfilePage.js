function ProfilePage() {
  // this is a place holder for what would be the HostedEvents associated with the logged in user
  const colors = ["#194b21", "#da4485", "#f0bbf7"];
  return (
    <div>
      <div className="container">
        <main>
          <header>
            <h1>Welcome!</h1>
          </header>
          <a href="http://localhost:3000/">Go Home</a>
          <div
            className="section"
            style={{
              backgroundColor: "#72b794",
              margin: "50px 50px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h1
                className="header"
                style={{
                  textAlign: "left",
                  margin: "10px",
                }}
              >
                My Events:
              </h1>
              <div
                style={{
                  marginLeft: "auto",
                  marginRight: "10px",
                }}
              >
                {/* TODO: Create new event page and "onclick" action */}
                <button>Create New Event</button>
              </div>
            </div>
            {colors.map((color, index) => (
              <div
                className="eventPreview"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "10px",
                  marginTop: "0px",
                  width: "auto",
                  height: "100px",
                  background: color,
                }}
              >
                <h3>Event Title : April 2024</h3>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default ProfilePage;
