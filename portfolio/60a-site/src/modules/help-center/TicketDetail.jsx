import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Package, ArrowLeft, Clock, User, Send, Paperclip, CheckCircle, AlertCircle } from 'lucide-react';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState([
    {
      id: 1,
      sender: 'user',
      name: 'John Doe',
      email: 'support@shiprocket.com',
      message: 'I am unable to process my shipment. The system shows an error when I try to generate the shipping label. Can you please help me resolve this issue?',
      timestamp: '2024-11-01 10:30 AM',
      avatar: 'JD'
    },
    {
      id: 2,
      sender: 'agent',
      name: 'Sarah Johnson',
      role: 'Support Agent',
      message: 'Hello John, thank you for reaching out to us. I understand you\'re facing issues with generating shipping labels. Could you please provide me with the order ID so I can investigate this further?',
      timestamp: '2024-11-01 11:15 AM',
      avatar: 'SJ'
    },
    {
      id: 3,
      sender: 'user',
      name: 'John Doe',
      email: 'support@shiprocket.com',
      message: 'Sure, the order ID is ORD-2024-1001. The error message says "Invalid shipping address format".',
      timestamp: '2024-11-01 11:30 AM',
      avatar: 'JD'
    },
    {
      id: 4,
      sender: 'agent',
      name: 'Sarah Johnson',
      role: 'Support Agent',
      message: 'Thank you for providing the order ID. I\'ve checked your order and found that the pincode field has some extra spaces. I\'ve corrected it on our end. Please try generating the label again and let me know if you face any issues.',
      timestamp: '2024-11-01 02:00 PM',
      avatar: 'SJ'
    },
    {
      id: 5,
      sender: 'user',
      name: 'John Doe',
      email: 'support@shiprocket.com',
      message: 'It worked! Thank you so much for the quick resolution. Really appreciate your help.',
      timestamp: '2024-11-03 02:15 PM',
      avatar: 'JD'
    }
  ]);

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
            You need to be logged in to view ticket details.
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
  const ticket = {
    id: 'TICK-1001',
    subject: 'Unable to process shipment',
    category: 'Orders',
    status: 'in-progress',
    priority: 'high',
    createdAt: '2024-11-01 10:30 AM',
    updatedAt: '2024-11-03 02:15 PM',
    assignedTo: {
      name: 'Sarah Johnson',
      role: 'Support Agent',
      team: 'Support Team A',
      avatar: 'SJ'
    },
    customer: {
      name: 'John Doe',
      email: 'support@shiprocket.com',
      avatar: 'JD'
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const newConversation = {
      id: conversations.length + 1,
      sender: 'user',
      name: ticket.customer.name,
      email: ticket.customer.email,
      message: newMessage,
      timestamp: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      avatar: ticket.customer.avatar
    };

    setConversations([...conversations, newConversation]);
    setNewMessage('');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Open' },
      'in-progress': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'In Progress' },
      resolved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Resolved' },
      closed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Closed' }
    };

    const config = statusConfig[status] || statusConfig.open;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
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
              <span className="text-gray-600">Ticket Details</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/tickets" className="text-gray-600 hover:text-gray-900">
                My Tickets
              </Link>
              <Link to="/help-center" className="text-gray-600 hover:text-gray-900">
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/tickets')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tickets</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Conversation Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-semibold text-gray-900">
                      {ticket.subject}
                    </h1>
                    {getStatusBadge(ticket.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Created: {ticket.createdAt}
                    </span>
                    <span>•</span>
                    <span>Ticket ID: {ticket.id}</span>
                  </div>
                </div>
                <div>
                  {getPriorityBadge(ticket.priority)}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Category:</span>
                <span>{ticket.category}</span>
              </div>
            </div>

            {/* Conversation Thread */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Conversation</h2>
              </div>

              <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`flex gap-4 ${conv.sender === 'user' ? '' : 'bg-blue-50 -mx-6 px-6 py-4'}`}
                  >
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${
                      conv.sender === 'user' ? 'bg-indigo-600' : 'bg-green-600'
                    }`}>
                      {conv.avatar}
                    </div>

                    {/* Message Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{conv.name}</span>
                        {conv.sender === 'agent' && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            {conv.role}
                          </span>
                        )}
                        {conv.sender === 'user' && (
                          <span className="text-xs text-gray-500">{conv.email}</span>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed mb-2">
                        {conv.message}
                      </p>
                      <span className="text-xs text-gray-500">{conv.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <form onSubmit={handleSendMessage}>
                  <div className="mb-3">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message here..."
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Paperclip className="w-4 h-4" />
                      <span className="text-sm">Attach File</span>
                    </button>
                    <button
                      type="submit"
                      disabled={newMessage.trim() === ''}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${
                        newMessage.trim() !== ''
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Reply</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar - Ticket Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Assigned Agent */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Assigned Agent</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
                  {ticket.assignedTo.avatar}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{ticket.assignedTo.name}</p>
                  <p className="text-sm text-gray-600">{ticket.assignedTo.role}</p>
                  <p className="text-xs text-gray-500">{ticket.assignedTo.team}</p>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Customer Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                    {ticket.customer.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{ticket.customer.name}</p>
                    <p className="text-sm text-gray-600">{ticket.customer.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Ticket Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ticket ID:</span>
                  <span className="font-medium text-gray-900">{ticket.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  {getStatusBadge(ticket.status)}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Priority:</span>
                  {getPriorityBadge(ticket.priority)}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium text-gray-900">{ticket.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900">{ticket.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="text-gray-900">{ticket.updatedAt}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Mark as Resolved
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  Close Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
