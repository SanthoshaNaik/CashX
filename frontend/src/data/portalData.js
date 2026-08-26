// Dynamic Company Branding & Portal Dataset
// Customized for company name: "TheCashX"

export const DEFAULT_COMPANY_INFO = {
  name: "TheCashX",
  tagline: "Instant Cash for Used Laptops, Desktops, Monitors & Mac Mini",
  establishedYear: 2026,
  yearsExperience: "24+",
  phone: "+91 89709 00825",
  whatsapp: "+91 89709 00825",
  email: "support@thecashx.com",
  websiteUrl: "https://www.thecashx.com",
  address: "Main Commercial Complex, Electronics Hub, MG Road, Bangalore - 560001",
  workingHours: "Mon - Sat: 9:30 AM - 8:00 PM | Sun: 10:00 AM - 4:00 PM",
  googleMapsUrl: "https://maps.google.com/?q=12.9716,77.5946"
};

export const BRANDS = [
  { id: "apple", name: "Apple MacBook", icon: "Apple", popular: true, basePrice: 45000 },
  { id: "dell", name: "Dell", icon: "Laptop", popular: true, basePrice: 22000 },
  { id: "hp", name: "HP", icon: "Laptop", popular: true, basePrice: 20000 },
  { id: "lenovo", name: "Lenovo", icon: "Laptop", popular: true, basePrice: 19000 },
  { id: "asus", name: "Asus", icon: "Laptop", popular: true, basePrice: 21000 },
  { id: "acer", name: "Acer", icon: "Laptop", popular: false, basePrice: 17000 },
  { id: "msi", name: "MSI", icon: "Gamepad2", popular: false, basePrice: 28000 },
  { id: "surface", name: "Microsoft Surface", icon: "Tablet", popular: false, basePrice: 32000 },
  { id: "samsung", name: "Samsung", icon: "Smartphone", popular: false, basePrice: 18000 },
  { id: "toshiba", name: "Toshiba", icon: "HardDrive", popular: false, basePrice: 11000 },
  { id: "sony", name: "Sony Vaio", icon: "Tv", popular: false, basePrice: 12000 },
  { id: "lg", name: "LG Gram", icon: "Monitor", popular: false, basePrice: 25000 }
];

export const CITIES = [
  { id: "bangalore", name: "Bangalore", hubs: 4, activeAgents: 12 },
  { id: "mysore", name: "Mysore", hubs: 2, activeAgents: 4 },
  { id: "chennai", name: "Chennai", hubs: 3, activeAgents: 8 },
  { id: "hyderabad", name: "Hyderabad", hubs: 4, activeAgents: 10 },
  { id: "pune", name: "Pune", hubs: 3, activeAgents: 6 },
  { id: "mumbai", name: "Mumbai", hubs: 5, activeAgents: 14 },
  { id: "delhi", name: "Delhi NCR", hubs: 6, activeAgents: 18 }
];

export const CATEGORIES = [
  {
    id: "laptop",
    name: "Laptop",
    supportingText: "Sell your laptop",
    title: "Sell Used Laptop",
    subtitle: "Dell, HP, Lenovo, Apple, Asus, Acer & more",
    route: "/sell-laptop",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=90",
    badge: "Highest Payout",
    basePrice: 24000,
    features: ["Instant Doorstep Pickup", "Free 2-Hour Diagnostic", "Instant UPI/Cash Payout"]
  },
  {
    id: "desktop",
    name: "Desktop",
    supportingText: "Sell your desktop",
    title: "Sell Desktop PC",
    subtitle: "Gaming Rigs, Workstations, Towers & AiO PCs",
    route: "/sell-desktop",
    image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=90",
    badge: "Component Valuation",
    basePrice: 32000,
    features: ["GPU/CPU Component Value", "Custom Tower Buyback", "Safe On-Site Testing"]
  },
  {
    id: "monitor",
    name: "Monitor",
    supportingText: "Sell your monitor",
    title: "Sell Monitor",
    subtitle: "Gaming, 4K, UltraWide & Professional Displays",
    route: "/sell-monitor",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=90",
    badge: "Instant Quote",
    basePrice: 12000,
    features: ["1080p / 2K / 4K Displays", "Gaming & High Refresh Rate", "Zero Hassle Doorstep Sale"]
  },
  {
    id: "macmini",
    name: "Mac Mini",
    supportingText: "Sell your Mac mini",
    title: "Sell Mac Mini",
    subtitle: "Apple Mac Mini M1, M2, M2 Pro, M4 & Intel Series",
    route: "/sell-macmini",
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=90",
    badge: "Apple Premium Rates",
    basePrice: 38000,
    features: ["Apple Silicon & Intel Models", "Top Resale Value", "DoD Data Sanitization"]
  }
];

