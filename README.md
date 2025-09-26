# University of Makati Library System

A secure web-based library management system for the University of Makati.

## Security Features

This application has been refactored to be production-ready with the following security improvements:

- ✅ Removed hardcoded admin credentials
- ✅ Centralized configuration management
- ✅ Enhanced input validation and sanitization
- ✅ Rate limiting for login attempts
- ✅ Secure authentication flow
- ✅ Environment-specific configurations

## Setup Instructions

### 1. Configuration

1. Copy the production template:
   ```bash
   cp config.production.template.js config.js
   ```

2. Edit `config.js` and add your actual Supabase credentials:
   ```javascript
   supabase: {
     url: 'https://your-project.supabase.co',
     anonKey: 'your-anon-key-here'
   }
   ```

### 2. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the project settings
3. Set up your database tables (users, admin_roles, etc.)
4. Configure Row Level Security (RLS) policies

### 3. Security Considerations

- **Never commit `config.js` to version control** - it's already in `.gitignore`
- Use environment variables in production deployments
- Implement server-side admin checks for production
- Enable HTTPS in production
- Set up proper CORS policies
- Implement proper logging and monitoring

### 4. Development vs Production

- **Development**: Uses `config.js` with debug enabled
- **Production**: Uses `config.production.template.js` with debug disabled

## File Structure

```
├── index.html              # Main login page
├── config.js               # Configuration (not in git)
├── config.production.template.js  # Production config template
├── auth.js                 # Secure authentication module
├── supabase.js             # Supabase integration
├── theme.css               # Styling
├── theme.js                # Theme functionality
└── .gitignore              # Git ignore file
```

## Security Improvements Made

### Before (Not Production-Ready)
- Hardcoded admin credentials in client-side code
- Secret codes visible in source code
- Limited input validation
- No rate limiting
- Direct database access from client

### After (Production-Ready)
- Centralized configuration management
- Secure authentication module
- Enhanced input validation
- Rate limiting for login attempts
- Proper error handling
- Environment-specific settings

## Next Steps for Full Production Deployment

1. **Server-Side Implementation**: Move admin checks to server-side API
2. **Environment Variables**: Use proper environment variable management
3. **HTTPS**: Enable SSL/TLS certificates
4. **Monitoring**: Add logging and error tracking
5. **Testing**: Implement comprehensive test suite
6. **CI/CD**: Set up automated deployment pipeline

## Support

For technical support or security concerns, contact the development team.
