import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const About = ({ isSidebarCollapsed, isSidebarVisible }) => {
  const [team, setTeam] = useState([]);
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.title && form.description) {
      setTeam(prev => [...prev, { ...form, id: Date.now() }]);
      setForm({ name: '', title: '', description: '' });
    }
  };

  const handleDelete = (id) => {
    setTeam(prev => prev.filter(member => member.id !== id));
  };

  return (
    <div className="flex h-screen bg-background">
      <NavigationSidebar 
        isCollapsed={isSidebarCollapsed} 
        isVisible={isSidebarVisible} 
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarVisible 
          ? (isSidebarCollapsed ? 'ml-16' : 'ml-64') 
          : 'ml-0'
      }`}>
        <Header />
        
        <main className="flex-1 overflow-auto p-6">
          <BreadcrumbNavigation 
            items={[
              { label: 'Dashboard', href: '/admin' },
              { label: 'About', href: '/admin/about' }
            ]} 
          />
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-surface border border-border rounded-xl shadow-sm p-8 mb-8">
              <h1 className="text-2xl font-bold text-text-primary mb-6">About Page Management</h1>
              
              <form onSubmit={handleSubmit} className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Add Team Member</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="border border-border rounded-lg px-4 py-2"
                    required
                  />
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    placeholder="Title/Position"
                    className="border border-border rounded-lg px-4 py-2"
                    required
                  />
                  <Button type="submit" iconName="Plus">
                    Add Member
                  </Button>
                </div>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  className="w-full border border-border rounded-lg px-4 py-2"
                  rows="3"
                  required
                />
              </form>

              <div>
                <h2 className="text-lg font-semibold mb-4">Team Members ({team.length})</h2>
                {team.length === 0 ? (
                  <p className="text-text-muted">No team members added yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {team.map((member) => (
                      <div key={member.id} className="border border-border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{member.name}</h3>
                          <Button
                            size="sm"
                            variant="ghost"
                            iconName="Trash2"
                            onClick={() => handleDelete(member.id)}
                            className="text-red-600 hover:text-red-800"
                          />
                        </div>
                        <p className="text-sm text-primary font-medium mb-2">{member.title}</p>
                        <p className="text-sm text-text-muted">{member.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default About;
