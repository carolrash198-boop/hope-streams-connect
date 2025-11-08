import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Notification {
  id: string;
  type: "donation" | "member" | "prayer" | "contact" | "volunteer" | "event" | "sermon";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
}

export const useRealtimeNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Subscribe to donations
    const donationsChannel = supabase
      .channel('donations-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'donations'
        },
        (payload) => {
          const newNotification: Notification = {
            id: `donation-${payload.new.id}`,
            type: "donation",
            title: "New Donation",
            message: `New donation of $${payload.new.amount} received${payload.new.donor_first_name ? ` from ${payload.new.donor_first_name}` : ''}`,
            timestamp: new Date(),
            read: false,
            data: payload.new,
          };
          addNotification(newNotification);
          toast.success(newNotification.message);
        }
      )
      .subscribe();

    // Subscribe to church members
    const membersChannel = supabase
      .channel('members-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'church_members'
        },
        (payload) => {
          const newNotification: Notification = {
            id: `member-${payload.new.id}`,
            type: "member",
            title: "New Church Member",
            message: `${payload.new.first_name} ${payload.new.last_name} joined as a new member`,
            timestamp: new Date(),
            read: false,
            data: payload.new,
          };
          addNotification(newNotification);
          toast.success(newNotification.message);
        }
      )
      .subscribe();

    // Subscribe to prayer requests
    const prayersChannel = supabase
      .channel('prayers-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'prayer_requests'
        },
        (payload) => {
          const newNotification: Notification = {
            id: `prayer-${payload.new.id}`,
            type: "prayer",
            title: "New Prayer Request",
            message: `${payload.new.first_name} submitted a prayer request: ${payload.new.subject}`,
            timestamp: new Date(),
            read: false,
            data: payload.new,
          };
          addNotification(newNotification);
          toast.info(newNotification.message);
        }
      )
      .subscribe();

    // Subscribe to contact submissions
    const contactsChannel = supabase
      .channel('contacts-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contact_submissions'
        },
        (payload) => {
          const newNotification: Notification = {
            id: `contact-${payload.new.id}`,
            type: "contact",
            title: "New Contact Submission",
            message: `${payload.new.first_name} ${payload.new.last_name} sent a message: ${payload.new.subject}`,
            timestamp: new Date(),
            read: false,
            data: payload.new,
          };
          addNotification(newNotification);
          toast.info(newNotification.message);
        }
      )
      .subscribe();

    // Subscribe to volunteer submissions
    const volunteersChannel = supabase
      .channel('volunteers-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'volunteer_submissions'
        },
        (payload) => {
          const newNotification: Notification = {
            id: `volunteer-${payload.new.id}`,
            type: "volunteer",
            title: "New Volunteer",
            message: `${payload.new.first_name} ${payload.new.last_name} signed up to volunteer`,
            timestamp: new Date(),
            read: false,
            data: payload.new,
          };
          addNotification(newNotification);
          toast.success(newNotification.message);
        }
      )
      .subscribe();

    // Subscribe to events
    const eventsChannel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'events'
        },
        (payload) => {
          const newNotification: Notification = {
            id: `event-${payload.new.id}`,
            type: "event",
            title: "New Event Created",
            message: `Event "${payload.new.title}" has been created`,
            timestamp: new Date(),
            read: false,
            data: payload.new,
          };
          addNotification(newNotification);
          toast.info(newNotification.message);
        }
      )
      .subscribe();

    // Subscribe to sermons
    const sermonsChannel = supabase
      .channel('sermons-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sermons'
        },
        (payload) => {
          const newNotification: Notification = {
            id: `sermon-${payload.new.id}`,
            type: "sermon",
            title: "New Sermon Added",
            message: `Sermon "${payload.new.title}" by ${payload.new.preacher} has been added`,
            timestamp: new Date(),
            read: false,
            data: payload.new,
          };
          addNotification(newNotification);
          toast.info(newNotification.message);
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(donationsChannel);
      supabase.removeChannel(membersChannel);
      supabase.removeChannel(prayersChannel);
      supabase.removeChannel(contactsChannel);
      supabase.removeChannel(volunteersChannel);
      supabase.removeChannel(eventsChannel);
      supabase.removeChannel(sermonsChannel);
    };
  }, []);

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev].slice(0, 50)); // Keep last 50
    setUnreadCount((prev) => prev + 1);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };
};
