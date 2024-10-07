export interface User {
    name:string;
    phone:string;
    email:string;
    age:string;
}

export interface Education {
    _id: string;
    institution: string;
    degree: string;
    field_of_study?: string;
    start_date: Date;
    end_date?: Date;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface Experience {
    _id: string;
    job_title: string;
    company: string;
    start_date: Date;
    end_date?: Date;
    description?: string; 
    created_at: Date;
    updated_at: Date;
  }
  

export interface UserProfile {
    settings: {
      notifications: {
        email_notifications: boolean;
        sms_notifications: boolean;
      };
      visibility: string;
    };
    _id: string;
    role: string;
    first_name: string;
    last_name: string;
    email:string;

    username: string;
    experience: Experience[];
    education: Education[];
    skills: string[];
    connections: string[];
    connection_requests: string[];
    createdAt: string;
    updatedAt: string;
    status:string;
    lastLogin:Date;
    __v: number;
  }
  