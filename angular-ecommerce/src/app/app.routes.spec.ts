import { routes } from './app.routes';
import { adminGuard } from './core/guards/admin.guard';

describe('App Routes', () => {
  it('defines all expected auth child routes with lazy components', () => {
    const authRoute = routes.find((route) => route.path === 'auth');
    const authChildren = authRoute?.children ?? [];
    const authPaths = authChildren.map((child) => child.path);

    expect(authPaths).toContain('login');
    expect(authPaths).toContain('register');
    expect(authPaths).toContain('verify-email');
    expect(authPaths).toContain('forgot-password');
    expect(authPaths).toContain('add-info');

    for (const childRoute of authChildren) {
      expect(typeof childRoute.loadComponent).toBe('function');
    }
  });

  it('includes key app feature routes', () => {
    const mainRoute = routes.find((route) => route.path === '');
    const childPaths = (mainRoute?.children || []).map((child) => child.path);

    expect(childPaths).toContain('cart');
    expect(childPaths).toContain('wishlist');
    expect(childPaths).toContain('products/:id');
    expect(childPaths).toContain('categories/:slug');
    expect(childPaths).toContain('admin/inventory');
  });

  it('protects admin inventory route with adminGuard', () => {
    const mainRoute = routes.find((route) => route.path === '');
    const adminRoute = mainRoute?.children?.find((child) => child.path === 'admin/inventory');

    expect(adminRoute).toBeTruthy();
    expect(adminRoute?.canActivate).toEqual([adminGuard]);
    expect(typeof adminRoute?.loadComponent).toBe('function');
  });

});
