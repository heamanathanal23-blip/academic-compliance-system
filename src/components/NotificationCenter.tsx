import React, { useState } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '@/context/NotificationContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function NotificationCenter() {
  const { notifications, removeNotification, markAsRead, clearAll } = useNotification();
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-500/20 bg-green-50/5';
      case 'error':
        return 'border-destructive/20 bg-destructive/5';
      case 'warning':
        return 'border-yellow-500/20 bg-yellow-50/5';
      case 'info':
      default:
        return 'border-blue-500/20 bg-blue-50/5';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between bg-background/95 backdrop-blur p-4 border-b border-border/50 z-10">
          <h3 className="font-semibold">Notifications</h3>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div className="divide-y divide-border/50">
            <AnimatePresence>
              {notifications.map((notification, idx) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.2 }}
                  className={`p-3 ${getColorClass(notification.type)} border-l-4`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{notification.message}</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <p className="text-sm">No notifications yet</p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