export const MONITOR_BRANDS = [
  { id: "dell", name: "Dell" },
  { id: "lg", name: "LG" },
  { id: "samsung", name: "Samsung" },
  { id: "benq", name: "BenQ" },
  { id: "asus", name: "ASUS ROG / TUF" },
  { id: "acer", name: "Acer Predator" },
  { id: "viewsonic", name: "ViewSonic" },
  { id: "msi", name: "MSI" },
  { id: "gigabyte", name: "Gigabyte / AORUS" },
  { id: "apple-display", name: "Apple Studio Display" }
];

export const MACMINI_MODELS = [
  { id: "m4-pro", name: "Mac Mini M4 Pro (2024)", basePrice: 75000 },
  { id: "m4", name: "Mac Mini M4 (2024)", basePrice: 52000 },
  { id: "m2-pro", name: "Mac Mini M2 Pro (2023)", basePrice: 62000 },
  { id: "m2", name: "Mac Mini M2 (2023)", basePrice: 42000 },
  { id: "m1", name: "Mac Mini M1 (2020)", basePrice: 32000 },
  { id: "intel-i7", name: "Mac Mini Intel Core i7", basePrice: 18000 },
  { id: "intel-i5", name: "Mac Mini Intel Core i5", basePrice: 14000 }
];

export const SERVICES = [
  {
    id: "sell-used-laptop",
    title: "Sell Used Laptop",
    shortDesc: "Get maximum resale cash for any working or non-working laptop.",
    fullDesc: "We buy used laptops of all brands including Dell, HP, Lenovo, Asus, Acer, and Samsung. Fast doorstep valuation and instant bank transfer or cash payment.",
    icon: "Laptop",
    tag: "High Value"
  },
  {
    id: "sell-desktop",
    title: "Sell Desktop & Rigs",
    shortDesc: "Buyback for custom gaming PCs, workstations, and all-in-one desktops.",
    fullDesc: "Got a custom gaming rig, editing workstation, or office desktop PC? We evaluate individual component values (GPU, CPU, RAM) for the best payout.",
    icon: "Monitor",
    tag: "Component Valuation"
  },
  {
    id: "sell-monitor",
    title: "Sell Monitors & Displays",
    shortDesc: "Top rates for 1080p, 2K, 4K, Gaming, and UltraWide monitors.",
    fullDesc: "Sell your used Dell, LG, Samsung, BenQ, or ASUS monitor with free doorstep inspection and quick instant payout.",
    icon: "Tv",
    tag: "Instant Quote"
  },
  {
    id: "sell-macmini",
    title: "Sell Apple Mac Mini",
    shortDesc: "Specialized buyback rates for Mac Mini M1, M2, M2 Pro, M4, and Intel.",
    fullDesc: "We offer top market rates for Apple Mac Mini desktops with transparent hardware assessment and instant payment on pickup.",
    icon: "Apple",
    tag: "Apple Rates"
  },
  {
    id: "corporate-buyback",
    title: "Corporate ITAD Buyback",
    shortDesc: "Bulk laptop & desktop disposal for companies, startups, and IT parks.",
    fullDesc: "End-to-end corporate asset disposition (ITAD) with bulk evaluation, official GST invoices, chain-of-custody documentation, and eco-recycling compliance.",
    icon: "Building2",
    tag: "B2B Solutions"
  },
  {
    id: "data-destruction",
    title: "DoD-Grade Data Wiping",
    shortDesc: "Guaranteed 100% permanent data destruction with official certificate.",
    fullDesc: "Before any device leaves your sight, our certified field agents perform multi-pass DoD 5220.22-M data wiping on all hard drives and SSDs.",
    icon: "ShieldCheck",
    tag: "100% Secure"
  }
];

