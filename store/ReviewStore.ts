import { create } from "zustand";
import { IReview } from "@/types";

interface ReviewState {
  reviews: IReview[],
  updateReviews: (nList: IReview[]) => void
}

export const useReviewStore = create<ReviewState>()((set) => ({
  reviews: [],
  updateReviews: (nList: IReview[]) => {
    set(() => ({ reviews: nList }));
    localStorage.setItem(process.env.NEXT_PUBLIC_STORAGE_KEY ?? 'sora-union-mrkevin0308', JSON.stringify(nList));
  }
}));