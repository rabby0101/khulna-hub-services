
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Home, BookOpen, Monitor, Car, Scissors, Hammer, UtensilsCrossed, Smartphone, PartyPopper } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Home Repair & Maintenance",
    bengali: "ঘর মেরামত ও রক্ষণাবেক্ষণ",
    icon: Wrench,
    jobs: 45,
    color: "bg-blue-50 text-blue-600"
  },
  {
    id: 2,
    name: "Home Services",
    bengali: "ঘরোয়া সেবা",
    icon: Home,
    jobs: 38,
    color: "bg-green-50 text-green-600"
  },
  {
    id: 3,
    name: "Education & Tutoring",
    bengali: "শিক্ষা ও গৃহশিক্ষকতা",
    icon: BookOpen,
    jobs: 52,
    color: "bg-purple-50 text-purple-600"
  },
  {
    id: 4,
    name: "Technology & IT",
    bengali: "প্রযুক্তি ও আইটি",
    icon: Monitor,
    jobs: 29,
    color: "bg-indigo-50 text-indigo-600"
  },
  {
    id: 5,
    name: "Automotive",
    bengali: "গাড়ি ও যানবাহন",
    icon: Car,
    jobs: 23,
    color: "bg-red-50 text-red-600"
  },
  {
    id: 6,
    name: "Personal Services",
    bengali: "ব্যক্তিগত সেবা",
    icon: Scissors,
    jobs: 34,
    color: "bg-pink-50 text-pink-600"
  },
  {
    id: 7,
    name: "Construction & Renovation",
    bengali: "নির্মাণ ও সংস্কার",
    icon: Hammer,
    jobs: 41,
    color: "bg-orange-50 text-orange-600"
  },
  {
    id: 8,
    name: "Food & Catering",
    bengali: "খাদ্য ও ক্যাটারিং",
    icon: UtensilsCrossed,
    jobs: 18,
    color: "bg-yellow-50 text-yellow-600"
  },
  {
    id: 9,
    name: "Mobile & Electronics",
    bengali: "মোবাইল ও ইলেকট্রনিক্স",
    icon: Smartphone,
    jobs: 26,
    color: "bg-teal-50 text-teal-600"
  },
  {
    id: 10,
    name: "Events & Entertainment",
    bengali: "অনুষ্ঠান ও বিনোদন",
    icon: PartyPopper,
    jobs: 15,
    color: "bg-cyan-50 text-cyan-600"
  }
];

const ServiceCategories = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Service Categories
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse our wide range of services available in Khulna
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card
                key={category.id}
                className="hover-scale cursor-pointer group border-0 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-sm md:text-base text-foreground mb-1 leading-tight">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground bengali-text mb-2">
                    {category.bengali}
                  </p>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {category.jobs} jobs
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;
