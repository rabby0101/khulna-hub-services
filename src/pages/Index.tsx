
import Header from "@/components/Header";
import ServiceCategories from "@/components/ServiceCategories";
import RecentJobs from "@/components/RecentJobs";
import HowItWorks from "@/components/HowItWorks";
import FeaturedProviders from "@/components/FeaturedProviders";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ServiceCategories />
      <RecentJobs />
      <HowItWorks />
      <FeaturedProviders />
      <Footer />
    </div>
  );
};

export default Index;
