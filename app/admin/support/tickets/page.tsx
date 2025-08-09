"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Eye, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import AdminLayout from "@/components/admin/admin-layout"
import { useAdminAuth } from "@/context/admin-auth-context"

// Mock support tickets data
const mockTickets = [
  {
    id: "TKT-12345",
    customer: "John Doe",
    email: "john@example.com",
    subject: "Order Delivery Issue",
    date: "2023-05-15T10:30:00Z",
    status: "open",
    priority: "high",
    lastUpdated: "2023-05-15T10:30:00Z",
  },
  {
    id: "TKT-12346",
    customer: "Jane Smith",
    email: "jane@example.com",
    subject: "Product Return Request",
    date: "2023-05-14T14:45:00Z",
    status: "in-progress",
    priority: "medium",
    lastUpdated: "2023-05-14T16:20:00Z",
  },
  {
    id: "TKT-12347",
    customer: "Mike Johnson",
    email: "mike@example.com",
    subject: "Payment Issue",
    date: "2023-05-13T09:15:00Z",
    status: "in-progress",
    priority: "high",
    lastUpdated: "2023-05-13T11:30:00Z",
  },
  {
    id: "TKT-12348",
    customer: "Sarah Williams",
    email: "sarah@example.com",
    subject: "Product Information Request",
    date: "2023-05-12T16:20:00Z",
    status: "resolved",
    priority: "low",
    lastUpdated: "2023-05-12T17:45:00Z",
  },
  {
    id: "TKT-12349",
    customer: "David Brown",
    email: "david@example.com",
    subject: "Website Technical Issue",
    date: "2023-05-11T11:10:00Z",
    status: "resolved",
    priority: "medium",
    lastUpdated: "2023-05-11T14:25:00Z",
  },
  {
    id: "TKT-12350",
    customer: "Emily Davis",
    email: "emily@example.com",
    subject: "Discount Code Not Working",
    date: "2023-05-10T13:25:00Z",
    status: "open",
    priority: "medium",
    lastUpdated: "2023-05-10T13:25:00Z",
  },
]

export default function SupportTicketsPage() {
  const [tickets] = useState(mockTickets)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const { hasPermission } = useAdminAuth()
  const canManageTickets = hasPermission("manage_support_tickets")

  const filteredTickets = tickets.filter(
    (ticket) =>
      (ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === "all" || ticket.status === statusFilter) &&
      (priorityFilter === "all" || ticket.priority === priorityFilter),
  )

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-amber-100 text-amber-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-amber-100 text-amber-800"
      case "low":
        return "bg-green-100 text-green-800"
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

  const statuses = ["all", "open", "in-progress", "resolved", "closed"]
  const priorities = ["all", "high", "medium", "low"]

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
          <p className="text-gray-500">Manage customer support tickets</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-auto md:flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search tickets..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "all"
                      ? "All Statuses"
                      : status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority === "all" ? "All Priorities" : priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No tickets found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>
                      <div>
                        <div>{ticket.customer}</div>
                        <div className="text-sm text-gray-500">{ticket.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>{formatDate(ticket.date)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(ticket.status)}>
                        {ticket.status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityBadgeColor(ticket.priority)}>
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/support/tickets/${ticket.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
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
