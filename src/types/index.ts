export interface IRegisterProps {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

export interface IRegisterErrors {
    name?: string;
    email?: string;
    password?: string;
    passwordConfirmation?: string;
}

export interface IUserSession {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
        profilePicture?: string;
        userProfile?: IUserProfile;
        auth0Id?: string;
        createdAt?: string;
        isActive?: boolean;
        provider?: string;
        role?: string;
        stripeCustomerId?: string;
        subscriptionType?: string;
        updatedAt?: Date;

        country?: string;
        city?: string;
        phone?: string;
        notifications?: boolean;
    };
}

export interface IUserProfile {
    id?: string;
    birthdate: Date | string;
    gender: string;
    weight: number | string;
    height: number | string;
    activityLevel?: 'sedentary' | 'moderate' | 'active' | 'very active';
    weightGoal?: 'lose weight' | 'maintain' | 'gain muscle';
    caloriesGoal?: number | string;
    hydrationGoal?: number | string;
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}



export interface AuthContextProps {
    userData: IUserSession | null;
    setUserData: (userData: IUserSession | null) => void;
    loginWithGoogle: () => void;
    logout: () => void;
    isLoading: boolean;
}

export interface IAlertState {
    type: 'success' | 'error';
    message: string;
}


export interface IloginProps {
    email: string;
    password: string;
}

export interface IFoodTracker {
    id: string;
    name: string;
    description?: string;
    calories: number;
    createdAt: string;
    isActive: boolean;
    image?: string; // Cambiar imageUrl a image
}
export interface ICreateFoodTracker {
    name: string;
    calories: number;
    description?: string;
}

export interface ICaloriesData {
    consumed: number;
    goal: number;
}
export interface IUsers {
    id: string,
    name: string,
    email: string,
    role: string,
    subscriptionType: string,
    isActive: boolean
}

export interface IUsersStatistics {
    usersNumber: number,
    premiumUsers: number,
    freeUsers: number
}

export interface IUsersPayments {
    data: {
        id: string,
        status: string,
        created_at: Date,
        currentPeriodStart: string,
        currentPeriodEnd: string,
        canceled_at?: string;
        user: {
            id: string,
            name: string,
            subscriptionType: string,
            isActive: boolean
        }
    }[];
    pagination:{
        page: number,
        limit:number,
        totalpayments:number,
        totalPages:number
    } 
}

export interface IPostList {
    posts:{
        id: string,
        title: string,
        content:string,
        status:string,
        createdAt: string,
        image?:string,
        reactions:[],
        author:{
            id:string,
            name:string,
            profilePicture?:string,
        }
    }[];
    pagination:{
        page: 1,
        limit: 10,
        totalpayments:number,
        totalPages:number
    } 
}
export interface IPost {
    id: string,
    title: string,
    content:string,
    status:string,
    createdAt: string,
    image?:string,
    reactions:[],
    author:{
        id:string,
        name:string,
        profilePicture?:string,
        
    }
}

export enum PostTag {
  VEGETARIAN = 'Vegetarian',
  VEGAN = 'Vegan',
  GLUTEN_FREE = 'GlutenFree',
  LOW_FAT = 'LowFat',
  QUICK = 'Quick',
  DESSERT = 'Dessert',
  BREAKFAST = 'Breakfast',
  HIGH_PROTEIN = 'HighInProtein',
  DAIRY_FREE = 'DairyFree',
  SUGAR_FREE = 'SugarFree',
}


export interface Post {
  id: string;
  title: string;
  content: string;
  tags?: PostTag[];
  image?: string; 
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'inactive';
  user: IUserSession['user'];
  favoritesCount?: number;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: IUserSession['user'];
  postId: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PostErrors {
  title?: string;
  content?: string;
  tags?: string;
}

export interface CommentErrors {
  content?: string;
}

// En tu archivo de tipos (types.ts)
export interface ApiPost {
  id: string;
  title: string;
  content: string;
  tags?: PostTag[];
  status: 'pending' | 'approved' | 'rejected' | 'inactive';
  image?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    profilePicture?: string;
  };
}


export interface FavoriteActionResponse {
  postId: string;
  isFavorite: boolean;
  favoritesCount: number;
  favoriteId?: string; // Añade esta línea
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export interface FavoriteHookParams {
  postId: string;
  isFavorite: boolean;
  token: string;
}


// interface PaginatedFavorites {
//   posts: Post[];
//   total: number;
//   page: number;
//   limit: number;
// }

export interface FavoritePost {
  post?: Post; 
  favoriteId: string;
  postMessage?: string; 
}
export interface IReviewsList{
    data:{
        results:{
            id: string,
            content: string,
            createdAt: string,
            user:{
                id:string,
                name:string,
                isActive:boolean,
            }
        }[];
        total: 1,
        page: 1,
        limit:number,
        totalPages:number
    }    

}