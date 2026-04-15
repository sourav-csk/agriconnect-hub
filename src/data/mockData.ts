export interface CropListing {
  id: string;
  farmerName: string;
  farmerLocation: string;
  cropName: string;
  quantity: number;
  unit: string;
  expectedPrice: number;
  image: string;
  category: string;
  postedAt: string;
}

export interface MandiPrice {
  crop: string;
  price: number;
  change: number;
  unit: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  rainfall: number;
  forecast: { day: string; temp: number; condition: string }[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface ChatThread {
  id: string;
  name: string;
  lastMessage: string;
  unread: number;
  avatar: string;
}

export const mandiPrices: MandiPrice[] = [
  { crop: "🌾 Wheat", price: 2250, change: 3.2, unit: "quintal" },
  { crop: "🌾 Rice", price: 3100, change: -1.5, unit: "quintal" },
  { crop: "🧅 Onion", price: 1800, change: 8.0, unit: "quintal" },
  { crop: "🥔 Potato", price: 1200, change: -2.3, unit: "quintal" },
  { crop: "🍅 Tomato", price: 2800, change: 12.5, unit: "quintal" },
  { crop: "🌽 Maize", price: 1950, change: 1.1, unit: "quintal" },
  { crop: "🫘 Soybean", price: 4200, change: -0.8, unit: "quintal" },
  { crop: "🥜 Groundnut", price: 5500, change: 2.0, unit: "quintal" },
];

export const cropListings: CropListing[] = [
  {
    id: "1", farmerName: "Ramesh Kumar", farmerLocation: "Indore, MP",
    cropName: "Organic Wheat", quantity: 50, unit: "quintal",
    expectedPrice: 2400, image: "", category: "Grains",
    postedAt: "2 hours ago",
  },
  {
    id: "2", farmerName: "Sita Devi", farmerLocation: "Nashik, MH",
    cropName: "Fresh Onions", quantity: 30, unit: "quintal",
    expectedPrice: 2000, image: "", category: "Vegetables",
    postedAt: "5 hours ago",
  },
  {
    id: "3", farmerName: "Arjun Singh", farmerLocation: "Lucknow, UP",
    cropName: "Basmati Rice", quantity: 100, unit: "quintal",
    expectedPrice: 3500, image: "", category: "Grains",
    postedAt: "1 day ago",
  },
  {
    id: "4", farmerName: "Priya Patel", farmerLocation: "Ahmedabad, GJ",
    cropName: "Groundnut", quantity: 20, unit: "quintal",
    expectedPrice: 5800, image: "", category: "Oilseeds",
    postedAt: "3 hours ago",
  },
];

export const weatherData: WeatherData = {
  temp: 32,
  condition: "Partly Cloudy",
  humidity: 65,
  rainfall: 25,
  forecast: [
    { day: "Today", temp: 32, condition: "☁️" },
    { day: "Tue", temp: 34, condition: "☀️" },
    { day: "Wed", temp: 30, condition: "🌧️" },
    { day: "Thu", temp: 28, condition: "🌧️" },
    { day: "Fri", temp: 31, condition: "⛅" },
  ],
};

export const chatThreads: ChatThread[] = [
  { id: "1", name: "Vikram Wholesaler", lastMessage: "What's your best price for wheat?", unread: 2, avatar: "V" },
  { id: "2", name: "Green Mart Retail", lastMessage: "Can you deliver by Friday?", unread: 0, avatar: "G" },
  { id: "3", name: "Hotel Sunrise", lastMessage: "We need 10 quintals of rice", unread: 1, avatar: "H" },
];

export const chatMessages: Record<string, ChatMessage[]> = {
  "1": [
    { id: "m1", senderId: "buyer", text: "Namaste! I need 50 quintals of wheat.", timestamp: "10:00 AM" },
    { id: "m2", senderId: "farmer", text: "Namaste ji! I have fresh wheat available at ₹2400/quintal.", timestamp: "10:02 AM" },
    { id: "m3", senderId: "buyer", text: "What's your best price for wheat?", timestamp: "10:05 AM" },
  ],
};

export const cropCategories = ["All", "Grains", "Vegetables", "Fruits", "Oilseeds", "Spices"];

export const suggestedPrices: Record<string, number> = {
  Wheat: 2300, Rice: 3200, Onion: 1900, Potato: 1300,
  Tomato: 2700, Maize: 2000, Soybean: 4300, Groundnut: 5600,
};
