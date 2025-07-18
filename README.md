# 💰 Spending Tracker - Personal Budget App

A modern, mobile-first spending and budget tracking application designed for variable income earners like servers, gig workers, and freelancers. Built with React, TypeScript, and Tailwind CSS, optimized for iOS mobile devices.

## ✨ Features

### 🚀 Core Functionality
- **Quick Expense Logging** - Add expenses in under 5 seconds
- **Income Tracking** - Log tips and paychecks with automatic budget distribution
- **Percentage-Based Budgeting** - Set budget categories with percentage allocations
- **Real-Time Updates** - See immediate impact on your budget
- **Emotion Tracking** - Log how you feel about each expense
- **Streak Tracking** - Build consistent money tracking habits

### 📱 Mobile Optimized
- **iOS Native Feel** - Optimized for iPhone and iPad
- **Touch-Friendly** - Large buttons and intuitive gestures
- **PWA Ready** - Install as a home screen app
- **Offline-First** - Works without internet connection
- **Safe Area Support** - Proper display on devices with notches

### 📊 Analytics & Reports
- **Visual Charts** - Pie charts and bar graphs for spending analysis
- **Daily Summaries** - Track income vs expenses daily
- **Category Breakdown** - See where your money goes
- **Time Range Filters** - 7, 30, or 90-day views
- **Progress Tracking** - Monitor budget category usage

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + react-chartjs-2
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **State Management**: React Context + localStorage
- **Build Tool**: Vite
- **PWA**: Service Worker ready

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd spending-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:3000`
   - For mobile testing, use your device's IP address

### Building for Production

```bash
npm run build
npm run preview
```

## 📱 Mobile Installation

### iOS Safari
1. Open the app in Safari on your iPhone/iPad
2. Tap the Share button (square with arrow)
3. Select "Add to Home Screen"
4. The app will now appear as a native app

### Android Chrome
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home screen"
4. Follow the prompts to install

## 🎯 How to Use

### Adding Expenses
1. Tap "Add Expense" on the home screen
2. Enter the amount (use quick amount buttons for speed)
3. Select a category
4. Optionally add vendor and note
5. Choose how you feel about the expense
6. Tap "Save Expense"

### Adding Income
1. Tap "Add Income" on the home screen
2. Enter the amount
3. Select income type (Tip or Paycheck)
4. Add optional note
5. See how it will be distributed to budget categories
6. Tap "Save Income"

### Managing Budget
1. Go to the Budget page
2. View current allocations and spending
3. Tap the edit button to adjust percentages
4. Ensure total equals 100%
5. Save your changes

### Viewing Reports
1. Navigate to the Reports page
2. Select time range (7D, 30D, 90D)
3. View charts and transaction history
4. Analyze spending patterns

## 🎨 Design Principles

- **Speed & Simplicity** - Every action should be quick and intuitive
- **Real-Time Awareness** - Immediate feedback on spending impact
- **Emotion-Driven** - Understand not just where money goes, but why
- **Rolling Budgets** - Adapt to variable income patterns
- **Mobile-First** - Designed for on-the-go use

## 📊 Budget Categories

Default categories included:
- 🍽️ Food & Dining (25%)
- 🚗 Transportation (15%)
- 🎬 Entertainment (10%)
- 🛍️ Shopping (20%)
- 💡 Bills & Utilities (20%)
- 💰 Savings (10%)

Customize percentages based on your priorities!

## 🔧 Customization

### Adding New Categories
Edit the `initialState` in `src/context/AppContext.tsx`:

```typescript
budgetCategories: [
  // ... existing categories
  { 
    id: '7', 
    name: 'New Category', 
    percentage: 5, 
    color: '#your-color', 
    icon: '🎯' 
  },
]
```

### Changing Currency
Update the settings in the context or add a settings page to change currency symbols.

## 📈 Future Enhancements

- [ ] Voice input for expenses
- [ ] Receipt photo scanning
- [ ] Export to CSV/PDF
- [ ] Multiple accounts support
- [ ] Bill reminders
- [ ] Goal setting and tracking
- [ ] Dark mode support
- [ ] Cloud sync (Firebase/Supabase)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on mobile devices
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by the needs of variable income earners
- Built with modern web technologies for optimal mobile experience
- Designed for simplicity and speed

---

**Happy Budgeting! 💰✨**