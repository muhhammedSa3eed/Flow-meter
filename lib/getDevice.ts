import { DeviceDB } from '@/types';

export async function getDevices(ProjectId: number): Promise<DeviceDB[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/DB/project/${ProjectId}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch devices');
  }

  const devices = await response.json();

  return devices;
}
