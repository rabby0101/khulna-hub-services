
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Plus, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="gradient-hero text-white py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Find Trusted Services in <span className="text-accent">Khulna</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 animate-fade-in">
            Connect with skilled professionals for all your service needs
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12 animate-fade-in">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="What service do you need? (e.g., electrician, plumber, tutor)"
                className="pl-12 pr-4 h-14 text-lg bg-white text-foreground"
              />
              <Button className="absolute right-2 top-2 h-10 bg-accent hover:bg-accent/90">
                Search
              </Button>
            </div>
            
            <div className="flex items-center justify-center mt-3 text-blue-100">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">Serving all areas in Khulna city</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100 w-full sm:w-auto">
              <Plus className="w-5 h-5 mr-2" />
              Post a Job
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary w-full sm:w-auto">
              <Users className="w-5 h-5 mr-2" />
              Browse Services
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mt-16 text-blue-100">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-sm">Service Providers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">2000+</div>
              <div className="text-sm">Jobs Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">4.8★</div>
              <div className="text-sm">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
