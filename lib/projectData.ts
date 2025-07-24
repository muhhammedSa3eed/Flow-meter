import { cache } from 'react';

export const getProjects = cache(async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`, {
    next: { tags: ['updateProjects'] },
  });

  return res.json();
});

export const getAllVisualizationTypes = cache(async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/VisualizationTypes`,
    {
      next: { tags: ['updateVisualizationTypes'] },
    }
  );
  const response = await res.json();
  // console.log('data', response);
  return response.data;
});
export const getAllCharts = cache(async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Charts`, {
    next: { tags: ['updateCharts'] },
  });

  return res.json();
});
