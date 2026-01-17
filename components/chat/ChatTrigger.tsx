'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MessageCircle } from 'lucide-react';
import { CalmSyncChat } from './CalmSyncChat';

export function ChatTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating chat button */}
      <Button
        onClick={() => setIsOpen(true)}
        size="icon"
        className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-primary shadow-lg hover:bg-primary/90 transition-all duration-300 hover:scale-125 hover:shadow-2xl hover:ring-4 hover:ring-primary/20 animate-pulse hover:animate-none group"
        aria-label="Open CalmSync chat"
      >
        <MessageCircle className="h-8 w-8 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
      </Button>

      {/* Chat dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md h-[600px] p-0 flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="sr-only">CalmSync Chat</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden px-6 pb-6">
            <CalmSyncChat />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
