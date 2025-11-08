import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { Users as UsersIcon, Shield, UserPlus, Search, Mail, Phone, Calendar, ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  created_at: string;
  roles: string[];
}

const Users = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("admin");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    members: 0,
    recent: 0
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: ""
  });

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please login to view users");
        return;
      }

      // Call edge function to fetch users
      const response = await fetch(
        `https://ueepzqmjueozyhbjcrzq.supabase.co/functions/v1/manage-users`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'list' }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch users');
      }

      const { users } = await response.json();

      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      if (profilesError) throw profilesError;

      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Combine auth users with profiles and roles
      const usersWithRoles = (users || []).map((user: any) => {
        const profile = profilesData?.find(p => p.user_id === user.id);
        const userRoles = (rolesData || [])
          .filter(r => r.user_id === user.id)
          .map(r => r.role);
        
        return {
          id: profile?.id || user.id,
          user_id: user.id,
          first_name: profile?.first_name || user.user_metadata?.first_name || null,
          last_name: profile?.last_name || user.user_metadata?.last_name || null,
          email: user.email || null,
          phone: profile?.phone || user.phone || null,
          role: profile?.role || null,
          created_at: user.created_at,
          roles: userRoles
        };
      });

      setProfiles(usersWithRoles);
      
      // Calculate stats
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      
      setStats({
        total: usersWithRoles.length,
        admins: usersWithRoles.filter(u => u.roles.includes('admin')).length,
        members: usersWithRoles.filter(u => !u.roles.includes('admin')).length,
        recent: usersWithRoles.filter(u => new Date(u.created_at) > thirtyDaysAgo).length
      });
    } catch (error: any) {
      toast.error("Failed to load users: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from("user_roles")
        .insert({
          user_id: selectedUser.user_id,
          role: selectedRole as "admin" | "moderator" | "user"
        });

      if (error) throw error;
      
      toast.success(`${selectedRole} role assigned successfully`);
      setDialogOpen(false);
      setSelectedUser(null);
      fetchProfiles();
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error("User already has this role");
      } else {
        toast.error("Failed to assign role: " + error.message);
      }
    }
  };

  const handleRemoveRole = async (userId: string, role: string) => {
    if (!confirm(`Remove ${role} role from this user?`)) return;

    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role as "admin" | "moderator" | "user");

      if (error) throw error;
      
      toast.success(`${role} role removed successfully`);
      fetchProfiles();
    } catch (error: any) {
      toast.error("Failed to remove role: " + error.message);
    }
  };

  const handleCreateUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please login to create users");
        return;
      }

      const response = await fetch(
        `https://ueepzqmjueozyhbjcrzq.supabase.co/functions/v1/manage-users`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            action: 'create',
            userData: formData
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create user');
      }

      toast.success("User created successfully");
      setCreateDialogOpen(false);
      setFormData({ email: "", password: "", first_name: "", last_name: "", phone: "" });
      fetchProfiles();
    } catch (error: any) {
      toast.error("Failed to create user: " + error.message);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please login to update users");
        return;
      }

      const response = await fetch(
        `https://ueepzqmjueozyhbjcrzq.supabase.co/functions/v1/manage-users`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            action: 'update',
            userId: selectedUser.user_id,
            userData: {
              email: formData.email,
              user_metadata: {
                first_name: formData.first_name,
                last_name: formData.last_name
              },
              phone: formData.phone || undefined
            }
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update user');
      }

      toast.success("User updated successfully");
      setEditDialogOpen(false);
      setSelectedUser(null);
      fetchProfiles();
    } catch (error: any) {
      toast.error("Failed to update user: " + error.message);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please login to delete users");
        return;
      }

      const response = await fetch(
        `https://ueepzqmjueozyhbjcrzq.supabase.co/functions/v1/manage-users`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            action: 'delete',
            userId: userToDelete.user_id
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }

      toast.success("User deleted successfully");
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchProfiles();
    } catch (error: any) {
      toast.error("Failed to delete user: " + error.message);
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.[0] || "";
    const last = lastName?.[0] || "";
    return `${first}${last}`.toUpperCase() || "U";
  };

  const getRoleBadgeVariant = (role: string) => {
    switch(role) {
      case 'admin': return 'default';
      case 'moderator': return 'secondary';
      default: return 'outline';
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = 
      (profile.first_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (profile.last_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (profile.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || 
      (roleFilter === "admin" && profile.roles.includes('admin')) ||
      (roleFilter === "member" && !profile.roles.includes('admin'));
    
    return matchesSearch && matchesRole;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredProfiles.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('ellipsis');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="p-8">
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-muted-foreground">View all registered users</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.members}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New (30 days)</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recent}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
            <SelectItem value="member">Members</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Info */}
      {filteredProfiles.length > 0 && (
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredProfiles.length)} of {filteredProfiles.length} users
        </div>
      )}

      {/* User Cards */}
      <div className="grid gap-4 mb-6">
        {currentUsers.map((profile) => (
          <Card key={profile.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(profile.first_name, profile.last_name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1">
                    {profile.first_name || profile.last_name
                      ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
                      : "Anonymous User"}
                  </h3>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {profile.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <span>{profile.email}</span>
                      </div>
                    )}
                    {profile.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* User Roles */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {profile.roles.length > 0 ? (
                      profile.roles.map((role) => (
                        <Badge 
                          key={role} 
                          variant={getRoleBadgeVariant(role)}
                          className="gap-2"
                        >
                          {role}
                          <button
                            onClick={() => handleRemoveRole(profile.user_id, role)}
                            className="ml-1 hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline">Member</Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedUser(profile);
                      setFormData({
                        email: profile.email || "",
                        password: "",
                        first_name: profile.first_name || "",
                        last_name: profile.last_name || "",
                        phone: profile.phone || ""
                      });
                      setEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedUser(profile);
                      setDialogOpen(true);
                    }}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Roles
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      setUserToDelete(profile);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProfiles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No users found matching your criteria.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
              </PaginationItem>
              
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => goToPage(page as number)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Assign Role Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">User</p>
                <p className="font-semibold">
                  {selectedUser.first_name} {selectedUser.last_name}
                </p>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Current Roles</p>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.roles.length > 0 ? (
                    selectedUser.roles.map((role) => (
                      <Badge key={role} variant={getRoleBadgeVariant(role)}>
                        {role}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline">No roles assigned</Badge>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Assign New Role</p>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAssignRole} className="w-full">
                Assign Role
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="create-email">Email *</Label>
              <Input
                id="create-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="user@example.com"
              />
            </div>
            <div>
              <Label htmlFor="create-password">Password *</Label>
              <Input
                id="create-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password"
              />
            </div>
            <div>
              <Label htmlFor="create-first-name">First Name</Label>
              <Input
                id="create-first-name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                placeholder="John"
              />
            </div>
            <div>
              <Label htmlFor="create-last-name">Last Name</Label>
              <Input
                id="create-last-name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="Doe"
              />
            </div>
            <div>
              <Label htmlFor="create-phone">Phone</Label>
              <Input
                id="create-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+254 712 345 678"
              />
            </div>
            <Button onClick={handleCreateUser} className="w-full">
              Create User
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="user@example.com"
              />
            </div>
            <div>
              <Label htmlFor="edit-first-name">First Name</Label>
              <Input
                id="edit-first-name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                placeholder="John"
              />
            </div>
            <div>
              <Label htmlFor="edit-last-name">Last Name</Label>
              <Input
                id="edit-last-name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="Doe"
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+254 712 345 678"
              />
            </div>
            <Button onClick={handleUpdateUser} className="w-full">
              Update User
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user account for {userToDelete?.first_name} {userToDelete?.last_name} ({userToDelete?.email}). 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Users;