export const REVIEWS = [
  {
    id: 1,
    name: "Rajesh Kumar",
    city: "Bangalore",
    device: "Dell XPS 15",
    rating: 5,
    comment: "Sold my 3-year-old Dell XPS 15 to TheCashX. The agent arrived within 2 hours, ran the diagnostic app, and transferred ₹38,500 directly into my UPI account on the spot!",
    date: "2 days ago"
  },
  {
    id: 2,
    name: "Priya Sharma",
    city: "Chennai",
    device: "MacBook Air M1",
    rating: 5,
    comment: "Best buyback experience! Offered ₹8,000 more than other platforms. Very professional staff and complete data wiping done right in front of me.",
    date: "1 week ago"
  },
  {
    id: 3,
    name: "Vikram Reddy",
    city: "Hyderabad",
    device: "Asus ROG Gaming PC",
    rating: 5,
    comment: "TheCashX bought our entire batch of 25 office laptops for corporate upgrade. Smooth execution, GST invoice, and instant IMPS settlement.",
    date: "2 weeks ago"
  }
];

export const FAQS = [
  {
    question: "How do I sell my device to TheCashX?",
    answer: "Selling your device to TheCashX is super easy: 1) Select your category (Laptop, Desktop, Monitor, Mac Mini). 2) Get an instant price quote. 3) Schedule a free doorstep pickup at your preferred time. 4) Our field agent inspects your device and pays you instantly via UPI, IMPS, or Cash."
  },
  {
    question: "How is the buyback price calculated?",
    answer: "Our valuation engine calculates prices based on Brand, Processor, RAM size, Storage (SSD/HDD), screen condition, battery health, cosmetic condition, and included accessories like the original charger and bill."
  },
  {
    question: "Is doorstep pickup really free?",
    answer: "Yes! Doorstep pickup is 100% free across all covered cities (Bangalore, Mysore, Chennai, Hyderabad, Pune, Mumbai, Delhi NCR). There are no hidden inspection charges or travel fees."
  },
  {
    question: "Is the payment instant during pickup?",
    answer: "Yes! Once our field agent completes the 5-minute physical and hardware diagnostic checklist, the payment is transferred instantly to your bank account via UPI/IMPS before the agent takes the device."
  },
  {
    question: "What documents do I need to keep ready?",
    answer: "You only need to provide 1 valid government ID proof (Aadhaar Card, Driving License, or Passport) along with the original purchase invoice/bill if available for ownership verification."
  },
  {
    question: "How do you ensure my private data is wiped safely?",
    answer: "Data security is our top priority. Our field agents perform military-grade DoD 5220.22-M data sanitization to permanently wipe all hard drives and SSDs, ensuring zero data recovery risk."
  }
];

export const BLOG_POSTS = [
  {
    id: "how-to-sell-laptop-data-security",
    title: "How to Securely Prepare & Wipe Your Laptop Before Selling It",
    category: "Data Security",
    readTime: "5 min read",
    snippet: "Discover step-by-step instructions for backing up your files, signing out of cloud accounts, and executing DoD data destruction.",
    content: "When selling your old device, wiping your personal files, browser passwords, bank credentials, and family photos is critical. Learn how TheCashX guarantees 100% data sanitization."
  },
  {
    id: "best-time-to-sell-laptop",
    title: "When is the Best Time to Upgrade & Sell Your Used Laptop?",
    category: "Valuation Guide",
    readTime: "4 min read",
    snippet: "Timing your laptop sale can yield up to 30% higher buyback value before newer generation processors hit the market.",
    content: "Laptops lose value as new CPU generations release. Discover the ideal 2 to 3-year resale window to maximize your cash return."
  },
  {
    id: "macbook-resale-value-tips",
    title: "5 Essential Tips to Keep Your Apple MacBook Resale Value High",
    category: "MacBook Guide",
    readTime: "6 min read",
    snippet: "Maintain your battery cycle count, keep your original Apple box, and use keyboard protectors to secure top tier buyback quotes.",
    content: "MacBooks hold their value better than Windows PCs, but minor screen scratches or high battery cycle counts can reduce quotes. Follow these tips to get the best rate."
  }
];

