import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Plus, Search, Filter, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const TicketDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your support tickets.
          </p>
          <button
            onClick={() => navigate('/support/login')}
            className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Mock ticket data
  const tickets = [
    {
      id: 'TICK-1001',
      subject: 'Unable to process shipment',
      category: 'Orders',
      status: 'open',
      priority: 'high',
      createdAt: '2024-11-01 10:30 AM',
      updatedAt: '2024-11-03 02:15 PM',
      assignedTo: 'Support Team A'
    },
    {
      id: 'TICK-1002',
      subject: 'Payment gateway integration issue',
      category: 'Technical',
      status: 'in-progress',
      priority: 'medium',
      createdAt: '2024-11-02 03:45 PM',
      updatedAt: '2024-11-04 11:20 AM',
      assignedTo: 'Tech Support'
    },
    {
      id: 'TICK-1003',
      subject: 'How to integrate WooCommerce?',
      category: 'Integration',
      status: 'resolved',
      priority: 'low',
      createdAt: '2024-10-28 09:15 AM',
      updatedAt: '2024-10-30 04:30 PM',
      assignedTo: 'Support Team B'
    },
    {
      id: 'TICK-1004',
      subject: 'Courier priority settings not working',
      category: 'Configuration',
      status: 'open',
      priority: 'medium',
      createdAt: '2024-11-03 01:20 PM',
      updatedAt: '2024-11-03 01:20 PM',
      assignedTo: 'Support Team A'
    },
    {
      id: 'TICK-1005',
      subject: 'Refund request for cancelled order',
      category: 'Billing',
      status: 'closed',
      priority: 'high',
      createdAt: '2024-10-25 11:00 AM',
      updatedAt: '2024-10-27 03:45 PM',
      assignedTo: 'Billing Team'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock },
      'in-progress': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertCircle },
      resolved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      closed: { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig.open;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {status.replace('-', ' ').toUpperCase()}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-orange-100 text-orange-800',
      low: 'bg-blue-100 text-blue-800'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${priorityConfig[priority]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || ticket.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    closed: tickets.filter(t => t.status === 'closed').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Package className="w-8 h-8 text-indigo-600" />
                <span className="text-xl font-bold text-gray-900">Shiprocket</span>
              </div>
              <span className="text-gray-600">Support Tickets</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/help-center"
                className="text-gray-600 hover:text-gray-900"
              >
                Help Center
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('isLoggedIn');
                  navigate('/support/login');
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-gray-900">{ticketStats.total}</div>
            <div className="text-sm text-gray-600">Total Tickets</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-blue-600">{ticketStats.open}</div>
            <div className="text-sm text-gray-600">Open</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-yellow-600">{ticketStats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-green-600">{ticketStats.resolved}</div>
            <div className="text-sm text-gray-600">Resolved</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-gray-600">{ticketStats.closed}</div>
            <div className="text-sm text-gray-600">Closed</div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Table Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">My Support Tickets</h2>
              <Link 
                to="/tickets/create"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>New Ticket</span>
              </Link>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tickets by ID or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-indigo-600">{ticket.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{ticket.subject}</div>
                      <div className="text-xs text-gray-500">Assigned to: {ticket.assignedTo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{ticket.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(ticket.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{ticket.createdAt}</div>
                      <div className="text-xs text-gray-500">Updated: {ticket.updatedAt}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link 
                        to={`/tickets/${ticket.id}`}
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTickets.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No tickets found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDashboard;
