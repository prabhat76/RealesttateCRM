# Frontend-Backend Connection Guide

## ✅ Successfully Connected

The Angular frontend is now connected to the Spring Boot backend with the following integrations:

### 🔗 **API Configuration**
- **Backend URL**: `http://localhost:8080/api`
- **Environment**: Development configuration
- **HTTP Client**: Configured with providers

### 🔐 **Authentication Integration**
- **Login Endpoint**: `POST /api/auth/login`
- **Token Storage**: localStorage with JWT
- **Auto Headers**: Bearer token in API calls

### 📊 **Dashboard Integration**
- **Stats API**: `GET /api/dashboard/stats`
- **Properties API**: `GET /api/properties/recent`
- **Leads API**: `GET /api/leads/recent`

### 🛠️ **Services Created**
1. **AuthService**: Backend authentication
2. **ApiService**: HTTP communication layer
3. **Environment**: API URL configuration

## 🚀 **How to Test**

### 1. Start Backend
```bash
cd /Users/prabhatkumar/Desktop/crm_novakeys/backend
mvn spring-boot:run
```

### 2. Start Frontend
```bash
cd /Users/prabhatkumar/Desktop/p
npm start
```

### 3. Login Credentials
- **Email**: superadmin@novakeys.com
- **Password**: admin123

## 📡 **API Endpoints Available**

### Authentication
- `POST /api/auth/login` - User login

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics

### Properties
- `GET /api/properties` - All properties
- `GET /api/properties/recent` - Recent properties
- `POST /api/properties` - Create property

### Leads
- `GET /api/leads` - All leads
- `GET /api/leads/recent` - Recent leads
- `POST /api/leads` - Create lead

## 🔧 **Configuration Files**

### Environment
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

### HTTP Client
```typescript
// src/main.ts
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient()]
});
```

## 🛡️ **Security Features**
- **JWT Token**: Automatic header injection
- **CORS**: Configured for localhost:4200
- **Error Handling**: Proper error responses

## 📈 **Data Flow**
1. **Login** → Backend validates → Returns JWT + User
2. **Dashboard** → API calls with JWT → Real data display
3. **CRUD Operations** → Authenticated API calls → Database updates

The frontend now communicates with the normalized, sharded, and indexed Spring Boot backend for real-time CRM operations.