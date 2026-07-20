import AvatarStage from '@/components/avatar/AvatarStage';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import HeaderNavigation from '@/components/layout/HeaderNavigation';
import ChatWrapper from '@/components/layout/ChatWrapper'; // We'll create this to manage state

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-slate-900">
      <HeaderNavigation />
      
      {/* The Hero Avatar Stage takes up the full height but the dashboard overlaps the bottom 35-40% */}
      <div className="absolute inset-0 z-0">
        <AvatarStage />
      </div>

      {/* The Chat Wrapper handles state between input and dashboard */}
      <ChatWrapper />
    </main>
  );
}
