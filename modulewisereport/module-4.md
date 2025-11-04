# Module 4: Development Plan, Testing, and Performance

## 4.1 Development Plan
### Phase 1 (Weeks 1-2)
- Image Upload System (backend validation, frontend preview, storage)
- Enhanced Error Handling (global handler, user-friendly messages)
- Search and Filter (backend search, frontend UI, DB text indexes)

### Phase 2 (Weeks 3-4)
- Real-time Messaging (WebSocket, chat UI, persistence)
- Email Notifications (SendGrid/SES, messages, expiry reminders)
- Advanced Search (location, price, sort)

### Phase 3 (Weeks 5-6)
- Production Deployment (Docker, cloud, env configs)
- Admin Panel (user mgmt, moderation, analytics)
- Performance Optimization (indexes, Redis cache, CDN)

### Phase 4 (Weeks 7-8)
- Analytics & Reporting
- Multi-tenancy Support

## 4.2 Testing Strategy
- Backend: JUnit 5, Mockito, Testcontainers; unit and integration tests
- Frontend: Jest, React Testing Library; E2E with Cypress/Playwright
- API Testing: Postman/Newman, RestAssured

Example Backend Tests
```java
@ExtendWith(MockitoExtension.class)
class AdServiceTest {
    // Service layer tests
}

@SpringBootTest
@Testcontainers
class AdControllerIntegrationTest {
    // Full context tests
}
```

Example Frontend Test
```javascript
import { render, screen } from '@testing-library/react';

test('renders advertisement card', () => {
  render(<AdCard ad={mockAd} />);
  expect(screen.getByText('iPhone 13')).toBeInTheDocument();
});
```

## 4.3 Performance Considerations
- Bottlenecks: missing indexes, no image optimization/CDN, no caching, bundle size

### Optimizations
- DB Indexes: text, userId, createdAt; unique email on users
- Frontend: code splitting, image optimization (lazy, query params)
- Caching: Spring Cache for frequent reads

### Metrics
- Page Load < 3s
- API < 500ms
- Query < 100ms
- Bundle < 500KB gzipped
