import { Projects } from "@/types";
import { cookies } from "next/headers";
import toast from "react-hot-toast";
//Function to update project by ID
export async function updateProjectById(
  id: string,
  updatedProject: Projects
): Promise<Projects> {
  const sessionCookie = (await cookies()).get("connect.sid");

  if (!sessionCookie) {
    toast.error("Session cookie not found");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: `connect.sid=${sessionCookie?.value}`,
      },
      body: JSON.stringify(updatedProject),
    }
  );

  if (!response.ok && response.status === 401) {
    toast.error("Not authenticated");
  }

  if (!response.ok) {
    toast.error("Failed to update project");
  }

  const updatedData: Projects = await response.json();
  return updatedData;
}
