import { SetStateAction, useEffect } from "react";

import { generateClient } from "aws-amplify/api";
import { remove } from "aws-amplify/storage";
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
import { on } from "events";

type SubscriptionDummyProps = {
  setTrailers: (value: SetStateAction<TrailerRCJ[]>) => void;
};

const SubscriptionDummy = ({ setTrailers }: SubscriptionDummyProps) => {
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
          setTrailers((prevItems: TrailerRCJ[]) =>
            prevItems.map((trailer: TrailerRCJ) =>
              trailer.id === data.onUpdateTrailerRCJ?.id
                ? data.onUpdateTrailerRCJ
                : trailer
            )
          );
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
  }, [setTrailers]);
  return null;
};

export default SubscriptionDummy;
