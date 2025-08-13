'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SelectPolling, SelectType } from '@/types';
import { Plus } from 'lucide-react';
import AddConnections from './AddConnections';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { dataPolling, dataType } from '@/lib/ConnectionsData';
interface AddConnectionsProps {
  ProjectId: number;
}
const AddConnectionsWrapper = ({ ProjectId }: AddConnectionsProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant={'custom'}>
            {' '}
            <Plus style={{ height: 20, width: 20 }} /> Add New Connection
          </Button>
        </SheetTrigger>

        <SheetContent>
          <div className="h-full flex flex-col">
            <SheetHeader>
              <SheetTitle> Connection Information</SheetTitle>
              <SheetDescription className={cn('mb-0 pb-0')}></SheetDescription>
            </SheetHeader>
            <ScrollArea className="flex-1 mt-4 pr-2">
              <AddConnections
                ProjectId={ProjectId}
                selectType={dataType}
                selectPolling={dataPolling}
              />
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>{' '}
    </>
  );
};

export default AddConnectionsWrapper;
