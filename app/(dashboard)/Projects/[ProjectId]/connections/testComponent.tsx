'use client';

import { useEffect, useState } from 'react';

interface Project {
  id: number;
  name: string;
  description: string;
}
const TestComponents = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const data = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`
        );
        const result = await data.json();
        setProjects(result);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    getProjects();
  }, []);
  console.log({ projects });

  if (loading) return <p>Loading...</p>;
  return (
    <div>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Projects</h1>
        <ul className="space-y-2">
          {projects.map((project) => (
            <li key={project.id} className="p-2 border rounded">
              <h2 className="text-lg font-semibold">{project.name}</h2>
              <p className="text-gray-600">{project.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TestComponents;
