import React, { useState, useRef } from 'react';
import Header from '../../components/ui/Header';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import useCoolAlert from '../../hooks/useCoolAlert';

const TEAM_KEY = 'aboutPageTeam';
const PRESIDENT_KEY = 'presidentDetails';

const getStoredTeam = () => {
  const stored = localStorage.getItem(TEAM_KEY);
  return stored ? JSON.parse(stored) : [];
};

const getPresident = () => {
  const stored = localStorage.getItem(PRESIDENT_KEY);
  return stored ? JSON.parse(stored) : {
    name: '',
    title: 'Club President',
    description: '',
    photo: null,
    photoPreview: null,
  };
};

const About = ({ isSidebarCollapsed, isSidebarVisible }) => {
  const alert = useCoolAlert();
  const [team, setTeam] = useState(getStoredTeam());
  const [president, setPresident] = useState(getPresident());
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    photo: null,
    photoPreview: null,
  });
  const [presidentForm, setPresidentForm] = useState(getPresident());
  const [editIndex, setEditIndex] = useState(null);
  const fileInputRef = useRef(null);
  const presidentInputRef = useRef(null);

  // Loading states for image uploads
  const [isPresidentPhotoUploading, setIsPresidentPhotoUploading] = useState(false);
  const [isTeamPhotoUploading, setIsTeamPhotoUploading] = useState(false);
  const [presidentUploadProgress, setPresidentUploadProgress] = useState(0);
  const [teamUploadProgress, setTeamUploadProgress] = useState(0);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'About Management', href: '/admin/about' }
  ];



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert.error(
        '🚫 Invalid File Type',
        'Please select a valid image file (PNG, JPG, JPEG, GIF)',
        {
          animation: 'shake',
          sound: true
        }
      );
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert.error(
        '📁 File Too Large',
        'Image size must be less than 5MB. Please choose a smaller file.',
        {
          animation: 'shake',
          sound: true
        }
      );
      return;
    }

    // Start loading animation
    setIsTeamPhotoUploading(true);
    setTeamUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setTeamUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    const reader = new FileReader();
    reader.onload = (ev) => {
      // Complete the progress
      setTeamUploadProgress(100);

      setTimeout(() => {
        setForm(f => ({ ...f, photo: ev.target.result, photoPreview: ev.target.result }));
        setIsTeamPhotoUploading(false);
        setTeamUploadProgress(0);
        alert.celebration(
          '🎉 Photo Uploaded!',
          'Team member photo has been uploaded successfully!',
          {
            animation: 'bounce',
            gradient: true,
            sound: true,
            autoClose: true,
            autoCloseDelay: 3000
          }
        );
      }, 500);
    };

    reader.onerror = () => {
      clearInterval(progressInterval);
      setIsTeamPhotoUploading(false);
      setTeamUploadProgress(0);
      alert.urgent(
        '🚨 Upload Failed',
        'An error occurred while uploading the photo. Please try again.',
        {
          animation: 'shake',
          gradient: true,
          sound: true
        }
      );
    };

    reader.readAsDataURL(file);
  };

  const handlePresidentInputChange = (e) => {
    const { name, value } = e.target;
    setPresidentForm(f => ({ ...f, [name]: value }));
  };

  const handlePresidentPhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert.error(
        '🚫 Invalid File Type',
        'Please select a valid image file (PNG, JPG, JPEG, GIF)',
        {
          animation: 'shake',
          sound: true
        }
      );
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert.error(
        '📁 File Too Large',
        'Image size must be less than 5MB. Please choose a smaller file.',
        {
          animation: 'shake',
          sound: true
        }
      );
      return;
    }

    // Start loading animation
    setIsPresidentPhotoUploading(true);
    setPresidentUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setPresidentUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    const reader = new FileReader();
    reader.onload = (ev) => {
      // Complete the progress
      setPresidentUploadProgress(100);

      setTimeout(() => {
        setPresidentForm(f => ({ ...f, photo: ev.target.result, photoPreview: ev.target.result }));
        setIsPresidentPhotoUploading(false);
        setPresidentUploadProgress(0);
        alert.celebration(
          '👑 President Photo Uploaded!',
          'President photo has been uploaded successfully!',
          {
            animation: 'bounce',
            gradient: true,
            sound: true,
            autoClose: true,
            autoCloseDelay: 3000
          }
        );
      }, 500);
    };

    reader.onerror = () => {
      clearInterval(progressInterval);
      setIsPresidentPhotoUploading(false);
      setPresidentUploadProgress(0);
      alert.urgent(
        '🚨 Upload Failed',
        'An error occurred while uploading the president photo. Please try again.',
        {
          animation: 'shake',
          gradient: true,
          sound: true
        }
      );
    };

    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setForm({ name: '', title: '', description: '', photo: null, photoPreview: null });
    setEditIndex(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.title || !form.description || !form.photo) {
      alert.error(
        '📝 Missing Information',
        'Please fill in all required fields including uploading a photo.',
        {
          animation: 'shake',
          sound: true
        }
      );
      return;
    }

    let updatedTeam;
    if (editIndex !== null) {
      updatedTeam = [...team];
      updatedTeam[editIndex] = { ...form };
      alert.celebration(
        '✅ Member Updated!',
        `${form.name}'s information has been updated successfully!`,
        {
          animation: 'bounce',
          gradient: true,
          sound: true,
          autoClose: true,
          autoCloseDelay: 3000
        }
      );
    } else {
      updatedTeam = [...team, { ...form }];
      alert.celebration(
        '🎉 Member Added!',
        `${form.name} has been successfully added to the team!`,
        {
          animation: 'bounce',
          gradient: true,
          sound: true,
          autoClose: true,
          autoCloseDelay: 3000
        }
      );
    }

    setTeam(updatedTeam);
    localStorage.setItem(TEAM_KEY, JSON.stringify(updatedTeam));
    window.dispatchEvent(new Event('teamDataUpdated'));
    resetForm();
  };

  const handlePresidentSubmit = (e) => {
    e.preventDefault();
    if (!presidentForm.name || !presidentForm.title || !presidentForm.description || !presidentForm.photo) {
      alert.error(
        '📝 Missing Information',
        'Please fill in all required fields including uploading a photo for the president.',
        {
          animation: 'shake',
          sound: true
        }
      );
      return;
    }

    console.log('Admin: Saving president data:', presidentForm);
    setPresident(presidentForm);
    localStorage.setItem(PRESIDENT_KEY, JSON.stringify(presidentForm));
    console.log('Admin: Data saved to localStorage, dispatching event');
    window.dispatchEvent(new Event('teamDataUpdated'));

    alert.celebration(
      '👑 President Details Updated!',
      `${presidentForm.name}'s information has been saved successfully!`,
      {
        animation: 'bounce',
        gradient: true,
        sound: true,
        autoClose: true,
        autoCloseDelay: 3000
      }
    );
  };

  const handleEdit = (idx) => {
    const member = team[idx];
    setForm({
      name: member.name,
      title: member.title,
      description: member.description,
      photo: member.photo,
      photoPreview: member.photo,
    });
    setEditIndex(idx);
  };

  const handleDelete = (idx) => {
    const memberName = team[idx]?.name || 'Team member';

    alert.warning(
      '🗑️ Member Removed',
      `${memberName} has been removed from the team.`,
      {
        animation: 'fade',
        sound: true,
        autoClose: true,
        autoCloseDelay: 2500
      }
    );

    const updatedTeam = team.filter((_, i) => i !== idx);
    setTeam(updatedTeam);
    localStorage.setItem(TEAM_KEY, JSON.stringify(updatedTeam));
    window.dispatchEvent(new Event('teamDataUpdated'));
    if (editIndex === idx) resetForm();
  };

  const presidentDetails = president.photoPreview ? (
    <img
      src={president.photoPreview}
      alt="President Preview"
      className="w-32 h-32 object-cover rounded border mb-2"
    />
  ) : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <NavigationSidebar isCollapsed={isSidebarCollapsed} isVisible={isSidebarVisible} />

      <main className={`transition-all duration-300 ${
        isSidebarVisible ? (isSidebarCollapsed ? 'ml-16' : 'ml-64') : 'ml-0'
      } pt-16`}>
        <div className="p-6 max-w-7xl mx-auto">
          <BreadcrumbNavigation items={breadcrumbItems} />

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2 flex items-center">
              <Icon name="Users" size={28} className="mr-3 text-primary" />
              Team Management
            </h1>
            <p className="text-text-muted text-lg">
              Manage your club's leadership team and member information
            </p>
          </div>

 
          {/* President Details Form */}
          <form onSubmit={handlePresidentSubmit} className="bg-surface border border-border rounded-xl shadow-sm p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-text-primary flex items-center">
                  <Icon name="Crown" size={24} className="mr-3 text-yellow-500" />
                  President Details
                </h2>
                <p className="text-text-muted mt-1">
                  Configure the club president's information and profile
                </p>
              </div>
              {president.name && (
                <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <Icon name="CheckCircle" size={16} />
                  <span>Profile Complete</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={presidentForm.name}
                    onChange={handlePresidentInputChange}
                    className="w-full border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Enter president's full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Title/Designation *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={presidentForm.title}
                    onChange={handlePresidentInputChange}
                    className="w-full border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="e.g., President, Club President"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={presidentForm.description}
                    onChange={handlePresidentInputChange}
                    className="w-full border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
                    rows={4}
                    placeholder="Brief description about the president..."
                    required
                  />
                </div>
              </div>

              {/* Right Column - Photo Upload */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Profile Photo
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isPresidentPhotoUploading
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary'
                  }`}>
                    <input
                      type="file"
                      accept="image/*"
                      ref={presidentInputRef}
                      onChange={handlePresidentPhotoChange}
                      className="hidden"
                      id="president-photo"
                      disabled={isPresidentPhotoUploading}
                    />

                    {isPresidentPhotoUploading ? (
                      <div className="space-y-3">
                        <div className="animate-spin mx-auto">
                          <Icon name="Loader2" size={32} className="text-primary" />
                        </div>
                        <p className="text-sm text-primary font-medium">Uploading photo...</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${presidentUploadProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-text-muted">{presidentUploadProgress}% complete</p>
                      </div>
                    ) : (
                      <label htmlFor="president-photo" className="cursor-pointer">
                        <Icon name="Upload" size={32} className="mx-auto mb-2 text-text-muted" />
                        <p className="text-sm text-text-muted mb-1">Click to upload photo</p>
                        <p className="text-xs text-text-muted">PNG, JPG up to 5MB</p>
                      </label>
                    )}
                  </div>
                </div>

                {/* Photo Preview */}
                <div className="bg-surface-hover rounded-lg p-4">
                  {presidentDetails}
                </div>
              </div>
            </div>
            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-border">
              <Button
                type="submit"
                iconName="Save"
                className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
              >
                Update President
              </Button>
            </div>
          </form>

 
          {/* Team Members Section */}
          <div className="bg-surface border border-border rounded-xl shadow-sm p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-text-primary flex items-center">
                  <Icon name="Users" size={24} className="mr-3 text-blue-500" />
                  Team Members
                </h2>
                <p className="text-text-muted mt-1">
                  Add and manage your club's team members
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                <Icon name="Users" size={16} />
                <span>{team.length} Members</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-surface-hover rounded-lg p-6 border border-border">
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                <Icon name="UserPlus" size={20} className="mr-2 text-green-500" />
                Add New Team Member
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      className="w-full border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="Enter member's full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Title/Designation *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleInputChange}
                      className="w-full border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="e.g., Vice President, Secretary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleInputChange}
                      className="w-full border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
                      rows={3}
                      placeholder="Brief description about the team member..."
                      required
                    />
                  </div>
                </div>

                {/* Right Column - Photo Upload */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Profile Photo
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      isTeamPhotoUploading
                        ? 'border-green-500 bg-green-50'
                        : 'border-border hover:border-primary'
                    }`}>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handlePhotoChange}
                        className="hidden"
                        id="team-photo"
                        disabled={isTeamPhotoUploading}
                      />

                      {isTeamPhotoUploading ? (
                        <div className="space-y-3">
                          <div className="animate-spin mx-auto">
                            <Icon name="Loader2" size={32} className="text-green-600" />
                          </div>
                          <p className="text-sm text-green-600 font-medium">Uploading photo...</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${teamUploadProgress}%` }}
                            />
                          </div>
                          <p className="text-xs text-text-muted">{teamUploadProgress}% complete</p>
                        </div>
                      ) : (
                        <label htmlFor="team-photo" className="cursor-pointer">
                          <Icon name="Upload" size={32} className="mx-auto mb-2 text-text-muted" />
                          <p className="text-sm text-text-muted mb-1">Click to upload photo</p>
                          <p className="text-xs text-text-muted">PNG, JPG up to 5MB</p>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Photo Preview */}
                  {form.photoPreview && (
                    <div className="bg-surface rounded-lg p-4 border border-border">
                      <p className="text-sm font-medium text-text-primary mb-2">Preview:</p>
                      <img
                        src={form.photoPreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border border-border"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-border">
                <Button
                  type="submit"
                  iconName={editIndex !== null ? 'Edit' : 'UserPlus'}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  {editIndex !== null ? 'Update Member' : 'Add Member'}
                </Button>
                {editIndex !== null && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={resetForm}
                    iconName="X"
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>

            {/* Team Members List */}
            <div className="mt-8 bg-surface rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-text-primary flex items-center">
                  <Icon name="Users" size={22} className="mr-2 text-blue-500" />
                  Current Team Members
                </h3>
                <div className="text-sm text-text-muted bg-blue-50 px-3 py-1 rounded-full">
                  {team.length} {team.length === 1 ? 'Member' : 'Members'}
                </div>
              </div>

              {team.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="Users" size={48} className="mx-auto mb-4 text-text-muted" />
                  <p className="text-text-muted text-lg mb-2">No team members added yet</p>
                  <p className="text-text-muted text-sm">Add your first team member using the form above</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {team.map((member, idx) => (
                    <div key={idx} className="bg-white rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
                      {/* Member Photo */}
                      <div className="flex items-center mb-4">
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-16 h-16 object-cover rounded-full border-2 border-gray-200"
                        />
                        <div className="ml-4 flex-1">
                          <h4 className="font-semibold text-text-primary text-lg">{member.name}</h4>
                          <p className="text-primary text-sm font-medium">{member.title}</p>
                        </div>
                      </div>

                      {/* Member Description */}
                      <p className="text-text-muted text-sm leading-relaxed mb-4">
                        {member.description}
                      </p>

                      {/* Action Buttons */}
                        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                          <Button
                            size="sm"
                            variant="ghost"
                            iconName="Edit"
                            onClick={() => handleEdit(idx)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            iconName="Trash2"
                            onClick={() => handleDelete(idx)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          />
                        </div>
                    </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
};

export default About;
