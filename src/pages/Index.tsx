import { Layout } from "@/components/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { MissionSection } from "@/components/home/MissionSection";
import { LatestSermon } from "@/components/home/LatestSermon";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { DonationCTA } from "@/components/home/DonationCTA";

const Index = () => {
  return (
    <Layout>
      <div className="overflow-hidden">
        <HeroSection />
        <MissionSection />
        <LatestSermon />
        <UpcomingEvents />
        <DonationCTA />
      </div>
    </Layout>
  );
};

export default Index;
