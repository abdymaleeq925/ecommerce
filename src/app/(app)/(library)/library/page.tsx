import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { DEFAULT_LIMIT } from "@/constants";
import { caller, getQueryClient, trpc } from "@/trpc/server";

import { LibraryView } from "@/modules/library/ui/views/library-view";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await caller.auth.session();
  if (!session?.user) {
    redirect("/sign-in");
  }
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(
    trpc.library.getMany.infiniteQueryOptions(
      { limit: DEFAULT_LIMIT },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
        },
      },
    ),
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LibraryView />
    </HydrationBoundary>
  );
};

export default Page;
