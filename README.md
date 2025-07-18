# Spending Tracker - Mobile App

A personal spending and budget tracking app optimized for mobile devices. **No computer needed to run on your iPhone!**

## 🚀 Quick Start (No Computer Required!)

### Option 1: Deploy to Netlify (Easiest)
1. **Create GitHub repo** on your phone at [github.com](https://github.com)
2. **Upload your code** to the repository
3. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub
   - Click "New site from Git"
   - Select your repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Deploy!

4. **Install on iPhone**:
   - Open Safari on your iPhone
   - Go to your Netlify URL
   - Tap Share button → "Add to Home Screen"

### Option 2: Use Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Deploy automatically
5. Add to home screen

## 📱 Features

- ✅ **Progressive Web App** - Works like a native app
- ✅ **Offline functionality** - No internet required
- ✅ **Local storage** - Your data stays on your phone
- ✅ **Mobile-optimized** - Perfect for iPhone
- ✅ **Touch-friendly** - iOS-style interface
- ✅ **Safe area support** - Works with notches and home indicators

## 🛠 Development (If you have a computer)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── context/       # React context for state management
├── pages/         # Main app pages
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── App.tsx        # Main app component
└── main.tsx       # App entry point
```

## 🎨 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Chart.js** - Data visualization
- **Capacitor** - Mobile app wrapper
- **PWA** - Progressive Web App features

## 📊 App Features

### Home Dashboard
- Overview of recent transactions
- Quick balance summary
- Recent activity feed

### Expense Tracking
- Add new expenses with categories
- Set spending limits
- Track recurring expenses

### Income Management
- Record variable income
- Track income sources
- Monthly income summaries

### Budget Planning
- Set monthly budgets
- Category-based budgeting
- Budget vs actual tracking

### Reports & Analytics
- Spending trends
- Category breakdowns
- Monthly comparisons
- Interactive charts

## 🔧 Configuration

The app uses local storage for data persistence, so no backend setup is required. All data is stored locally on your device.

## 📱 Mobile Optimizations

- Touch-friendly interface
- iOS safe area support
- Offline functionality
- Fast loading times
- Native app feel

## 🚀 Deployment

See `deploy-to-phone.md` for detailed instructions on deploying without a computer.

## 📄 License

This project is open source and available under the MIT License.