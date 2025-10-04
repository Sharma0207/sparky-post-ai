# Sparky Post AI - Facebook Content Generator & Publisher

A full-featured web application that generates AI-powered social media content and posts directly to Facebook with a single click.

## 🚀 Features

### ✨ Core Functionality
- **AI-Powered Content Generation**: Generate captions, hashtags, and images from simple prompts
- **Direct Facebook Posting**: Post content directly to Facebook using Graph API
- **Post Scheduling**: Schedule posts for future publication
- **Multiple Post Variations**: Generate 3 unique versions of each post
- **Post History**: Track all your published content
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 🎨 User Experience
- **Modern UI**: Clean, intuitive interface built with React and Tailwind CSS
- **Real-time Feedback**: Loading states, progress indicators, and success notifications
- **Interactive Post Cards**: Hover effects, image previews, and quick actions
- **Mobile-First Design**: Optimized for all screen sizes
- **Dark/Light Theme Support**: Built-in theme switching

### 🔧 Technical Features
- **Facebook SDK Integration**: Secure authentication and posting
- **Graph API Integration**: Direct posting to Facebook pages
- **Local Storage**: Persistent data storage for posts and settings
- **Error Handling**: Comprehensive error management and retry mechanisms
- **Image Management**: Download, copy, and share generated images

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Facebook Developer Account (for API access)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sharma0207/sparky-post-ai.git
   cd sparky-post-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_FACEBOOK_APP_ID=your_facebook_app_id
   VITE_LOVABLE_API_KEY=your_lovable_api_key
   ```

4. **Configure Facebook App**
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app
   - Add Facebook Login and Pages API products
   - Set your domain in App Settings
   - Update `YOUR_FACEBOOK_APP_ID` in `src/components/SocialMediaPopup.tsx`

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📱 How to Use

### 1. Connect Facebook Account
- Click the Facebook icon in the sidebar
- Authorize the app with required permissions
- Your account will be connected for direct posting

### 2. Generate Content
- Enter a descriptive prompt (e.g., "Generate a happy Diwali post with diyas")
- Click "Generate" to create 3 unique post variations
- Wait for AI to generate captions, hashtags, and images

### 3. Post to Facebook
- Select your preferred post variation
- Choose "Post Now" for immediate posting
- Or "Schedule" to post at a specific time

### 4. Manage Content
- View scheduled posts in the "Scheduled Posts" tab
- Check your posting history in the "Post History" tab
- Download or copy content for manual sharing

## 🔑 Facebook API Setup

### Required Permissions
- `public_profile`: Access to user's public profile
- `email`: Access to user's email
- `pages_manage_posts`: Manage posts on pages
- `publish_to_groups`: Publish to groups (optional)

### App Configuration
1. **Valid OAuth Redirect URIs**: Add your domain
2. **App Domains**: Add your production domain
3. **Privacy Policy URL**: Required for production
4. **Terms of Service URL**: Required for production

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx          # Main dashboard component
│   ├── GeneratedPost.tsx      # Individual post card
│   ├── PostScheduler.tsx      # Post scheduling interface
│   ├── ScheduledPosts.tsx    # Scheduled posts management
│   ├── SocialMediaPopup.tsx  # Facebook connection popup
│   ├── Sidebar.tsx           # Navigation sidebar
│   └── ui/                   # Reusable UI components
├── hooks/
│   └── use-toast.ts          # Toast notification hook
├── integrations/
│   └── supabase/             # Supabase configuration
├── lib/
│   └── utils.ts              # Utility functions
└── pages/
    └── Index.tsx             # Main page component
```

## 🎯 Key Components

### Dashboard
- Main application interface
- Content generation and management
- Tabbed navigation for different features
- Responsive design for all devices

### GeneratedPost
- Interactive post cards with hover effects
- Image preview and loading states
- Quick actions (copy, download, share)
- Selection and posting functionality

### PostScheduler
- Calendar-based scheduling interface
- Time selection with quick presets
- Post preview before scheduling
- Validation and error handling

### SocialMediaPopup
- Facebook SDK integration
- OAuth authentication flow
- Manual token input option
- Permission management

## 🔒 Security Features

- **Secure Token Storage**: Access tokens stored in localStorage
- **CORS Protection**: Proper CORS headers for API calls
- **Input Validation**: All user inputs are validated
- **Error Boundaries**: Graceful error handling throughout the app

## 📊 Performance Optimizations

- **Lazy Loading**: Images loaded on demand
- **Efficient State Management**: Optimized React state updates
- **Responsive Images**: Optimized for different screen sizes
- **Caching**: Local storage for better performance

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

### Manual Deployment
1. Build the project: `npm run build`
2. Upload `dist` folder to your web server
3. Configure your web server for SPA routing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the Facebook API documentation

## 🔮 Future Enhancements

- [ ] Instagram integration
- [ ] LinkedIn posting
- [ ] Twitter/X support
- [ ] Advanced analytics
- [ ] Team collaboration features
- [ ] Content templates
- [ ] Bulk posting
- [ ] A/B testing for posts

---

**Made with ❤️ for content creators and social media managers**