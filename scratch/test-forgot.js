const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const DB_PATH = path.join(__dirname, "../data/db.json");

async function test() {
  try {
    const email = "osamaafzal1432901@gmail.com";
    console.log("Reading DB from:", DB_PATH);
    const data = await fs.readFile(DB_PATH, "utf-8");
    const db = JSON.parse(data);
    
    console.log("Searching user...");
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    console.log("User found:", user);
    
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const expiry = new Date(Date.now() + 3600000).toISOString();
      
      console.log("Simulating token save...");
      user.resetToken = token;
      user.resetTokenExpiry = expiry;
      
      console.log("Simulated updated user:", user);
      
      // Let's write it to test write operations
      await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
      console.log("DB saved successfully!");
    }
  } catch (err) {
    console.error("Test failed:", err);
  }
}

test();
