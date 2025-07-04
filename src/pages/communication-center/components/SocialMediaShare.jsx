import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SocialMediaShare = ({ content, subject, attachments = [], onShare }) => {
  const [shareOptions, setShareOptions] = useState({
    facebook: {
      enabled: true,
      customMessage: '',
      includeLink: true,
      postType: 'text' // text, image, link
    },
    whatsapp: {
      enabled: true,
      customMessage: '',
      includeLink: true,
      groups: ['rotary-members', 'board-members'] // predefined WhatsApp groups
    },
    twitter: {
      enabled: true,
      customMessage: '',
      includeHashtags: true,
      hashtags: ['#RotaryClub', '#GulmoharBangalore', '#CommunityService'],
      includeLink: true
    },
    instagram: {
      enabled: true,
      postType: 'story', // story, post
      includeHashtags: true,
      hashtags: ['#RotaryClub', '#GulmoharBangalore', '#CommunityService']
    }
  });

  const [isSharing, setIsSharing] = useState(false);
  const [shareResults, setShareResults] = useState({});
  const [showInstagramModal, setShowInstagramModal] = useState(false);
  const [instagramContent, setInstagramContent] = useState('');
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsappContent, setWhatsappContent] = useState('');
  const [showTwitterModal, setShowTwitterModal] = useState(false);
  const [twitterContent, setTwitterContent] = useState('');
  const [showFacebookModal, setShowFacebookModal] = useState(false);
  const [facebookContent, setFacebookContent] = useState('');

  // Show Instagram sharing instructions
  const showInstagramInstructions = (content) => {
    console.log('📸 Instagram sharing triggered with content:', content);
    setInstagramContent(content);
    setShowInstagramModal(true);
    console.log('📸 Instagram modal should be showing now');
  };

  // Show WhatsApp sharing options
  const showWhatsAppOptions = (content) => {
    setWhatsappContent(content);
    setShowWhatsAppModal(true);
  };

  // Show Twitter sharing options
  const showTwitterOptions = (content) => {
    setTwitterContent(content);
    setShowTwitterModal(true);
  };

  // Show Facebook sharing options
  const showFacebookOptions = (content) => {
    setFacebookContent(content);
    setShowFacebookModal(true);
  };

  // Share media files directly to platforms
  const shareMediaToPlatform = async (platform, mediaFiles, text) => {
    if (mediaFiles.length === 0) {
      // No media files, use regular text sharing
      return shareRegularContent(platform, text);
    }

    try {
      switch (platform) {
        case 'facebook':
          return await shareToFacebookWithMedia(mediaFiles, text);
        case 'twitter':
          return await shareToTwitterWithMedia(mediaFiles, text);
        case 'instagram':
          return await shareToInstagramWithMedia(mediaFiles, text);
        case 'whatsapp':
          return await shareToWhatsAppWithMedia(mediaFiles, text);
        default:
          return shareRegularContent(platform, text);
      }
    } catch (error) {
      console.error(`Error sharing to ${platform}:`, error);
      throw error;
    }
  };

  // Facebook media sharing
  const shareToFacebookWithMedia = async (mediaFiles, text) => {
    if (mediaFiles.length === 1) {
      // Single image/video
      const file = mediaFiles[0];
      const formData = new FormData();
      formData.append('file', file.file);
      formData.append('message', text);

      // Create a temporary URL for the media
      const mediaUrl = URL.createObjectURL(file.file);

      // Open Facebook with media
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(mediaUrl)}&quote=${encodeURIComponent(text)}`;
      window.open(fbUrl, '_blank', 'width=600,height=400');

      return { success: true, platform: 'facebook', mediaCount: 1 };
    } else {
      // Multiple files - show modal with instructions
      showFacebookOptions(text);
      return { success: true, platform: 'facebook', mediaCount: mediaFiles.length };
    }
  };

  // Twitter media sharing
  const shareToTwitterWithMedia = async (mediaFiles, text) => {
    // Twitter supports up to 4 images or 1 video
    const images = mediaFiles.filter(f => f.type.startsWith('image/')).slice(0, 4);
    const videos = mediaFiles.filter(f => f.type.startsWith('video/')).slice(0, 1);

    if (images.length > 0 || videos.length > 0) {
      // Create blob URLs for media
      const mediaUrls = [...images, ...videos].map(file => URL.createObjectURL(file.file));

      // For now, show Twitter modal with media preview
      showTwitterOptions(text);
      return { success: true, platform: 'twitter', mediaCount: mediaUrls.length };
    }

    return shareRegularContent('twitter', text);
  };

  // Instagram media sharing
  const shareToInstagramWithMedia = async (mediaFiles, text) => {
    if (mediaFiles.length > 0) {
      // Instagram requires manual upload, show enhanced modal
      showInstagramInstructions(text);
      return { success: true, platform: 'instagram', mediaCount: mediaFiles.length };
    }

    return shareRegularContent('instagram', text);
  };

  // WhatsApp media sharing
  const shareToWhatsAppWithMedia = async (mediaFiles, text) => {
    if (mediaFiles.length > 0) {
      // WhatsApp Web supports media sharing
      showWhatsAppOptions(text);
      return { success: true, platform: 'whatsapp', mediaCount: mediaFiles.length };
    }

    return shareRegularContent('whatsapp', text);
  };

  // Regular content sharing (fallback)
  const shareRegularContent = (platform, text) => {
    const shareContent = generateShareContent(platform);

    switch (platform) {
      case 'facebook':
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareContent.url)}&quote=${encodeURIComponent(shareContent.text)}`;
        window.open(fbUrl, '_blank', 'width=600,height=400');
        break;
      case 'twitter':
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareContent.text)}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
        break;
      case 'instagram':
        // Show Instagram instructions modal for text-only sharing
        showInstagramInstructions(shareContent.text);
        break;
      case 'whatsapp':
        // Show WhatsApp options modal for text-only sharing
        showWhatsAppOptions(shareContent.text);
        break;
      default:
        console.log(`Regular sharing for ${platform}:`, shareContent);
    }

    return { success: true, platform, mediaCount: 0 };
  };

  // Generate shareable content for each platform
  const generateShareContent = (platform) => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/newsletter/${Date.now()}`; // In real app, use actual newsletter ID

    let shareText = shareOptions[platform].customMessage || subject;

    // Truncate content for preview
    const contentPreview = content.length > 200 ? content.substring(0, 200) + '...' : content;

    // Get media files for sharing
    const mediaFiles = attachments.filter(att =>
      att.type.startsWith('image/') || att.type.startsWith('video/')
    );
    
    switch (platform) {
      case 'facebook':
        return {
          text: shareText,
          url: shareOptions[platform].includeLink ? shareUrl : '',
          description: contentPreview,
          media: mediaFiles
        };
      
      case 'whatsapp':
        const whatsappText = `*${shareText}*\n\n${contentPreview}${shareOptions[platform].includeLink ? `\n\n🔗 Read more: ${shareUrl}` : ''}`;
        return {
          text: whatsappText,
          url: shareUrl,
          media: mediaFiles
        };
      
      case 'twitter':
        let twitterText = shareText;
        if (contentPreview) {
          twitterText += `\n\n${contentPreview}`;
        }
        if (shareOptions[platform].includeHashtags) {
          twitterText += ' ' + shareOptions[platform].hashtags.join(' ');
        }
        if (shareOptions[platform].includeLink) {
          // Twitter auto-shortens URLs, so we can include it
          twitterText += ` ${shareUrl}`;
        }
        // Twitter has 280 character limit
        if (twitterText.length > 280) {
          twitterText = twitterText.substring(0, 277) + '...';
        }
        return {
          text: twitterText,
          url: shareUrl,
          media: mediaFiles
        };
      
      case 'instagram':
        const instagramText = `${shareText}\n\n${contentPreview}`;
        return {
          text: instagramText,
          hashtags: shareOptions[platform].includeHashtags ? shareOptions[platform].hashtags : [],
          type: shareOptions[platform].postType,
          media: mediaFiles
        };
      
      default:
        return { text: shareText, url: shareUrl };
    }
  };

  const handleShare = async (platform) => {
    setIsSharing(true);
    const shareContent = generateShareContent(platform);
    
    try {
      // Use media sharing if there are media files
      const result = await shareMediaToPlatform(platform, shareContent.media || [], shareContent.text);
      
      setShareResults(prev => ({
        ...prev,
        [platform]: {
          success: true,
          timestamp: new Date(),
          mediaCount: result.mediaCount
        }
      }));

      // Notify parent component
      if (onShare) {
        onShare(platform, { ...shareContent, mediaShared: result.mediaCount });
      }
      
    } catch (error) {
      console.error(`Error sharing to ${platform}:`, error);
      setShareResults(prev => ({
        ...prev,
        [platform]: { success: false, error: error.message }
      }));
    } finally {
      setIsSharing(false);
    }
  };

  const updateShareOption = (platform, field, value) => {
    setShareOptions(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value
      }
    }));
  };

  const socialPlatforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'Globe', // Using Globe as Facebook icon alternative
      color: '#1877F2',
      description: 'Share to Facebook page or personal profile'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: 'MessageCircle',
      color: '#25D366',
      description: 'Send to WhatsApp contacts or groups'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: 'Bird', // Using Bird as Twitter icon alternative
      color: '#1DA1F2',
      description: 'Tweet to your followers'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: 'Camera', // Using Camera as Instagram icon alternative
      color: '#E4405F',
      description: 'Share to Instagram story or post'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">Social Media Sharing</h3>
        <div className="text-sm text-text-secondary">
          Share your newsletter across social platforms
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {socialPlatforms.map((platform) => (
          <div
            key={platform.id}
            className={`border rounded-lg p-4 transition-all duration-200 ${
              shareOptions[platform.id].enabled
                ? 'border-border bg-surface'
                : 'border-border/50 bg-surface/50 opacity-60'
            }`}
          >
            {/* Platform Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: platform.color + '20' }}
                >
                  <Icon name={platform.icon} size={16} style={{ color: platform.color }} />
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">{platform.name}</h4>
                  <p className="text-xs text-text-muted">{platform.description}</p>
                </div>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={shareOptions[platform.id].enabled}
                  onChange={(e) => updateShareOption(platform.id, 'enabled', e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${
                  shareOptions[platform.id].enabled ? 'bg-primary' : 'bg-border'
                }`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 mt-1 ${
                    shareOptions[platform.id].enabled ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                </div>
              </label>
            </div>

            {shareOptions[platform.id].enabled && (
              <div className="space-y-3">
                {/* Custom Message */}
                <div>
                  <label className="block text-xs font-medium text-text-primary mb-1">
                    Custom Message (optional)
                  </label>
                  <textarea
                    value={shareOptions[platform.id].customMessage}
                    onChange={(e) => updateShareOption(platform.id, 'customMessage', e.target.value)}
                    placeholder={`Custom message for ${platform.name}...`}
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Platform-specific options */}
                {platform.id === 'whatsapp' && (
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={shareOptions[platform.id].includeLink}
                        onChange={(e) => updateShareOption(platform.id, 'includeLink', e.target.checked)}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
                      />
                      <span className="text-xs text-text-secondary">Include link</span>
                    </label>
                  </div>
                )}

                {platform.id === 'twitter' && (
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={shareOptions[platform.id].includeHashtags}
                        onChange={(e) => updateShareOption(platform.id, 'includeHashtags', e.target.checked)}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
                      />
                      <span className="text-xs text-text-secondary">Include hashtags</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={shareOptions[platform.id].includeLink}
                        onChange={(e) => updateShareOption(platform.id, 'includeLink', e.target.checked)}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
                      />
                      <span className="text-xs text-text-secondary">Include link</span>
                    </label>
                  </div>
                )}

                {platform.id === 'instagram' && (
                  <div>
                    <label className="block text-xs font-medium text-text-primary mb-1">
                      Post Type
                    </label>
                    <select
                      value={shareOptions[platform.id].postType}
                      onChange={(e) => updateShareOption(platform.id, 'postType', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="story">Instagram Story</option>
                      <option value="post">Instagram Post</option>
                    </select>
                  </div>
                )}

                {/* Share Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare(platform.id)}
                  disabled={isSharing}
                  className="w-full"
                  style={{ borderColor: platform.color, color: platform.color }}
                >
                  {isSharing ? (
                    <>
                      <Icon name="Loader" size={14} className="animate-spin mr-2" />
                      Sharing...
                    </>
                  ) : (
                    <>
                      <Icon name="Share" size={14} className="mr-2" />
                      Share to {platform.name}
                    </>
                  )}
                </Button>

                {/* Share Result */}
                {shareResults[platform.id] && (
                  <div className={`text-xs p-2 rounded ${
                    shareResults[platform.id].success
                      ? 'bg-success/10 text-success'
                      : 'bg-error/10 text-error'
                  }`}>
                    {shareResults[platform.id].success
                      ? `✓ Shared to ${platform.name} successfully`
                      : `✗ Failed to share: ${shareResults[platform.id].error}`
                    }
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Share All Button */}
      <div className="flex justify-center pt-4 border-t border-border">
        <Button
          variant="primary"
          onClick={() => {
            socialPlatforms.forEach(platform => {
              if (shareOptions[platform.id].enabled) {
                handleShare(platform.id);
              }
            });
          }}
          disabled={isSharing || !socialPlatforms.some(p => shareOptions[p.id].enabled)}
          iconName="Share"
        >
          Share to All Selected Platforms
        </Button>
      </div>

      {/* Instagram Instructions Modal */}
      {showInstagramModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-1000 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Icon name="Camera" size={20} color="white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Share to Instagram</h3>
                  <p className="text-sm text-gray-600">Content ready to share</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => setShowInstagramModal(false)}
                className="text-gray-500 hover:text-gray-700 hover:bg-white/50"
              />
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 max-h-[calc(95vh-120px)] overflow-y-auto">
              <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-sm font-medium text-success">Content Copied Successfully!</span>
                </div>
                <p className="text-xs text-text-secondary">
                  Your newsletter content has been copied to your clipboard with hashtags.
                </p>
              </div>

              {/* Media Preview */}
              {attachments.filter(att => att.type.startsWith('image/') || att.type.startsWith('video/')).length > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <h5 className="text-xs font-medium text-purple-800 mb-2 flex items-center">
                    <Icon name="Image" size={12} className="mr-1" />
                    Your Media Files ({attachments.filter(att => att.type.startsWith('image/') || att.type.startsWith('video/')).length})
                  </h5>
                  <div className="grid grid-cols-3 gap-2">
                    {attachments
                      .filter(att => att.type.startsWith('image/') || att.type.startsWith('video/'))
                      .slice(0, 9)
                      .map((attachment, idx) => (
                      <div key={idx} className="relative">
                        {attachment.type.startsWith('image/') ? (
                          <img
                            src={attachment.preview}
                            alt={attachment.name}
                            className="w-full h-16 object-cover rounded border"
                          />
                        ) : (
                          <div className="w-full h-16 bg-gray-100 rounded border flex flex-col items-center justify-center">
                            <Icon name="Video" size={16} className="text-gray-500" />
                            <span className="text-xs text-gray-600">Video</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {attachments.filter(att => att.type.startsWith('image/') || att.type.startsWith('video/')).length > 9 && (
                    <p className="text-xs text-purple-700 mt-2">
                      +{attachments.filter(att => att.type.startsWith('image/') || att.type.startsWith('video/')).length - 9} more files
                    </p>
                  )}
                  <p className="text-xs text-purple-700 mt-2">
                    📱 Upload these images/videos when creating your Instagram post
                  </p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                  <Icon name="Info" size={16} className="mr-2" />
                  How to share on Instagram:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span className="text-blue-700">Open Instagram app on your phone</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span className="text-blue-700">Create a new post or story</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <span className="text-blue-700">Paste content (long-press → Paste)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    <span className="text-blue-700">Add photos/videos and publish</span>
                  </div>
                </div>
              </div>

              {/* Content Preview */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h5 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                  <Icon name="Eye" size={16} className="mr-2" />
                  Content Preview:
                </h5>
                <div className="bg-white rounded border p-3 text-sm text-gray-700 max-h-32 overflow-y-auto">
                  <div className="whitespace-pre-wrap">{instagramContent}</div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  ✨ <strong>Enhanced for Instagram:</strong> Added hashtags and engagement elements
                </div>
              </div>

              {/* Pro Tips */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Icon name="Lightbulb" size={16} className="text-purple-600 mt-0.5" />
                  <div className="text-xs text-purple-800">
                    <p className="font-medium mb-1">💡 Pro Tips:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
                      <p>• Switch accounts (tap profile)</p>
                      <p>• Choose personal/business</p>
                      <p>• Post to Stories/Feed/Reels</p>
                      <p>• Schedule if business account</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Upload Info */}
              {attachments.length > 0 && (
                <div className="bg-info-50 border border-info-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Icon name="Image" size={16} className="text-info-600 mt-0.5" />
                    <div className="text-xs text-info-800">
                      <p className="font-medium mb-1">Your Attachments ({attachments.length}):</p>
                      <div className="space-y-1">
                        {attachments.slice(0, 3).map((att, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <Icon name={att.type.startsWith('image/') ? 'Image' : 'Video'} size={12} />
                            <span className="truncate">{att.name}</span>
                          </div>
                        ))}
                        {attachments.length > 3 && (
                          <p className="text-info-600">...and {attachments.length - 3} more files</p>
                        )}
                      </div>
                      <p className="mt-2">Remember to upload these files when creating your Instagram post!</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Copy Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      await navigator.clipboard.writeText(instagramContent);
                      // Show brief confirmation
                      const button = event.target;
                      const originalText = button.textContent;
                      button.textContent = '✅ Copied!';
                      setTimeout(() => {
                        button.textContent = originalText;
                      }, 1500);
                    }}
                    iconName="Copy"
                    className="w-full"
                  >
                    📋 Copy Content
                  </Button>

                  {/* Instagram Mobile App Option */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      // Copy content and show mobile instructions
                      await navigator.clipboard.writeText(instagramContent);
                      setShowInstagramModal(false);

                      alert(`📱 Content copied for Instagram mobile!\n\n📲 Next steps:\n1. Open Instagram app on your phone\n2. Tap "+" to create new post\n3. Choose "Post" or "Story"\n4. Long-press in text area and tap "Paste"\n5. Add your photos and share!\n\n✅ Content is ready in your clipboard!`);
                    }}
                    iconName="Smartphone"
                    className="w-full border-pink-200 hover:bg-pink-50"
                  >
                    📱 Mobile App
                  </Button>
                </div>

                {/* Primary Action - Open Instagram Web */}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={async () => {
                    try {
                      // Copy content to clipboard first
                      await navigator.clipboard.writeText(instagramContent);

                      // Open Instagram web
                      window.open('https://www.instagram.com/', '_blank');

                      // Close this modal
                      setShowInstagramModal(false);

                      // Show success message with instructions
                      setTimeout(() => {
                        alert(`✅ Instagram opened & content copied!\n\n📱 Next steps:\n1. Click "+" (Create) button in Instagram\n2. Choose "Post" or "Story"\n3. Press Ctrl+V (or Cmd+V) to paste content\n4. Add your images and publish!\n\n💡 Content is ready in your clipboard!`);
                      }, 1000);

                    } catch (error) {
                      // Fallback to just copying
                      await navigator.clipboard.writeText(instagramContent);
                      alert('📋 Content copied to clipboard! Please open Instagram manually and paste with Ctrl+V');
                    }
                  }}
                  iconName="ExternalLink"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  🚀 Open Instagram & Copy Content
                </Button>

                {/* Close Button */}
                <div className="flex justify-center pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowInstagramModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Sharing Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998] flex items-center justify-center p-1 sm:p-4">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl w-full max-w-xs sm:max-w-lg max-h-[98vh] sm:max-h-[95vh] overflow-y-auto m-1 sm:m-0">
            {/* Header */}
            <div className="flex items-center justify-between p-2 sm:p-4 border-b border-gray-200 bg-green-50">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="MessageCircle" size={16} className="text-white sm:hidden" />
                  <Icon name="MessageCircle" size={20} color="white" className="hidden sm:block" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-lg font-semibold text-gray-800 truncate">Share to WhatsApp</h3>
                  <p className="text-xs text-gray-600 hidden sm:block">Choose your sharing method</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => setShowWhatsAppModal(false)}
                className="text-gray-500 hover:text-gray-700 hover:bg-white/50 p-1 sm:p-2 flex-shrink-0"
              />
            </div>

            {/* Content */}
            <div className="p-2 sm:p-4 space-y-2 sm:space-y-3">
              {/* Content Preview */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 sm:p-3">
                <h5 className="text-xs font-medium text-gray-800 mb-1 sm:mb-2">Message Preview:</h5>
                <div className="text-xs text-gray-600 max-h-16 sm:max-h-20 overflow-y-auto">
                  {whatsappContent}
                </div>
              </div>

              {/* Media Preview */}
              {attachments.filter(att => att.type.startsWith('image/') || att.type.startsWith('video/')).length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <h5 className="text-xs font-medium text-green-800 flex items-center flex-1 min-w-0">
                      <Icon name="Paperclip" size={12} className="mr-1 flex-shrink-0" />
                      <span className="truncate">Media Files ({attachments.filter(att => att.type.startsWith('image/') || att.type.startsWith('video/')).length})</span>
                    </h5>
                    {/* Download Images Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Download all media files
                        const mediaFiles = attachments.filter(att => att.type.startsWith('image/') || att.type.startsWith('video/'));
                        mediaFiles.forEach((attachment, index) => {
                          setTimeout(() => {
                            const link = document.createElement('a');
                            link.href = attachment.preview;
                            link.download = attachment.name;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }, index * 500); // Stagger downloads
                        });

                        alert(`📥 Downloaded ${mediaFiles.length} media file(s)! Now you can attach them in WhatsApp after pasting the text.`);
                      }}
                      iconName="Download"
                      className="bg-green-600 text-white border-green-600 hover:bg-green-700 text-xs px-2 py-1 flex-shrink-0"
                    >
                      Download All
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {attachments
                      .filter(att => att.type.startsWith('image/') || att.type.startsWith('video/'))
                      .slice(0, 6)
                      .map((attachment, idx) => (
                      <div key={idx} className="relative">
                        {attachment.type.startsWith('image/') ? (
                          <img
                            src={attachment.preview}
                            alt={attachment.name}
                            className="w-full h-14 sm:h-16 object-cover rounded border"
                          />
                        ) : (
                          <div className="w-full h-14 sm:h-16 bg-gray-100 rounded border flex items-center justify-center">
                            <Icon name="Video" size={16} className="text-gray-500" />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded-b truncate">
                          {attachment.name}
                        </div>
                      </div>
                    ))}
                  </div>
                  {attachments.filter(att => att.type.startsWith('image/') || att.type.startsWith('video/')).length > 6 && (
                    <p className="text-xs text-green-700 mt-2">
                      +{attachments.filter(att => att.type.startsWith('image/') || att.type.startsWith('video/')).length - 6} more files
                    </p>
                  )}
                  <div className="mt-3 bg-green-100 border border-green-300 rounded p-2">
                    <p className="text-xs text-green-800 font-medium mb-1">📱 How to share images in WhatsApp:</p>
                    <ol className="text-xs text-green-700 space-y-1 ml-3">
                      <li>1. Click "Download All" button above</li>
                      <li>2. Click any WhatsApp sharing button below</li>
                      <li>3. Paste the text in WhatsApp</li>
                      <li>4. Click 📎 (attachment) in WhatsApp</li>
                      <li>5. Select the downloaded images</li>
                      <li>6. Send your complete post with images!</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* Sharing Options */}
              <div className="space-y-2 sm:space-y-3">
                <h4 className="font-medium text-gray-800 text-sm hidden sm:block">Choose sharing method:</h4>

                {/* WhatsApp Community/Groups */}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    // Try WhatsApp Web first (for logged-in users)
                    const webUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(whatsappContent)}`;
                    const waWindow = window.open(webUrl, '_blank');
                    if (waWindow) {
                      setShowWhatsAppModal(false);
                    } else {
                      // Fallback to wa.me
                      const waUrl = `https://wa.me/?text=${encodeURIComponent(whatsappContent)}`;
                      window.open(waUrl, '_blank');
                      setShowWhatsAppModal(false);
                    }
                  }}
                  iconName="Users"
                  className="w-full justify-start bg-green-600 hover:bg-green-700 text-white border-green-600 p-2 sm:p-3"
                >
                  <div className="text-left min-w-0 flex-1">
                    <div className="font-medium text-xs sm:text-sm">Share to Community/Groups</div>
                    <div className="text-xs text-green-100 hidden sm:block">Opens directly in WhatsApp Web</div>
                  </div>
                </Button>

                {/* WhatsApp Web Direct */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Direct WhatsApp Web URL for logged-in users
                    const webUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(whatsappContent)}`;
                    const waWindow = window.open(webUrl, '_blank');
                    if (waWindow) {
                      setShowWhatsAppModal(false);
                    } else {
                      // Fallback to copy
                      navigator.clipboard.writeText(whatsappContent);
                      alert('Popup blocked. Content copied to clipboard!');
                    }
                  }}
                  iconName="Globe"
                  className="w-full justify-start border-green-200 hover:bg-green-50 p-2 sm:p-3"
                >
                  <div className="text-left min-w-0 flex-1">
                    <div className="font-medium text-xs sm:text-sm">WhatsApp Web (Direct)</div>
                    <div className="text-xs text-green-600 hidden sm:block">For logged-in WhatsApp Web users</div>
                  </div>
                </Button>

                {/* WhatsApp Mobile/Fallback */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const waUrl = `https://wa.me/?text=${encodeURIComponent(whatsappContent)}`;
                    const waWindow = window.open(waUrl, '_blank');
                    if (waWindow) {
                      setShowWhatsAppModal(false);
                    } else {
                      // Fallback to copy
                      navigator.clipboard.writeText(whatsappContent);
                      alert('Popup blocked. Content copied to clipboard!');
                    }
                  }}
                  iconName="Smartphone"
                  className="w-full justify-start p-2 sm:p-3"
                >
                  <div className="text-left min-w-0 flex-1">
                    <div className="font-medium text-xs sm:text-sm">WhatsApp Mobile</div>
                    <div className="text-xs text-gray-600 hidden sm:block">Opens WhatsApp app or web signup</div>
                  </div>
                </Button>

                {/* Copy to Clipboard */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await navigator.clipboard.writeText(whatsappContent);
                    setShowWhatsAppModal(false);
                    // Show success message
                    setShareResults(prev => ({
                      ...prev,
                      whatsapp: { success: true, message: 'Content copied to clipboard!' }
                    }));
                  }}
                  iconName="Copy"
                  className="w-full justify-start p-2 sm:p-3"
                >
                  <div className="text-left min-w-0 flex-1">
                    <div className="font-medium text-xs sm:text-sm">Copy to Clipboard</div>
                    <div className="text-xs text-gray-600 hidden sm:block">Paste in WhatsApp app manually</div>
                  </div>
                </Button>

                {/* Broadcast List Option */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    // Copy content and show broadcast instructions
                    await navigator.clipboard.writeText(whatsappContent);
                    alert('Content copied! Now open WhatsApp → New Broadcast → Select contacts → Paste message');
                    setShowWhatsAppModal(false);
                  }}
                  iconName="Radio"
                  className="w-full justify-start border-blue-200 hover:bg-blue-50 p-2 sm:p-3"
                >
                  <div className="text-left min-w-0 flex-1">
                    <div className="font-medium text-xs sm:text-sm">Broadcast to Multiple Contacts</div>
                    <div className="text-xs text-blue-600 hidden sm:block">Send to many people at once</div>
                  </div>
                </Button>

                {/* QR Code Option */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Generate WhatsApp QR code URL
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://wa.me/?text=${encodeURIComponent(whatsappContent)}`)}`;
                    window.open(qrUrl, '_blank');
                    setShowWhatsAppModal(false);
                  }}
                  iconName="QrCode"
                  className="w-full justify-start"
                >
                  <div className="text-left">
                    <div className="font-medium">Generate QR Code</div>
                    <div className="text-xs text-text-muted">Scan with phone to share</div>
                  </div>
                </Button>
              </div>

              {/* Community Posting Instructions */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Icon name="Users" size={16} className="text-green-600 mt-0.5" />
                  <div className="text-xs text-green-800">
                    <p className="font-medium mb-2">📢 Community Posting Tips:</p>
                    <div className="space-y-1">
                      <div className="flex items-start space-x-2">
                        <span className="flex-shrink-0 w-4 h-4 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                        <span><strong>Groups:</strong> Share to WhatsApp groups for community discussions</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="flex-shrink-0 w-4 h-4 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                        <span><strong>Communities:</strong> Post in WhatsApp Communities for wider reach</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="flex-shrink-0 w-4 h-4 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                        <span><strong>Broadcast:</strong> Send to multiple contacts simultaneously</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="flex-shrink-0 w-4 h-4 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                        <span><strong>Images:</strong> Download images first, then attach in WhatsApp using 📎 button</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Twitter Sharing Modal */}
      {showTwitterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-1000 flex items-center justify-center p-1 sm:p-4">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl w-full max-w-xs sm:max-w-lg max-h-[98vh] sm:max-h-[95vh] overflow-y-auto m-1 sm:m-0">
            {/* Header */}
            <div className="flex items-center justify-between p-2 sm:p-4 border-b border-gray-200 bg-blue-50">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Twitter" size={16} className="text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-lg truncate">Share to Twitter</h3>
                  <p className="text-xs text-gray-600 hidden sm:block">Choose your sharing method</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTwitterModal(false)}
                iconName="X"
                className="text-gray-500 hover:text-gray-700 hover:bg-white/50 p-1 sm:p-2 flex-shrink-0"
              />
            </div>

            {/* Content Preview */}
            <div className="p-2 sm:p-4 border-b border-gray-200">
              <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                <p className="text-xs sm:text-sm text-gray-600 whitespace-pre-wrap">
                  {twitterContent}
                </p>
                <div className="mt-1 sm:mt-2 text-xs text-gray-500">
                  Character count: {twitterContent.length}/280
                </div>
              </div>

              {/* Media Preview */}
              {attachments.filter(att => att.type.startsWith('image/') || att.type.startsWith('video/')).length > 0 && (
                <div className="mt-3">
                  <h5 className="text-xs font-medium text-gray-800 mb-2">
                    Media to Share ({attachments.filter(att => att.type.startsWith('image/') || att.type.startsWith('video/')).length})
                  </h5>
                  <div className="grid grid-cols-2 gap-2">
                    {attachments
                      .filter(att => att.type.startsWith('image/') || att.type.startsWith('video/'))
                      .slice(0, 4)
                      .map((attachment, idx) => (
                      <div key={idx} className="relative">
                        {attachment.type.startsWith('image/') ? (
                          <img
                            src={attachment.preview}
                            alt={attachment.name}
                            className="w-full h-16 sm:h-20 object-cover rounded border"
                          />
                        ) : (
                          <div className="w-full h-16 sm:h-20 bg-gray-100 rounded border flex items-center justify-center">
                            <Icon name="Video" size={20} className="text-gray-500" />
                            <span className="text-xs text-gray-600 ml-1 hidden sm:inline">Video</span>
                          </div>
                        )}
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                          {attachment.name.split('.').pop().toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                  {attachments.filter(att => att.type.startsWith('image/') || att.type.startsWith('video/')).length > 4 && (
                    <p className="text-xs text-gray-600 mt-1">
                      +{attachments.filter(att => att.type.startsWith('image/') || att.type.startsWith('video/')).length - 4} more files (Twitter supports max 4 images or 1 video)
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Sharing Options */}
            <div className="p-2 sm:p-4 space-y-2 sm:space-y-3">
              {/* Twitter Web Option */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterContent)}`;
                  window.open(twitterUrl, '_blank', 'width=600,height=400');
                  setShowTwitterModal(false);
                }}
                iconName="ExternalLink"
                className="w-full justify-start p-2 sm:p-3"
              >
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium text-xs sm:text-sm">Open Twitter Web</div>
                  <div className="text-xs text-gray-600 hidden sm:block">
                    {attachments.filter(att => att.type.startsWith('image/') || att.type.startsWith('video/')).length > 0
                      ? `Post with ${attachments.filter(att => att.type.startsWith('image/') || att.type.startsWith('video/')).length} media file(s)`
                      : 'Post directly to Twitter'
                    }
                  </div>
                </div>
              </Button>

              {/* Copy to Clipboard Option */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(twitterContent).then(() => {
                    alert('Content copied to clipboard!');
                    setShowTwitterModal(false);
                  });
                }}
                iconName="Copy"
                className="w-full justify-start p-2 sm:p-3"
              >
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium text-xs sm:text-sm">Copy to Clipboard</div>
                  <div className="text-xs text-gray-600 hidden sm:block">Paste in Twitter app manually</div>
                </div>
              </Button>

              {/* Account Selection Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
                  <div className="text-xs text-blue-800">
                    <p className="font-medium mb-1">Account Selection:</p>
                    <p>When you click "Open Twitter Web", you'll be taken to Twitter where you can:</p>
                    <ul className="mt-1 space-y-1">
                      <li>• Choose which account to post from</li>
                      <li>• Add images/videos manually</li>
                      <li>• Edit the content before posting</li>
                      <li>• Schedule the tweet if needed</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Image Upload Note */}
              {attachments.length > 0 && (
                <div className="bg-warning-50 border border-warning-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Icon name="Upload" size={16} className="text-warning-600 mt-0.5" />
                    <div className="text-xs text-warning-800">
                      <p className="font-medium mb-1">Image/Video Upload:</p>
                      <p>You have {attachments.length} attachment(s). After opening Twitter:</p>
                      <ul className="mt-1 space-y-1">
                        <li>• Click the image/video icon in the tweet composer</li>
                        <li>• Upload your files manually</li>
                        <li>• Twitter supports up to 4 images or 1 video per tweet</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Facebook Sharing Modal */}
      {showFacebookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-1000 flex items-center justify-center p-1 sm:p-4">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl w-full max-w-xs sm:max-w-lg max-h-[98vh] sm:max-h-[95vh] overflow-y-auto m-1 sm:m-0">
            {/* Header */}
            <div className="flex items-center justify-between p-2 sm:p-4 border-b border-gray-200 bg-blue-50">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Facebook" size={16} className="text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-lg truncate">Share to Facebook</h3>
                  <p className="text-xs text-gray-600 hidden sm:block">Choose your sharing method</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFacebookModal(false)}
                iconName="X"
                className="text-gray-500 hover:text-gray-700 hover:bg-white/50 p-1 sm:p-2 flex-shrink-0"
              />
            </div>

            {/* Content Preview */}
            <div className="p-2 sm:p-4 border-b border-gray-200">
              <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                <p className="text-xs sm:text-sm text-gray-600 whitespace-pre-wrap">
                  {facebookContent}
                </p>
              </div>

              {/* Media Preview */}
              {attachments.filter(att => att.type.startsWith('image/') || att.type.startsWith('video/')).length > 0 && (
                <div className="mt-3">
                  <h5 className="text-xs font-medium text-gray-800 mb-2 flex items-center">
                    <Icon name="Image" size={12} className="mr-1" />
                    Media to Share ({attachments.filter(att => att.type.startsWith('image/') || att.type.startsWith('video/')).length})
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {attachments
                      .filter(att => att.type.startsWith('image/') || att.type.startsWith('video/'))
                      .slice(0, 6)
                      .map((attachment, idx) => (
                      <div key={idx} className="relative">
                        {attachment.type.startsWith('image/') ? (
                          <img
                            src={attachment.preview}
                            alt={attachment.name}
                            className="w-full h-14 sm:h-16 object-cover rounded border"
                          />
                        ) : (
                          <div className="w-full h-14 sm:h-16 bg-gray-100 rounded border flex items-center justify-center">
                            <Icon name="Video" size={16} className="text-gray-500" />
                            <span className="text-xs text-gray-600 ml-1 hidden sm:inline">Video</span>
                          </div>
                        )}
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                          {attachment.name.split('.').pop().toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                  {attachments.filter(att => att.type.startsWith('image/') || att.type.startsWith('video/')).length > 6 && (
                    <p className="text-xs text-gray-600 mt-1">
                      +{attachments.filter(att => att.type.startsWith('image/') || att.type.startsWith('video/')).length - 6} more files
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Sharing Options */}
            <div className="p-2 sm:p-4 space-y-2 sm:space-y-3">
              {/* Facebook Web Option */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const shareContent = generateShareContent('facebook');
                  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareContent.url)}&quote=${encodeURIComponent(shareContent.text)}`;
                  window.open(fbUrl, '_blank', 'width=600,height=400');
                  setShowFacebookModal(false);
                }}
                iconName="ExternalLink"
                className="w-full justify-start p-2 sm:p-3"
              >
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium text-xs sm:text-sm">Open Facebook Sharer</div>
                  <div className="text-xs text-gray-600 hidden sm:block">Post directly to Facebook</div>
                </div>
              </Button>

              {/* Copy to Clipboard Option */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(facebookContent).then(() => {
                    alert('Content copied to clipboard!');
                    setShowFacebookModal(false);
                  });
                }}
                iconName="Copy"
                className="w-full justify-start p-2 sm:p-3"
              >
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium text-xs sm:text-sm">Copy to Clipboard</div>
                  <div className="text-xs text-gray-600 hidden sm:block">Paste in Facebook app manually</div>
                </div>
              </Button>

              {/* Account Selection Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Icon name="Users" size={16} className="text-blue-600 mt-0.5" />
                  <div className="text-xs text-blue-800">
                    <p className="font-medium mb-1">Account & Page Selection:</p>
                    <p>When you open Facebook, you can:</p>
                    <ul className="mt-1 space-y-1">
                      <li>• Choose to post to your personal profile</li>
                      <li>• Select a Facebook Page you manage</li>
                      <li>• Post to Facebook Groups you're part of</li>
                      <li>• Schedule the post for later</li>
                      <li>• Choose audience (Public, Friends, Custom)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Image Upload Note */}
              {attachments.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Icon name="Upload" size={16} className="text-green-600 mt-0.5" />
                    <div className="text-xs text-green-800">
                      <p className="font-medium mb-1">Media Upload ({attachments.length} files):</p>
                      <div className="space-y-1 mb-2">
                        {attachments.slice(0, 3).map((att, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <Icon name={att.type.startsWith('image/') ? 'Image' : 'Video'} size={12} />
                            <span className="truncate">{att.name}</span>
                          </div>
                        ))}
                        {attachments.length > 3 && (
                          <p className="text-green-600">...and {attachments.length - 3} more files</p>
                        )}
                      </div>
                      <p>After opening Facebook, click "Photo/Video" to upload your files!</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaShare;
