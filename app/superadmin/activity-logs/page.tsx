"use client"

import { useState } from "react"
import { Search, Filter, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import AdminLayout from "@/components/admin/admin-layout"

// Mock activity logs data
const mockActivityLogs = [
  {
    id: "1",
    user: "John Doe (Super Admin)",
    action: "login",
    description: "Logged in to the admin panel",
    ip: "192.168.1.1",
    timestamp: "2023-05-15T10:30:00Z",
    details: {
      browser: "Chrome 112.0.0",
      os: "Windows 10",
      device: "Desktop",
    },
  },
  {
    id: "2",
    user: "Jane Smith (Product Manager)",
    action: "create",
    description: "Created new product: Classic White T-Shirt",
    ip: "192.168.1.2",
    timestamp: "2023-05-15T09:45:00Z",
    details: {
      productId: "1",
      productName: "Classic White T-Shirt",
      price: "$29.99",
      category: "T-Shirts",
    },
  },
  {
    id: "3",
    user: "Mike Johnson (Order Manager)",
    action: "update",
    description: "Updated order status: ORD-12345",
    ip: "192.168.1.3",
    timestamp: "2023-05-15T08:20:00Z",
    details: {
      orderId: "ORD-12345",
      oldStatus: "processing",
      newStatus: "shipped",
      customer: "Alex Wilson",
    },
  },
  {
    id: "4",
    user: "Sarah Williams (Admin)",
    action: "delete",
    description: "Deleted product: Vintage Denim Jacket",
    ip: "192.168.1.4",
    timestamp: "2023-05-14T16:15:00Z",
    details: {
      productId: "45",
      productName: "Vintage Denim Jacket",
      price: "$89.99",
      category: "Jackets",
    },
  },
  {
    id: "5",
    user: "David Brown (Marketing Manager)",
    action: "create",
    description: "Created new promotion: Summer Sale",
    ip: "192.168.1.5",
    timestamp: "2023-05-14T14:30:00Z",
    details: {
      promotionId: "SUMMER2023",
      discount: "20%",
      startDate: "2023-06-01",
      endDate: "2023-06-30",
    },
  },
  {
    id: "6",
    user: "Emily Davis (Customer Support)",
    action: "update",
    description: "Responded to support ticket: #12345",
    ip: "192.168.1.6",
    timestamp: "2023-05-14T11:45:00Z",
    details: {
      ticketId: "#12345",
      customer: "Chris Thompson",
      subject: "Order Delivery Issue",
      status: "resolved",
    },
  },
  {
    id: "7",
    user: "John Doe (Super Admin)",
    action: "update",
    description: "Updated user role: Jane Smith",
    ip: "192.168.1.1",
    timestamp: "2023-05-13T15:20:00Z",
    details: {
      userId: "2",
      userName: "Jane Smith",
      oldRole: "Editor",
      newRole: "Product Manager",
    },
  },
  {
    id: "8",
    user: "System",
    action: "system",
    description: "Automated inventory update",
    ip: "internal",
    timestamp: "2023-05-13T00:00:00Z",
    details: {
      productsUpdated: 156,
      lowStockItems: 12,
      outOfStockItems: 3,
    },
  },
]

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState(mockActivityLogs)
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedLog, setSelectedLog] = useState(null)

  const filteredLogs = logs.filter(
    (log) =>
      (log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (actionFilter === "all" || log.action === actionFilter),
  )

  const getActionBadgeColor = (action) => {
    switch (action) {
      case "login":
        return "bg-blue-100 text-blue-800"
      case "create":
        return "bg-green-100 text-green-800"
      case "update":
        return "bg-amber-100 text-amber-800"
      case "delete":
        return "bg-red-100 text-red-800"
      case "system":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const actions = ["all", "login", "create", "update", "delete", "system"]

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
          <p className="text-gray-500">Track admin user activities and system events</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-auto md:flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by user or description..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {actions.map((action) => (
                <option key={action} value={action}>
                  {action === "all" ? "All Actions" : action.charAt(0).toUpperCase() + action.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No activity logs found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>
                      <Badge className={getActionBadgeColor(log.action)}>
                        {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.description}</TableCell>
                    <TableCell>{log.ip}</TableCell>
                    <TableCell>{formatDate(log.timestamp)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedLog(log)
                          setIsDetailsOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Activity Details</DialogTitle>
              <DialogDescription>Detailed information about the selected activity.</DialogDescription>
            </DialogHeader>
            {selectedLog && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">User:</div>
                  <div className="text-sm">{selectedLog.user}</div>

                  <div className="text-sm font-medium">Action:</div>
                  <div className="text-sm">
                    <Badge className={getActionBadgeColor(selectedLog.action)}>
                      {selectedLog.action.charAt(0).toUpperCase() + selectedLog.action.slice(1)}
                    </Badge>
                  </div>

                  <div className="text-sm font-medium">Description:</div>
                  <div className="text-sm">{selectedLog.description}</div>

                  <div className="text-sm font-medium">IP Address:</div>
                  <div className="text-sm">{selectedLog.ip}</div>

                  <div className="text-sm font-medium">Timestamp:</div>
                  <div className="text-sm">{formatDate(selectedLog.timestamp)}</div>
                </div>

                <div className="border-t pt-4">
                  <div className="text-sm font-medium mb-2">Additional Details:</div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(selectedLog.details, null, 2)}</pre>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
