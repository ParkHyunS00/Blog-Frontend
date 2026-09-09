import { useQuery } from "@tanstack/react-query";
import { fetchCategoryLatestPosts, fetchPopularPosts } from "../api/posts-explore";

export function useCategoryLatestPosts() {
  return useQuery({
    queryKey: ["categories", "latest-posts"],
    queryFn: fetchCategoryLatestPosts,
    retry: 1,
  });
}

export function usePopularPosts() {
  return useQuery({
    queryKey: ["posts", "popular"],
    queryFn: fetchPopularPosts,
    retry: 1,
  });
}
