import { Bell, Check, Trash2, DollarSign, Users, Heart, Mail, HandHeart, Calendar, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRealtimeNotifications, Notification } from "@/hooks/useRealtimeNotifications";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useRealtimeNotifications();
  const navigate = useNavigate();

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "donation":
        return <DollarSign className="h-4 w-4 text-green-600" />;
      case "member":
        return <Users className="h-4 w-4 text-blue-600" />;
      case "prayer":
        return <Heart className="h-4 w-4 text-red-600" />;
      case "contact":
        return <Mail className="h-4 w-4 text-purple-600" />;
      case "volunteer":
        return <HandHeart className="h-4 w-4 text-orange-600" />;
      case "event":
        return <Calendar className="h-4 w-4 text-indigo-600" />;
      case "sermon":
        return <Video className="h-4 w-4 text-teal-600" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationLink = (notification: Notification) => {
    switch (notification.type) {
      case "donation":
        return "/admin/donations";
      case "member":
        return "/admin/church-members";
      case "prayer":
        return "/admin/prayers";
      case "contact":
        return "/admin/contact";
      case "volunteer":
        return "/admin/volunteers";
      case "event":
        return "/admin/events";
      case "sermon":
        return "/admin/sermons";
      default:
        return "/admin/dashboard";
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    navigate(getNotificationLink(notification));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-6 text-xs"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          <>
            <ScrollArea className="h-[400px]">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex flex-col items-start gap-2 p-3 cursor-pointer ${
                    !notification.read ? "bg-accent/50" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-2 w-full">
                    <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="justify-center text-destructive cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                clearNotifications();
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
