import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

type GitHubUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export async function saveUser(user: GitHubUser) {
  if (!user.email) {
    console.error("GitHub user has no email");
    return;
  }

  try {
    await connectDB();

    await User.findOneAndUpdate(
      { email: user.email },
      {
        $set: {
          name: user.name || "Developer",
          image: user.image || "",
          githubId: user.id,
        },
        $setOnInsert: {
          email: user.email,
          bio: "",
          skills: [],
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    console.log("User saved to MongoDB:", user.email);
  } catch (error) {
    console.error("Failed to save user to MongoDB:", error);
  }
}