export const INITIAL_REQUESTS = [
  {
    id: "LB-9821",
    customer: {
      name: "Harish Murthy",
      phone: "+91 89709 00825",
      altPhone: "+91 89709 00825",
      email: "harish.m@gmail.com",
      address: "Flat 402, Green View Apartments, Indiranagar",
      city: "Bangalore",
      pincode: "560038"
    },
    device: {
      type: "Laptop",
      brand: "Apple",
      model: "MacBook Pro 14 M1",
      processor: "Apple M1 Pro",
      ram: "16GB",
      storage: "512GB SSD",
      age: "2 Years",
      condition: "Excellent",
      accessories: ["Charger", "Original Box", "Invoice"],
      expectedPrice: 65000
    },
    status: "New Request",
    assignedAgentId: "agent-101",
    assignedAgentName: "Suresh Gowda",
    date: "2026-07-24",
    estimatedPrice: 68000,
    finalOfferPrice: 66500,
    remarks: "Client kept device in pristine condition with skin wrap.",
    inspection: {
      physical: { screenOk: "Yes", displayIssue: "No", scratches: "No", dents: "No", hingesOk: "Yes", keyboardOk: "Yes", touchpadOk: "Yes", webcamOk: "Yes", speakersOk: "Yes", micOk: "Yes" },
      hardware: { powerOn: "Working", batteryHealth: "89%", chargingPort: "Working", usbPorts: "Working", hdmiPort: "Working", wifi: "Working", bluetooth: "Working", storageDetection: "Working", ramDetection: "Working", fingerprintSensor: "Working", graphicsCheck: "Working" },
      software: { windowsActivated: "Working", driversInstalled: "Working", biosAccessible: "Working", osWorking: "Working" },
      accessories: { charger: true, box: true, bag: false, invoice: true, warranty: false },
      images: [
        { label: "Front View", url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80" },
        { label: "Keyboard View", url: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80" }
      ]
    }
  },
  {
    id: "LB-9822",
    customer: {
      name: "Sneha Patel",
      phone: "+91 89709 00825",
      altPhone: "",
      email: "sneha.p@outlook.com",
      address: "Building 12, Tech Park Enclave, Whitefield",
      city: "Bangalore",
      pincode: "560066"
    },
    device: {
      type: "Laptop",
      brand: "Dell",
      model: "Inspiron 15 5000",
      processor: "Intel Core i5 (11th Gen)",
      ram: "8GB",
      storage: "1TB HDD + 256GB SSD",
      age: "3 Years",
      condition: "Good",
      accessories: ["Charger"],
      expectedPrice: 22000
    },
    status: "Assigned",
    assignedAgentId: "agent-102",
    assignedAgentName: "Anand Verma",
    date: "2026-07-24",
    estimatedPrice: 23500,
    finalOfferPrice: 0,
    remarks: "Scheduled pickup for evening 5:00 PM.",
    inspection: null
  },
  {
    id: "LB-9823",
    customer: {
      name: "Deepak Chawla",
      phone: "+91 89709 00825",
      altPhone: "",
      email: "deepak@chawla.in",
      address: "15th Cross, Malleshwaram",
      city: "Bangalore",
      pincode: "560003"
    },
    device: {
      type: "Desktop",
      brand: "Custom Rig",
      model: "RTX 3070 Gaming PC",
      processor: "AMD Ryzen 7 5800X",
      ram: "32GB",
      storage: "1TB NVMe SSD",
      age: "1.5 Years",
      condition: "Excellent",
      accessories: ["Charger", "Original Box"],
      expectedPrice: 55000
    },
    status: "Completed",
    assignedAgentId: "agent-101",
    assignedAgentName: "Suresh Gowda",
    date: "2026-07-23",
    estimatedPrice: 58000,
    finalOfferPrice: 57000,
    remarks: "Inspected at doorstep, verified GPU stress test. Instant payment made via UPI.",
    inspection: null
  }
];
