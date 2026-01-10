# CO-PARENTS Deployment Notes

## Environment Files Created
- ✅ `server/.env.example` - Template for backend environment variables
- ✅ `client/.env.production` - Frontend production configuration
- ✅ `client/.env.development` - Frontend development configuration
- ✅ `client/src/config/api.js` - Central API configuration helper

## Backend Changes
- ✅ Updated CORS configuration in `server/index.js` to support production IP (68.183.85.8)

## Next Steps Required

### 1. Update Server Environment File
Copy `.env.example` to `.env` and fill in production values:
```bash
cp server/.env.example server/.env
# Edit server/.env with your actual values
```

### 2. Update Frontend Files (31 files need changes)
Replace hardcoded `http://localhost:5000` with the API helper functions.

**Files to update:**
- `client/src/context/AuthContext.jsx`
- `client/src/pages/ListingDetail.jsx`
- `client/src/pages/Listings.jsx`
- `client/src/pages/Profile.jsx`
- `client/src/pages/admin/*.jsx` (4 files)
- `client/src/pages/vendor/*.jsx` (3 files)
- `client/src/pages/counselingForm.jsx`

**Pattern:**
```javascript
// Add import at top
import { getApiUrl, getUploadUrl } from '@/config/api';

// Replace hardcoded URLs
// OLD: 'http://localhost:5000/api/listings'
// NEW: getApiUrl('/api/listings')

// OLD: `http://localhost:5000/uploads/${filename}`
// NEW: getUploadUrl(filename)
```

### 3. Set Up MongoDB
Choose one:
- **Option A:** Install MongoDB on the droplet
- **Option B:** Use MongoDB Atlas (recommended for production)

### 4. Deploy to Digital Ocean
Follow the comprehensive deployment guide in `deployment_guide.md`

## Important Reminders

> **CRITICAL:** Before deploying:
> 1. Update `server/.env` with strong JWT_SECRET and COOKIE_SECRET
> 2. Configure MongoDB connection string
> 3. If using a domain name, update CORS origins and environment files

> **SECURITY:** Never commit `.env` files to Git! They're already in `.gitignore`
