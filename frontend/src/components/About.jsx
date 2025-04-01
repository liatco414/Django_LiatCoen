function About() {
    return (
        <>
            <div
                className="about"
                style={{
                    width: "100%",
                    height: "100%",
                    padding: "90px",
                    textAlign: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.68)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <h1 style={{ fontWeight: "900", color: "white" }}>About Us</h1>
                <div className="content" style={{ color: "white", fontSize: "1.2em" }}>
                    <p>
                        Welcome to Our News Site, your go-to platform for international news! Our website is dedicated to bringing you the latest and most relevant news from around the world, offering
                        diverse perspectives on global events. Whether you're passionate about current affairs or simply looking to stay informed, we provide a user-friendly space for readers to
                        explore insightful articles and share their thoughts. <br />
                        <br /> In this site, we believe in the power of interaction. Registered users can engage with our content by leaving comments, sparking meaningful discussions around the news
                        that matters most. Not only do we value your opinion, but we also offer an easy-to-navigate platform for users to stay up to date with the world’s developments. <br />
                        <br /> For those who prefer a more hands-on experience, our admin users have full control to create, edit, and delete articles, ensuring that our content is always fresh and
                        accurate. We also offer special categories such as Drafts and Archives, allowing admins to manage articles they might reconsider or wish to revisit. Whether you're a news
                        enthusiast, a curious reader, or someone looking to engage with global discussions, This is the place to stay informed, interact, and explore the world of international news.
                        Join us today to start exploring!
                    </p>
                </div>
            </div>
        </>
    );
}

export default About;
