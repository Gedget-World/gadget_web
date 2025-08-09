"use client"

import { useState } from "react"
import { PlusCircle, Edit, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import AdminLayout from "@/components/admin/admin-layout"
import {
  type AdminRoleType,
  DEFAULT_ROLE_PERMISSIONS,
  ROLE_DISPLAY_NAMES,
  type Permission,
} from "@/context/admin-auth-context"

// Group permissions by category for better organization
const PERMISSION_GROUPS = {
  "Products & Inventory": [
    "view_products",
    "manage_products",
    "manage_categories",
    "manage_inventory",
    "manage_attributes",
  ],
  "Orders & Customers": ["view_orders", "manage_orders", "process_refunds", "view_customers"],
  Marketing: ["manage_promotions", "manage_banners", "manage_marketing_campaigns"],
  "Customer Support": ["view_support_tickets", "manage_support_tickets", "manage_reviews"],
  "Analytics & Reports": ["view_analytics", "export_reports"],
  "Admin & Settings": [
    "manage_admins",
    "manage_roles",
    "view_activity_logs",
    "manage_settings",
    "manage_payment_methods",
    "manage_shipping_methods",
  ],
}

// Permission display names
const PERMISSION_DISPLAY_NAMES: Record<Permission, string> = {
  view_products: "View Products",
  manage_products: "Manage Products",
  manage_categories: "Manage Categories",
  manage_inventory: "Manage Inventory",
  manage_attributes: "Manage Attributes",

  view_orders: "View Orders",
  manage_orders: "Manage Orders",
  process_refunds: "Process Refunds",
  view_customers: "View Customers",

  manage_promotions: "Manage Promotions",
  manage_banners: "Manage Banners",
  manage_marketing_campaigns: "Manage Marketing Campaigns",

  view_support_tickets: "View Support Tickets",
  manage_support_tickets: "Manage Support Tickets",
  manage_reviews: "Manage Reviews",

  view_analytics: "View Analytics",
  export_reports: "Export Reports",

  manage_admins: "Manage Admins",
  manage_roles: "Manage Roles",
  view_activity_logs: "View Activity Logs",

  manage_settings: "Manage Settings",
  manage_payment_methods: "Manage Payment Methods",
  manage_shipping_methods: "Manage Shipping Methods",
}

// Mock roles data
const mockRoles = [
  {
    id: "1",
    name: "Super Admin",
    type: "super-admin" as AdminRoleType,
    permissions: DEFAULT_ROLE_PERMISSIONS["super-admin"],
    adminCount: 1,
    isSystem: true,
  },
  {
    id: "2",
    name: "Product Manager",
    type: "product-manager" as AdminRoleType,
    permissions: DEFAULT_ROLE_PERMISSIONS["product-manager"],
    adminCount: 3,
    isSystem: true,
  },
  {
    id: "3",
    name: "Order Manager",
    type: "order-manager" as AdminRoleType,
    permissions: DEFAULT_ROLE_PERMISSIONS["order-manager"],
    adminCount: 2,
    isSystem: true,
  },
  {
    id: "4",
    name: "Marketing Manager",
    type: "marketing-manager" as AdminRoleType,
    permissions: DEFAULT_ROLE_PERMISSIONS["marketing-manager"],
    adminCount: 1,
    isSystem: true,
  },
  {
    id: "5",
    name: "Customer Support",
    type: "customer-support-manager" as AdminRoleType,
    permissions: DEFAULT_ROLE_PERMISSIONS["customer-support-manager"],
    adminCount: 4,
    isSystem: true,
  },
  {
    id: "6",
    name: "Analytics Manager",
    type: "analytics-manager" as AdminRoleType,
    permissions: DEFAULT_ROLE_PERMISSIONS["analytics-manager"],
    adminCount: 1,
    isSystem: true,
  },
  {
    id: "7",
    name: "Content Editor",
    type: "custom" as AdminRoleType,
    permissions: ["view_products", "manage_products", "view_analytics"],
    adminCount: 2,
    isSystem: false,
  },
]

export default function RolesPage() {
  const [roles, setRoles] = useState(mockRoles)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<(typeof mockRoles)[0] | null>(null)
  const [newRole, setNewRole] = useState({
    name: "",
    type: "custom" as AdminRoleType,
    permissions: [] as Permission[],
  })

  const { toast } = useToast()

  const filteredRoles = roles.filter((role) => role.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleAddRole = () => {
    if (!newRole.name) {
      toast({
        title: "Error",
        description: "Please enter a role name",
        variant: "destructive",
      })
      return
    }

    if (newRole.permissions.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one permission",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would be an API call
    const newRoleItem = {
      id: String(roles.length + 1),
      name: newRole.name,
      type: newRole.type,
      permissions: newRole.permissions,
      adminCount: 0,
      isSystem: false,
    }

    setRoles([...roles, newRoleItem])
    setIsAddDialogOpen(false)
    setNewRole({
      name: "",
      type: "custom",
      permissions: [],
    })

    toast({
      title: "Success",
      description: "Role has been added successfully",
    })
  }

  const handleEditRole = () => {
    if (!selectedRole) return

    if (!selectedRole.name) {
      toast({
        title: "Error",
        description: "Please enter a role name",
        variant: "destructive",
      })
      return
    }

    if (selectedRole.permissions.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one permission",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would be an API call
    setRoles(roles.map((role) => (role.id === selectedRole.id ? selectedRole : role)))
    setIsEditDialogOpen(false)
    setSelectedRole(null)

    toast({
      title: "Success",
      description: "Role has been updated successfully",
    })
  }

  const handleDeleteRole = () => {
    if (!selectedRole) return

    // In a real app, this would be an API call
    setRoles(roles.filter((role) => role.id !== selectedRole.id))
    setIsDeleteDialogOpen(false)
    setSelectedRole(null)

    toast({
      title: "Success",
      description: "Role has been deleted successfully",
    })
  }

  const handlePermissionChange = (permission: Permission, isChecked: boolean, isEditing = false) => {
    if (isEditing && selectedRole) {
      const updatedPermissions = isChecked
        ? [...selectedRole.permissions, permission]
        : selectedRole.permissions.filter((p) => p !== permission)

      setSelectedRole({
        ...selectedRole,
        permissions: updatedPermissions,
      })
    } else {
      const updatedPermissions = isChecked
        ? [...newRole.permissions, permission]
        : newRole.permissions.filter((p) => p !== permission)

      setNewRole({
        ...newRole,
        permissions: updatedPermissions,
      })
    }
  }

  const handleSelectAllInGroup = (group: Permission[], isChecked: boolean, isEditing = false) => {
    if (isEditing && selectedRole) {
      const currentPermissions = new Set(selectedRole.permissions)

      if (isChecked) {
        // Add all permissions in the group
        group.forEach((permission) => currentPermissions.add(permission))
      } else {
        // Remove all permissions in the group
        group.forEach((permission) => currentPermissions.delete(permission))
      }

      setSelectedRole({
        ...selectedRole,
        permissions: Array.from(currentPermissions),
      })
    } else {
      const currentPermissions = new Set(newRole.permissions)

      if (isChecked) {
        // Add all permissions in the group
        group.forEach((permission) => currentPermissions.add(permission))
      } else {
        // Remove all permissions in the group
        group.forEach((permission) => currentPermissions.delete(permission))
      }

      setNewRole({
        ...newRole,
        permissions: Array.from(currentPermissions),
      })
    }
  }

  const isGroupChecked = (group: Permission[], permissions: Permission[]) => {
    return group.every((permission) => permissions.includes(permission))
  }

  const isGroupIndeterminate = (group: Permission[], permissions: Permission[]) => {
    const checkedCount = group.filter((permission) => permissions.includes(permission)).length
    return checkedCount > 0 && checkedCount < group.length
  }

  const PermissionsList = ({ permissions, isEditing = false }) => (
    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
      {Object.entries(PERMISSION_GROUPS).map(([groupName, groupPermissions]) => (
        <div key={groupName} className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`group-${groupName}-${isEditing ? "edit" : "add"}`}
              checked={isGroupChecked(
                groupPermissions as Permission[],
                isEditing ? selectedRole?.permissions || [] : permissions,
              )}
              onCheckedChange={(checked) =>
                handleSelectAllInGroup(groupPermissions as Permission[], !!checked, isEditing)
              }
              className="data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground"
              data-state={
                isGroupIndeterminate(
                  groupPermissions as Permission[],
                  isEditing ? selectedRole?.permissions || [] : permissions,
                )
                  ? "indeterminate"
                  : undefined
              }
            />
            <Label htmlFor={`group-${groupName}-${isEditing ? "edit" : "add"}`} className="font-medium">
              {groupName}
            </Label>
          </div>
          <div className="ml-6 space-y-1">
            {(groupPermissions as Permission[]).map((permission) => (
              <div key={permission} className="flex items-center space-x-2">
                <Checkbox
                  id={`${permission}-${isEditing ? "edit" : "add"}`}
                  checked={
                    isEditing ? selectedRole?.permissions.includes(permission) : permissions.includes(permission)
                  }
                  onCheckedChange={(checked) => handlePermissionChange(permission, !!checked, isEditing)}
                />
                <Label htmlFor={`${permission}-${isEditing ? "edit" : "add"}`}>
                  {PERMISSION_DISPLAY_NAMES[permission]}
                </Label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
            <p className="text-gray-500">Manage admin roles and their permissions</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Role
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Role</DialogTitle>
                <DialogDescription>Create a new admin role with specific permissions.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Role Name
                  </Label>
                  <Input
                    id="name"
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Permissions</h4>
                  <PermissionsList permissions={newRole.permissions} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" onClick={handleAddRole}>
                  Add Role
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search roles..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Admins</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No roles found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>
                      <Badge variant={role.isSystem ? "default" : "outline"}>
                        {role.isSystem ? ROLE_DISPLAY_NAMES[role.type] : "Custom"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {role.permissions.length} permissions
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{role.adminCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog
                          open={isEditDialogOpen && selectedRole?.id === role.id}
                          onOpenChange={(open) => {
                            setIsEditDialogOpen(open)
                            if (!open) setSelectedRole(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedRole(role)}
                              disabled={role.type === "super-admin"}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Edit Role</DialogTitle>
                              <DialogDescription>Modify role permissions.</DialogDescription>
                            </DialogHeader>
                            {selectedRole && (
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-name" className="text-right">
                                    Role Name
                                  </Label>
                                  <Input
                                    id="edit-name"
                                    value={selectedRole.name}
                                    onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
                                    className="col-span-3"
                                    disabled={selectedRole.isSystem}
                                  />
                                </div>

                                <div className="mt-4">
                                  <h4 className="font-medium mb-2">Permissions</h4>
                                  <PermissionsList permissions={selectedRole.permissions} isEditing={true} />
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button type="submit" onClick={handleEditRole}>
                                Save Changes
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Dialog
                          open={isDeleteDialogOpen && selectedRole?.id === role.id}
                          onOpenChange={(open) => {
                            setIsDeleteDialogOpen(open)
                            if (!open) setSelectedRole(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedRole(role)}
                              disabled={role.type === "super-admin" || role.isSystem}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Deletion</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete the role "{selectedRole?.name}"? This action cannot be
                                undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button variant="destructive" onClick={handleDeleteRole}>
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  )
}
