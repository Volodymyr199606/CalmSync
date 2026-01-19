'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { MessageCircle, X } from 'lucide-react';
import { CalmSyncChat } from './CalmSyncChat';

export function ChatTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating chat button */}
      <Button
        onClick={() => setIsOpen(true)}
        size="icon"
        className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-primary shadow-lg hover:bg-primary/90 transition-all duration-300 hover:scale-125 hover:shadow-2xl hover:ring-4 hover:ring-primary/20 animate-pulse hover:animate-none group !cursor-pointer"
        aria-label="Open CalmSync chat"
      >
        <MessageCircle className="h-8 w-8 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
      </Button>

      {/* Chat dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          className="max-w-md h-[600px] p-0 flex flex-col bg-slate-900/80 backdrop-blur-xl border-white/20 shadow-2xl"
          showCloseButton={false}
        >
          {/* Custom glass-morphism close button */}
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 hover:border-white/30 text-white/80 hover:text-white transition-all duration-300 cursor-pointer"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
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
