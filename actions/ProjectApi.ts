import { Projects } from '@/types';

import { getCookies } from 'next-client-cookies/server';
import toast from 'react-hot-toast';

// GetAllProjects
export async function getProjects(): Promise<Projects[]> {
  const cookies = await getCookies();

  const sessionCookie = cookies.get('connect.sid');
  if (!sessionCookie) {
    toast.error('Session cookie not found');
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/getprojects`,
    {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `connect.sid=${sessionCookie}`,
      },
    }
  );

  if (!response.ok && response.status === 401) {
    toast.error('Not authenticated');
  }

  if (!response.ok) {
    toast.error('Failed to fetch project');
  }

  const projects = await response.json();
  // console.log("Fetched Projects:", projects);

  return projects;
}

//Create project

export async function createProject(data: {
  name: string;
  description: string;
}): Promise<Projects> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/create`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include', // Send credentials (cookies) along with the request
    }
  );

  if (!res.ok) {
    toast.error('Failed to create project');
  }

  // Parse the response and return a project object
  const project: Projects = await res.json();
  return project;
}
// export async function updateProject(data: {
//   name: string;
//   description: string;
// }): Promise<Projects> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${id}`,
//     {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//       credentials: "include", // Send credentials (cookies) along with the request
//     }
//   );

//   if (!res.ok) {
//     toast.error("Failed to create project");
//   }

//   // Parse the response and return a project object
//   const project: Projects = await res.json();
//   return project;
// }
// export async function updateProject(
//   id: string,
//   updatedProject: UpdateProjectPayload
// ): Promise<Projects> {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${id}`,
//     {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       credentials: "include",
//       body: JSON.stringify(updatedProject),
//     }
//   );

//   if (!response.ok) {
//     const errorText = await response.text();
//     toast.error(errorText || "Failed to update project");
//   }

//   return response.json();
// }
// Delete Projects
export async function deleteProject(id: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    toast.error(errorText || 'Failed to delete project');
  }

  return res.json();
}

// export async function GetProjectById(id: string): Promise<Projects> {
//   const sessionCookie = (await cookies()).get("connect.sid");

//   if (!sessionCookie) {
//     throw new Error("Session cookie not found");
//   }

//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${id}`,
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Cookie: `connect.sid=${sessionCookie.value}`,
//       },
//     }
//   );

//   if (!response.ok && response.status === 401) {
//     throw new Error("Not authenticated");
//   }

//   if (!response.ok) {
//     throw new Error("Failed to fetch project");
//   }

//   const project = await response.json();
//   return project;
// }
