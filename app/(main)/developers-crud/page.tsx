import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import DevelopersClient from "./DevelopersClient";
import { requireAdmin } from "@/lib/isAdmin";

export default async function DevelopersCrudPage() {
  const { isAdmin } = await requireAdmin();

  if (!isAdmin) {
    redirect("/developers");
  }

  await connectDB();

  const users = await User.find()
    .sort({ createdAt: -1 })
    .lean();

  const githubDevelopers = users.map((user) => ({
    _id: user._id.toString(),
    name: user.name,
    role: user.githubUsername
      ? `@${user.githubUsername}`
      : "Developer",
    bio: user.bio || "",
    image: user.image || "",
    skills: user.skills || [],
  }));

  return (
    <DevelopersClient githubDevelopers={githubDevelopers} />
  );
}