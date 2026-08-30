import React from 'react';
import { AdminProvider, useAdmin } from './AdminContext';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminHeader } from './components/AdminHeader';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import { AdminAgentsPage } from './pages/AdminAgentsPage';
import { AdminOverviewPage } from './pages/AdminOverviewPage';
import { FieldAgentOrdersPage } from './pages/FieldAgentOrdersPage';

const AdminContent = () => {
  const { adminUser, activeTab } = useAdmin();

  // If unauthenticated, directly display the Admin Login Page
  if (!adminUser) {
    return <AdminLoginPage />;
  }

  const isFieldAgent = adminUser.role === 'FIELD_AGENT';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-pitch)' }}>
      <AdminHeader />
      <main style={{ flex: 1 }}>
        {isFieldAgent ? (
          /* Field Agent View: Scoped Pickups & Inspection Console */
          <FieldAgentOrdersPage />
        ) : (
          /* Super Admin View: Full Management */
          <>
            {activeTab === 'orders' && <AdminOrdersPage />}
            {activeTab === 'agents' && <AdminAgentsPage />}
            {activeTab === 'overview' && <AdminOverviewPage />}
          </>
        )}
      </main>
    </div>
  );
};

export const AdminApp = () => {
  return (
    <AdminProvider>
      <AdminContent />
    </AdminProvider>
  );
};

export default AdminApp;
