export interface Location {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface SocialMediaLinks {
  facebook?: string;
  x?: string;
  linkedin?: string;
  email?: string;
}

export interface Speaker {
  userId: string;
  metaData: {
    title?: string;
    company?: string;
    bio?: string;
    profileImage?: string;
    [key: string]: any; // Allow for custom fields
  };
}

export interface ProgramScheduleItem {
  time: string;
  period: string;
  title: string;
  description: string;
  speaker?: Speaker;
}

export interface Pricing {
  amount: number;
  currency: string;
  description?: string;
}

export interface Event {
  uuid: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  eventCategory: string;
  year: number;
  description: string;
  coverImage?: string;
  images?: string[];
  tags: string[];
  attendees: (string | { userId: string; ticketType: string; checkedIn: boolean })[];
  location: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  registrationPricing: number | {
    amount: number;
    currency: string;
    description?: string;
  };
  earlyBirdRegistrationPricing?: number | {
    amount: number;
    currency: string;
    description?: string;
  };
  eventDate: string | Date | {
    start: Date;
    end: Date;
  };
  seatsAvailable?: number;
  seatsPurchased?: number;
  socialMediaLinks: {
    facebook?: string;
    x?: string;
    linkedIn?: string;
    email?: string;
  };
  speakers: {
    userId: string;
    metaData?: {
      title?: string;
      bio?: string;
      headshot?: string;
      [key: string]: any;
    };
  }[];
  eventContactEmail?: string;
  programSchedule: {
    time: string | Date;
    period?: string;
    title: string;
    description?: string;
    location?: string;
  }[];
}
