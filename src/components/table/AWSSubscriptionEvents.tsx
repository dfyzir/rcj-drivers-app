import { SetStateAction, useEffect } from "react";

import { generateClient } from "aws-amplify/api";

import { GraphQLSubscription } from "@aws-amplify/api";

import {
  OnCreateTrailerRCJSubscription,
  OnDeleteTrailerRCJSubscription,
  OnUpdateTrailerRCJSubscription,
  TrailerRCJ,
} from "@/API";

import {
  onCreateTrailerRCJ,
  onUpdateTrailerRCJ,
  onDeleteTrailerRCJ,
} from "@/graphql/subscriptions";
import { useRouter } from "next/router";

type AWSSubscriptionEventsProps = {
  setTrailers: (value: SetStateAction<TrailerRCJ[]>) => void;
  trailer: TrailerRCJ;
};

const AWSSubscriptionEvents = ({
  setTrailers,
  trailer,
}: AWSSubscriptionEventsProps) => {
  const router = useRouter();
  const { replace } = useRouter();

  const chassisId = trailer?.id;
  const { search } = router.query;

  useEffect(() => {
    const client = generateClient();

    const createSubscription = client
      .graphql<GraphQLSubscription<OnCreateTrailerRCJSubscription>>({
        query: onCreateTrailerRCJ,
      })
      .subscribe({
        next: ({ data }) => {
          const { onCreateTrailerRCJ } = data;
          onCreateTrailerRCJ != null
            ? setTrailers((prevItems) => [...prevItems, onCreateTrailerRCJ])
            : null;
        },
      });

    const updateSubscription = client
      .graphql<GraphQLSubscription<OnUpdateTrailerRCJSubscription>>({
        query: onUpdateTrailerRCJ,
      })
      .subscribe({
        next: ({ data }) => {
          console.log("Subsr", data);
          setTrailers((prevItems: TrailerRCJ[]) =>
            prevItems.map((trailer: TrailerRCJ) =>
              trailer.id === data.onUpdateTrailerRCJ?.id
                ? data.onUpdateTrailerRCJ
                : trailer
            )
          );
          if (
            data.onUpdateTrailerRCJ?.id === chassisId &&
            search !== data.onUpdateTrailerRCJ?.chassisNumber
          ) {
            replace(`/?search=${data.onUpdateTrailerRCJ?.chassisNumber}`);
          }
        },
      });

    const deleteSubscription = client
      .graphql<GraphQLSubscription<OnDeleteTrailerRCJSubscription>>({
        query: onDeleteTrailerRCJ,
      })
      .subscribe({
        next: async ({ data }) => {
          setTrailers((prevState) =>
            prevState.filter(({ id }) => id !== data.onDeleteTrailerRCJ?.id)
          );
        },
      });

    return () => {
      createSubscription.unsubscribe();
      updateSubscription.unsubscribe();
      deleteSubscription.unsubscribe();
    };
  }, [chassisId, replace, search, setTrailers]);
  return null;
};

export default AWSSubscriptionEvents;
