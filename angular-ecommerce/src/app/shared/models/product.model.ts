export interface RatingBreakdown {
    averageRating: number;
    star5Percentage: number;
    star4Percentage: number;
    star3Percentage: number;
    star2Percentage: number;
    star1Percentage: number;
}

export interface RatingReviewCard {
    ratings:number;
    username:string;
    timestamp:string;
    review:string;
    likes:number;
}

export interface ProductSpec {
    label: string;
    value: string;
}

export interface Product{
    id:number;
    slug?:string;
    title:string;
    subtitle?:string;
    description?:string;
    longDescription?:string;
    price:number;
    originalPrice:number;
    rating:number;
    image:string;
    gallery?: string[];
    category?:string;
    categorySlug?:string;
    brand?: string;
    ram?: string;
    os?: 'Windows 11' | 'Windows 10' | 'Linux' | 'macOS';
    fastShipping?: boolean;
    inStock?: boolean;
    colors?: string[];
    featureBullets?: string[];
    specs?: ProductSpec[];
    discount?:string;
    tag?:string;
    reviews?:number;
    sectionTags?: string[];
    ratingsAndReviews?:RatingReviewCard[];
    ratingBreakdown?:RatingBreakdown;
}