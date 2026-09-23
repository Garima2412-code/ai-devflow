import Sidebar from './Sidebar';
import TopBar from './TopBar';

const AppLayout = ({ children, breadcrumb }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar breadcrumb={breadcrumb} />
        <main className="flex-1 overflow-y-auto bg-surface-0 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;