import React, { useState, useMemo } from 'react';
import Icon from '../../../../components/AppIcon';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

const MemberTable = ({ 
  members, 
  selectedMembers, 
  onSelectMember, 
  onSelectAll, 
  onViewMember, 
  onEditMember, 
  onDeactivateMember,
  searchTerm,
  onSearchChange,
  sortConfig,
  onSort
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedMembers = useMemo(() => {
    if (!sortConfig.key) return members;

    return [...members].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [members, sortConfig]);

  const filteredMembers = useMemo(() => {
    return sortedMembers.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.membershipId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm)
    );
  }, [sortedMembers, searchTerm]);

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMembers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMembers, currentPage]);

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  const handleSort = (key) => {
    onSort(key);
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={16} className="text-text-muted" />;
    }
    return sortConfig.direction === 'asc' 
      ? <Icon name="ArrowUp" size={16} className="text-primary" />
      : <Icon name="ArrowDown" size={16} className="text-primary" />;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-success-100', text: 'text-success-700', label: 'Active' },
      inactive: { bg: 'bg-error-100', text: 'text-error-700', label: 'Inactive' },
      pending: { bg: 'bg-warning-100', text: 'text-warning-700', label: 'Pending' },
      suspended: { bg: 'bg-error-100', text: 'text-error-700', label: 'Suspended' }
    };

    const config = statusConfig[status] || statusConfig.active;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const isAllSelected = selectedMembers.length === paginatedMembers.length && paginatedMembers.length > 0;
  const isIndeterminate = selectedMembers.length > 0 && selectedMembers.length < paginatedMembers.length;

  // Add a helper to highlight the search term
  function highlightText(text, searchTerm) {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'ig');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <mark key={i} style={{ background: '#ffe066', padding: 0 }}>{part}</mark> : part
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-border">
      {/* Table Header with Search and Actions */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search members by name, email, ID, or phone..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">
              {filteredMembers.length} of {members.length} members
            </span>
            {selectedMembers.length > 0 && (
              <span className="text-sm font-medium text-primary">
                {selectedMembers.length} selected
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-secondary">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={input => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                />
              </th>
              {[
                { key: 'name', label: 'Member Name' },
                { key: 'membershipId', label: 'ID' },
                { key: 'email', label: 'Contact' },
                { key: 'membershipType', label: 'Type' },
                { key: 'status', label: 'Status' },
                { key: 'joinDate', label: 'Join Date' },
                { key: 'lastActivity', label: 'Last Activity' }
              ].map(column => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {getSortIcon(column.key)}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedMembers.map((member) => (
              <tr
                key={member.id}
                className="hover:bg-surface-secondary transition-colors duration-150 cursor-pointer"
                onClick={() => onViewMember(member)}
              >
                <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.id)}
                    onChange={(e) => onSelectMember(member.id, e.target.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{highlightText(member.name, searchTerm)}</p>
                      <p className="text-xs text-text-muted">{member.designation}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm font-medium text-text-primary">{member.membershipId}</p>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="text-sm text-text-primary">{member.email}</p>
                    <p className="text-xs text-text-muted">{member.phone}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-text-primary">{member.membershipType}</span>
                </td>
                <td className="px-4 py-4">
                  {getStatusBadge(member.status)}
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm text-text-primary">{member.joinDate}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm text-text-primary">{member.lastActivity}</p>
                </td>
                <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      iconSize={16}
                      onClick={() => onViewMember(member)}
                      className="text-text-secondary hover:text-primary"
                      title="View Profile"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      iconSize={16}
                      onClick={() => onEditMember(member)}
                      className="text-text-secondary hover:text-primary"
                      title="Edit Member"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="UserX"
                      iconSize={16}
                      onClick={() => onDeactivateMember(member)}
                      className="text-text-secondary hover:text-error"
                      title="Deactivate Member"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        <div className="p-4 space-y-4">
          {paginatedMembers.map((member) => (
            <div
              key={member.id}
              className="bg-surface border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-150"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.id)}
                    onChange={(e) => onSelectMember(member.id, e.target.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{highlightText(member.name, searchTerm)}</p>
                    <p className="text-xs text-text-muted">{member.designation}</p>
                  </div>
                </div>
                {getStatusBadge(member.status)}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <p className="text-text-muted text-xs">Member ID</p>
                  <p className="text-text-primary font-medium">{member.membershipId}</p>
                </div>
                <div>
                  <p className="text-text-muted text-xs">Type</p>
                  <p className="text-text-primary">{member.membershipType}</p>
                </div>
                <div>
                  <p className="text-text-muted text-xs">Join Date</p>
                  <p className="text-text-primary">{member.joinDate}</p>
                </div>
                <div>
                  <p className="text-text-muted text-xs">Last Activity</p>
                  <p className="text-text-primary">{member.lastActivity}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-text-muted text-xs mb-1">Contact</p>
                <p className="text-text-primary text-sm">{member.email}</p>
                <p className="text-text-secondary text-sm">{member.phone}</p>
              </div>

              <div className="flex items-center justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Eye"
                  iconPosition="left"
                  onClick={() => onViewMember(member)}
                  className="text-text-secondary hover:text-primary"
                >
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Edit"
                  iconPosition="left"
                  onClick={() => onEditMember(member)}
                  className="text-text-secondary hover:text-primary"
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="UserX"
                  iconPosition="left"
                  onClick={() => onDeactivateMember(member)}
                  className="text-text-secondary hover:text-error"
                >
                  Deactivate
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredMembers.length)} of {filteredMembers.length} results
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                iconName="ChevronLeft"
                iconSize={16}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="text-text-secondary hover:text-primary disabled:opacity-50"
              />
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={currentPage === pageNum ? "" : "text-text-secondary hover:text-primary"}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                iconName="ChevronRight"
                iconSize={16}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="text-text-secondary hover:text-primary disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberTable;