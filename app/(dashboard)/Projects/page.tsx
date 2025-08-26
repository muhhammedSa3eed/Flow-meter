import { Suspense } from 'react';
import Loading from '@/app/loading';
import ProjectsWrapper from '@/components/projects-wrapper';
import { getProjects } from '@/lib/projectData';

// async function getProjects() {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`, {
//     cache: 'no-store',
//   });
//   if (!res.ok) {
//     throw new Error('Failed to fetch data');
//   }
//   return res.json();
// }

export default async function PageProject() {
  const projects = await getProjects();
  return (
    <>
      <div className="flex flex-row m-3 ">
        <div>
          <h1 className="mr-2 font-bold text-xl">Projects</h1>
        </div>
      </div>
      <ProjectsWrapper projects={projects} />
    </>
  );
}
