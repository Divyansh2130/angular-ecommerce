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

export interface Product{
    title:string;
    description?:string;
    price:number;
    originalPrice:number;
    rating:number;
    image:string;
    category?:string;
    discount?:string;
    tag?:string;
    reviews?:number;
    ratingsAndReviews?:RatingReviewCard[];
    ratingBreakdown?:RatingBreakdown;
}