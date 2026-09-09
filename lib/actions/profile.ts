"use server";

import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("You must be logged in.");
  }

  const name = formData.get("name")?.toString().trim() || "";
  const bio = formData.get("bio")?.toString().trim() || "";
  const skillsText = formData.get("skills")?.toString().trim() || "";
  const githubUsername =
    formData.get("githubUsername")?.toString().trim() || "";

  const skills = skillsText
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  if (!name) {
    throw new Error("Name is required.");
  }

  await connectDB();

  await User.findOneAndUpdate(
    { email: session.user.email },
    {
      $set: {
        name,
        bio,
        skills,
        githubUsername,
      },
    },
    {
      returnDocument: "after",
    }
  );

  revalidatePath("/developers");
  revalidatePath("/profile");
}