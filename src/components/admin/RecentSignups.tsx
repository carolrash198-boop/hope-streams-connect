import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

const RecentSignups = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    fetchRecentSignups();
  }, []);

  const fetchRecentSignups = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (data) {
      setProfiles(data);
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.[0] || "";
    const last = lastName?.[0] || "";
    return `${first}${last}`.toUpperCase() || "U";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Signups</CardTitle>
        <CardDescription>Latest users who joined the community</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {profiles.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No user signups yet
            </p>
          ) : (
            profiles.map((profile) => (
              <div key={profile.id} className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(profile.first_name, profile.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {profile.first_name || profile.last_name
                      ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
                      : "Anonymous User"}
                  </p>
                  <p className="text-xs text-muted-foreground">{profile.email}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Active
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentSignups;
