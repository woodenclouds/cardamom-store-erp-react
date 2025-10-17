# Cardamom Dry Center Management System

A comprehensive React-based web application for managing cardamom drying and processing center operations, including raw cardamom intake, drying batches, sales issues, payments, and customer ledgers.

## 🌟 Features

### Core Functionality
- **Dashboard**: Overview of key metrics with interactive charts
- **Collections**: Manage raw cardamom intake with customer tracking
- **Drying Batches**: Track drying processes with yield calculations
- **Issues**: Issue dried cardamom to customers with payment tracking
- **Payments**: Record and manage customer payments
- **Ledger**: Customer account statements and transaction history
- **Reports**: Generate drying yield and outstanding payment reports

### UI/UX Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode**: Toggle between light and dark themes
- **Toast Notifications**: Real-time feedback for user actions
- **Modal Forms**: Clean, animated forms for data entry
- **Data Tables**: Searchable, paginated tables with sorting
- **Charts**: Interactive charts for data visualization

## 🛠 Tech Stack

- **Frontend**: React 19.1.1 + Vite 7.1.7
- **Styling**: TailwindCSS with custom green theme
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Yup validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Top navigation bar
│   ├── Sidebar.jsx     # Side navigation menu
│   ├── DataTable.jsx   # Reusable data table
│   ├── ModalForm.jsx   # Modal dialog wrapper
│   └── Card.jsx        # Metric display cards
├── pages/              # Application pages
│   ├── Login.jsx       # Authentication page
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Collection.jsx  # Raw cardamom collections
│   ├── DryingBatch.jsx # Drying batch management
│   ├── Issue.jsx       # Issue dried cardamom
│   ├── Payments.jsx    # Payment tracking
│   ├── Ledger.jsx      # Customer ledger
│   └── Reports.jsx     # Analytics and reports
├── services/           # API and data services
│   └── api.js          # Mock API endpoints
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
└── routes.jsx          # Route configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Wostore
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Demo Credentials
- **Username**: `admin`
- **Password**: `admin123`

## 📊 Application Pages

### 1. Login Page
- Clean, centered login form
- Cardamom leaf branding
- Demo credentials display
- Form validation with error messages

### 2. Dashboard
- **Metrics Cards**: Total collections, dried quantity, pending payments, active batches
- **Collection Trends Chart**: 7-day collection trends using Recharts
- **Recent Activity**: Latest collections and active batches
- **Real-time Updates**: Live data refresh

### 3. Collections
- **Data Table**: All collection records with search and pagination
- **Add/Edit Modal**: Customer autocomplete, quantity/rate calculation
- **Auto-calculation**: Amount automatically calculated from quantity × rate
- **Batch Tracking**: Optional batch number assignment

### 4. Drying Batches
- **Batch Management**: Create, edit, and track drying batches
- **Yield Calculation**: Automatic drying loss percentage calculation
- **Status Tracking**: In Progress vs Completed batches
- **Grade Management**: A, B, C grade classification

### 5. Issues
- **Customer Selection**: Autocomplete customer search
- **Batch Selection**: Available completed batches dropdown
- **Payment Status**: Track paid vs pending payments
- **Auto-calculation**: Amount calculation from quantity × rate

### 6. Payments
- **Payment Recording**: Date, customer, amount, mode, remarks
- **Summary Cards**: Total received and pending amounts
- **Payment Modes**: Cash, Bank Transfer, Cheque, UPI
- **Transaction History**: Complete payment tracking

### 7. Ledger
- **Customer Search**: Select customer to view statement
- **Transaction History**: Debit/credit entries with running balance
- **Export Options**: PDF and Excel export functionality
- **Date Filtering**: Filter transactions by date range

### 8. Reports
- **Drying Yield Report**: Batch-wise yield analysis with date filtering
- **Outstanding Summary**: Customer outstanding amounts
- **Export Functionality**: Export reports in various formats
- **Interactive Charts**: Visual representation of data

## 🎨 Design System

### Color Palette
- **Primary Green**: `#14532d` to `#22c55e` (earthy green tones)
- **Earth Tones**: Complementary browns and beiges
- **Dark Mode**: Full dark theme support with `dark:` prefixes

### Components
- **Cards**: Consistent shadow and rounded corners
- **Buttons**: Primary and secondary variants with hover states
- **Forms**: Clean inputs with focus states and validation
- **Tables**: Alternating row colors with hover effects
- **Modals**: Smooth slide-in animations

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Configuration

### TailwindCSS
Custom configuration in `tailwind.config.js` with:
- Extended color palette for primary and earth tones
- Dark mode support
- Custom component classes

### API Configuration
Mock API endpoints in `src/services/api.js`:
- Authentication endpoints
- CRUD operations for all entities
- Customer search functionality
- Report generation endpoints

## 📱 Responsive Features

- **Collapsible Sidebar**: Mobile-friendly navigation
- **Responsive Tables**: Horizontal scroll on small screens
- **Touch-friendly**: Large tap targets for mobile
- **Adaptive Layout**: Flexible grid systems

## 🔐 Authentication

- **Mock Authentication**: LocalStorage-based token system
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Session Persistence**: Login state maintained across browser sessions

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Environment Variables
Create `.env` file for production:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with React and Vite for modern development experience
- TailwindCSS for utility-first styling
- Lucide React for beautiful icons
- Recharts for data visualization
- Framer Motion for smooth animations

---

**Cardamom Dry Center Management System** - Streamlining cardamom processing operations with modern web technology.