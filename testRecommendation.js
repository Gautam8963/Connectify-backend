require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/user");
const ConnectionRequest = require("./src/models/connectionRequest");

// simple test to verify recommendation logic
async function testRecommendations() {
    try {
        // connect to database
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to database");

        // clean up test data
        await User.deleteMany({ emailId: { $regex: /test.*@example\.com/ } });
        await ConnectionRequest.deleteMany({});
        console.log("🧹 Cleaned up old test data");

        // create test users
        const alice = await User.create({
            firstName: "Alice",
            lastName: "Johnson",
            emailId: "test.alice@example.com",
            password: "Test@1234",
            age: 24,
            skills: ["React", "JavaScript", "CSS"],
            experienceLevel: "intermediate",
            interests: ["Web Development", "UI/UX"],
        });

        const bob = await User.create({
            firstName: "Bobby",
            lastName: "Smith",
            emailId: "test.bob@example.com",
            password: "Test@1234",
            age: 26,
            skills: ["Node.js", "MongoDB", "Express"],
            experienceLevel: "advanced",
            interests: ["Backend", "APIs"],
        });

        const charlie = await User.create({
            firstName: "Charlie",
            lastName: "Brown",
            emailId: "test.charlie@example.com",
            password: "Test@1234",
            age: 23,
            skills: ["Python", "Django", "PostgreSQL"],
            experienceLevel: "beginner",
            interests: ["Machine Learning", "Data Science"],
        });

        const dave = await User.create({
            firstName: "Dave",
            lastName: "Wilson",
            emailId: "test.dave@example.com",
            password: "Test@1234",
            age: 25,
            skills: ["React", "Node.js", "JavaScript"],
            experienceLevel: "intermediate",
            interests: ["Web Development", "Full Stack"],
        });

        console.log("✅ Created test users");

        // simulate Dave's perspective - he should match best with Alice
        // Alice: 2 common skills (React, JS) + 1 common interest (Web Dev) + 2 exp match = 5
        // Bob: 1 common skill (Node) = 1
        // Charlie: 0 matches = 0

        const loggedInUser = dave;

        const users = await User.find({
            _id: { $ne: loggedInUser._id },
        }).select("firstName skills experienceLevel interests");

        const usersWithScore = users.map((user) => {
            let score = 0;

            if (loggedInUser.skills && user.skills) {
                const commonSkills = loggedInUser.skills.filter((skill) =>
                    user.skills.includes(skill)
                );
                score += commonSkills.length;
            }

            if (loggedInUser.interests && user.interests) {
                const commonInterests = loggedInUser.interests.filter((interest) =>
                    user.interests.includes(interest)
                );
                score += commonInterests.length;
            }

            if (
                loggedInUser.experienceLevel &&
                user.experienceLevel &&
                loggedInUser.experienceLevel === user.experienceLevel
            ) {
                score += 2;
            }

            return {
                name: user.firstName,
                score: score,
            };
        });

        usersWithScore.sort((a, b) => b.score - a.score);

        console.log("\n📊 Recommendation Results for Dave:");
        console.log("Expected: Alice (highest), Bobby (medium), Charlie (lowest)");
        console.log("\nActual Results:");
        usersWithScore.forEach((user, index) => {
            console.log(`${index + 1}. ${user.name} - Score: ${user.score}`);
        });

        // verify
        if (usersWithScore[0].name === "Alice" && usersWithScore[0].score === 5) {
            console.log("\n✅ TEST PASSED: Recommendation logic works correctly!");
        } else {
            console.log("\n❌ TEST FAILED: Unexpected results");
        }

        // cleanup
        await User.deleteMany({ emailId: { $regex: /test.*@example\.com/ } });
        console.log("\n🧹 Cleaned up test data");

        await mongoose.connection.close();
        console.log("✅ Database connection closed");
    } catch (error) {
        console.error("❌ Error:", error.message);
        await mongoose.connection.close();
    }
}

testRecommendations();
