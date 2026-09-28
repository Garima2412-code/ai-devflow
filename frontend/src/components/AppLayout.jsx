import Sidebar from './Sidebar';
import TopBar from './TopBar';

const AppLayout = ({ children, breadcrumb }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-surface-0 text-text-primary">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar breadcrumb={breadcrumb} />
        <main className="flex-1 overflow-y-auto bg-surface-1/40 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;