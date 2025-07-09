import React, { useState } from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';

const MemberInquisitiveList = ({
  videos,
  onEditVideo,
  onDuplicateVideo,
  onDeleteVideo,
  onViewVideo,
  onToggleStatus
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Get unique categories for filter
  const categories = [...new Set(videos.map(video => video.category))];

  // Sort and filter videos
  const sortedAndFilteredVideos = videos
    .filter(video => {
      if (filterStatus !== 'all' && video.status !== filterStatus) return false;
      if (filterCategory !== 'all' && video.category !== filterCategory) return false;
      return true;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getYouTubeVideoId = (url) => {
    if (!url) return null;

    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/embed\/|youtu\.be\/)([^?&\n]+)/,
      /youtube\.com\/watch\?v=([^&\n]+)/,
      /youtube\.com\/watch\?.*&v=([^&\n]+)/,
      /youtu\.be\/([^?&\n]+)/,
      /youtube\.com\/v\/([^?&\n]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  const getYouTubeThumbnail = (url) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return null;

    // Try high quality thumbnail first, fallback to medium quality
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  const getYouTubeThumbnailFallback = (url) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return null;

    // Medium quality fallback
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  };

  return (
    <div className="p-8">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Icon name="Filter" size={16} className="text-gray-600" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Filters:</span>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Icon name="ArrowUpDown" size={16} className="text-gray-600" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Sort:</span>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          >
            <option value="createdAt">Date Created</option>
            <option value="title">Title</option>
            <option value="category">Category</option>
            <option value="priority">Priority</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>

          <div className="flex items-center border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Icon name="Grid3X3" size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Icon name="List" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center border border-blue-200">
          <div className="text-3xl font-bold text-blue-600 mb-2">{videos.length}</div>
          <div className="text-sm font-medium text-blue-700">Total Videos</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center border border-green-200">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {videos.filter(v => v.status === 'active').length}
          </div>
          <div className="text-sm font-medium text-green-700">Active</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl text-center border border-orange-200">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {videos.filter(v => v.status === 'inactive').length}
          </div>
          <div className="text-sm font-medium text-orange-700">Inactive</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center border border-purple-200">
          <div className="text-3xl font-bold text-purple-600 mb-2">{categories.length}</div>
          <div className="text-sm font-medium text-purple-700">Categories</div>
        </div>
      </div>

      {/* Videos Grid/List */}
      {sortedAndFilteredVideos.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Video" size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-3">No videos found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {videos.length === 0
              ? "Get started by adding your first member inquisitive video to showcase your community."
              : "Try adjusting your filters to see more videos."
            }
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'
          : 'space-y-6'
        }>
          {sortedAndFilteredVideos.map((video) => (
            <div
              key={video.id}
              className={`bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300 ${
                viewMode === 'list' ? 'flex items-center' : ''
              }`}
            >
              {/* Video Thumbnail */}
              <div className={`relative ${viewMode === 'list' ? 'w-40 h-28 flex-shrink-0' : 'h-52'} bg-gray-100 overflow-hidden`}>
                <img
                  src={getYouTubeThumbnail(video.videoUrl)}
                  alt={video.title}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  onError={(e) => {
                    // Try fallback thumbnail first
                    const fallbackUrl = getYouTubeThumbnailFallback(video.videoUrl);
                    if (fallbackUrl && e.target.src !== fallbackUrl) {
                      e.target.src = fallbackUrl;
                    } else {
                      // Final fallback to placeholder
                      e.target.src = 'https://via.placeholder.com/480x360/f3f4f6/9ca3af?text=Video+Thumbnail';
                    }
                  }}
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
                    <Icon name="Play" size={20} className="text-gray-800 ml-1" />
                  </div>
                </div>
                {/* Video duration badge (if available) */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  <Icon name="Video" size={12} className="inline mr-1" />
                  Video
                </div>
              </div>

              {/* Content */}
              <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 flex-1 mr-3">{video.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    video.status === 'active'
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}>
                    {video.status}
                  </span>
                </div>

                {video.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-200">
                    {video.category}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                    video.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                    video.priority === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    'bg-gray-50 text-gray-700 border-gray-200'
                  }`}>
                    {video.priority} priority
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Eye"
                    onClick={() => onViewVideo(video.id)}
                    className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Edit"
                    onClick={() => onEditVideo(video.id)}
                    className="text-xs text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Copy"
                    onClick={() => onDuplicateVideo(video.id)}
                    className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  >
                    Duplicate
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName={video.status === 'active' ? 'Pause' : 'Play'}
                    onClick={() => onToggleStatus(video.id)}
                    className={`text-xs ${
                      video.status === 'active'
                        ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50'
                        : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                    }`}
                  >
                    {video.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Trash2"
                    onClick={() => onDeleteVideo(video.id)}
                    className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberInquisitiveList;
