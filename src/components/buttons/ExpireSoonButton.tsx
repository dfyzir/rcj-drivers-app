import { SetStateAction, useMemo } from "react";
import { useCheckDate } from "@/hooks/useCheckDate";
import { TrailerRCJ } from "@/API";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  divider,
} from "@nextui-org/react";

type ExpireSoonButtonProps = {
  trailers: TrailerRCJ[];
  setFilterValue: (value: SetStateAction<string>) => void;
  setPage: (value: SetStateAction<number>) => void;
};

const ExpireSoonButton = ({
  trailers,
  setFilterValue,
  setPage,
}: ExpireSoonButtonProps) => {
  const { isExpireSoon } = useCheckDate();

  const expiredItems = useMemo(() => {
    let expiredTrailers = trailers?.map((trailer: TrailerRCJ) => ({
      __typename: trailer.__typename,
      id: trailer.id,
      chassisNumber: trailer.chassisNumber,
      vinNumber: trailer.vinNumber,
      plateNumber: trailer.plateNumber,
      inspectionExpiresAt: trailer.inspectionExpiresAt,
      inspectionFile: trailer.inspectionFile,
      registrationExpiresAt: trailer.registrationExpiresAt,
      registrationFile: trailer.registrationFile,
      createdAt: trailer.createdAt,
      updatedAt: trailer.updatedAt,
    }));

    expiredTrailers = expiredTrailers.filter(
      (trailer) =>
        (trailer.inspectionExpiresAt
          ? isExpireSoon(trailer.inspectionExpiresAt)
          : null) ||
        (trailer.registrationExpiresAt
          ? isExpireSoon(trailer.registrationExpiresAt)
          : null)
    );

    return expiredTrailers;
  }, [isExpireSoon, trailers]);

  return (
    <div>
      {expiredItems.length > 0 ? (
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="shadow"
              color="warning"
              size="lg"
              className="text-xl font-semibold text-white">
              {expiredItems.length} expire soon
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            {expiredItems.map((item) => (
              <DropdownItem
                key={item.id}
                onPress={() => {
                  setFilterValue(item.chassisNumber!);
                  setPage(1);
                }}>
                <div
                  title="Show chassis in the table"
                  className="text-center font-semibold text-xl ">
                  {item.chassisNumber}
                </div>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      ) : null}
    </div>
  );
};

export default ExpireSoonButton;
