
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, User, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import UserMenu from "./UserMenu";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">KS</span>
            </div>
            <span className="font-bold text-xl text-foreground">Khulna Services</span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="What service do you need?"
                className="pl-10 pr-4 h-10"
              />
            </div>
          </div>

          {/* Location & Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-1" />
              Khulna, Bangladesh
            </div>
            
            <Button variant="outline" size="sm" className="hidden md:flex">
              Post a Job
            </Button>
            
            {user ? (
              <UserMenu />
            ) : (
              <Button size="sm" asChild>
                <Link to="/auth">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}
            
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="What service do you need?"
              className="pl-10 pr-4 h-10"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
