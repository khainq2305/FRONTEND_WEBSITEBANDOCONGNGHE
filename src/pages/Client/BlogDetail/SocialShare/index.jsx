import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faLinkedin, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { faShare, faLink } from '@fortawesome/free-solid-svg-icons';

const SocialShare = ({ title, url, description }) => {
    const currentUrl = url || window.location.href;
    const shareTitle = encodeURIComponent(title || 'Bài viết hay');
    const shareDescription = encodeURIComponent(description || '');

    const socialLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
        twitter: `https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodeURIComponent(currentUrl)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${shareTitle}`
    };

    const handleShare = (platform) => {
        window.open(socialLinks[platform], '_blank', 'width=600,height=400');
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(currentUrl);
            alert('Đã sao chép link bài viết!');
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faShare} className="text-gray-600" />
                    <span className="font-medium text-gray-700">Chia sẻ bài viết:</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleShare('facebook')}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
                        title="Chia sẻ lên Facebook"
                    >
                        <FontAwesomeIcon icon={faFacebook} size="sm" />
                    </button>
                    <button
                        onClick={() => handleShare('twitter')}
                        className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors duration-200"
                        title="Chia sẻ lên Twitter"
                    >
                        <FontAwesomeIcon icon={faTwitter} size="sm" />
                    </button>
                    <button
                        onClick={() => handleShare('linkedin')}
                        className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors duration-200"
                        title="Chia sẻ lên LinkedIn"
                    >
                        <FontAwesomeIcon icon={faLinkedin} size="sm" />
                    </button>
                    <button
                        onClick={() => handleShare('telegram')}
                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
                        title="Chia sẻ lên Telegram"
                    >
                        <FontAwesomeIcon icon={faTelegram} size="sm" />
                    </button>
                    <button
                        onClick={handleCopyLink}
                        className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors duration-200"
                        title="Sao chép link"
                    >
                        <FontAwesomeIcon icon={faLink} size="sm" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SocialShare;
