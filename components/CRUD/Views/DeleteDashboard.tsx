import React from 'react';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Dashboard } from '@/types';
import { CircleAlert } from 'lucide-react';

export default function DeleteDashboard({
  projectId,
  dashboard,
}: {
  projectId: number | null;
  dashboard: Dashboard;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${projectId}/dashboards/${dashboard.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to delete the dashboard.');
      }
      // router.refresh();

      // toast.success('The dashboard has been deleted successfully.');
      router.push(`/Projects/${projectId}`);
      // window.location.reload();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Failed to deleted dashboard: ${err.message}`);
      } else {
        toast.error('Failed to deleted dashboard due to an unknown error.');
      }
    }
  };

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle className="flex items-center gap-2">
          <CircleAlert className="opacity-80" size={16} strokeWidth={2} />
          Are you sure?
        </AlertDialogTitle>{' '}
        <AlertDialogDescription>
          This action cannot be undone. {dashboard.name} will be permanently
          deleted.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          className={cn(buttonVariants({ variant: 'destructive' }))}
          onClick={handleDelete}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}
